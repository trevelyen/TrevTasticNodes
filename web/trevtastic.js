import { app } from "../../../scripts/app.js";

// Load CSS stylesheet
function addStylesheet(url, baseUrl) {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.type = "text/css";
  link.href = new URL(url, baseUrl).href;
  document.head.appendChild(link);
}

app.registerExtension({
    name: "TrevTasticNodes",

    async init() {
        addStylesheet("./css/trevtastic.css", import.meta.url);
    },

    async nodeCreated(node) {
        if (node.comfyClass === "TrevImageResizer") {
            const updateWidgetVisibility = () => {
                const bypassResizing = node.widgets.find(w => w.name === "bypass_resizing");
                const useCustomSize = node.widgets.find(w => w.name === "use_custom_size");
                const resolution = node.widgets.find(w => w.name === "resolution");
                const multiplier = node.widgets.find(w => w.name === "multiplier");
                const portraitMode = node.widgets.find(w => w.name === "portrait_mode");
                const customWidth = node.widgets.find(w => w.name === "custom_width");
                const customHeight = node.widgets.find(w => w.name === "custom_height");

                if (!useCustomSize || !resolution) return;

                const isBypassed = bypassResizing ? bypassResizing.value : false;
                const isCustomSize = useCustomSize.value;
                const isCustomResolution = resolution.value === "Custom";

                // When bypassed, disable all resizing controls below it
                if (multiplier) {
                    const showMultiplier = !isCustomSize && !isBypassed;
                    multiplier.disabled = !showMultiplier;
                    multiplier.options = multiplier.options || {};
                    multiplier.options.hidden = isCustomSize;
                }

                if (useCustomSize) {
                    useCustomSize.disabled = isBypassed;
                }

                // Portrait mode for resizing (only when using preset resolution, not custom, and not bypassed)
                if (portraitMode) {
                    const showPortrait = isCustomSize && !isCustomResolution;
                    const enablePortrait = showPortrait && !isBypassed;
                    portraitMode.disabled = !enablePortrait;
                    portraitMode.options = portraitMode.options || {};
                    portraitMode.options.hidden = !showPortrait;
                }

                if (resolution) {
                    const showResolution = isCustomSize && !isBypassed;
                    resolution.disabled = !showResolution;
                    resolution.options = resolution.options || {};
                    resolution.options.hidden = !isCustomSize;
                }

                // Show/hide custom width/height (only when resolution is "Custom" and not bypassed)
                if (customWidth) {
                    const showCustomDims = isCustomSize && isCustomResolution;
                    const enableCustomDims = showCustomDims && !isBypassed;
                    customWidth.disabled = !enableCustomDims;
                    customWidth.options = customWidth.options || {};
                    customWidth.options.hidden = !showCustomDims;
                }
                if (customHeight) {
                    const showCustomDims = isCustomSize && isCustomResolution;
                    const enableCustomDims = showCustomDims && !isBypassed;
                    customHeight.disabled = !enableCustomDims;
                    customHeight.options = customHeight.options || {};
                    customHeight.options.hidden = !showCustomDims;
                }

                // Preserve width, only adjust height
                const currentWidth = node.size[0];
                const newSize = node.computeSize();
                node.setSize([currentWidth, newSize[1]]);
            };

            // Add callbacks to relevant widgets
            const bypassResizing = node.widgets.find(w => w.name === "bypass_resizing");
            const useCustomSize = node.widgets.find(w => w.name === "use_custom_size");
            const resolution = node.widgets.find(w => w.name === "resolution");

            if (bypassResizing) {
                const originalCallback = bypassResizing.callback;
                bypassResizing.callback = function(value) {
                    if (originalCallback) originalCallback.call(this, value);
                    updateWidgetVisibility();
                };
            }

            if (useCustomSize) {
                const originalCallback = useCustomSize.callback;
                useCustomSize.callback = function(value) {
                    if (originalCallback) originalCallback.call(this, value);
                    updateWidgetVisibility();
                };
            }

            if (resolution) {
                const originalCallback = resolution.callback;
                resolution.callback = function(value) {
                    if (originalCallback) originalCallback.call(this, value);
                    updateWidgetVisibility();
                };
            }

            // Initial update
            setTimeout(updateWidgetVisibility, 100);
        }

        // TrevSlider - adjust node size to fit both widgets
        if (node.comfyClass === "TrevSlider") {
            setTimeout(() => {
                node.setSize([300, 120]);
            }, 50);
        }
    },

    async beforeRegisterNodeDef(nodeType, nodeData) {
        // TrevModelChooser setup
        if (nodeData.name === "TrevModelChooser") {
            const onNodeCreated = nodeType.prototype.onNodeCreated;
            nodeType.prototype.onNodeCreated = function () {
                const result = onNodeCreated?.apply(this, arguments);

                const node = this;

                // Initialize model list
                node.modelList = ["Model 1"];

                // Find the selected_model widget
                const selectedModelWidget = this.widgets.find(w => w.name === "selected_model");
                const modelNamesWidget = this.widgets.find(w => w.name === "model_names");

                // Hide the model_names widget (it's for serialization only)
                if (modelNamesWidget) {
                    modelNamesWidget.type = "hidden";
                    modelNamesWidget.computeSize = () => [0, -4];
                }

                // Hide the original INT widget completely
                if (selectedModelWidget) {
                    selectedModelWidget.type = "hidden";
                    selectedModelWidget.computeSize = () => [0, -4];
                }

                // Create a combo widget to show model names
                const modelComboWidget = this.addWidget("combo", "model", node.modelList[0], (value) => {
                    // Skip callback during configuration restore
                    if (node._isRestoring) return;
                    const index = node.modelList.indexOf(value);
                    if (index !== -1 && selectedModelWidget) {
                        selectedModelWidget.value = index + 1; // 1-indexed
                        // Save selection change to localStorage
                        if (node.modelChooserElements?.saveToLocalStorage) {
                            node.modelChooserElements.saveToLocalStorage();
                        }
                    }
                }, { values: [...node.modelList] });

                // Function to update the combo widget from modelList
                const updateComboWidget = () => {
                    modelComboWidget.options.values = [...node.modelList];
                    if (modelNamesWidget) {
                        modelNamesWidget.value = node.modelList.join("|||");
                    }
                };

                // Function to save model list to localStorage (backup persistence)
                const saveToLocalStorage = () => {
                    try {
                        const key = `TrevModelChooser_${node.id}`;
                        const data = {
                            modelList: node.modelList,
                            selectedIndex: selectedModelWidget ? selectedModelWidget.value : 1
                        };
                        localStorage.setItem(key, JSON.stringify(data));
                    } catch (e) {
                        // localStorage not available or full - fail silently
                    }
                };

                // Function to resize node
                const resizeNode = () => {
                    const currentWidth = node.size[0];
                    const newSize = node.computeSize();
                    node.setSize([currentWidth, newSize[1]]);
                };

                // Store references for onConfigure
                node.modelChooserElements = {
                    selectedModelWidget,
                    modelNamesWidget,
                    modelComboWidget,
                    updateComboWidget,
                    resizeNode,
                    saveToLocalStorage
                };

                // Add "Add Model" button (full width)
                this.addWidget("button", "add_model", "Add Model", () => {
                    const newIndex = node.modelList.length + 1;
                    node.modelList.push(`Model ${newIndex}`);
                    updateComboWidget();

                    if (selectedModelWidget) {
                        selectedModelWidget.options.max = node.modelList.length;
                    }

                    modelComboWidget.value = node.modelList[node.modelList.length - 1];
                    if (selectedModelWidget) {
                        selectedModelWidget.value = node.modelList.length;
                    }

                    saveToLocalStorage();
                    resizeNode();
                });

                // Create a custom widget for Rename | Remove buttons side by side
                const buttonRowWidget = {
                    type: "custom",
                    name: "button_row",
                    value: null,
                    options: {},
                    computeSize: function () {
                        return [node.size[0], 26];
                    },
                    draw: function (ctx, theNode, width, y) {
                        const buttonHeight = 20;
                        const buttonY = y + 3;
                        const gap = 6;
                        const buttonWidth = (width - gap) / 2;

                        // Draw Rename button
                        ctx.fillStyle = "#333";
                        ctx.beginPath();
                        ctx.roundRect(0, buttonY, buttonWidth, buttonHeight, 4);
                        ctx.fill();
                        ctx.fillStyle = "#fff";
                        ctx.font = "12px Arial";
                        ctx.textAlign = "center";
                        ctx.textBaseline = "middle";
                        ctx.fillText("Rename", buttonWidth / 2, buttonY + buttonHeight / 2);

                        // Draw Remove button
                        ctx.fillStyle = "#333";
                        ctx.beginPath();
                        ctx.roundRect(buttonWidth + gap, buttonY, buttonWidth, buttonHeight, 4);
                        ctx.fill();
                        ctx.fillStyle = "#fff";
                        ctx.fillText("Remove", buttonWidth + gap + buttonWidth / 2, buttonY + buttonHeight / 2);
                    },
                    mouse: function (event, pos) {
                        if (event.type === "pointerdown") {
                            const gap = 6;
                            const buttonWidth = (node.size[0] - gap) / 2;

                            if (pos[0] < buttonWidth) {
                                // Rename clicked
                                const currentModel = modelComboWidget.value;
                                const currentIndex = node.modelList.indexOf(currentModel);
                                if (currentIndex !== -1) {
                                    const newName = prompt("Enter new name for model:", currentModel);
                                    if (newName && newName.trim()) {
                                        node.modelList[currentIndex] = newName.trim();
                                        updateComboWidget();
                                        modelComboWidget.value = newName.trim();
                                        saveToLocalStorage();
                                    }
                                }
                            } else if (pos[0] > buttonWidth + gap) {
                                // Remove clicked
                                if (node.modelList.length <= 1) {
                                    alert("Cannot remove the last model.");
                                    return true;
                                }
                                const currentModel = modelComboWidget.value;
                                const currentIndex = node.modelList.indexOf(currentModel);
                                if (currentIndex !== -1) {
                                    node.modelList.splice(currentIndex, 1);
                                    updateComboWidget();
                                    if (selectedModelWidget) {
                                        selectedModelWidget.options.max = node.modelList.length;
                                    }
                                    modelComboWidget.value = node.modelList[0];
                                    if (selectedModelWidget) {
                                        selectedModelWidget.value = 1;
                                    }
                                    saveToLocalStorage();
                                    resizeNode();
                                }
                            }
                            return true;
                        }
                        return false;
                    }
                };
                this.widgets.push(buttonRowWidget);

                // Resize node to fit
                setTimeout(() => {
                    const currentWidth = node.size[0];
                    const newSize = node.computeSize();
                    node.setSize([Math.max(currentWidth, 200), newSize[1]]);
                }, 100);

                return result;
            };

            // Handle workflow load - restore model list from saved data
            const onConfigure = nodeType.prototype.onConfigure;
            nodeType.prototype.onConfigure = function (data) {
                if (onConfigure) {
                    onConfigure.apply(this, arguments);
                }

                const node = this;

                // Set flag to prevent combo callback from overwriting during restore
                node._isRestoring = true;

                // Restoration function - extracted so we can retry if needed
                const doRestore = (retryCount = 0) => {
                    // Wait for modelChooserElements to be available (race condition guard)
                    if (!node.modelChooserElements) {
                        if (retryCount < 10) {
                            // Retry up to 10 times with 50ms delays (500ms total max wait)
                            setTimeout(() => doRestore(retryCount + 1), 50);
                        } else {
                            console.warn("TrevModelChooser: Failed to restore - modelChooserElements not available");
                            node._isRestoring = false;
                        }
                        return;
                    }

                    const { selectedModelWidget, modelNamesWidget, modelComboWidget, updateComboWidget, saveToLocalStorage } = node.modelChooserElements;

                    // Get widget indices for reading from widgets_values
                    const selectedIdx = node.widgets.findIndex(w => w.name === "selected_model");
                    const namesIdx = node.widgets.findIndex(w => w.name === "model_names");

                    // Load model names - prefer widgets_values from data, fallback to widget value, then localStorage
                    let modelNamesValue = null;
                    let selectedValue = 1;
                    let restoredFromLocalStorage = false;

                    if (data.widgets_values && namesIdx !== -1 && data.widgets_values[namesIdx] !== undefined && data.widgets_values[namesIdx] !== "") {
                        modelNamesValue = data.widgets_values[namesIdx];
                    } else if (modelNamesWidget && modelNamesWidget.value && modelNamesWidget.value !== "") {
                        modelNamesValue = modelNamesWidget.value;
                    }

                    // If no workflow data, try localStorage as last resort
                    if (!modelNamesValue || modelNamesValue.length === 0) {
                        try {
                            const key = `TrevModelChooser_${node.id}`;
                            const stored = localStorage.getItem(key);
                            if (stored) {
                                const parsed = JSON.parse(stored);
                                if (parsed.modelList && Array.isArray(parsed.modelList) && parsed.modelList.length > 0) {
                                    node.modelList = parsed.modelList;
                                    updateComboWidget();
                                    restoredFromLocalStorage = true;
                                    if (parsed.selectedIndex && parsed.selectedIndex > 0 && parsed.selectedIndex <= node.modelList.length) {
                                        selectedValue = parsed.selectedIndex;
                                    }
                                }
                            }
                        } catch (e) {
                            // localStorage not available or corrupted - fail silently
                        }
                    }

                    if (!restoredFromLocalStorage && modelNamesValue && modelNamesValue.length > 0) {
                        node.modelList = modelNamesValue.split("|||");
                        updateComboWidget();
                    }

                    // Restore selected model - prefer widgets_values from data (unless restored from localStorage)
                    if (!restoredFromLocalStorage) {
                        if (data.widgets_values && selectedIdx !== -1 && data.widgets_values[selectedIdx] !== undefined && data.widgets_values[selectedIdx] > 0) {
                            selectedValue = data.widgets_values[selectedIdx];
                        } else if (selectedModelWidget && selectedModelWidget.value && selectedModelWidget.value > 0) {
                            selectedValue = selectedModelWidget.value;
                        }
                    }

                    if (selectedValue > 0 && selectedValue <= node.modelList.length) {
                        modelComboWidget.value = node.modelList[selectedValue - 1];
                        if (selectedModelWidget) {
                            selectedModelWidget.value = selectedValue;
                        }
                    }

                    // Update max for selectedModelWidget
                    if (selectedModelWidget) {
                        selectedModelWidget.options = selectedModelWidget.options || {};
                        selectedModelWidget.options.max = node.modelList.length;
                    }

                    // Save to localStorage after successful restore (keeps backup fresh)
                    if (saveToLocalStorage) {
                        saveToLocalStorage();
                    }

                    // Clear the restoring flag after restore is complete
                    node._isRestoring = false;
                };

                // Start restoration with initial delay to let widgets populate
                setTimeout(() => doRestore(0), 50);
            };

            // Ensure widget values are properly serialized
            const onSerialize = nodeType.prototype.onSerialize;
            nodeType.prototype.onSerialize = function (data) {
                if (onSerialize) {
                    onSerialize.apply(this, arguments);
                }

                // Manually ensure widgets_values contains our data
                if (this.modelChooserElements) {
                    const { selectedModelWidget, modelNamesWidget } = this.modelChooserElements;

                    // Update the hidden widget value
                    if (modelNamesWidget) {
                        modelNamesWidget.value = this.modelList.join("|||");
                    }

                    // Ensure widgets_values array has our values in correct positions
                    // Find widget indices
                    const selectedIdx = this.widgets.findIndex(w => w.name === "selected_model");
                    const namesIdx = this.widgets.findIndex(w => w.name === "model_names");

                    if (!data.widgets_values) {
                        data.widgets_values = [];
                    }

                    if (selectedIdx !== -1 && selectedModelWidget) {
                        data.widgets_values[selectedIdx] = selectedModelWidget.value;
                    }
                    if (namesIdx !== -1 && modelNamesWidget) {
                        data.widgets_values[namesIdx] = modelNamesWidget.value;
                    }
                }
            };
        }

        // TrevSlider setup
        if (nodeData.name === "TrevSlider") {
            const onNodeCreated = nodeType.prototype.onNodeCreated;
            nodeType.prototype.onNodeCreated = function () {
                const result = onNodeCreated?.apply(this, arguments);

                // Initialize properties with defaults
                this.properties = this.properties || {};
                this.properties.min = this.properties.min ?? 0;
                this.properties.max = this.properties.max ?? 1;
                this.properties.step = this.properties.step ?? 0.01;
                this.properties.defaultValue = this.properties.defaultValue ?? 0.5;
                this.properties.label = this.properties.label ?? "Value";
                this.properties.useInt = this.properties.useInt ?? false;

                const node = this;

                // Get the value widget reference (hiding is done in nodeCreated hook)
                const valueWidget = this.widgets.find(w => w.name === "value");
                this._valueWidget = valueWidget;

                // Create wrapper div
                const wrapper = document.createElement("div");
                wrapper.className = "trev-slider-wrapper";

                // Create slider container
                const sliderContainer = document.createElement("div");
                sliderContainer.className = "trev-slider-container";

                // Create label
                const label = document.createElement("span");
                label.className = "trev-slider-label";
                label.textContent = node.properties.label;

                // Create slider input
                const slider = document.createElement("input");
                slider.type = "range";
                slider.min = node.properties.min;
                slider.max = node.properties.max;
                slider.step = node.properties.step;
                slider.value = valueWidget ? valueWidget.value : node.properties.defaultValue;
                slider.className = "trev-slider";

                // Create value display
                const valueDisplay = document.createElement("input");
                valueDisplay.type = "number";
                valueDisplay.min = node.properties.min;
                valueDisplay.max = node.properties.max;
                valueDisplay.step = node.properties.step;
                valueDisplay.value = valueWidget ? valueWidget.value : node.properties.defaultValue;
                valueDisplay.className = "trev-slider-value";

                // Function to update the backend widget
                const updateValue = (val) => {
                    if (valueWidget) {
                        valueWidget.value = node.properties.useInt ? Math.round(val) : val;
                    }
                };

                // Function to update slider constraints from properties
                const updateSliderFromProperties = () => {
                    slider.min = node.properties.min;
                    slider.max = node.properties.max;
                    slider.step = node.properties.step;
                    valueDisplay.min = node.properties.min;
                    valueDisplay.max = node.properties.max;
                    valueDisplay.step = node.properties.step;
                    label.textContent = node.properties.label;
                };

                // Sync slider and value display
                slider.addEventListener("input", (e) => {
                    let val = parseFloat(e.target.value);
                    if (node.properties.useInt) val = Math.round(val);
                    valueDisplay.value = val;
                    updateValue(val);
                });

                valueDisplay.addEventListener("change", (e) => {
                    const min = parseFloat(node.properties.min);
                    const max = parseFloat(node.properties.max);
                    let val = parseFloat(e.target.value);
                    if (isNaN(val)) val = min;
                    val = Math.max(min, Math.min(max, val));
                    if (node.properties.useInt) val = Math.round(val);
                    slider.value = val;
                    valueDisplay.value = val;
                    updateValue(val);
                });

                // Assemble elements
                sliderContainer.appendChild(label);
                sliderContainer.appendChild(slider);
                sliderContainer.appendChild(valueDisplay);
                wrapper.appendChild(sliderContainer);

                // Add as DOM widget with serialization for the value
                this.addDOMWidget("trev_slider_ui", "custom_slider", wrapper, {
                    getValue() {
                        return node._valueWidget ? node._valueWidget.value : node.properties.defaultValue;
                    },
                    setValue(v) {
                        slider.value = v;
                        valueDisplay.value = v;
                        if (node._valueWidget) {
                            node._valueWidget.value = v;
                        }
                    },
                    serialize: false,
                });

                // Store references for property updates
                this.sliderElements = { slider, valueDisplay, label, updateSliderFromProperties, updateValue };

                // Set node size
                this.setSize([300, 100]);

                return result;
            };

            // Handle workflow load - sync UI with loaded values
            const onConfigure = nodeType.prototype.onConfigure;
            nodeType.prototype.onConfigure = function (data) {
                if (onConfigure) {
                    onConfigure.apply(this, arguments);
                }

                // After a short delay to ensure widgets are ready
                setTimeout(() => {
                    if (this.sliderElements) {
                        // Update slider constraints from loaded properties
                        this.sliderElements.updateSliderFromProperties();

                        // Sync slider UI with the loaded value from widget data
                        if (data.widgets_values && data.widgets_values.length > 0) {
                            const savedValue = data.widgets_values[0];
                            this.sliderElements.slider.value = savedValue;
                            this.sliderElements.valueDisplay.value = savedValue;
                            if (this._valueWidget) {
                                this._valueWidget.value = savedValue;
                            }
                        }
                    }
                }, 50);
            };

            // Override onPropertyChanged to update slider when properties change
            const onPropertyChanged = nodeType.prototype.onPropertyChanged;
            nodeType.prototype.onPropertyChanged = function (name, value) {
                if (onPropertyChanged) {
                    onPropertyChanged.apply(this, arguments);
                }

                if (this.sliderElements) {
                    this.sliderElements.updateSliderFromProperties();

                    // Reset to default if changing defaultValue
                    if (name === "defaultValue") {
                        this.sliderElements.slider.value = value;
                        this.sliderElements.valueDisplay.value = value;
                        this.sliderElements.updateValue(value);
                    }
                }
            };

            // Handle serialization - include the hidden value widget
            const onSerialize = nodeType.prototype.onSerialize;
            nodeType.prototype.onSerialize = function (data) {
                if (onSerialize) {
                    onSerialize.apply(this, arguments);
                }
                // Ensure the value is saved in widgets_values
                if (this._valueWidget) {
                    data.widgets_values = [this._valueWidget.value];
                }
            };

            // Add context menu options for settings
            const getExtraMenuOptions = nodeType.prototype.getExtraMenuOptions;
            nodeType.prototype.getExtraMenuOptions = function (_, options) {
                if (getExtraMenuOptions) {
                    getExtraMenuOptions.apply(this, arguments);
                }

                const node = this;

                options.unshift(
                    {
                        content: "Slider Settings",
                        has_submenu: true,
                        callback: () => {},
                        submenu: {
                            options: [
                                {
                                    content: `Min: ${node.properties.min}`,
                                    callback: () => {
                                        const val = prompt("Enter minimum value:", node.properties.min);
                                        if (val !== null) {
                                            node.properties.min = parseFloat(val) || 0;
                                            node.onPropertyChanged("min", node.properties.min);
                                        }
                                    },
                                },
                                {
                                    content: `Max: ${node.properties.max}`,
                                    callback: () => {
                                        const val = prompt("Enter maximum value:", node.properties.max);
                                        if (val !== null) {
                                            node.properties.max = parseFloat(val) || 1;
                                            node.onPropertyChanged("max", node.properties.max);
                                        }
                                    },
                                },
                                {
                                    content: `Step: ${node.properties.step}`,
                                    callback: () => {
                                        const val = prompt("Enter step value:", node.properties.step);
                                        if (val !== null) {
                                            node.properties.step = parseFloat(val) || 0.01;
                                            node.onPropertyChanged("step", node.properties.step);
                                        }
                                    },
                                },
                                {
                                    content: `Default: ${node.properties.defaultValue}`,
                                    callback: () => {
                                        const val = prompt("Enter default value:", node.properties.defaultValue);
                                        if (val !== null) {
                                            node.properties.defaultValue = parseFloat(val) || 0.5;
                                            node.onPropertyChanged("defaultValue", node.properties.defaultValue);
                                        }
                                    },
                                },
                                {
                                    content: `Label: ${node.properties.label}`,
                                    callback: () => {
                                        const val = prompt("Enter label:", node.properties.label);
                                        if (val !== null) {
                                            node.properties.label = val || "Value";
                                            node.onPropertyChanged("label", node.properties.label);
                                        }
                                    },
                                },
                                null, // separator
                                {
                                    content: `Output: ${node.properties.useInt ? "INT" : "FLOAT"}`,
                                    callback: () => {
                                        node.properties.useInt = !node.properties.useInt;
                                        // Update step to 1 for INT mode if current step is fractional
                                        if (node.properties.useInt && node.properties.step < 1) {
                                            node.properties.step = 1;
                                        }
                                        // Round current value if switching to INT
                                        if (node.properties.useInt && node.sliderElements) {
                                            const currentVal = Math.round(parseFloat(node.sliderElements.slider.value));
                                            node.sliderElements.slider.value = currentVal;
                                            node.sliderElements.valueDisplay.value = currentVal;
                                            node.sliderElements.updateValue(currentVal);
                                        }
                                        node.onPropertyChanged("useInt", node.properties.useInt);
                                    },
                                },
                            ],
                        },
                    },
                    null // separator
                );
            };
        }

        // TrevRoute setup - sync output type with connected input type
        if (nodeData.name === "TrevRoute") {
            const onNodeCreated = nodeType.prototype.onNodeCreated;
            nodeType.prototype.onNodeCreated = function () {
                const result = onNodeCreated?.apply(this, arguments);
                const node = this;

                // Function to update output type based on connected inputs
                const updateOutputType = () => {
                    // Find the first connected input and use its type
                    let connectedType = "*";
                    if (node.inputs) {
                        for (const input of node.inputs) {
                            if (input.link != null) {
                                const linkInfo = app.graph.links[input.link];
                                if (linkInfo) {
                                    const originNode = app.graph.getNodeById(linkInfo.origin_id);
                                    if (originNode && originNode.outputs && originNode.outputs[linkInfo.origin_slot]) {
                                        connectedType = originNode.outputs[linkInfo.origin_slot].type;
                                        break;
                                    }
                                }
                            }
                        }
                    }

                    // Update the output type
                    if (node.outputs && node.outputs[0]) {
                        if (node.outputs[0].type !== connectedType) {
                            node.outputs[0].type = connectedType;
                            node.outputs[0].name = connectedType === "*" ? "output" : connectedType;
                        }
                    }
                };

                // Update on connection change
                const onConnectionsChange = node.onConnectionsChange;
                node.onConnectionsChange = function (type, index, connected, linkInfo) {
                    if (onConnectionsChange) {
                        onConnectionsChange.apply(this, arguments);
                    }
                    updateOutputType();
                };

                // Initial update after a short delay
                setTimeout(updateOutputType, 100);

                return result;
            };

            // Handle workflow load
            const onConfigure = nodeType.prototype.onConfigure;
            nodeType.prototype.onConfigure = function (data) {
                if (onConfigure) {
                    onConfigure.apply(this, arguments);
                }
                const node = this;
                // Update output type after load
                setTimeout(() => {
                    if (node.onConnectionsChange) {
                        node.onConnectionsChange();
                    }
                }, 100);
            };
        }

        // TrevInverseRoute setup - sync all output types with input type
        if (nodeData.name === "TrevInverseRoute") {
            const onNodeCreated = nodeType.prototype.onNodeCreated;
            nodeType.prototype.onNodeCreated = function () {
                const result = onNodeCreated?.apply(this, arguments);
                const node = this;

                // Function to update all output types based on connected input
                const updateOutputTypes = () => {
                    let connectedType = "*";
                    // Check the input slot for connected type
                    if (node.inputs && node.inputs[0] && node.inputs[0].link != null) {
                        const linkInfo = app.graph.links[node.inputs[0].link];
                        if (linkInfo) {
                            const originNode = app.graph.getNodeById(linkInfo.origin_id);
                            if (originNode && originNode.outputs && originNode.outputs[linkInfo.origin_slot]) {
                                connectedType = originNode.outputs[linkInfo.origin_slot].type;
                            }
                        }
                    }

                    // Update all output types (except the last one which is INT for index)
                    if (node.outputs) {
                        for (let i = 0; i < node.outputs.length - 1; i++) {
                            if (node.outputs[i].type !== connectedType) {
                                node.outputs[i].type = connectedType;
                                node.outputs[i].name = connectedType === "*" ? `output_${i + 1}` : connectedType;
                            }
                        }
                    }
                };

                // Update on connection change
                const onConnectionsChange = node.onConnectionsChange;
                node.onConnectionsChange = function () {
                    if (onConnectionsChange) {
                        onConnectionsChange.apply(this, arguments);
                    }
                    updateOutputTypes();
                };

                // Initial update after a short delay
                setTimeout(updateOutputTypes, 100);

                return result;
            };

            // Handle workflow load
            const onConfigure = nodeType.prototype.onConfigure;
            nodeType.prototype.onConfigure = function () {
                if (onConfigure) {
                    onConfigure.apply(this, arguments);
                }
                const node = this;
                // Update output types after load
                setTimeout(() => {
                    if (node.onConnectionsChange) {
                        node.onConnectionsChange();
                    }
                }, 100);
            };
        }

        // TrevClaude setup
        if (nodeData.name === "TrevClaude") {
            const onNodeCreated = nodeType.prototype.onNodeCreated;
            nodeType.prototype.onNodeCreated = function () {
                const result = onNodeCreated?.apply(this, arguments);
                const node = this;

                // Hide the default prompt widget
                const promptWidget = this.widgets.find(w => w.name === "prompt");
                if (promptWidget) {
                    promptWidget.type = "hidden";
                    promptWidget.computeSize = () => [0, -4];
                }

                // Create the chat UI wrapper
                const wrapper = document.createElement("div");
                wrapper.className = "trevclaude-wrapper";

                // Chat history container
                const chatHistory = document.createElement("div");
                chatHistory.className = "trevclaude-history";

                // Input container
                const inputContainer = document.createElement("div");
                inputContainer.className = "trevclaude-input-container";

                // Text input
                const input = document.createElement("textarea");
                input.className = "trevclaude-input";
                input.placeholder = "Ask Claude about your workflow...";
                input.rows = 2;

                // Send button
                const sendBtn = document.createElement("button");
                sendBtn.className = "trevclaude-send-btn";
                sendBtn.textContent = "Send";

                // Loading indicator
                const loading = document.createElement("div");
                loading.className = "trevclaude-loading";
                loading.style.display = "none";
                loading.textContent = "Claude is thinking...";

                // Simple markdown parser
                const parseMarkdown = (text) => {
                    return text
                        // Code blocks
                        .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre><code class="language-$1">$2</code></pre>')
                        // Inline code
                        .replace(/`([^`]+)`/g, '<code>$1</code>')
                        // Bold
                        .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
                        // Italic
                        .replace(/\*([^*]+)\*/g, '<em>$1</em>')
                        // Headers
                        .replace(/^### (.+)$/gm, '<h4>$1</h4>')
                        .replace(/^## (.+)$/gm, '<h3>$1</h3>')
                        .replace(/^# (.+)$/gm, '<h2>$1</h2>')
                        // Lists
                        .replace(/^- (.+)$/gm, '<li>$1</li>')
                        // Arrows
                        .replace(/→/g, '→')
                        // Line breaks
                        .replace(/\n/g, '<br>');
                };

                // Function to add a message to chat history
                const addMessage = (role, content) => {
                    const msg = document.createElement("div");
                    msg.className = `trevclaude-message trevclaude-${role}`;
                    if (role === "assistant") {
                        msg.innerHTML = parseMarkdown(content);
                    } else {
                        msg.textContent = content;
                    }
                    chatHistory.appendChild(msg);
                    chatHistory.scrollTop = chatHistory.scrollHeight;
                };

                // Function to get current workflow
                const getWorkflow = () => {
                    try {
                        return app.graph.serialize();
                    } catch (e) {
                        console.error("Failed to serialize workflow:", e);
                        return {};
                    }
                };

                // Function to send message to Claude
                const sendMessage = async () => {
                    const prompt = input.value.trim();
                    if (!prompt) return;

                    // Add user message to chat
                    addMessage("user", prompt);
                    input.value = "";

                    // Show loading
                    loading.style.display = "block";
                    sendBtn.disabled = true;

                    try {
                        const workflow = getWorkflow();
                        const response = await fetch("/trevclaude/send", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                prompt: prompt,
                                workflow: workflow,
                                node_id: node.id
                            })
                        });

                        const data = await response.json();
                        if (data.response) {
                            addMessage("assistant", data.response);
                        } else if (data.error) {
                            addMessage("error", `Error: ${data.error}`);
                        }
                    } catch (e) {
                        addMessage("error", `Failed to contact Claude: ${e.message}`);
                    } finally {
                        loading.style.display = "none";
                        sendBtn.disabled = false;
                    }
                };

                // Event listeners
                sendBtn.addEventListener("click", sendMessage);
                input.addEventListener("keydown", (e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                    }
                });

                // Assemble UI
                inputContainer.appendChild(input);
                inputContainer.appendChild(sendBtn);
                wrapper.appendChild(chatHistory);
                wrapper.appendChild(loading);
                wrapper.appendChild(inputContainer);

                // Add as DOM widget
                this.addDOMWidget("trevclaude_chat", "custom_chat", wrapper, {
                    getValue() { return ""; },
                    setValue(v) {},
                    serialize: false,
                });

                // Set node size
                this.setSize([400, 350]);

                // Add welcome message
                setTimeout(() => {
                    addMessage("assistant", "Hello! I'm Claude. I can see your ComfyUI workflow and help you with questions about it. What would you like to know?");
                }, 100);

                return result;
            };
        }
    }
});
