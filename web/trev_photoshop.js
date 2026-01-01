import { app } from "/scripts/app.js";

const extensionName = "trev.TrevPhotoshop";

// Tool definitions with SVG icons (only enabled tools)
const TOOLS = [
    {
        id: "brush",
        name: "Brush Tool",
        shortcut: "B",
        icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="m14.622 17.897-10.68-2.913"/>
            <path d="M18.376 2.622a1 1 0 1 1 3.002 3.002L17.36 9.643a.5.5 0 0 0 0 .707l.944.944a2.41 2.41 0 0 1 0 3.408l-.944.944a.5.5 0 0 1-.707 0L8.354 7.348a.5.5 0 0 1 0-.707l.944-.944a2.41 2.41 0 0 1 3.408 0l.944.944a.5.5 0 0 0 .707 0z"/>
            <path d="M9 8c-1.804 2.71-3.97 3.46-6.583 3.948a.507.507 0 0 0-.302.819l7.32 8.883a1 1 0 0 0 1.185.204C12.735 20.405 16 16.792 16 15"/>
        </svg>`
    },
    {
        id: "eraser",
        name: "Eraser Tool",
        shortcut: "E",
        icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 21H8a2 2 0 0 1-1.42-.587l-3.994-3.999a2 2 0 0 1 0-2.828l10-10a2 2 0 0 1 2.829 0l5.999 6a2 2 0 0 1 0 2.828L12.834 21"/>
            <path d="m5.082 11.09 8.828 8.828"/>
        </svg>`
    },
    {
        id: "fill",
        name: "Paint Bucket",
        shortcut: "G",
        icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M11 7 6 2"/>
            <path d="M18.992 12H2.041"/>
            <path d="M21.145 18.38A3.34 3.34 0 0 1 20 16.5a3.3 3.3 0 0 1-1.145 1.88c-.575.46-.855 1.02-.855 1.595A2 2 0 0 0 20 22a2 2 0 0 0 2-2.025c0-.58-.285-1.13-.855-1.595"/>
            <path d="m8.5 4.5 2.148-2.148a1.205 1.205 0 0 1 1.704 0l7.296 7.296a1.205 1.205 0 0 1 0 1.704l-7.592 7.592a3.615 3.615 0 0 1-5.112 0l-3.888-3.888a3.615 3.615 0 0 1 0-5.112L5.67 7.33"/>
        </svg>`
    },
    {
        id: "move",
        name: "Move Tool",
        shortcut: "V",
        icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 2v20"/>
            <path d="m15 19-3 3-3-3"/>
            <path d="m19 9 3 3-3 3"/>
            <path d="M2 12h20"/>
            <path d="m5 9-3 3 3 3"/>
            <path d="m9 5 3-3 3 3"/>
        </svg>`
    },
    {
        id: "hand",
        name: "Hand Tool",
        shortcut: "H",
        icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 11V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2"/>
            <path d="M14 10V4a2 2 0 0 0-2-2a2 2 0 0 0-2 2v2"/>
            <path d="M10 10.5V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2v8"/>
            <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/>
        </svg>`
    }
];

// Action buttons (trigger actions, not selectable tools)
const ACTION_BUTTONS = [
    {
        id: "undo",
        name: "Undo (Ctrl+Z)",
        icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 7v6h6"/>
            <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6.36 2.64L3 13"/>
        </svg>`,
        action: "undo",
        isUndoRedo: true
    },
    {
        id: "redo",
        name: "Redo (Ctrl+Y)",
        icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 7v6h-6"/>
            <path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6.36 2.64L21 13"/>
        </svg>`,
        action: "redo",
        isUndoRedo: true
    },
    {
        id: "paste",
        name: "Paste Image",
        shortcut: "V",
        icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M11 14h10"/>
            <path d="M16 4h2a2 2 0 0 1 2 2v1.344"/>
            <path d="m17 18 4-4-4-4"/>
            <path d="M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 1.793-1.113"/>
            <rect x="8" y="2" width="8" height="4" rx="1"/>
        </svg>`,
        action: "pasteFromClipboard"
    },
    {
        id: "flipH",
        name: "Flip Horizontal",
        icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 3v18"/>
            <path d="M16 7l4 5-4 5"/>
            <path d="M8 7l-4 5 4 5"/>
        </svg>`,
        action: "flipHorizontal",
        requiresMoveTool: true
    },
    {
        id: "flipV",
        name: "Flip Vertical",
        icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 12h18"/>
            <path d="M7 8l5-4 5 4"/>
            <path d="M7 16l5 4 5-4"/>
        </svg>`,
        action: "flipVertical",
        requiresMoveTool: true
    }
];

// Layer button icons
const LAYER_ICONS = {
    add: {
        id: "layer_add",
        icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 .83.18 2 2 0 0 0 .83-.18l8.58-3.9a1 1 0 0 0 0-1.831z"/>
            <path d="M16 17h6"/>
            <path d="M19 14v6"/>
            <path d="M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 .825.178"/>
            <path d="M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l2.116-.962"/>
        </svg>`
    },
    delete: {
        id: "layer_delete",
        icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/>
            <path d="M3 6h18"/>
            <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
        </svg>`
    },
    clear: {
        id: "layer_clear",
        icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 12h.01"/>
            <path d="M14 15.4641a4 4 0 0 1-4 0L7.52786 19.74597 A 1 1 0 0 0 7.99303 21.16211 10 10 0 0 0 16.00697 21.16211 1 1 0 0 0 16.47214 19.74597z"/>
            <path d="M16 12a4 4 0 0 0-2-3.464l2.472-4.282a1 1 0 0 1 1.46-.305 10 10 0 0 1 4.006 6.94A1 1 0 0 1 21 12z"/>
            <path d="M8 12a4 4 0 0 1 2-3.464L7.528 4.254a1 1 0 0 0-1.46-.305 10 10 0 0 0-4.006 6.94A1 1 0 0 0 3 12z"/>
        </svg>`
    },
    editSize: {
        id: "edit_size",
        icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M13 7 8.7 2.7a2.41 2.41 0 0 0-3.4 0L2.7 5.3a2.41 2.41 0 0 0 0 3.4L7 13"/>
            <path d="m8 6 2-2"/>
            <path d="m18 16 2-2"/>
            <path d="m17 11 4.3 4.3c.94.94.94 2.46 0 3.4l-2.6 2.6c-.94.94-2.46.94-3.4 0L11 17"/>
            <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/>
            <path d="m15 5 4 4"/>
        </svg>`
    },
    zoomIn: {
        id: "zoom_in",
        icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.3-4.3"/>
            <path d="M11 8v6"/>
            <path d="M8 11h6"/>
        </svg>`
    },
    zoomOut: {
        id: "zoom_out",
        icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.3-4.3"/>
            <path d="M8 11h6"/>
        </svg>`
    },
    zoomReset: {
        id: "zoom_reset",
        icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.3-4.3"/>
            <path d="M11 8v6"/>
            <path d="M8 11h6"/>
            <path d="M2 2l4 4"/>
            <path d="M2 6V2h4"/>
        </svg>`
    }
};

// Cache for rendered icon images
const iconCache = {};
let iconsLoaded = false;

// Default canvas dimensions
const DEFAULT_CANVAS_WIDTH = 1000;
const DEFAULT_CANVAS_HEIGHT = 1000;

// Sublayer class - each brush stroke or pasted image gets its own sublayer
class Sublayer {
    constructor(width, height) {
        if (typeof OffscreenCanvas !== 'undefined') {
            this.canvas = new OffscreenCanvas(width, height);
        } else {
            this.canvas = document.createElement('canvas');
            this.canvas.width = width;
            this.canvas.height = height;
        }
        this.ctx = this.canvas.getContext('2d');

        // Transform properties (for future use)
        this.x = 0;
        this.y = 0;
        this.scaleX = 1;
        this.scaleY = 1;
        this.rotation = 0;
        this.opacity = 100;
        this.visible = true;
        // Rotation pivot in canvas coordinates (center of content)
        this.pivotX = width / 2;
        this.pivotY = height / 2;
    }
}

// Layer canvas manager - creates and manages OffscreenCanvas for each layer
class LayerManager {
    constructor(width = DEFAULT_CANVAS_WIDTH, height = DEFAULT_CANVAS_HEIGHT) {
        this.width = width;
        this.height = height;
        this.layers = new Map(); // layerId -> { canvas, ctx, data }
        this.compositeCanvas = null;
        this.compositeCtx = null;
        this._initComposite();
    }

    _initComposite() {
        // Use OffscreenCanvas if available, otherwise regular canvas
        if (typeof OffscreenCanvas !== 'undefined') {
            this.compositeCanvas = new OffscreenCanvas(this.width, this.height);
        } else {
            this.compositeCanvas = document.createElement('canvas');
            this.compositeCanvas.width = this.width;
            this.compositeCanvas.height = this.height;
        }
        this.compositeCtx = this.compositeCanvas.getContext('2d');
    }

    createLayer(layerId, fillColor = null) {
        const layerData = {
            sublayers: [],           // Array of Sublayer objects
            compositedCanvas: null,  // Cache of all sublayers composited
            needsRecomposite: true   // Flag to know when to rebuild cache
        };

        // If fillColor specified, create initial sublayer with that fill
        if (fillColor) {
            const sublayer = new Sublayer(this.width, this.height);
            sublayer.ctx.fillStyle = fillColor;
            sublayer.ctx.fillRect(0, 0, this.width, this.height);
            layerData.sublayers.push(sublayer);
        }

        this.layers.set(layerId, layerData);
        return layerData;
    }

    getLayer(layerId) {
        return this.layers.get(layerId);
    }

    deleteLayer(layerId) {
        const layer = this.layers.get(layerId);
        if (layer) {
            layer.sublayers = [];  // Clear references
        }
        this.layers.delete(layerId);
    }

    // Create a new sublayer for a layer (called when starting a new stroke or pasting an image)
    createSublayer(layerId) {
        const layer = this.layers.get(layerId);
        if (!layer) return null;

        const sublayer = new Sublayer(this.width, this.height);
        layer.sublayers.push(sublayer);
        layer.needsRecomposite = true;
        return sublayer;
    }

    // Get the current (last) sublayer for a layer
    getCurrentSublayer(layerId) {
        const layer = this.layers.get(layerId);
        if (!layer || layer.sublayers.length === 0) return null;
        return layer.sublayers[layer.sublayers.length - 1];
    }

    // Get the drawing context for the current sublayer
    getLayerContext(layerId) {
        const sublayer = this.getCurrentSublayer(layerId);
        return sublayer ? sublayer.ctx : null;
    }

    // Get the current sublayer's position offset (for coordinate adjustment when drawing)
    getCurrentSublayerOffset(layerId) {
        const sublayer = this.getCurrentSublayer(layerId);
        return sublayer ? { x: sublayer.x, y: sublayer.y } : { x: 0, y: 0 };
    }

    // Get a specific sublayer's context by index
    getSublayerContext(layerId, sublayerIndex) {
        const layer = this.layers.get(layerId);
        if (!layer || sublayerIndex < 0 || sublayerIndex >= layer.sublayers.length) return null;
        return layer.sublayers[sublayerIndex].ctx;
    }

    // Get a specific sublayer's offset by index
    getSublayerOffset(layerId, sublayerIndex) {
        const layer = this.layers.get(layerId);
        if (!layer || sublayerIndex < 0 || sublayerIndex >= layer.sublayers.length) return { x: 0, y: 0 };
        const sublayer = layer.sublayers[sublayerIndex];
        return { x: sublayer.x, y: sublayer.y };
    }

    // Get all sublayers for a layer (for operations that need to work on all sublayers)
    getAllSublayers(layerId) {
        const layer = this.layers.get(layerId);
        return layer ? layer.sublayers : [];
    }

    // Composite all sublayers within a single layer into one canvas
    compositeLayer(layerId) {
        const layer = this.layers.get(layerId);
        if (!layer) return null;

        // Create compositedCanvas if not exists
        if (!layer.compositedCanvas) {
            if (typeof OffscreenCanvas !== 'undefined') {
                layer.compositedCanvas = new OffscreenCanvas(this.width, this.height);
            } else {
                layer.compositedCanvas = document.createElement('canvas');
                layer.compositedCanvas.width = this.width;
                layer.compositedCanvas.height = this.height;
            }
        }

        const ctx = layer.compositedCanvas.getContext('2d');
        ctx.clearRect(0, 0, this.width, this.height);

        for (const sublayer of layer.sublayers) {
            if (!sublayer.visible) continue;  // Skip hidden sublayers
            ctx.globalAlpha = sublayer.opacity / 100;
            ctx.save();

            // Check if sublayer is normalized (identity transform)
            const isNormalized = sublayer.x === 0 && sublayer.y === 0 &&
                                 sublayer.scaleX === 1 && sublayer.scaleY === 1 &&
                                 sublayer.rotation === 0;

            if (isNormalized) {
                // No transform needed - draw directly
                ctx.drawImage(sublayer.canvas, 0, 0);
            } else {
                // Apply full transform around pivot
                const pivotInLayerX = sublayer.x + sublayer.pivotX * sublayer.scaleX;
                const pivotInLayerY = sublayer.y + sublayer.pivotY * sublayer.scaleY;
                ctx.translate(pivotInLayerX, pivotInLayerY);
                ctx.rotate(sublayer.rotation);
                ctx.scale(sublayer.scaleX, sublayer.scaleY);
                ctx.translate(-sublayer.pivotX, -sublayer.pivotY);
                ctx.drawImage(sublayer.canvas, 0, 0);
            }
            ctx.restore();
        }

        ctx.globalAlpha = 1;
        layer.needsRecomposite = false;
        return layer.compositedCanvas;
    }

    // Composite all visible layers into one image
    composite(layerDataArray) {
        // layerDataArray: [{id, visible, opacity, blendMode}, ...] in bottom-to-top order
        this.compositeCtx.clearRect(0, 0, this.width, this.height);

        for (const layerData of layerDataArray) {
            if (!layerData.visible) continue;

            const layerCanvas = this.compositeLayer(layerData.id);
            if (!layerCanvas) continue;

            this.compositeCtx.globalAlpha = (layerData.opacity || 100) / 100;
            this.compositeCtx.globalCompositeOperation = layerData.blendMode || 'source-over';
            this.compositeCtx.drawImage(layerCanvas, 0, 0);
        }

        this.compositeCtx.globalAlpha = 1;
        this.compositeCtx.globalCompositeOperation = 'source-over';

        return this.compositeCanvas;
    }

    // Resize all layer canvases
    resize(newWidth, newHeight) {
        const oldWidth = this.width;
        const oldHeight = this.height;
        this.width = newWidth;
        this.height = newHeight;

        // Resize composite
        if (typeof OffscreenCanvas !== 'undefined') {
            const newComposite = new OffscreenCanvas(newWidth, newHeight);
            const newCtx = newComposite.getContext('2d');
            newCtx.drawImage(this.compositeCanvas, 0, 0);
            this.compositeCanvas = newComposite;
            this.compositeCtx = newCtx;
        } else {
            const newComposite = document.createElement('canvas');
            newComposite.width = newWidth;
            newComposite.height = newHeight;
            const newCtx = newComposite.getContext('2d');
            newCtx.drawImage(this.compositeCanvas, 0, 0);
            this.compositeCanvas = newComposite;
            this.compositeCtx = newCtx;
        }

        // Resize each sublayer within each layer, preserving content
        for (const [layerId, layer] of this.layers) {
            const newSublayers = [];

            for (const sublayer of layer.sublayers) {
                const newSublayer = new Sublayer(newWidth, newHeight);
                newSublayer.ctx.drawImage(sublayer.canvas, 0, 0);
                // Preserve transform properties
                newSublayer.x = sublayer.x;
                newSublayer.y = sublayer.y;
                newSublayer.scaleX = sublayer.scaleX;
                newSublayer.scaleY = sublayer.scaleY;
                newSublayer.rotation = sublayer.rotation;
                newSublayer.opacity = sublayer.opacity;
                newSublayer.pivotX = sublayer.pivotX;
                newSublayer.pivotY = sublayer.pivotY;
                newSublayers.push(newSublayer);
            }

            layer.sublayers = newSublayers;
            layer.compositedCanvas = null;  // Force re-creation at new size
            layer.needsRecomposite = true;
        }
    }

    // Paste an image onto a specific layer (creates a new sublayer)
    pasteImage(layerId, image, x = 0, y = 0) {
        const sublayer = this.createSublayer(layerId);
        if (!sublayer) return false;
        sublayer.ctx.drawImage(image, x, y);
        return true;
    }

    // Clear a layer (removes all sublayers)
    clearLayer(layerId) {
        const layer = this.layers.get(layerId);
        if (!layer) return;
        layer.sublayers = [];
        layer.needsRecomposite = true;
    }

    // Get layer as ImageData for thumbnails
    getLayerThumbnail(layerId, thumbWidth, thumbHeight) {
        // First composite the layer's sublayers
        const layerCanvas = this.compositeLayer(layerId);
        if (!layerCanvas) return null;

        let thumbCanvas;
        if (typeof OffscreenCanvas !== 'undefined') {
            thumbCanvas = new OffscreenCanvas(thumbWidth, thumbHeight);
        } else {
            thumbCanvas = document.createElement('canvas');
            thumbCanvas.width = thumbWidth;
            thumbCanvas.height = thumbHeight;
        }
        const thumbCtx = thumbCanvas.getContext('2d');
        thumbCtx.drawImage(layerCanvas, 0, 0, thumbWidth, thumbHeight);
        return thumbCanvas;
    }

    // Get sublayer count for a layer
    getSublayerCount(layerId) {
        const layer = this.layers.get(layerId);
        return layer ? layer.sublayers.length : 0;
    }

    // Get sublayer thumbnail
    getSublayerThumbnail(layerId, sublayerIndex, thumbWidth, thumbHeight) {
        const layer = this.layers.get(layerId);
        if (!layer || sublayerIndex < 0 || sublayerIndex >= layer.sublayers.length) return null;

        const sublayer = layer.sublayers[sublayerIndex];
        let thumbCanvas;
        if (typeof OffscreenCanvas !== 'undefined') {
            thumbCanvas = new OffscreenCanvas(thumbWidth, thumbHeight);
        } else {
            thumbCanvas = document.createElement('canvas');
            thumbCanvas.width = thumbWidth;
            thumbCanvas.height = thumbHeight;
        }
        const thumbCtx = thumbCanvas.getContext('2d');
        thumbCtx.drawImage(sublayer.canvas, 0, 0, thumbWidth, thumbHeight);
        return thumbCanvas;
    }

    // Get sublayer visibility
    getSublayerVisible(layerId, sublayerIndex) {
        const layer = this.layers.get(layerId);
        if (!layer || sublayerIndex < 0 || sublayerIndex >= layer.sublayers.length) return false;
        return layer.sublayers[sublayerIndex].visible;
    }

    // Toggle sublayer visibility
    toggleSublayerVisible(layerId, sublayerIndex) {
        const layer = this.layers.get(layerId);
        if (!layer || sublayerIndex < 0 || sublayerIndex >= layer.sublayers.length) return false;
        layer.sublayers[sublayerIndex].visible = !layer.sublayers[sublayerIndex].visible;
        layer.needsRecomposite = true;
        return layer.sublayers[sublayerIndex].visible;
    }

    // Delete a sublayer
    deleteSublayer(layerId, sublayerIndex) {
        const layer = this.layers.get(layerId);
        if (!layer || sublayerIndex < 0 || sublayerIndex >= layer.sublayers.length) return false;
        layer.sublayers.splice(sublayerIndex, 1);
        layer.needsRecomposite = true;
        return true;
    }

    // Get sublayer's transformed bounds (in layer coordinates)
    getSublayerBounds(layerId, sublayerIndex) {
        const layer = this.layers.get(layerId);
        if (!layer || sublayerIndex < 0 || sublayerIndex >= layer.sublayers.length) return null;

        const sublayer = layer.sublayers[sublayerIndex];

        // Calculate content-based bounding box by finding outermost non-transparent pixels
        const canvas = sublayer.canvas;
        const ctx = canvas.getContext('2d');
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        let minX = canvas.width;
        let minY = canvas.height;
        let maxX = 0;
        let maxY = 0;
        let hasContent = false;

        // Scan for non-transparent pixels
        for (let y = 0; y < canvas.height; y++) {
            for (let x = 0; x < canvas.width; x++) {
                const alpha = data[(y * canvas.width + x) * 4 + 3];
                if (alpha > 0) {
                    hasContent = true;
                    if (x < minX) minX = x;
                    if (x > maxX) maxX = x;
                    if (y < minY) minY = y;
                    if (y > maxY) maxY = y;
                }
            }
        }

        // If no content, return full bounds
        if (!hasContent) {
            // Update pivot to canvas center
            sublayer.pivotX = this.width / 2;
            sublayer.pivotY = this.height / 2;
            return {
                x: sublayer.x,
                y: sublayer.y,
                width: this.width * sublayer.scaleX,
                height: this.height * sublayer.scaleY,
                contentX: 0,
                contentY: 0,
                contentWidth: this.width,
                contentHeight: this.height
            };
        }

        // Calculate content dimensions
        const contentWidth = maxX - minX + 1;
        const contentHeight = maxY - minY + 1;

        // Update pivot to content center (in canvas coordinates)
        sublayer.pivotX = minX + contentWidth / 2;
        sublayer.pivotY = minY + contentHeight / 2;

        // Return bounds based on actual content, accounting for sublayer transform
        const bounds = {
            x: sublayer.x + minX * sublayer.scaleX,
            y: sublayer.y + minY * sublayer.scaleY,
            width: contentWidth * sublayer.scaleX,
            height: contentHeight * sublayer.scaleY,
            contentX: minX,
            contentY: minY,
            contentWidth: contentWidth,
            contentHeight: contentHeight
        };
        return bounds;
    }

    // Get sublayer object directly
    getSublayer(layerId, sublayerIndex) {
        const layer = this.layers.get(layerId);
        if (!layer || sublayerIndex < 0 || sublayerIndex >= layer.sublayers.length) return null;
        return layer.sublayers[sublayerIndex];
    }

    // Bake sublayer transform into pixels and reset transform to identity
    // Called automatically after move/resize/rotate to commit the transform
    bakeSublayerTransform(layerId, sublayerIndex) {
        const layer = this.layers.get(layerId);
        if (!layer || sublayerIndex < 0 || sublayerIndex >= layer.sublayers.length) {
            return false;
        }

        const sublayer = layer.sublayers[sublayerIndex];

        // Skip if already normalized (no transform applied)
        if (sublayer.x === 0 && sublayer.y === 0 &&
            sublayer.scaleX === 1 && sublayer.scaleY === 1 &&
            sublayer.rotation === 0) {
            return true;
        }

        // Calculate the bounding box of the transformed content in layer space
        // We need to transform all 4 corners of the source canvas and find the bounds
        const srcWidth = sublayer.canvas.width;
        const srcHeight = sublayer.canvas.height;
        const corners = [
            { x: 0, y: 0 },
            { x: srcWidth, y: 0 },
            { x: srcWidth, y: srcHeight },
            { x: 0, y: srcHeight }
        ];

        const pivotInLayerX = sublayer.x + sublayer.pivotX * sublayer.scaleX;
        const pivotInLayerY = sublayer.y + sublayer.pivotY * sublayer.scaleY;
        const cos = Math.cos(sublayer.rotation);
        const sin = Math.sin(sublayer.rotation);

        // Transform each corner to find bounds
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        for (const corner of corners) {
            // Apply the same transform chain as compositeLayer
            // 1. Translate by -pivot
            let x = corner.x - sublayer.pivotX;
            let y = corner.y - sublayer.pivotY;
            // 2. Scale
            x *= sublayer.scaleX;
            y *= sublayer.scaleY;
            // 3. Rotate
            const rx = x * cos - y * sin;
            const ry = x * sin + y * cos;
            // 4. Translate by pivot in layer space
            x = rx + pivotInLayerX;
            y = ry + pivotInLayerY;

            minX = Math.min(minX, x);
            minY = Math.min(minY, y);
            maxX = Math.max(maxX, x);
            maxY = Math.max(maxY, y);
        }

        // Round bounds outward to avoid subpixel clipping
        minX = Math.floor(minX);
        minY = Math.floor(minY);
        maxX = Math.ceil(maxX);
        maxY = Math.ceil(maxY);

        // Calculate new canvas size (at least 1x1)
        const newWidth = Math.max(1, maxX - minX);
        const newHeight = Math.max(1, maxY - minY);

        // Create new canvas sized to fit all transformed content
        let newCanvas;
        if (typeof OffscreenCanvas !== 'undefined') {
            newCanvas = new OffscreenCanvas(newWidth, newHeight);
        } else {
            newCanvas = document.createElement('canvas');
            newCanvas.width = newWidth;
            newCanvas.height = newHeight;
        }
        const newCtx = newCanvas.getContext('2d');

        // Draw the transformed content onto the new canvas
        // Offset so that minX,minY maps to 0,0 in the new canvas
        newCtx.translate(-minX, -minY);
        newCtx.translate(pivotInLayerX, pivotInLayerY);
        newCtx.rotate(sublayer.rotation);
        newCtx.scale(sublayer.scaleX, sublayer.scaleY);
        newCtx.translate(-sublayer.pivotX, -sublayer.pivotY);
        newCtx.drawImage(sublayer.canvas, 0, 0);

        // Reset the context transform so subsequent drawing operations work correctly
        newCtx.setTransform(1, 0, 0, 1, 0, 0);

        // Replace sublayer canvas and set position to the bounds origin
        sublayer.canvas = newCanvas;
        sublayer.ctx = newCtx;
        sublayer.x = minX;
        sublayer.y = minY;
        sublayer.scaleX = 1;
        sublayer.scaleY = 1;
        sublayer.rotation = 0;
        sublayer.pivotX = newWidth / 2;
        sublayer.pivotY = newHeight / 2;

        layer.needsRecomposite = true;
        return true;
    }

}

// Drawing tools implementation
class DrawingTools {
    constructor(layerManager) {
        this.layerManager = layerManager;
        this.brushSize = 50;
        this.brushHardness = 100; // 0-100, affects edge softness
        this.brushFeather = 0; // 0-100, 0 = hard edge, 100 = fully feathered
        this.lastPoint = null;
    }

    // Draw a brush stroke segment
    drawBrushSegment(layerId, x1, y1, x2, y2, color, size = null, feather = null) {
        const ctx = this.layerManager.getLayerContext(layerId);
        if (!ctx) return;

        // Adjust coordinates for sublayer offset
        const offset = this.layerManager.getCurrentSublayerOffset(layerId);
        x1 -= offset.x;
        y1 -= offset.y;
        x2 -= offset.x;
        y2 -= offset.y;

        const brushSize = size || this.brushSize;
        const brushFeather = feather !== null ? feather : this.brushFeather;

        if (brushFeather > 0) {
            // For feathered brush, draw a series of dots along the path
            const dx = x2 - x1;
            const dy = y2 - y1;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const spacing = Math.max(1, brushSize / 8); // Denser spacing for smoother strokes
            const steps = Math.max(1, Math.ceil(dist / spacing));

            for (let i = 0; i <= steps; i++) {
                const t = i / steps;
                const x = x1 + dx * t;
                const y = y1 + dy * t;
                // Pass adjusted coordinates directly to avoid double offset
                this._drawBrushDotInternal(ctx, x, y, color, brushSize, brushFeather);
            }
        } else {
            // Hard brush - use line stroke
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.lineWidth = brushSize;
            ctx.strokeStyle = color;

            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
        }
    }

    // Draw a single brush dot
    drawBrushDot(layerId, x, y, color, size = null, feather = null) {
        const ctx = this.layerManager.getLayerContext(layerId);
        if (!ctx) return;

        // Adjust coordinates for sublayer offset
        const offset = this.layerManager.getCurrentSublayerOffset(layerId);
        x -= offset.x;
        y -= offset.y;

        const brushSize = size || this.brushSize;
        const brushFeather = feather !== null ? feather : this.brushFeather;
        this._drawBrushDotInternal(ctx, x, y, color, brushSize, brushFeather);
    }

    // Internal helper for drawing brush dot (coordinates already adjusted)
    _drawBrushDotInternal(ctx, x, y, color, brushSize, brushFeather) {
        const radius = brushSize / 2;

        if (brushFeather > 0) {
            // Create radial gradient for feathered brush
            const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
            // Parse color to get RGB values
            let r, g, b;
            if (color.startsWith('#')) {
                const hex = color.slice(1);
                r = parseInt(hex.substr(0, 2), 16);
                g = parseInt(hex.substr(2, 2), 16);
                b = parseInt(hex.substr(4, 2), 16);
            } else {
                r = g = b = 0;
            }

            // Hard core size based on feather (0% feather = 100% hard, 100% feather = 0% hard)
            const hardRatio = 1 - (brushFeather / 100);
            gradient.addColorStop(0, `rgba(${r},${g},${b},1)`);
            gradient.addColorStop(hardRatio, `rgba(${r},${g},${b},1)`);
            gradient.addColorStop(1, `rgba(${r},${g},${b},0)`);

            ctx.fillStyle = gradient;
        } else {
            ctx.fillStyle = color;
        }

        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
    }

    // Erase (draw with destination-out)
    // sublayerIndex: specific sublayer to erase from, or null to erase from all sublayers
    eraseSegment(layerId, x1, y1, x2, y2, size = null, feather = null, sublayerIndex = null) {
        const brushSize = size || this.brushSize;
        const brushFeather = feather !== null ? feather : this.brushFeather;

        // Get sublayers to erase from
        const sublayers = sublayerIndex !== null
            ? [{ sublayer: this.layerManager.getSublayer(layerId, sublayerIndex), index: sublayerIndex }]
            : this.layerManager.getAllSublayers(layerId).map((sl, i) => ({ sublayer: sl, index: i }));

        for (const { sublayer } of sublayers) {
            if (!sublayer || !sublayer.visible) continue;

            const ctx = sublayer.ctx;
            ctx.save();
            ctx.globalCompositeOperation = 'destination-out';

            if (brushFeather > 0) {
                // For feathered eraser, draw a series of dots along the path
                const dx = x2 - x1;
                const dy = y2 - y1;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const spacing = Math.max(1, brushSize / 8);
                const steps = Math.max(1, Math.ceil(dist / spacing));

                for (let i = 0; i <= steps; i++) {
                    const t = i / steps;
                    const x = x1 + dx * t;
                    const y = y1 + dy * t;
                    this._eraseFeatheredDot(ctx, x, y, brushSize, brushFeather);
                }
            } else {
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';
                ctx.lineWidth = brushSize;
                ctx.strokeStyle = 'rgba(0,0,0,1)';

                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
                ctx.stroke();
            }
            ctx.restore();
        }

        // Mark layer for recomposite
        const layer = this.layerManager.getLayer(layerId);
        if (layer) layer.needsRecomposite = true;
    }

    // Helper for feathered eraser dot
    _eraseFeatheredDot(ctx, x, y, brushSize, brushFeather) {
        const radius = brushSize / 2;
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
        const hardRatio = 1 - (brushFeather / 100);
        gradient.addColorStop(0, 'rgba(0,0,0,1)');
        gradient.addColorStop(hardRatio, 'rgba(0,0,0,1)');
        gradient.addColorStop(1, 'rgba(0,0,0,0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
    }

    // sublayerIndex: specific sublayer to erase from, or null to erase from all sublayers
    eraseDot(layerId, x, y, size = null, feather = null, sublayerIndex = null) {
        const brushSize = size || this.brushSize;
        const brushFeather = feather !== null ? feather : this.brushFeather;
        const radius = brushSize / 2;

        // Get sublayers to erase from
        const sublayers = sublayerIndex !== null
            ? [{ sublayer: this.layerManager.getSublayer(layerId, sublayerIndex), index: sublayerIndex }]
            : this.layerManager.getAllSublayers(layerId).map((sl, i) => ({ sublayer: sl, index: i }));

        for (const { sublayer } of sublayers) {
            if (!sublayer || !sublayer.visible) continue;

            const ctx = sublayer.ctx;
            ctx.save();
            ctx.globalCompositeOperation = 'destination-out';

            if (brushFeather > 0) {
                this._eraseFeatheredDot(ctx, x, y, brushSize, brushFeather);
            } else {
                ctx.fillStyle = 'rgba(0,0,0,1)';
                ctx.beginPath();
                ctx.arc(x, y, radius, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.restore();
        }

        // Mark layer for recomposite
        const layer = this.layerManager.getLayer(layerId);
        if (layer) layer.needsRecomposite = true;
    }

    // Fill bucket tool (flood fill)
    floodFill(layerId, startX, startY, fillColor) {
        const ctx = this.layerManager.getLayerContext(layerId);
        if (!ctx) return;

        // Adjust coordinates for sublayer offset
        const offset = this.layerManager.getCurrentSublayerOffset(layerId);
        startX -= offset.x;
        startY -= offset.y;

        const width = this.layerManager.width;
        const height = this.layerManager.height;
        const imageData = ctx.getImageData(0, 0, width, height);
        const data = imageData.data;

        // Parse fill color
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = 1;
        tempCanvas.height = 1;
        const tempCtx = tempCanvas.getContext('2d');
        tempCtx.fillStyle = fillColor;
        tempCtx.fillRect(0, 0, 1, 1);
        const fillRgba = tempCtx.getImageData(0, 0, 1, 1).data;

        const startIdx = (Math.floor(startY) * width + Math.floor(startX)) * 4;
        const startR = data[startIdx];
        const startG = data[startIdx + 1];
        const startB = data[startIdx + 2];
        const startA = data[startIdx + 3];

        // If same color, don't fill
        if (startR === fillRgba[0] && startG === fillRgba[1] && startB === fillRgba[2] && startA === fillRgba[3]) {
            return;
        }

        const tolerance = 32;
        const stack = [[Math.floor(startX), Math.floor(startY)]];
        const visited = new Set();

        const matchesStart = (idx) => {
            return Math.abs(data[idx] - startR) <= tolerance &&
                   Math.abs(data[idx + 1] - startG) <= tolerance &&
                   Math.abs(data[idx + 2] - startB) <= tolerance &&
                   Math.abs(data[idx + 3] - startA) <= tolerance;
        };

        while (stack.length > 0) {
            const [x, y] = stack.pop();
            const key = `${x},${y}`;

            if (visited.has(key)) continue;
            if (x < 0 || x >= width || y < 0 || y >= height) continue;

            const idx = (y * width + x) * 4;
            if (!matchesStart(idx)) continue;

            visited.add(key);

            // Fill pixel
            data[idx] = fillRgba[0];
            data[idx + 1] = fillRgba[1];
            data[idx + 2] = fillRgba[2];
            data[idx + 3] = fillRgba[3];

            // Add neighbors
            stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
        }

        ctx.putImageData(imageData, 0, 0);
    }
}

// Pre-render SVG icons to images
function getIconImage(tool, color, node) {
    const cacheKey = `${tool.id}_${color}`;
    if (iconCache[cacheKey] && iconCache[cacheKey].complete && iconCache[cacheKey].naturalWidth > 0) {
        return iconCache[cacheKey];
    }

    if (!tool.icon) return null;

    // Replace currentColor with actual color
    let svgWithColor = tool.icon.replace(/currentColor/g, color);

    // Clean up whitespace and ensure proper SVG format
    svgWithColor = svgWithColor.trim();

    // Add xmlns if not present
    if (!svgWithColor.includes('xmlns=')) {
        svgWithColor = svgWithColor.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
    }

    // Use encodeURIComponent for safe encoding (works better than btoa for all characters)
    const dataUrl = 'data:image/svg+xml,' + encodeURIComponent(svgWithColor);

    const img = new Image();

    // Set up load handler before setting src
    img.onload = () => {
        iconsLoaded = true;
        if (node) {
            node.setDirtyCanvas(true, true);
        }
        // Also trigger app graph redraw
        if (app?.graph) {
            app.graph.setDirtyCanvas(true, false);
        }
    };

    img.onerror = (e) => {
        console.warn(`Failed to load icon for ${tool.id}:`, e);
    };

    img.src = dataUrl;
    iconCache[cacheKey] = img;

    return img;
}

app.registerExtension({
    name: extensionName,

    // Send canvas data for all TrevPhotoshop nodes before queuing
    async beforeQueuePrompt() {
        const nodes = app.graph._nodes.filter(n => n.type === "TrevPhotoshop");
        for (const node of nodes) {
            if (node.sendCanvasData) {
                await node.sendCanvasData();
            }
        }
    },

    async beforeRegisterNodeDef(nodeType, nodeData, app) {
        if (nodeData.name !== "TrevPhotoshop") return;

        const onNodeCreated = nodeType.prototype.onNodeCreated;
        nodeType.prototype.onNodeCreated = function() {
            const result = onNodeCreated?.apply(this, arguments);

            this.selectedTool = "brush";
            this.foregroundColor = "#000000";
            this.backgroundColor = "#ffffff";
            this.brushSize = 50;
            this.brushFeather = 0; // 0-100, 0 = hard edge, 100 = fully feathered

            // Canvas dimensions (the actual drawing surface)
            this.canvasWidth = DEFAULT_CANVAS_WIDTH;
            this.canvasHeight = DEFAULT_CANVAS_HEIGHT;

            // Initialize layer manager
            this.layerManager = new LayerManager(this.canvasWidth, this.canvasHeight);
            this.drawingTools = new DrawingTools(this.layerManager);

            // Layers panel state
            this.layers = [
                { id: 1, name: "Layer 1", visible: true, locked: false, opacity: 100, expanded: true },
            ];
            this.selectedLayer = 1;
            this.selectedSublayer = null;  // Index of selected sublayer within layer, null = layer selected
            this.expandedLayers = new Set([1]);  // Set of expanded layer IDs

            // Create layer canvases
            this.layerManager.createLayer(1); // Empty layer 1

            // Drawing state
            this.isDrawing = false;
            this.lastDrawPoint = null;

            // View state (pan and zoom)
            this.viewOffsetX = 0;
            this.viewOffsetY = 0;
            this.viewZoom = 1;

            // Undo/Redo history stacks
            this.undoStack = [];
            this.redoStack = [];
            this.maxHistorySize = 50;
            this._pendingCommand = null;

            // Layer/sublayer drag reordering state
            this._isDraggingLayerItem = false;
            this._draggedItem = null;  // { type: 'layer'|'sublayer', layerId, sublayerIndex? }
            this._dragStartPos = null;
            this._dropTarget = null;   // { type: 'layer'|'sublayer', layerId, sublayerIndex?, position: 'before'|'after' }

            // Set minimum size (wider to accommodate toolbar with color picker, taller for output slots)
            this.size = [850, 740];
            this.setSize([850, 740]);

            // Pre-cache icons
            const self = this;
            TOOLS.forEach(tool => {
                if (tool.icon) {
                    getIconImage(tool, "#aaa", self);
                    getIconImage(tool, "#fff", self);
                }
            });
            // Pre-cache action button icons
            ACTION_BUTTONS.forEach(btn => {
                if (btn.icon) {
                    getIconImage(btn, "#aaa", self);
                    getIconImage(btn, "#fff", self);
                }
            });
            // Pre-cache layer button icons
            Object.values(LAYER_ICONS).forEach(icon => {
                getIconImage(icon, "#aaa", self);
                getIconImage(icon, "#fff", self);
            });

            // Add global mouseup/pointerup listener to catch releases outside the node
            // Use capture phase to ensure we get the event before anything else can stop it
            this._globalMouseUpHandler = (e) => {
                // Handle layer/sublayer drag drop BEFORE resetting state
                if (self._isDraggingLayerItem && self._draggedItem && self._dropTarget) {
                    const draggedItem = self._draggedItem;
                    const dropTarget = self._dropTarget;

                    if (draggedItem.type === 'sublayer' && dropTarget.type === 'sublayer') {
                        // Reorder sublayers within the same layer
                        // Note: Sublayers are displayed in reverse order (last index = top of list)
                        const layer = self.layerManager?.getLayer(draggedItem.layerId);
                        if (layer && draggedItem.layerId === dropTarget.layerId) {
                            const fromIndex = draggedItem.sublayerIndex;
                            const targetIndex = dropTarget.sublayerIndex;

                            if (fromIndex !== targetIndex) {
                                const beforeOrder = layer.sublayers.map((_, i) => i);
                                const [sublayer] = layer.sublayers.splice(fromIndex, 1);

                                let insertIndex = targetIndex;
                                if (fromIndex < targetIndex) {
                                    insertIndex -= 1;
                                }
                                if (dropTarget.position === 'after') {
                                    insertIndex += 1;
                                }
                                insertIndex = Math.max(0, Math.min(layer.sublayers.length, insertIndex));

                                layer.sublayers.splice(insertIndex, 0, sublayer);
                                layer.needsRecomposite = true;
                                self.selectedSublayer = insertIndex;
                                self._pushCommand({
                                    type: 'reorder_sublayers',
                                    layerId: draggedItem.layerId,
                                    before: { order: beforeOrder },
                                    after: { fromIndex, toIndex: insertIndex }
                                });
                            }
                        }
                    } else if (draggedItem.type === 'layer' && dropTarget.type === 'layer') {
                        // Reorder layers
                        const fromIndex = self.layers.findIndex(l => l.id === draggedItem.layerId);
                        const targetIndex = self.layers.findIndex(l => l.id === dropTarget.layerId);

                        if (fromIndex !== -1 && targetIndex !== -1 && fromIndex !== targetIndex) {
                            const beforeOrder = self.layers.map(l => l.id);
                            const [movedLayer] = self.layers.splice(fromIndex, 1);
                            let insertIndex = targetIndex;
                            if (fromIndex < targetIndex) {
                                insertIndex -= 1;
                            }
                            if (dropTarget.position === 'after') {
                                insertIndex += 1;
                            }
                            insertIndex = Math.max(0, Math.min(self.layers.length, insertIndex));
                            self.layers.splice(insertIndex, 0, movedLayer);

                            for (const l of self.layers) {
                                const layerData = self.layerManager?.getLayer(l.id);
                                if (layerData) layerData.needsRecomposite = true;
                            }
                            self._pushCommand({
                                type: 'reorder_layers',
                                before: { order: beforeOrder },
                                after: { order: self.layers.map(l => l.id) }
                            });
                        }
                    }
                }

                // Reset layer drag state
                if (self._isDraggingLayerItem || self._dragStartPos) {
                    self._isDraggingLayerItem = false;
                    self._draggedItem = null;
                    self._dragStartPos = null;
                    self._dropTarget = null;
                    self.setDirtyCanvas(true);
                }

                if (self.isDrawing || self.isPanning || self.isRotating || self.isMoving || self.isResizing || self._draggingBrushSlider || self._draggingFeatherSlider || self._draggingSV || self._draggingHue || self._handlingCanvasInteraction) {
                    // Bake sublayer transform after move/resize/rotate to commit pixels
                    if ((self.isMoving || self.isResizing || self.isRotating) &&
                        self.selectedSublayer !== null && self.layerManager) {
                        self.layerManager.bakeSublayerTransform(self.selectedLayer, self.selectedSublayer);
                    }

                    // Finalize pending undo commands before resetting state
                    self._finalizePendingCommand();

                    self.isDrawing = false;
                    self.lastDrawPoint = null;
                    self.isPanning = false;
                    self._panStart = null;
                    self.isMoving = false;
                    self._moveStart = null;
                    self.isResizing = false;
                    self._resizeStart = null;
                    self._resizeHandle = null;
                    self.isRotating = false;
                    self._rotateStartAngle = null;
                    self._rotateTargetStartRotation = null;
                    self._handlingCanvasInteraction = false;
                    self._draggingBrushSlider = false;
                    self._draggingFeatherSlider = false;
                    self._draggingSV = false;
                    self._draggingHue = false;
                    self.setDirtyCanvas(true);
                }
            };
            // Listen on both mouseup and pointerup with capture phase for maximum compatibility
            document.addEventListener('mouseup', this._globalMouseUpHandler, true);
            document.addEventListener('pointerup', this._globalMouseUpHandler, true);

            // Also listen for mouseup on window to catch edge cases
            this._windowMouseUpHandler = (e) => {
                self._globalMouseUpHandler(e);
            };
            window.addEventListener('mouseup', this._windowMouseUpHandler, true);
            window.addEventListener('pointerup', this._windowMouseUpHandler, true);

            // Method to get canvas as base64 PNG
            this.getCanvasDataURL = function() {
                if (!this.layerManager) return null;

                // Create a temporary canvas to composite all layers
                const tempCanvas = document.createElement('canvas');
                tempCanvas.width = this.canvasWidth;
                tempCanvas.height = this.canvasHeight;
                const tempCtx = tempCanvas.getContext('2d');

                // Get composited image from layer manager
                const compositedCanvas = this.layerManager.composite(
                    this.layers.map(l => ({
                        id: l.id,
                        visible: l.visible,
                        opacity: l.opacity,
                        blendMode: l.blendMode || 'source-over'
                    }))
                );

                if (compositedCanvas) {
                    tempCtx.drawImage(compositedCanvas, 0, 0);
                }

                return tempCanvas.toDataURL('image/png');
            };

            // Send canvas data to server before execution
            this.sendCanvasData = async function() {
                const canvasData = this.getCanvasDataURL();
                if (!canvasData) return false;

                try {
                    const response = await fetch('/trevphotoshop/canvas_data', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            unique_id: String(this.id),
                            canvas_data: canvasData
                        })
                    });
                    return response.ok;
                } catch (e) {
                    console.error('Failed to send canvas data:', e);
                    return false;
                }
            };

            return result;
        };

        // Hook into queue execution to send canvas data before processing
        const origOnExecutionStart = nodeType.prototype.onExecutionStart;
        nodeType.prototype.onExecutionStart = function() {
            // Send canvas data to server
            this.sendCanvasData();
            if (origOnExecutionStart) {
                return origOnExecutionStart.apply(this, arguments);
            }
        };

        // Clean up global listeners when node is removed
        const onRemoved = nodeType.prototype.onRemoved;
        nodeType.prototype.onRemoved = function() {
            if (this._globalMouseUpHandler) {
                document.removeEventListener('mouseup', this._globalMouseUpHandler, true);
                document.removeEventListener('pointerup', this._globalMouseUpHandler, true);
            }
            if (this._windowMouseUpHandler) {
                window.removeEventListener('mouseup', this._windowMouseUpHandler, true);
                window.removeEventListener('pointerup', this._windowMouseUpHandler, true);
            }
            if (this._undoKeyHandler) {
                document.removeEventListener('keydown', this._undoKeyHandler);
            }
            // Clear history stacks
            this.undoStack = [];
            this.redoStack = [];
            if (onRemoved) {
                return onRemoved.apply(this, arguments);
            }
        };

        // ========== UNDO/REDO HELPER METHODS ==========

        // Clone an OffscreenCanvas or regular canvas
        const cloneCanvas = (source) => {
            if (!source) return null;
            let clone;
            if (typeof OffscreenCanvas !== 'undefined') {
                clone = new OffscreenCanvas(source.width, source.height);
            } else {
                clone = document.createElement('canvas');
                clone.width = source.width;
                clone.height = source.height;
            }
            const ctx = clone.getContext('2d');
            ctx.drawImage(source, 0, 0);
            return clone;
        };

        // Clone a sublayer including its canvas
        nodeType.prototype._cloneSublayer = function(sublayer) {
            if (!sublayer) return null;
            return {
                canvas: cloneCanvas(sublayer.canvas),
                x: sublayer.x,
                y: sublayer.y,
                scaleX: sublayer.scaleX,
                scaleY: sublayer.scaleY,
                rotation: sublayer.rotation,
                opacity: sublayer.opacity,
                visible: sublayer.visible,
                pivotX: sublayer.pivotX,
                pivotY: sublayer.pivotY
            };
        };

        // Restore a sublayer from a snapshot
        nodeType.prototype._restoreSublayer = function(sublayer, snapshot) {
            if (!sublayer || !snapshot) return;
            const ctx = sublayer.canvas.getContext('2d');
            ctx.clearRect(0, 0, sublayer.canvas.width, sublayer.canvas.height);
            if (snapshot.canvas) {
                ctx.drawImage(snapshot.canvas, 0, 0);
            }
            sublayer.x = snapshot.x;
            sublayer.y = snapshot.y;
            sublayer.scaleX = snapshot.scaleX;
            sublayer.scaleY = snapshot.scaleY;
            sublayer.rotation = snapshot.rotation;
            sublayer.opacity = snapshot.opacity;
            sublayer.visible = snapshot.visible;
            if (snapshot.pivotX !== undefined) sublayer.pivotX = snapshot.pivotX;
            if (snapshot.pivotY !== undefined) sublayer.pivotY = snapshot.pivotY;
        };

        // Push a command to the undo stack
        nodeType.prototype._pushCommand = function(cmd) {
            this.undoStack.push(cmd);
            this.redoStack = []; // Clear redo stack on new action
            // Enforce max history size
            while (this.undoStack.length > this.maxHistorySize) {
                this.undoStack.shift();
            }
        };

        // Check if undo is available
        nodeType.prototype._canUndo = function() {
            return this.undoStack && this.undoStack.length > 0;
        };

        // Check if redo is available
        nodeType.prototype._canRedo = function() {
            return this.redoStack && this.redoStack.length > 0;
        };

        // Finalize pending command (called before resetting interaction state)
        nodeType.prototype._finalizePendingCommand = function() {
            if (!this._pendingCommand) return;

            const cmd = this._pendingCommand;
            const layer = this.layerManager?.getLayer(cmd.layerId);

            if (cmd.type === 'brush_stroke' && this.isDrawing) {
                // Snapshot the completed sublayer for redo
                const sublayer = layer?.sublayers[cmd.sublayerIndex];
                if (sublayer) {
                    cmd.after = {
                        snapshot: this._cloneSublayer(sublayer)
                    };
                    this._pushCommand(cmd);
                }
            } else if (cmd.type === 'erase' && this.isDrawing) {
                // Snapshot the after state
                if (cmd.sublayerIndex !== null && layer?.sublayers[cmd.sublayerIndex]) {
                    cmd.after = {
                        canvas: cloneCanvas(layer.sublayers[cmd.sublayerIndex].canvas)
                    };
                } else if (layer && cmd.before?.sublayerSnapshots) {
                    cmd.after = {
                        sublayerSnapshots: layer.sublayers.map((sl, i) => ({
                            index: i,
                            canvas: cloneCanvas(sl.canvas)
                        }))
                    };
                }
                this._pushCommand(cmd);
            } else if (cmd.type === 'transform' && (this.isMoving || this.isResizing || this.isRotating)) {
                // Complete transform command with after state
                if (cmd.sublayerIndex !== undefined && layer?.sublayers[cmd.sublayerIndex]) {
                    const sublayer = layer.sublayers[cmd.sublayerIndex];
                    cmd.after = { snapshot: this._cloneSublayer(sublayer) };
                    this._pushCommand(cmd);
                }
            } else if (cmd.type === 'move' && this.isMoving) {
                // Layer move (all sublayers)
                if (layer) {
                    cmd.after = {
                        sublayerPositions: layer.sublayers.map(sl => ({ x: sl.x, y: sl.y }))
                    };
                }
                this._pushCommand(cmd);
            }

            this._pendingCommand = null;
        };

        // Undo the last action
        nodeType.prototype.undo = function() {
            if (!this._canUndo()) return;

            const cmd = this.undoStack.pop();
            this.redoStack.push(cmd);

            const layer = this.layerManager?.getLayer(cmd.layerId);

            switch (cmd.type) {
                case 'brush_stroke':
                case 'fill':
                case 'paste':
                    // These create a new sublayer - remove it
                    if (layer && cmd.sublayerIndex !== undefined) {
                        layer.sublayers.splice(cmd.sublayerIndex, 1);
                        layer.needsRecomposite = true;
                        // Adjust selected sublayer if needed
                        if (this.selectedLayer === cmd.layerId && this.selectedSublayer !== null) {
                            if (this.selectedSublayer >= layer.sublayers.length) {
                                this.selectedSublayer = layer.sublayers.length > 0 ? layer.sublayers.length - 1 : null;
                            }
                        }
                    }
                    break;

                case 'erase':
                    // Restore the canvas from before snapshot
                    if (layer && cmd.sublayerIndex !== undefined && layer.sublayers[cmd.sublayerIndex]) {
                        const sublayer = layer.sublayers[cmd.sublayerIndex];
                        const ctx = sublayer.canvas.getContext('2d');
                        ctx.clearRect(0, 0, sublayer.canvas.width, sublayer.canvas.height);
                        if (cmd.before.canvas) {
                            ctx.drawImage(cmd.before.canvas, 0, 0);
                        }
                        layer.needsRecomposite = true;
                    } else if (layer && cmd.before.sublayerSnapshots) {
                        // Restore multiple sublayers
                        for (const snap of cmd.before.sublayerSnapshots) {
                            if (layer.sublayers[snap.index]) {
                                const sublayer = layer.sublayers[snap.index];
                                const ctx = sublayer.canvas.getContext('2d');
                                ctx.clearRect(0, 0, sublayer.canvas.width, sublayer.canvas.height);
                                if (snap.canvas) {
                                    ctx.drawImage(snap.canvas, 0, 0);
                                }
                            }
                        }
                        layer.needsRecomposite = true;
                    }
                    break;

                case 'transform':
                    // Restore full sublayer from snapshot
                    if (layer && cmd.sublayerIndex !== undefined && layer.sublayers[cmd.sublayerIndex] && cmd.before.snapshot) {
                        this._restoreSublayer(layer.sublayers[cmd.sublayerIndex], cmd.before.snapshot);
                        layer.needsRecomposite = true;
                    }
                    break;

                case 'move':
                    // Layer move (all sublayers)
                    if (layer && cmd.before.sublayerStarts) {
                        for (let i = 0; i < cmd.before.sublayerStarts.length; i++) {
                            if (layer.sublayers[i]) {
                                layer.sublayers[i].x = cmd.before.sublayerStarts[i].x;
                                layer.sublayers[i].y = cmd.before.sublayerStarts[i].y;
                            }
                        }
                        layer.needsRecomposite = true;
                    }
                    break;

                case 'add_layer':
                    // Remove the added layer
                    if (cmd.after.layerId !== undefined) {
                        const idx = this.layers.findIndex(l => l.id === cmd.after.layerId);
                        if (idx !== -1) {
                            this.layers.splice(idx, 1);
                            this.layerManager?.deleteLayer(cmd.after.layerId);
                            this.expandedLayers.delete(cmd.after.layerId);
                            if (this.selectedLayer === cmd.after.layerId) {
                                this.selectedLayer = this.layers[Math.max(0, idx - 1)]?.id || 1;
                                this.selectedSublayer = null;
                            }
                        }
                    }
                    break;

                case 'delete_layer':
                    // Restore the deleted layer
                    if (cmd.before.layerDef && cmd.before.sublayerSnapshots) {
                        const layerDef = { ...cmd.before.layerDef };
                        this.layers.push(layerDef);
                        this.layerManager?.createLayer(layerDef.id);
                        const restoredLayer = this.layerManager?.getLayer(layerDef.id);
                        if (restoredLayer) {
                            // Restore sublayers
                            for (const snap of cmd.before.sublayerSnapshots) {
                                const newSublayer = new Sublayer(this.layerManager.width, this.layerManager.height);
                                this._restoreSublayer(newSublayer, snap);
                                restoredLayer.sublayers.push(newSublayer);
                            }
                            restoredLayer.needsRecomposite = true;
                        }
                        if (layerDef.expanded) {
                            this.expandedLayers.add(layerDef.id);
                        }
                    }
                    break;

                case 'delete_sublayer':
                    // Restore the deleted sublayer
                    if (layer && cmd.before.snapshot) {
                        const newSublayer = new Sublayer(this.layerManager.width, this.layerManager.height);
                        this._restoreSublayer(newSublayer, cmd.before.snapshot);
                        // Insert at original position
                        layer.sublayers.splice(cmd.sublayerIndex, 0, newSublayer);
                        layer.needsRecomposite = true;
                    }
                    break;

                case 'clear_layer':
                    // Restore all cleared sublayers
                    if (layer && cmd.before.sublayerSnapshots) {
                        for (const snapshot of cmd.before.sublayerSnapshots) {
                            const newSublayer = new Sublayer(this.layerManager.width, this.layerManager.height);
                            this._restoreSublayer(newSublayer, snapshot);
                            layer.sublayers.push(newSublayer);
                        }
                        layer.needsRecomposite = true;
                    }
                    break;

                case 'toggle_visibility':
                    // Toggle back
                    if (cmd.sublayerIndex !== undefined && layer?.sublayers[cmd.sublayerIndex]) {
                        layer.sublayers[cmd.sublayerIndex].visible = cmd.before.visible;
                        layer.needsRecomposite = true;
                    } else {
                        const layerObj = this.layers.find(l => l.id === cmd.layerId);
                        if (layerObj) {
                            layerObj.visible = cmd.before.visible;
                        }
                    }
                    break;

                case 'reorder_layers':
                    // Restore original layer order
                    if (cmd.before.order) {
                        const newLayers = [];
                        for (const id of cmd.before.order) {
                            const foundLayer = this.layers.find(l => l.id === id);
                            if (foundLayer) newLayers.push(foundLayer);
                        }
                        this.layers = newLayers;
                        // Force recomposite of all layers
                        for (const l of this.layers) {
                            const layerData = this.layerManager?.getLayer(l.id);
                            if (layerData) layerData.needsRecomposite = true;
                        }
                    }
                    break;

                case 'reorder_sublayers':
                    // Restore original sublayer order
                    if (layer && cmd.before.order) {
                        const currentSublayers = [...layer.sublayers];
                        layer.sublayers = cmd.before.order.map(i => currentSublayers[i] || layer.sublayers[i]);
                        layer.needsRecomposite = true;
                    }
                    break;
            }

            this.setDirtyCanvas(true);
        };

        // Redo the last undone action
        nodeType.prototype.redo = function() {
            if (!this._canRedo()) return;

            const cmd = this.redoStack.pop();
            this.undoStack.push(cmd);

            const layer = this.layerManager?.getLayer(cmd.layerId);

            switch (cmd.type) {
                case 'brush_stroke':
                case 'fill':
                case 'paste':
                    // Re-create the sublayer
                    if (layer && cmd.after.snapshot) {
                        const newSublayer = new Sublayer(this.layerManager.width, this.layerManager.height);
                        this._restoreSublayer(newSublayer, cmd.after.snapshot);
                        // Insert at original position
                        layer.sublayers.splice(cmd.sublayerIndex, 0, newSublayer);
                        layer.needsRecomposite = true;
                    }
                    break;

                case 'erase':
                    // Apply the erased state
                    if (layer && cmd.sublayerIndex !== undefined && layer.sublayers[cmd.sublayerIndex]) {
                        const sublayer = layer.sublayers[cmd.sublayerIndex];
                        const ctx = sublayer.canvas.getContext('2d');
                        ctx.clearRect(0, 0, sublayer.canvas.width, sublayer.canvas.height);
                        if (cmd.after.canvas) {
                            ctx.drawImage(cmd.after.canvas, 0, 0);
                        }
                        layer.needsRecomposite = true;
                    } else if (layer && cmd.after.sublayerSnapshots) {
                        for (const snap of cmd.after.sublayerSnapshots) {
                            if (layer.sublayers[snap.index]) {
                                const sublayer = layer.sublayers[snap.index];
                                const ctx = sublayer.canvas.getContext('2d');
                                ctx.clearRect(0, 0, sublayer.canvas.width, sublayer.canvas.height);
                                if (snap.canvas) {
                                    ctx.drawImage(snap.canvas, 0, 0);
                                }
                            }
                        }
                        layer.needsRecomposite = true;
                    }
                    break;

                case 'transform':
                    // Restore full sublayer from snapshot
                    if (layer && cmd.sublayerIndex !== undefined && layer.sublayers[cmd.sublayerIndex] && cmd.after.snapshot) {
                        this._restoreSublayer(layer.sublayers[cmd.sublayerIndex], cmd.after.snapshot);
                        layer.needsRecomposite = true;
                    }
                    break;

                case 'move':
                    // Layer move (all sublayers)
                    if (layer && cmd.after.sublayerPositions) {
                        for (let i = 0; i < cmd.after.sublayerPositions.length; i++) {
                            if (layer.sublayers[i]) {
                                layer.sublayers[i].x = cmd.after.sublayerPositions[i].x;
                                layer.sublayers[i].y = cmd.after.sublayerPositions[i].y;
                            }
                        }
                        layer.needsRecomposite = true;
                    }
                    break;

                case 'add_layer':
                    // Re-add the layer
                    if (cmd.after.layerDef) {
                        const layerDef = { ...cmd.after.layerDef };
                        this.layers.push(layerDef);
                        this.layerManager?.createLayer(layerDef.id);
                        if (layerDef.expanded) {
                            this.expandedLayers.add(layerDef.id);
                        }
                    }
                    break;

                case 'delete_layer':
                    // Re-delete the layer
                    if (cmd.before.layerDef) {
                        const idx = this.layers.findIndex(l => l.id === cmd.before.layerDef.id);
                        if (idx !== -1) {
                            this.layers.splice(idx, 1);
                            this.layerManager?.deleteLayer(cmd.before.layerDef.id);
                            this.expandedLayers.delete(cmd.before.layerDef.id);
                            if (this.selectedLayer === cmd.before.layerDef.id) {
                                this.selectedLayer = this.layers[Math.max(0, idx - 1)]?.id || 1;
                                this.selectedSublayer = null;
                            }
                        }
                    }
                    break;

                case 'delete_sublayer':
                    // Re-delete the sublayer
                    if (layer && cmd.sublayerIndex !== undefined) {
                        layer.sublayers.splice(cmd.sublayerIndex, 1);
                        layer.needsRecomposite = true;
                        if (this.selectedLayer === cmd.layerId && this.selectedSublayer !== null) {
                            if (this.selectedSublayer >= layer.sublayers.length) {
                                this.selectedSublayer = layer.sublayers.length > 0 ? layer.sublayers.length - 1 : null;
                            }
                        }
                    }
                    break;

                case 'clear_layer':
                    // Re-clear all sublayers
                    if (layer) {
                        layer.sublayers = [];
                        layer.needsRecomposite = true;
                        this.selectedSublayer = null;
                    }
                    break;

                case 'toggle_visibility':
                    // Toggle again
                    if (cmd.sublayerIndex !== undefined && layer?.sublayers[cmd.sublayerIndex]) {
                        layer.sublayers[cmd.sublayerIndex].visible = cmd.after.visible;
                        layer.needsRecomposite = true;
                    } else {
                        const layerObj = this.layers.find(l => l.id === cmd.layerId);
                        if (layerObj) {
                            layerObj.visible = cmd.after.visible;
                        }
                    }
                    break;

                case 'reorder_layers':
                    // Apply new layer order
                    if (cmd.after.order) {
                        const newLayers = [];
                        for (const id of cmd.after.order) {
                            const foundLayer = this.layers.find(l => l.id === id);
                            if (foundLayer) newLayers.push(foundLayer);
                        }
                        this.layers = newLayers;
                        // Force recomposite of all layers
                        for (const l of this.layers) {
                            const layerData = this.layerManager?.getLayer(l.id);
                            if (layerData) layerData.needsRecomposite = true;
                        }
                    }
                    break;

                case 'reorder_sublayers':
                    // Re-apply sublayer reorder
                    if (layer && cmd.after.fromIndex !== undefined && cmd.after.toIndex !== undefined) {
                        // Reverse the undo to get to the after state
                        // The after state is what we want to restore
                        const fromIdx = cmd.after.fromIndex;
                        let toIdx = cmd.after.toIndex;

                        // Remove from current position and insert at target
                        const [sublayer] = layer.sublayers.splice(fromIdx, 1);
                        if (fromIdx < toIdx) {
                            toIdx -= 1;
                        }
                        layer.sublayers.splice(toIdx, 0, sublayer);
                        layer.needsRecomposite = true;
                        this.selectedSublayer = toIdx;
                    }
                    break;
            }

            this.setDirtyCanvas(true);
        };

        // ========== END UNDO/REDO HELPER METHODS ==========

        // Helper function to draw rounded rectangle
        const drawRoundedRect = (ctx, x, y, w, h, r) => {
            ctx.beginPath();
            ctx.moveTo(x + r, y);
            ctx.lineTo(x + w - r, y);
            ctx.quadraticCurveTo(x + w, y, x + w, y + r);
            ctx.lineTo(x + w, y + h - r);
            ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
            ctx.lineTo(x + r, y + h);
            ctx.quadraticCurveTo(x, y + h, x, y + h - r);
            ctx.lineTo(x, y + r);
            ctx.quadraticCurveTo(x, y, x + r, y);
            ctx.closePath();
        };

        const onDrawForeground = nodeType.prototype.onDrawForeground;
        nodeType.prototype.onDrawForeground = function(ctx) {
            if (onDrawForeground) {
                onDrawForeground.apply(this, arguments);
            }

            // UI Configuration
            const toolbarWidth = 200;
            const toolSize = 36;
            const toolSpacing = 3;
            const startY = 70; // Account for title bar (30) + output slots (~40)

            // Color palette
            const colors = {
                bgDark: "#1e1e1e",
                bgMedium: "#252525",
                bgLight: "#2d2d2d",
                bgLighter: "#353535",
                border: "#1a1a1a",
                borderLight: "#3a3a3a",
                text: "#e0e0e0",
                textDim: "#888",
                textMuted: "#666",
                accent: "#3d8eff",
                accentDark: "#2d6edf",
                selected: "#3d5a80",
                hover: "#404040"
            };

            // ========== LEFT TOOLBAR ==========
            // Toolbar solid background
            ctx.fillStyle = colors.bgMedium;
            ctx.fillRect(0, startY, toolbarWidth, this.size[1] - startY);

            // Right border
            ctx.strokeStyle = colors.border;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(toolbarWidth, startY);
            ctx.lineTo(toolbarWidth, this.size[1]);
            ctx.stroke();

            // Calculate available height for upper half (half of toolbar area)
            const toolbarAvailableHeight = this.size[1] - startY - 8;
            const halfHeight = toolbarAvailableHeight / 2;

            // Tool button sizing
            const toolBtnSize = 36;
            const toolBtnSpacing = 4;
            const toolsAreaWidth = 46;

            // ========== TOOLS SECTION (height-fit to buttons) ==========
            const toolsContainerX = 4;
            const toolsContainerY = startY + 4;
            const toolsContainerW = toolbarWidth - 8;
            // Height fits exactly the number of tool buttons
            const toolsContainerH = TOOLS.length * (toolBtnSize + toolBtnSpacing) + 6;

            drawRoundedRect(ctx, toolsContainerX, toolsContainerY, toolsContainerW, toolsContainerH, 4);
            ctx.fillStyle = colors.bgDark;
            ctx.fill();
            ctx.strokeStyle = colors.borderLight;
            ctx.lineWidth = 1;
            ctx.stroke();

            // Tools section - single column with wider buttons
            const toolX = 10;
            let toolY = startY + 10;

            TOOLS.forEach((tool) => {
                const isSelected = this.selectedTool === tool.id;

                // Tool button background
                drawRoundedRect(ctx, toolX, toolY, toolBtnSize, toolBtnSize, 4);

                if (isSelected) {
                    const selGrad = ctx.createLinearGradient(toolX, toolY, toolX, toolY + toolBtnSize);
                    selGrad.addColorStop(0, colors.selected);
                    selGrad.addColorStop(1, "#2a4060");
                    ctx.fillStyle = selGrad;
                } else {
                    ctx.fillStyle = colors.bgLighter;
                }
                ctx.fill();

                if (isSelected) {
                    ctx.strokeStyle = colors.accent;
                    ctx.lineWidth = 2;
                } else {
                    ctx.strokeStyle = colors.borderLight;
                    ctx.lineWidth = 1;
                }
                ctx.stroke();

                // Draw icon
                const iconColor = isSelected ? "#fff" : colors.textDim;
                const iconImg = getIconImage(tool, iconColor, this);

                if (iconImg && iconImg.complete && iconImg.naturalWidth > 0) {
                    const iconPadding = 6;
                    const iconSize = toolBtnSize - iconPadding * 2;
                    try {
                        ctx.drawImage(iconImg, toolX + iconPadding, toolY + iconPadding, iconSize, iconSize);
                    } catch (e) {}
                }

                // Store bounds for click detection
                tool._bounds = { x: toolX, y: toolY, w: toolBtnSize, h: toolBtnSize };

                // Move to next row
                toolY += toolBtnSize + toolBtnSpacing;
            });

            // ========== SIZE SLIDER (right after tools) ==========
            const sizeSliderSectionY = toolsContainerY + toolsContainerH + 6;
            const sizeSliderSectionH = 32;

            // Size slider background
            drawRoundedRect(ctx, toolsContainerX, sizeSliderSectionY, toolsContainerW, sizeSliderSectionH, 4);
            ctx.fillStyle = colors.bgDark;
            ctx.fill();
            ctx.strokeStyle = colors.borderLight;
            ctx.lineWidth = 1;
            ctx.stroke();

            // Size label
            ctx.fillStyle = colors.textDim;
            ctx.font = "11px 'Segoe UI', Arial, sans-serif";
            ctx.textAlign = "left";
            ctx.textBaseline = "middle";
            ctx.fillText("Size", toolsContainerX + 8, sizeSliderSectionY + sizeSliderSectionH / 2);

            // Size value
            ctx.fillStyle = colors.text;
            ctx.font = "11px 'Segoe UI', Arial, sans-serif";
            ctx.textAlign = "left";
            ctx.fillText(this.brushSize + "px", toolsContainerX + 38, sizeSliderSectionY + sizeSliderSectionH / 2);

            // Slider
            const sliderX = toolsContainerX + 75;
            const sliderW = toolsContainerW - 85;
            const sliderY = sizeSliderSectionY + sizeSliderSectionH / 2;
            const sliderH = 6;

            // Slider track background
            drawRoundedRect(ctx, sliderX, sliderY - sliderH / 2, sliderW, sliderH, 3);
            ctx.fillStyle = colors.bgMedium;
            ctx.fill();

            // Slider fill
            const sliderPercent = Math.min(1, this.brushSize / 200);
            if (sliderPercent > 0) {
                drawRoundedRect(ctx, sliderX, sliderY - sliderH / 2, sliderW * sliderPercent, sliderH, 3);
                ctx.fillStyle = colors.accent;
                ctx.fill();
            }

            // Slider handle
            const handleX = sliderX + sliderW * sliderPercent;
            ctx.beginPath();
            ctx.arc(handleX, sliderY, 7, 0, Math.PI * 2);
            ctx.fillStyle = "#fff";
            ctx.fill();
            ctx.strokeStyle = colors.accent;
            ctx.lineWidth = 2;
            ctx.stroke();

            // Store slider bounds for interaction
            this._brushSliderBounds = { x: sliderX, y: sliderY - 10, w: sliderW, h: 20 };

            // Feather slider disabled for now
            this._featherSliderBounds = null;

            // ========== ACTION SECTION (fills to half height) ==========
            const actionSectionY = sizeSliderSectionY + sizeSliderSectionH + 6;
            const actionSectionH = Math.max(60, (startY + halfHeight) - actionSectionY);

            // Action section background
            drawRoundedRect(ctx, toolsContainerX, actionSectionY, toolsContainerW, actionSectionH, 4);
            ctx.fillStyle = colors.bgDark;
            ctx.fill();
            ctx.strokeStyle = colors.borderLight;
            ctx.lineWidth = 1;
            ctx.stroke();

            // Check if flip buttons should be enabled (move tool + sublayer selected)
            const flipEnabled = this.selectedTool === 'move' && this.selectedSublayer !== null;

            // Paste button (top left of action section)
            const pasteBtn = ACTION_BUTTONS.find(b => b.id === 'paste');
            if (pasteBtn) {
                const pasteBtnX = toolsContainerX + toolsContainerW - toolBtnSize - 6;
                const pasteBtnY = actionSectionY + 6;

                // Paste button background
                drawRoundedRect(ctx, pasteBtnX, pasteBtnY, toolBtnSize, toolBtnSize, 4);
                ctx.fillStyle = colors.bgLighter;
                ctx.fill();
                ctx.strokeStyle = colors.borderLight;
                ctx.lineWidth = 1;
                ctx.stroke();

                // Draw icon
                const iconImg = getIconImage(pasteBtn, colors.textDim, this);

                if (iconImg && iconImg.complete && iconImg.naturalWidth > 0) {
                    const iconPadding = 6;
                    const iconSize = toolBtnSize - iconPadding * 2;
                    try {
                        ctx.drawImage(iconImg, pasteBtnX + iconPadding, pasteBtnY + iconPadding, iconSize, iconSize);
                    } catch (e) {}
                }

                // Store bounds for click detection
                pasteBtn._bounds = { x: pasteBtnX, y: pasteBtnY, w: toolBtnSize, h: toolBtnSize };
            }

            // Flip Horizontal button (top left of action section)
            const flipHBtn = ACTION_BUTTONS.find(b => b.id === 'flipH');
            if (flipHBtn) {
                const flipHBtnX = toolsContainerX + 6;
                const flipHBtnY = actionSectionY + 6;

                // Button background
                drawRoundedRect(ctx, flipHBtnX, flipHBtnY, toolBtnSize, toolBtnSize, 4);
                ctx.fillStyle = flipEnabled ? colors.bgLighter : colors.bgDark;
                ctx.fill();
                ctx.strokeStyle = colors.borderLight;
                ctx.lineWidth = 1;
                ctx.stroke();

                // Draw icon (dimmed when disabled)
                const iconColor = flipEnabled ? colors.textDim : colors.textMuted;
                const iconImg = getIconImage(flipHBtn, iconColor, this);

                if (iconImg && iconImg.complete && iconImg.naturalWidth > 0) {
                    const iconPadding = 6;
                    const iconSize = toolBtnSize - iconPadding * 2;
                    try {
                        ctx.globalAlpha = flipEnabled ? 1 : 0.4;
                        ctx.drawImage(iconImg, flipHBtnX + iconPadding, flipHBtnY + iconPadding, iconSize, iconSize);
                        ctx.globalAlpha = 1;
                    } catch (e) {}
                }

                // Store bounds for click detection
                flipHBtn._bounds = { x: flipHBtnX, y: flipHBtnY, w: toolBtnSize, h: toolBtnSize };
                flipHBtn._enabled = flipEnabled;
            }

            // Flip Vertical button (next to flip horizontal)
            const flipVBtn = ACTION_BUTTONS.find(b => b.id === 'flipV');
            if (flipVBtn) {
                const flipVBtnX = toolsContainerX + 6 + toolBtnSize + 4;
                const flipVBtnY = actionSectionY + 6;

                // Button background
                drawRoundedRect(ctx, flipVBtnX, flipVBtnY, toolBtnSize, toolBtnSize, 4);
                ctx.fillStyle = flipEnabled ? colors.bgLighter : colors.bgDark;
                ctx.fill();
                ctx.strokeStyle = colors.borderLight;
                ctx.lineWidth = 1;
                ctx.stroke();

                // Draw icon (dimmed when disabled)
                const iconColor = flipEnabled ? colors.textDim : colors.textMuted;
                const iconImg = getIconImage(flipVBtn, iconColor, this);

                if (iconImg && iconImg.complete && iconImg.naturalWidth > 0) {
                    const iconPadding = 6;
                    const iconSize = toolBtnSize - iconPadding * 2;
                    try {
                        ctx.globalAlpha = flipEnabled ? 1 : 0.4;
                        ctx.drawImage(iconImg, flipVBtnX + iconPadding, flipVBtnY + iconPadding, iconSize, iconSize);
                        ctx.globalAlpha = 1;
                    } catch (e) {}
                }

                // Store bounds for click detection
                flipVBtn._bounds = { x: flipVBtnX, y: flipVBtnY, w: toolBtnSize, h: toolBtnSize };
                flipVBtn._enabled = flipEnabled;
            }

            // Undo/Redo row (above zoom controls)
            const undoRedoBtnHeight = 28;
            const undoRedoBtnWidth = (toolsContainerW - 12 - 4) / 2; // Half width with padding and gap
            const undoRedoRowY = actionSectionY + actionSectionH - 52 - undoRedoBtnHeight - 6;

            // Undo button (left half)
            const undoBtn = ACTION_BUTTONS.find(b => b.id === 'undo');
            const undoEnabled = this._canUndo();
            if (undoBtn) {
                const undoBtnX = toolsContainerX + 6;

                // Button background
                drawRoundedRect(ctx, undoBtnX, undoRedoRowY, undoRedoBtnWidth, undoRedoBtnHeight, 4);
                ctx.fillStyle = undoEnabled ? colors.bgLighter : colors.bgDark;
                ctx.fill();
                ctx.strokeStyle = colors.borderLight;
                ctx.lineWidth = 1;
                ctx.stroke();

                // Draw icon (dimmed when disabled)
                const iconColor = undoEnabled ? colors.textDim : colors.textMuted;
                const iconImg = getIconImage(undoBtn, iconColor, this);

                if (iconImg && iconImg.complete && iconImg.naturalWidth > 0) {
                    const iconSize = undoRedoBtnHeight - 6;
                    const iconX = undoBtnX + (undoRedoBtnWidth - iconSize) / 2;
                    const iconY = undoRedoRowY + (undoRedoBtnHeight - iconSize) / 2;
                    try {
                        ctx.globalAlpha = undoEnabled ? 1 : 0.4;
                        ctx.drawImage(iconImg, iconX, iconY, iconSize, iconSize);
                        ctx.globalAlpha = 1;
                    } catch (e) {}
                }

                // Store bounds for click detection
                undoBtn._bounds = { x: undoBtnX, y: undoRedoRowY, w: undoRedoBtnWidth, h: undoRedoBtnHeight };
                undoBtn._enabled = undoEnabled;
            }

            // Redo button (right half)
            const redoBtn = ACTION_BUTTONS.find(b => b.id === 'redo');
            const redoEnabled = this._canRedo();
            if (redoBtn) {
                const redoBtnX = toolsContainerX + 6 + undoRedoBtnWidth + 4;

                // Button background
                drawRoundedRect(ctx, redoBtnX, undoRedoRowY, undoRedoBtnWidth, undoRedoBtnHeight, 4);
                ctx.fillStyle = redoEnabled ? colors.bgLighter : colors.bgDark;
                ctx.fill();
                ctx.strokeStyle = colors.borderLight;
                ctx.lineWidth = 1;
                ctx.stroke();

                // Draw icon (dimmed when disabled)
                const iconColor = redoEnabled ? colors.textDim : colors.textMuted;
                const iconImg = getIconImage(redoBtn, iconColor, this);

                if (iconImg && iconImg.complete && iconImg.naturalWidth > 0) {
                    const iconSize = undoRedoBtnHeight - 6;
                    const iconX = redoBtnX + (undoRedoBtnWidth - iconSize) / 2;
                    const iconY = undoRedoRowY + (undoRedoBtnHeight - iconSize) / 2;
                    try {
                        ctx.globalAlpha = redoEnabled ? 1 : 0.4;
                        ctx.drawImage(iconImg, iconX, iconY, iconSize, iconSize);
                        ctx.globalAlpha = 1;
                    } catch (e) {}
                }

                // Store bounds for click detection
                redoBtn._bounds = { x: redoBtnX, y: undoRedoRowY, w: undoRedoBtnWidth, h: undoRedoBtnHeight };
                redoBtn._enabled = redoEnabled;
            }

            // Zoom controls row (above dimensions)
            const zoomBtnSize = 20;
            const zoomBtnSpacing = 4;
            const zoomRowY = actionSectionY + actionSectionH - 52;
            const zoomPercent = Math.round((this.viewZoom || 1) * 100);

            // Zoom out button
            const zoomOutBtnX = toolsContainerX + 6;
            drawRoundedRect(ctx, zoomOutBtnX, zoomRowY, zoomBtnSize, zoomBtnSize, 3);
            ctx.fillStyle = colors.bgLighter;
            ctx.fill();
            ctx.strokeStyle = colors.borderLight;
            ctx.lineWidth = 1;
            ctx.stroke();

            const zoomOutIconImg = getIconImage(LAYER_ICONS.zoomOut, colors.textDim, this);
            if (zoomOutIconImg && zoomOutIconImg.complete && zoomOutIconImg.naturalWidth > 0) {
                const iconPadding = 2;
                const iconSize = zoomBtnSize - iconPadding * 2;
                try {
                    ctx.drawImage(zoomOutIconImg, zoomOutBtnX + iconPadding, zoomRowY + iconPadding, iconSize, iconSize);
                } catch (e) {}
            }
            this._zoomOutBtnBounds = { x: zoomOutBtnX, y: zoomRowY, w: zoomBtnSize, h: zoomBtnSize };

            // Zoom percentage text
            ctx.fillStyle = colors.text;
            ctx.font = "11px 'Segoe UI', Arial, sans-serif";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            const zoomTextX = zoomOutBtnX + zoomBtnSize + zoomBtnSpacing + 28;
            ctx.fillText(`${zoomPercent}%`, zoomTextX, zoomRowY + zoomBtnSize / 2);

            // Zoom in button
            const zoomInBtnX = zoomTextX + 28;
            drawRoundedRect(ctx, zoomInBtnX, zoomRowY, zoomBtnSize, zoomBtnSize, 3);
            ctx.fillStyle = colors.bgLighter;
            ctx.fill();
            ctx.strokeStyle = colors.borderLight;
            ctx.lineWidth = 1;
            ctx.stroke();

            const zoomInIconImg = getIconImage(LAYER_ICONS.zoomIn, colors.textDim, this);
            if (zoomInIconImg && zoomInIconImg.complete && zoomInIconImg.naturalWidth > 0) {
                const iconPadding = 2;
                const iconSize = zoomBtnSize - iconPadding * 2;
                try {
                    ctx.drawImage(zoomInIconImg, zoomInBtnX + iconPadding, zoomRowY + iconPadding, iconSize, iconSize);
                } catch (e) {}
            }
            this._zoomInBtnBounds = { x: zoomInBtnX, y: zoomRowY, w: zoomBtnSize, h: zoomBtnSize };

            // Zoom reset button (100%)
            const zoomResetBtnX = toolsContainerX + toolsContainerW - zoomBtnSize - 6;
            drawRoundedRect(ctx, zoomResetBtnX, zoomRowY, zoomBtnSize, zoomBtnSize, 3);
            ctx.fillStyle = colors.bgLighter;
            ctx.fill();
            ctx.strokeStyle = colors.borderLight;
            ctx.lineWidth = 1;
            ctx.stroke();

            // Draw "1:1" text for reset button
            ctx.fillStyle = colors.textDim;
            ctx.font = "bold 9px 'Segoe UI', Arial, sans-serif";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText("1:1", zoomResetBtnX + zoomBtnSize / 2, zoomRowY + zoomBtnSize / 2);
            this._zoomResetBtnBounds = { x: zoomResetBtnX, y: zoomRowY, w: zoomBtnSize, h: zoomBtnSize };

            // Canvas dimensions at bottom of action section
            ctx.fillStyle = colors.textDim;
            ctx.font = "11px 'Segoe UI', Arial, sans-serif";
            ctx.textAlign = "left";
            ctx.textBaseline = "bottom";
            const dimensionsText = `${this.canvasWidth} × ${this.canvasHeight}`;
            const dimTextX = toolsContainerX + 8;
            const dimTextY = actionSectionY + actionSectionH - 8;
            ctx.fillText(dimensionsText, dimTextX, dimTextY);

            // Edit size button next to dimensions
            const editSizeBtnSize = 18;
            const editSizeBtnX = toolsContainerX + toolsContainerW - editSizeBtnSize - 8;
            const editSizeBtnY = actionSectionY + actionSectionH - editSizeBtnSize - 6;

            drawRoundedRect(ctx, editSizeBtnX, editSizeBtnY, editSizeBtnSize, editSizeBtnSize, 3);
            ctx.fillStyle = colors.bgLighter;
            ctx.fill();
            ctx.strokeStyle = colors.borderLight;
            ctx.lineWidth = 1;
            ctx.stroke();

            const editSizeIconImg = getIconImage(LAYER_ICONS.editSize, colors.textDim, this);
            if (editSizeIconImg && editSizeIconImg.complete && editSizeIconImg.naturalWidth > 0) {
                const iconPadding = 2;
                const iconSize = editSizeBtnSize - iconPadding * 2;
                try {
                    ctx.drawImage(editSizeIconImg, editSizeBtnX + iconPadding, editSizeBtnY + iconPadding, iconSize, iconSize);
                } catch (e) {}
            }
            this._editSizeBtnBounds = { x: editSizeBtnX, y: editSizeBtnY, w: editSizeBtnSize, h: editSizeBtnSize };

            // ========== COLOR PICKER SECTION (inside tools container) ==========
            // Color picker area is in the tools container, next to tool buttons
            const colorPickerX = toolsAreaWidth + 8;
            const colorPickerY = toolsContainerY + 6;
            const colorPickerW = toolbarWidth - colorPickerX - 6;
            // Color picker height fills the tools container
            const colorPickerH = toolsContainerH - 12;

            // Parse current foreground color to HSV
            const hexToHsv = (hex) => {
                const r = parseInt(hex.slice(1, 3), 16) / 255;
                const g = parseInt(hex.slice(3, 5), 16) / 255;
                const b = parseInt(hex.slice(5, 7), 16) / 255;
                const max = Math.max(r, g, b);
                const min = Math.min(r, g, b);
                const d = max - min;
                let h = 0;
                const s = max === 0 ? 0 : d / max;
                const v = max;
                if (d !== 0) {
                    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
                    else if (max === g) h = ((b - r) / d + 2) / 6;
                    else h = ((r - g) / d + 4) / 6;
                }
                return { h, s, v };
            };

            // Initialize color picker state if needed
            if (this._colorPickerHue === undefined) {
                const hsv = hexToHsv(this.foregroundColor);
                this._colorPickerHue = hsv.h;
                this._colorPickerSat = hsv.s;
                this._colorPickerVal = hsv.v;
            }

            // Saturation/Value square
            const svSquareX = colorPickerX + 4;
            const svSquareY = colorPickerY + 4;
            const svSquareSize = colorPickerW - 24;

            // Draw saturation/value gradient
            const hsvToRgb = (h, s, v) => {
                let r, g, b;
                const i = Math.floor(h * 6);
                const f = h * 6 - i;
                const p = v * (1 - s);
                const q = v * (1 - f * s);
                const t = v * (1 - (1 - f) * s);
                switch (i % 6) {
                    case 0: r = v; g = t; b = p; break;
                    case 1: r = q; g = v; b = p; break;
                    case 2: r = p; g = v; b = t; break;
                    case 3: r = p; g = q; b = v; break;
                    case 4: r = t; g = p; b = v; break;
                    case 5: r = v; g = p; b = q; break;
                }
                return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
            };

            // Draw SV square with gradients
            const pureColor = hsvToRgb(this._colorPickerHue, 1, 1);
            const pureColorStr = `rgb(${pureColor.r},${pureColor.g},${pureColor.b})`;

            // White to pure color gradient (horizontal)
            const hGrad = ctx.createLinearGradient(svSquareX, svSquareY, svSquareX + svSquareSize, svSquareY);
            hGrad.addColorStop(0, '#fff');
            hGrad.addColorStop(1, pureColorStr);
            ctx.fillStyle = hGrad;
            ctx.fillRect(svSquareX, svSquareY, svSquareSize, svSquareSize);

            // Black gradient overlay (vertical)
            const vGrad = ctx.createLinearGradient(svSquareX, svSquareY, svSquareX, svSquareY + svSquareSize);
            vGrad.addColorStop(0, 'rgba(0,0,0,0)');
            vGrad.addColorStop(1, 'rgba(0,0,0,1)');
            ctx.fillStyle = vGrad;
            ctx.fillRect(svSquareX, svSquareY, svSquareSize, svSquareSize);

            // SV square border
            ctx.strokeStyle = colors.borderLight;
            ctx.lineWidth = 1;
            ctx.strokeRect(svSquareX, svSquareY, svSquareSize, svSquareSize);

            // Draw SV cursor
            const svCursorX = svSquareX + this._colorPickerSat * svSquareSize;
            const svCursorY = svSquareY + (1 - this._colorPickerVal) * svSquareSize;
            ctx.beginPath();
            ctx.arc(svCursorX, svCursorY, 5, 0, Math.PI * 2);
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(svCursorX, svCursorY, 4, 0, Math.PI * 2);
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 1;
            ctx.stroke();

            // Store SV square bounds
            this._svSquareBounds = { x: svSquareX, y: svSquareY, w: svSquareSize, h: svSquareSize };

            // Hue slider (vertical on right side of SV square)
            const hueSliderX = svSquareX + svSquareSize + 4;
            const hueSliderY = svSquareY;
            const hueSliderW = 12;
            const hueSliderH = svSquareSize;

            // Draw hue gradient
            const hueGrad = ctx.createLinearGradient(hueSliderX, hueSliderY, hueSliderX, hueSliderY + hueSliderH);
            hueGrad.addColorStop(0, '#ff0000');
            hueGrad.addColorStop(0.17, '#ffff00');
            hueGrad.addColorStop(0.33, '#00ff00');
            hueGrad.addColorStop(0.5, '#00ffff');
            hueGrad.addColorStop(0.67, '#0000ff');
            hueGrad.addColorStop(0.83, '#ff00ff');
            hueGrad.addColorStop(1, '#ff0000');
            ctx.fillStyle = hueGrad;
            drawRoundedRect(ctx, hueSliderX, hueSliderY, hueSliderW, hueSliderH, 2);
            ctx.fill();
            ctx.strokeStyle = colors.borderLight;
            ctx.lineWidth = 1;
            ctx.stroke();

            // Hue cursor
            const hueCursorY = hueSliderY + this._colorPickerHue * hueSliderH;
            ctx.fillStyle = '#fff';
            ctx.beginPath();
            ctx.moveTo(hueSliderX - 3, hueCursorY - 4);
            ctx.lineTo(hueSliderX - 3, hueCursorY + 4);
            ctx.lineTo(hueSliderX + 2, hueCursorY);
            ctx.closePath();
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(hueSliderX + hueSliderW + 3, hueCursorY - 4);
            ctx.lineTo(hueSliderX + hueSliderW + 3, hueCursorY + 4);
            ctx.lineTo(hueSliderX + hueSliderW - 2, hueCursorY);
            ctx.closePath();
            ctx.fill();

            // Store hue slider bounds
            this._hueSliderBounds = { x: hueSliderX, y: hueSliderY, w: hueSliderW, h: hueSliderH };

            // Current color swatches below the picker
            const swatchY = svSquareY + svSquareSize + 8;
            const swatchW = (svSquareSize + hueSliderW) / 2 - 2;
            const swatchH = 24;
            const swatchOffsetX = 2; // Offset to move swatches and button right

            // Foreground color swatch
            ctx.fillStyle = this.foregroundColor;
            drawRoundedRect(ctx, svSquareX + swatchOffsetX, swatchY, swatchW, swatchH, 3);
            ctx.fill();
            ctx.strokeStyle = this._editingForeground !== false ? colors.accent : colors.borderLight;
            ctx.lineWidth = this._editingForeground !== false ? 2 : 1;
            ctx.stroke();
            this._fgColorBounds = { x: svSquareX + swatchOffsetX, y: swatchY, w: swatchW, h: swatchH };

            // Background color swatch
            ctx.fillStyle = this.backgroundColor;
            drawRoundedRect(ctx, svSquareX + swatchOffsetX + swatchW + 4, swatchY, swatchW, swatchH, 3);
            ctx.fill();
            ctx.strokeStyle = this._editingForeground === false ? colors.accent : colors.borderLight;
            ctx.lineWidth = this._editingForeground === false ? 2 : 1;
            ctx.stroke();
            this._bgColorBounds = { x: svSquareX + swatchOffsetX + swatchW + 4, y: swatchY, w: swatchW, h: swatchH };

            // Eyedropper button below swatches - fills remaining height
            const eyedropperY = swatchY + swatchH + 6;
            const eyedropperBtnW = svSquareSize + hueSliderW;
            const eyedropperBtnH = (toolsContainerY + toolsContainerH - 6) - eyedropperY;
            const isEyedropperActive = this._eyedropperMode === true;
            const eyedropperPreviewColor = this._eyedropperPreviewColor;

            drawRoundedRect(ctx, svSquareX + swatchOffsetX, eyedropperY, eyedropperBtnW, eyedropperBtnH, 4);
            // Fill with preview color when active and hovering over canvas
            if (isEyedropperActive && eyedropperPreviewColor) {
                ctx.fillStyle = eyedropperPreviewColor;
            } else {
                ctx.fillStyle = isEyedropperActive ? colors.selected : colors.bgLighter;
            }
            ctx.fill();
            ctx.strokeStyle = isEyedropperActive ? colors.accent : colors.borderLight;
            ctx.lineWidth = isEyedropperActive ? 2 : 1;
            ctx.stroke();

            // Eyedropper icon (simple crosshair/dropper representation)
            // Use contrasting text color when showing preview
            if (isEyedropperActive && eyedropperPreviewColor) {
                // Calculate luminance to determine text color
                const r = parseInt(eyedropperPreviewColor.slice(1, 3), 16);
                const g = parseInt(eyedropperPreviewColor.slice(3, 5), 16);
                const b = parseInt(eyedropperPreviewColor.slice(5, 7), 16);
                const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
                ctx.fillStyle = luminance > 0.5 ? "#000" : "#fff";
            } else {
                ctx.fillStyle = isEyedropperActive ? "#fff" : colors.text;
            }
            ctx.font = "11px 'Segoe UI', Arial, sans-serif";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText("⬡ Pick Color", svSquareX + swatchOffsetX + eyedropperBtnW / 2, eyedropperY + eyedropperBtnH / 2);

            this._eyedropperBtnBounds = { x: svSquareX + swatchOffsetX, y: eyedropperY, w: eyedropperBtnW, h: eyedropperBtnH };

            // Initialize editing foreground flag
            if (this._editingForeground === undefined) {
                this._editingForeground = true;
            }

            // ========== MAIN CANVAS AREA ==========
            const canvasX = toolbarWidth + 4;
            const canvasY = startY + 4;
            const canvasW = this.size[0] - canvasX - 4;
            const canvasH = this.size[1] - canvasY - 4;

            this._canvasBounds = { x: canvasX, y: canvasY, w: canvasW, h: canvasH };

            if (canvasW > 0 && canvasH > 0) {
                // Canvas area background (outside the drawing area)
                ctx.fillStyle = "#0d0d0d";
                ctx.fillRect(canvasX, canvasY, canvasW, canvasH);

                ctx.save();
                ctx.beginPath();
                ctx.rect(canvasX, canvasY, canvasW, canvasH);
                ctx.clip();

                // Calculate canvas position
                const zoom = this.viewZoom || 1;
                const drawWidth = this.canvasWidth * zoom;
                const drawHeight = this.canvasHeight * zoom;
                const offsetX = (canvasW - drawWidth) / 2 + (this.viewOffsetX || 0);
                const offsetY = (canvasH - drawHeight) / 2 + (this.viewOffsetY || 0);
                const imgX = canvasX + offsetX;
                const imgY = canvasY + offsetY;

                this._imageDrawBounds = { x: imgX, y: imgY, w: drawWidth, h: drawHeight, zoom: zoom };

                // Checkered transparency background
                const gridSize = 8;
                const visibleLeft = Math.max(canvasX, imgX);
                const visibleTop = Math.max(canvasY, imgY);
                const visibleRight = Math.min(canvasX + canvasW, imgX + drawWidth);
                const visibleBottom = Math.min(canvasY + canvasH, imgY + drawHeight);

                if (visibleRight > visibleLeft && visibleBottom > visibleTop) {
                    for (let gx = visibleLeft; gx < visibleRight; gx += gridSize) {
                        for (let gy = visibleTop; gy < visibleBottom; gy += gridSize) {
                            const gridCol = Math.floor((gx - imgX) / gridSize);
                            const gridRow = Math.floor((gy - imgY) / gridSize);
                            const isLight = ((gridCol + gridRow) % 2) === 0;
                            ctx.fillStyle = isLight ? "#4a4a4a" : "#3a3a3a";
                            ctx.fillRect(gx, gy, Math.min(gridSize, visibleRight - gx), Math.min(gridSize, visibleBottom - gy));
                        }
                    }
                }

                // Draw layers
                if (this.layerManager) {
                    const compositeImage = this.layerManager.composite(this.layers);
                    ctx.drawImage(compositeImage, imgX, imgY, drawWidth, drawHeight);
                }

                // Subtle canvas border shadow
                if (visibleRight > visibleLeft && visibleBottom > visibleTop) {
                    ctx.strokeStyle = "rgba(0,0,0,0.5)";
                    ctx.lineWidth = 1;
                    ctx.strokeRect(imgX, imgY, drawWidth, drawHeight);
                }

                ctx.restore();

                // Inset border for canvas area
                ctx.strokeStyle = colors.border;
                ctx.lineWidth = 1;
                ctx.strokeRect(canvasX, canvasY, canvasW, canvasH);

                // Draw brush cursor
                if (this._lastMousePos && (this.selectedTool === 'brush' || this.selectedTool === 'eraser')) {
                    const mx = this._lastMousePos.x;
                    const my = this._lastMousePos.y;
                    if (mx >= canvasX && mx <= canvasX + canvasW && my >= canvasY && my <= canvasY + canvasH) {
                        const cursorRadius = this.brushSize / 2 * (this.viewZoom || 1);

                        // Outer ring (contrast)
                        ctx.strokeStyle = 'rgba(0,0,0,0.5)';
                        ctx.lineWidth = 2;
                        ctx.beginPath();
                        ctx.arc(mx, my, cursorRadius + 1, 0, Math.PI * 2);
                        ctx.stroke();

                        // Inner ring
                        ctx.strokeStyle = this.selectedTool === 'eraser' ? '#fff' : this.foregroundColor;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.arc(mx, my, cursorRadius, 0, Math.PI * 2);
                        ctx.stroke();
                    }
                }

                // Draw eyedropper cursor when in eyedropper mode
                if (this._lastMousePos && this._eyedropperMode) {
                    const mx = this._lastMousePos.x;
                    const my = this._lastMousePos.y;
                    if (mx >= canvasX && mx <= canvasX + canvasW && my >= canvasY && my <= canvasY + canvasH) {
                        const size = 8;
                        ctx.strokeStyle = '#000';
                        ctx.lineWidth = 2;
                        ctx.beginPath();
                        ctx.moveTo(mx - size, my);
                        ctx.lineTo(mx + size, my);
                        ctx.moveTo(mx, my - size);
                        ctx.lineTo(mx, my + size);
                        ctx.stroke();

                        ctx.strokeStyle = '#fff';
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(mx - size, my);
                        ctx.lineTo(mx + size, my);
                        ctx.moveTo(mx, my - size);
                        ctx.lineTo(mx, my + size);
                        ctx.stroke();
                    }
                }

                // Draw resize handles when move tool is selected and a sublayer is selected
                if (this.selectedTool === 'move' && this.selectedSublayer !== null && this.layerManager) {
                    const sublayerBounds = this.layerManager.getSublayerBounds(this.selectedLayer, this.selectedSublayer);
                    if (sublayerBounds) {
                        // Convert layer coordinates to screen coordinates
                        const screenX = imgX + sublayerBounds.x * zoom;
                        const screenY = imgY + sublayerBounds.y * zoom;
                        const screenW = sublayerBounds.width * zoom;
                        const screenH = sublayerBounds.height * zoom;

                        // Draw selection border (dashed)
                        ctx.strokeStyle = '#3d8eff';
                        ctx.lineWidth = 1;
                        ctx.setLineDash([4, 4]);
                        ctx.strokeRect(screenX, screenY, screenW, screenH);
                        ctx.setLineDash([]);

                        // Handle size
                        const handleSize = 8;
                        const halfHandle = handleSize / 2;

                        // Define handle positions: corners and edge midpoints
                        const handles = [
                            { id: 'nw', x: screenX, y: screenY, cursor: 'nwse-resize' },
                            { id: 'n', x: screenX + screenW / 2, y: screenY, cursor: 'ns-resize' },
                            { id: 'ne', x: screenX + screenW, y: screenY, cursor: 'nesw-resize' },
                            { id: 'e', x: screenX + screenW, y: screenY + screenH / 2, cursor: 'ew-resize' },
                            { id: 'se', x: screenX + screenW, y: screenY + screenH, cursor: 'nwse-resize' },
                            { id: 's', x: screenX + screenW / 2, y: screenY + screenH, cursor: 'ns-resize' },
                            { id: 'sw', x: screenX, y: screenY + screenH, cursor: 'nesw-resize' },
                            { id: 'w', x: screenX, y: screenY + screenH / 2, cursor: 'ew-resize' }
                        ];

                        // Store handle bounds for interaction
                        this._resizeHandles = handles.map(h => ({
                            id: h.id,
                            x: h.x - halfHandle,
                            y: h.y - halfHandle,
                            w: handleSize,
                            h: handleSize,
                            cursor: h.cursor
                        }));

                        // Rotation handle - single point above top-center
                        const rotationHandleDistance = 25;
                        const rotationHandleSize = 10;
                        const rotationHandleX = screenX + screenW / 2;
                        const rotationHandleY = screenY - rotationHandleDistance;

                        // Draw line from top-center to rotation handle
                        ctx.strokeStyle = '#3d8eff';
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(screenX + screenW / 2, screenY);
                        ctx.lineTo(rotationHandleX, rotationHandleY);
                        ctx.stroke();

                        // Draw rotation handle (circle)
                        ctx.fillStyle = '#fff';
                        ctx.strokeStyle = '#3d8eff';
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.arc(rotationHandleX, rotationHandleY, rotationHandleSize / 2, 0, Math.PI * 2);
                        ctx.fill();
                        ctx.stroke();

                        // Store rotation handle bounds for interaction (single zone)
                        this._rotationZones = [{
                            id: 'rotate',
                            x: rotationHandleX - rotationHandleSize / 2,
                            y: rotationHandleY - rotationHandleSize / 2,
                            w: rotationHandleSize,
                            h: rotationHandleSize
                        }];

                        // Store center of selection for rotation calculations
                        this._selectionCenter = {
                            x: screenX + screenW / 2,
                            y: screenY + screenH / 2
                        };

                        // Draw handles
                        for (const handle of handles) {
                            ctx.fillStyle = '#fff';
                            ctx.fillRect(handle.x - halfHandle, handle.y - halfHandle, handleSize, handleSize);
                            ctx.strokeStyle = '#3d8eff';
                            ctx.lineWidth = 1;
                            ctx.strokeRect(handle.x - halfHandle, handle.y - halfHandle, handleSize, handleSize);
                        }
                    }
                } else {
                    this._resizeHandles = null;
                    this._rotationZones = null;
                    this._selectionCenter = null;
                }

            }

            // ========== LAYERS PANEL (second half of toolbar) ==========
            const layersPanelX = 4;
            const layersPanelY = actionSectionY + actionSectionH + 6;
            const layersPanelW = toolbarWidth - 8;
            // Layers panel takes remaining space
            const layersPanelH = Math.max(100, this.size[1] - layersPanelY - 4);
            const layerHeaderHeight = 24;
            const layerRowHeight = 36;

            // Layers panel background
            drawRoundedRect(ctx, layersPanelX, layersPanelY, layersPanelW, layersPanelH, 4);
            ctx.fillStyle = colors.bgDark;
            ctx.fill();
            ctx.strokeStyle = colors.borderLight;
            ctx.lineWidth = 1;
            ctx.stroke();

            // Layers header
            const layerHeaderPaddingTop = 4;
            ctx.fillStyle = colors.text;
            ctx.font = "bold 10px 'Segoe UI', Arial, sans-serif";
            ctx.textAlign = "left";
            ctx.textBaseline = "middle";
            ctx.fillText("LAYERS", layersPanelX + 8, layersPanelY + layerHeaderPaddingTop + layerHeaderHeight / 2);

            // Layer control buttons in header
            const layerBtnSize = 18;
            const layerBtnY = layersPanelY + layerHeaderPaddingTop + 1;

            // Add layer button (position accounts for 3 buttons: add, delete, clear)
            const addBtnX = layersPanelX + layersPanelW - layerBtnSize * 3 - 4 * 2 - 6;
            drawRoundedRect(ctx, addBtnX, layerBtnY, layerBtnSize, layerBtnSize, 3);
            ctx.fillStyle = colors.bgLighter;
            ctx.fill();
            ctx.strokeStyle = colors.borderLight;
            ctx.lineWidth = 1;
            ctx.stroke();
            // Draw add layer icon
            const addIconImg = getIconImage(LAYER_ICONS.add, colors.text, this);
            if (addIconImg && addIconImg.complete && addIconImg.naturalWidth > 0) {
                const iconPadding = 2;
                const iconSize = layerBtnSize - iconPadding * 2;
                try {
                    ctx.drawImage(addIconImg, addBtnX + iconPadding, layerBtnY + iconPadding, iconSize, iconSize);
                } catch (e) {}
            }
            this._addLayerBtnBounds = { x: addBtnX, y: layerBtnY, w: layerBtnSize, h: layerBtnSize };

            // Delete layer button
            // Dim the button if only one layer exists and the layer itself is selected (not a sublayer)
            const isDeleteDisabled = this.layers.length <= 1 && this.selectedSublayer === null;
            const delBtnX = addBtnX + layerBtnSize + 4;
            drawRoundedRect(ctx, delBtnX, layerBtnY, layerBtnSize, layerBtnSize, 3);
            ctx.fillStyle = isDeleteDisabled ? colors.bgDark : colors.bgLighter;
            ctx.fill();
            ctx.strokeStyle = colors.borderLight;
            ctx.stroke();
            // Draw delete layer icon (dimmed if disabled)
            const delIconColor = isDeleteDisabled ? colors.textDim : colors.text;
            const delIconImg = getIconImage(LAYER_ICONS.delete, delIconColor, this);
            if (delIconImg && delIconImg.complete && delIconImg.naturalWidth > 0) {
                const iconPadding = 2;
                const iconSize = layerBtnSize - iconPadding * 2;
                try {
                    ctx.globalAlpha = isDeleteDisabled ? 0.4 : 1;
                    ctx.drawImage(delIconImg, delBtnX + iconPadding, layerBtnY + iconPadding, iconSize, iconSize);
                    ctx.globalAlpha = 1;
                } catch (e) {}
            }
            this._delLayerBtnBounds = { x: delBtnX, y: layerBtnY, w: layerBtnSize, h: layerBtnSize };
            this._deleteDisabled = isDeleteDisabled;

            // Clear layer button (clears all sublayers from selected layer)
            const sublayerCount = this.layerManager ? this.layerManager.getSublayerCount(this.selectedLayer) : 0;
            const isClearDisabled = sublayerCount === 0;
            const clearBtnX = delBtnX + layerBtnSize + 4;
            drawRoundedRect(ctx, clearBtnX, layerBtnY, layerBtnSize, layerBtnSize, 3);
            ctx.fillStyle = isClearDisabled ? colors.bgDark : colors.bgLighter;
            ctx.fill();
            ctx.strokeStyle = colors.borderLight;
            ctx.stroke();
            // Draw clear layer icon (dimmed if disabled)
            const clearIconColor = isClearDisabled ? colors.textDim : colors.text;
            const clearIconImg = getIconImage(LAYER_ICONS.clear, clearIconColor, this);
            if (clearIconImg && clearIconImg.complete && clearIconImg.naturalWidth > 0) {
                const iconPadding = 2;
                const iconSize = layerBtnSize - iconPadding * 2;
                try {
                    ctx.globalAlpha = isClearDisabled ? 0.4 : 1;
                    ctx.drawImage(clearIconImg, clearBtnX + iconPadding, layerBtnY + iconPadding, iconSize, iconSize);
                    ctx.globalAlpha = 1;
                } catch (e) {}
            }
            this._clearLayerBtnBounds = { x: clearBtnX, y: layerBtnY, w: layerBtnSize, h: layerBtnSize };
            this._clearDisabled = isClearDisabled;

            // Draw layers (reverse order - top layer first)
            let layerY = layersPanelY + layerHeaderPaddingTop + layerHeaderHeight + 2;
            this._layerRowBounds = [];
            this._sublayerRowBounds = [];
            const sublayerRowHeight = 22;  // Smaller height for sublayers

            for (let i = this.layers.length - 1; i >= 0; i--) {
                const layer = this.layers[i];
                const isLayerSelected = layer.id === this.selectedLayer && this.selectedSublayer === null;
                const sublayerCount = this.layerManager ? this.layerManager.getSublayerCount(layer.id) : 0;
                const isExpanded = this.expandedLayers.has(layer.id);

                // Check if layer row fits in panel
                if (layerY + layerRowHeight > layersPanelY + layersPanelH - 4) break;

                // Store bounds for click detection
                this._layerRowBounds.push({
                    id: layer.id,
                    x: layersPanelX + 2,
                    y: layerY,
                    w: layersPanelW - 4,
                    h: layerRowHeight - 2,
                    visX: layersPanelX + 6,
                    visW: 16,
                    expandX: layersPanelX + layersPanelW - 20,
                    expandW: 16
                });

                // Layer row background
                if (isLayerSelected) {
                    const selGrad = ctx.createLinearGradient(layersPanelX, layerY, layersPanelX, layerY + layerRowHeight - 2);
                    selGrad.addColorStop(0, colors.selected);
                    selGrad.addColorStop(1, "#2a4060");
                    ctx.fillStyle = selGrad;
                    drawRoundedRect(ctx, layersPanelX + 2, layerY, layersPanelW - 4, layerRowHeight - 2, 3);
                    ctx.fill();
                }

                // Visibility toggle
                const eyeX = layersPanelX + 10;
                const eyeY = layerY + layerRowHeight / 2;
                ctx.fillStyle = layer.visible ? colors.text : colors.textMuted;
                ctx.font = "12px 'Segoe UI', Arial, sans-serif";
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillText(layer.visible ? "●" : "○", eyeX, eyeY);

                // Layer thumbnail
                const thumbX = layersPanelX + 22;
                const thumbY = layerY + 4;
                const thumbSize = layerRowHeight - 8;

                // Thumbnail checkered bg
                const tGridSize = 4;
                for (let tx = 0; tx < thumbSize; tx += tGridSize) {
                    for (let ty = 0; ty < thumbSize; ty += tGridSize) {
                        ctx.fillStyle = ((tx + ty) / tGridSize) % 2 === 0 ? "#555" : "#444";
                        ctx.fillRect(thumbX + tx, thumbY + ty, Math.min(tGridSize, thumbSize - tx), Math.min(tGridSize, thumbSize - ty));
                    }
                }

                // Draw actual layer thumbnail
                if (this.layerManager) {
                    const thumbCanvas = this.layerManager.getLayerThumbnail(layer.id, thumbSize, thumbSize);
                    if (thumbCanvas) {
                        try {
                            ctx.drawImage(thumbCanvas, thumbX, thumbY, thumbSize, thumbSize);
                        } catch (e) {}
                    }
                }

                // Thumbnail border
                ctx.strokeStyle = isLayerSelected ? colors.accent : colors.borderLight;
                ctx.lineWidth = 1;
                ctx.strokeRect(thumbX, thumbY, thumbSize, thumbSize);

                // Layer name
                ctx.fillStyle = isLayerSelected ? "#fff" : colors.text;
                ctx.font = "11px 'Segoe UI', Arial, sans-serif";
                ctx.textAlign = "left";
                ctx.textBaseline = "middle";
                const maxNameWidth = layersPanelW - thumbSize - 70;
                let displayName = layer.name;
                while (ctx.measureText(displayName).width > maxNameWidth && displayName.length > 3) {
                    displayName = displayName.slice(0, -4) + "...";
                }
                ctx.fillText(displayName, thumbX + thumbSize + 6, layerY + layerRowHeight / 2);

                // Lock icon
                if (layer.locked) {
                    ctx.fillStyle = colors.textDim;
                    ctx.font = "10px 'Segoe UI', Arial, sans-serif";
                    ctx.textAlign = "right";
                    ctx.fillText("🔒", layersPanelX + layersPanelW - 24, layerY + layerRowHeight / 2);
                }

                // Expand/collapse arrow (if layer has sublayers)
                if (sublayerCount > 0) {
                    ctx.fillStyle = colors.textDim;
                    ctx.font = "10px 'Segoe UI', Arial, sans-serif";
                    ctx.textAlign = "center";
                    ctx.fillText(isExpanded ? "▼" : "▶", layersPanelX + layersPanelW - 12, layerY + layerRowHeight / 2);
                }

                layerY += layerRowHeight;

                // Draw sublayers if expanded
                if (isExpanded && sublayerCount > 0) {
                    const subThumbSize = sublayerRowHeight - 6;
                    for (let si = sublayerCount - 1; si >= 0; si--) {
                        // Check if sublayer row fits
                        if (layerY + sublayerRowHeight > layersPanelY + layersPanelH - 4) break;

                        const isSublayerSelected = layer.id === this.selectedLayer && this.selectedSublayer === si;
                        const sublayerVisible = this.layerManager ? this.layerManager.getSublayerVisible(layer.id, si) : true;

                        // Store sublayer bounds (including visibility click area)
                        const visX = layersPanelX + 14;
                        this._sublayerRowBounds.push({
                            layerId: layer.id,
                            sublayerIndex: si,
                            x: layersPanelX + 12,
                            y: layerY,
                            w: layersPanelW - 16,
                            h: sublayerRowHeight - 2,
                            visX: visX,
                            visW: 12
                        });

                        // Sublayer row background
                        if (isSublayerSelected) {
                            ctx.fillStyle = "#2a4a6a";
                            drawRoundedRect(ctx, layersPanelX + 12, layerY, layersPanelW - 16, sublayerRowHeight - 2, 2);
                            ctx.fill();
                        }

                        // Tree line
                        ctx.strokeStyle = colors.borderLight;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(layersPanelX + 18, layerY);
                        ctx.lineTo(layersPanelX + 18, layerY + sublayerRowHeight / 2);
                        ctx.lineTo(layersPanelX + 26, layerY + sublayerRowHeight / 2);
                        ctx.stroke();

                        // Visibility toggle for sublayer
                        ctx.fillStyle = sublayerVisible ? colors.textDim : colors.textMuted;
                        ctx.font = "9px 'Segoe UI', Arial, sans-serif";
                        ctx.textAlign = "center";
                        ctx.textBaseline = "middle";
                        ctx.fillText(sublayerVisible ? "●" : "○", layersPanelX + 30, layerY + sublayerRowHeight / 2);

                        // Sublayer thumbnail
                        const subThumbX = layersPanelX + 38;
                        const subThumbY = layerY + 3;

                        // Mini checkered bg
                        for (let tx = 0; tx < subThumbSize; tx += 3) {
                            for (let ty = 0; ty < subThumbSize; ty += 3) {
                                ctx.fillStyle = ((tx + ty) / 3) % 2 === 0 ? "#555" : "#444";
                                ctx.fillRect(subThumbX + tx, subThumbY + ty, Math.min(3, subThumbSize - tx), Math.min(3, subThumbSize - ty));
                            }
                        }

                        // Draw sublayer thumbnail (dimmed if hidden)
                        if (this.layerManager) {
                            const subThumbCanvas = this.layerManager.getSublayerThumbnail(layer.id, si, subThumbSize, subThumbSize);
                            if (subThumbCanvas) {
                                try {
                                    ctx.globalAlpha = sublayerVisible ? 1 : 0.4;
                                    ctx.drawImage(subThumbCanvas, subThumbX, subThumbY, subThumbSize, subThumbSize);
                                    ctx.globalAlpha = 1;
                                } catch (e) {}
                            }
                        }

                        // Sublayer thumbnail border
                        ctx.strokeStyle = isSublayerSelected ? colors.accent : colors.borderLight;
                        ctx.lineWidth = 1;
                        ctx.strokeRect(subThumbX, subThumbY, subThumbSize, subThumbSize);

                        // Sublayer name (dimmed if hidden)
                        ctx.fillStyle = sublayerVisible ? (isSublayerSelected ? "#fff" : colors.textDim) : colors.textMuted;
                        ctx.font = "10px 'Segoe UI', Arial, sans-serif";
                        ctx.textAlign = "left";
                        ctx.textBaseline = "middle";
                        ctx.fillText(`Sub-layer ${si + 1}`, subThumbX + subThumbSize + 4, layerY + sublayerRowHeight / 2);

                        // Sublayer delete button (trash icon on right side)
                        const subDelBtnSize = 14;
                        const subDelBtnX = layersPanelX + layersPanelW - subDelBtnSize - 8;
                        const subDelBtnY = layerY + (sublayerRowHeight - subDelBtnSize) / 2;

                        // Draw trash icon (red)
                        const subDelIconImg = getIconImage(LAYER_ICONS.delete, "#ff4444", this);
                        if (subDelIconImg && subDelIconImg.complete && subDelIconImg.naturalWidth > 0) {
                            try {
                                ctx.globalAlpha = 0.8;
                                ctx.drawImage(subDelIconImg, subDelBtnX, subDelBtnY, subDelBtnSize, subDelBtnSize);
                                ctx.globalAlpha = 1;
                            } catch (e) {}
                        }

                        // Update sublayer bounds to include delete button area
                        const lastBound = this._sublayerRowBounds[this._sublayerRowBounds.length - 1];
                        if (lastBound) {
                            lastBound.delX = subDelBtnX;
                            lastBound.delY = subDelBtnY;
                            lastBound.delW = subDelBtnSize;
                            lastBound.delH = subDelBtnSize;
                        }

                        layerY += sublayerRowHeight;
                    }
                }
            }

            // Draw drop indicator when dragging layers/sublayers
            if (this._isDraggingLayerItem && this._dropTarget && this._dropTarget.y) {
                ctx.strokeStyle = '#3d8eff';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(layersPanelX + 4, this._dropTarget.y);
                ctx.lineTo(layersPanelX + layersPanelW - 4, this._dropTarget.y);
                ctx.stroke();

                // Draw small circles at ends of the line
                ctx.fillStyle = '#3d8eff';
                ctx.beginPath();
                ctx.arc(layersPanelX + 4, this._dropTarget.y, 3, 0, Math.PI * 2);
                ctx.fill();
                ctx.beginPath();
                ctx.arc(layersPanelX + layersPanelW - 4, this._dropTarget.y, 3, 0, Math.PI * 2);
                ctx.fill();
            }
        };

        // Helper: Convert screen coords to layer coords
        nodeType.prototype._screenToLayerCoords = function(screenX, screenY) {
            if (!this._imageDrawBounds) return null;
            const bounds = this._imageDrawBounds;

            // Convert screen position to layer position
            const layerX = (screenX - bounds.x) / bounds.zoom;
            const layerY = (screenY - bounds.y) / bounds.zoom;

            // Check if within layer bounds
            if (layerX < 0 || layerX >= this.canvasWidth || layerY < 0 || layerY >= this.canvasHeight) {
                return null;
            }

            return { x: layerX, y: layerY };
        };

        // Helper: Check if point is in canvas area
        nodeType.prototype._isInCanvasArea = function(localPos) {
            if (!this._canvasBounds) return false;
            const b = this._canvasBounds;
            return localPos[0] >= b.x && localPos[0] <= b.x + b.w &&
                   localPos[1] >= b.y && localPos[1] <= b.y + b.h;
        };

        // Pick color from canvas at given layer coordinates
        nodeType.prototype._pickColorFromCanvas = function(layerX, layerY) {
            if (!this.layerManager) return null;

            // Get the composite image
            const compositeCanvas = this.layerManager.composite(this.layers);
            const ctx = compositeCanvas.getContext('2d');

            // Get pixel data at the position
            const x = Math.floor(layerX);
            const y = Math.floor(layerY);

            if (x < 0 || x >= this.canvasWidth || y < 0 || y >= this.canvasHeight) {
                return null;
            }

            const imageData = ctx.getImageData(x, y, 1, 1);
            const data = imageData.data;

            // Convert to hex color
            const r = data[0].toString(16).padStart(2, '0');
            const g = data[1].toString(16).padStart(2, '0');
            const b = data[2].toString(16).padStart(2, '0');

            return `#${r}${g}${b}`;
        };

        // Helper: HSV to RGB conversion
        const hsvToRgb = (h, s, v) => {
            let r, g, b;
            const i = Math.floor(h * 6);
            const f = h * 6 - i;
            const p = v * (1 - s);
            const q = v * (1 - f * s);
            const t = v * (1 - (1 - f) * s);
            switch (i % 6) {
                case 0: r = v; g = t; b = p; break;
                case 1: r = q; g = v; b = p; break;
                case 2: r = p; g = v; b = t; break;
                case 3: r = p; g = q; b = v; break;
                case 4: r = t; g = p; b = v; break;
                case 5: r = v; g = p; b = q; break;
            }
            return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
        };

        // Helper: Update color from picker state
        nodeType.prototype._updateColorFromPicker = function() {
            const rgb = hsvToRgb(this._colorPickerHue, this._colorPickerSat, this._colorPickerVal);
            const hex = '#' + rgb.r.toString(16).padStart(2, '0') + rgb.g.toString(16).padStart(2, '0') + rgb.b.toString(16).padStart(2, '0');
            if (this._editingForeground !== false) {
                this.foregroundColor = hex;
            } else {
                this.backgroundColor = hex;
            }
        };

        // Helper: Hex to HSV
        const hexToHsv = (hex) => {
            const r = parseInt(hex.slice(1, 3), 16) / 255;
            const g = parseInt(hex.slice(3, 5), 16) / 255;
            const b = parseInt(hex.slice(5, 7), 16) / 255;
            const max = Math.max(r, g, b);
            const min = Math.min(r, g, b);
            const d = max - min;
            let h = 0;
            const s = max === 0 ? 0 : d / max;
            const v = max;
            if (d !== 0) {
                if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
                else if (max === g) h = ((b - r) / d + 2) / 6;
                else h = ((r - g) / d + 4) / 6;
            }
            return { h, s, v };
        };

        // Handle mouse clicks on tools and layers panel
        const onMouseDown = nodeType.prototype.onMouseDown;
        nodeType.prototype.onMouseDown = function(e, localPos, graphCanvas) {
            const toolbarWidth = 200;
            const startY = 70; // Account for title bar + output slots

            // Check if click is in toolbar area
            if (localPos[0] < toolbarWidth && localPos[1] > startY) {
                // Check brush size slider
                if (this._brushSliderBounds) {
                    const sb = this._brushSliderBounds;
                    if (localPos[0] >= sb.x && localPos[0] <= sb.x + sb.w &&
                        localPos[1] >= sb.y && localPos[1] <= sb.y + sb.h) {
                        this._draggingBrushSlider = true;
                        const percent = (localPos[0] - sb.x) / sb.w;
                        this.brushSize = Math.max(1, Math.min(200, Math.round(percent * 200)));
                        this.setDirtyCanvas(true);
                        return true;
                    }
                }

                // Check feather slider
                if (this._featherSliderBounds) {
                    const fb = this._featherSliderBounds;
                    if (localPos[0] >= fb.x && localPos[0] <= fb.x + fb.w &&
                        localPos[1] >= fb.y && localPos[1] <= fb.y + fb.h) {
                        this._draggingFeatherSlider = true;
                        const percent = (localPos[0] - fb.x) / fb.w;
                        this.brushFeather = Math.max(0, Math.min(100, Math.round(percent * 100)));
                        this.setDirtyCanvas(true);
                        return true;
                    }
                }
                // Check SV square (saturation/value picker)
                if (this._svSquareBounds) {
                    const sv = this._svSquareBounds;
                    if (localPos[0] >= sv.x && localPos[0] <= sv.x + sv.w &&
                        localPos[1] >= sv.y && localPos[1] <= sv.y + sv.h) {
                        this._draggingSV = true;
                        this._colorPickerSat = Math.max(0, Math.min(1, (localPos[0] - sv.x) / sv.w));
                        this._colorPickerVal = Math.max(0, Math.min(1, 1 - (localPos[1] - sv.y) / sv.h));
                        this._updateColorFromPicker();
                        this.setDirtyCanvas(true);
                        return true;
                    }
                }

                // Check Hue slider
                if (this._hueSliderBounds) {
                    const hs = this._hueSliderBounds;
                    if (localPos[0] >= hs.x && localPos[0] <= hs.x + hs.w &&
                        localPos[1] >= hs.y && localPos[1] <= hs.y + hs.h) {
                        this._draggingHue = true;
                        this._colorPickerHue = Math.max(0, Math.min(1, (localPos[1] - hs.y) / hs.h));
                        this._updateColorFromPicker();
                        this.setDirtyCanvas(true);
                        return true;
                    }
                }

                // Check foreground color swatch click - switch to editing foreground
                if (this._fgColorBounds) {
                    const fb = this._fgColorBounds;
                    if (localPos[0] >= fb.x && localPos[0] <= fb.x + fb.w &&
                        localPos[1] >= fb.y && localPos[1] <= fb.y + fb.h) {
                        this._editingForeground = true;
                        // Update picker to show current foreground color
                        const hsv = hexToHsv(this.foregroundColor);
                        this._colorPickerHue = hsv.h;
                        this._colorPickerSat = hsv.s;
                        this._colorPickerVal = hsv.v;
                        this.setDirtyCanvas(true);
                        return true;
                    }
                }

                // Check background color swatch click - switch to editing background
                if (this._bgColorBounds) {
                    const bb = this._bgColorBounds;
                    if (localPos[0] >= bb.x && localPos[0] <= bb.x + bb.w &&
                        localPos[1] >= bb.y && localPos[1] <= bb.y + bb.h) {
                        this._editingForeground = false;
                        // Update picker to show current background color
                        const hsv = hexToHsv(this.backgroundColor);
                        this._colorPickerHue = hsv.h;
                        this._colorPickerSat = hsv.s;
                        this._colorPickerVal = hsv.v;
                        this.setDirtyCanvas(true);
                        return true;
                    }
                }

                // Check eyedropper button click
                if (this._eyedropperBtnBounds) {
                    const eb = this._eyedropperBtnBounds;
                    if (localPos[0] >= eb.x && localPos[0] <= eb.x + eb.w &&
                        localPos[1] >= eb.y && localPos[1] <= eb.y + eb.h) {
                        this._eyedropperMode = !this._eyedropperMode;
                        this.setDirtyCanvas(true);
                        return true;
                    }
                }

                // Check tool button clicks
                for (const tool of TOOLS) {
                    if (tool._bounds) {
                        const tb = tool._bounds;
                        if (localPos[0] >= tb.x && localPos[0] <= tb.x + tb.w &&
                            localPos[1] >= tb.y && localPos[1] <= tb.y + tb.h) {
                            this.selectedTool = tool.id;
                            this.setDirtyCanvas(true);
                            return true;
                        }
                    }
                }

                // Check action button clicks
                for (const btn of ACTION_BUTTONS) {
                    if (btn._bounds) {
                        const ab = btn._bounds;
                        if (localPos[0] >= ab.x && localPos[0] <= ab.x + ab.w &&
                            localPos[1] >= ab.y && localPos[1] <= ab.y + ab.h) {
                            // Check if button requires move tool and is enabled
                            if (btn.requiresMoveTool && !btn._enabled) {
                                // Button is disabled, don't execute
                                return true;
                            }
                            // Check if button is undo/redo and is enabled
                            if (btn.isUndoRedo && !btn._enabled) {
                                // Button is disabled, don't execute
                                return true;
                            }
                            // Execute the action
                            if (btn.action && typeof this[btn.action] === 'function') {
                                this[btn.action]();
                            }
                            this.setDirtyCanvas(true);
                            return true;
                        }
                    }
                }

                // Check edit size button click
                if (this._editSizeBtnBounds) {
                    const esb = this._editSizeBtnBounds;
                    if (localPos[0] >= esb.x && localPos[0] <= esb.x + esb.w &&
                        localPos[1] >= esb.y && localPos[1] <= esb.y + esb.h) {
                        this.showResizeModal();
                        return true;
                    }
                }

                // Check zoom button clicks
                if (this._zoomInBtnBounds) {
                    const zib = this._zoomInBtnBounds;
                    if (localPos[0] >= zib.x && localPos[0] <= zib.x + zib.w &&
                        localPos[1] >= zib.y && localPos[1] <= zib.y + zib.h) {
                        this.viewZoom = Math.min(5, (this.viewZoom || 1) * 1.25);
                        this.setDirtyCanvas(true);
                        return true;
                    }
                }

                if (this._zoomOutBtnBounds) {
                    const zob = this._zoomOutBtnBounds;
                    if (localPos[0] >= zob.x && localPos[0] <= zob.x + zob.w &&
                        localPos[1] >= zob.y && localPos[1] <= zob.y + zob.h) {
                        this.viewZoom = Math.max(0.1, (this.viewZoom || 1) * 0.8);
                        this.setDirtyCanvas(true);
                        return true;
                    }
                }

                if (this._zoomResetBtnBounds) {
                    const zrb = this._zoomResetBtnBounds;
                    if (localPos[0] >= zrb.x && localPos[0] <= zrb.x + zrb.w &&
                        localPos[1] >= zrb.y && localPos[1] <= zrb.y + zrb.h) {
                        this.viewZoom = 1;
                        this.viewOffsetX = 0;
                        this.viewOffsetY = 0;
                        this.setDirtyCanvas(true);
                        return true;
                    }
                }

                // Check add layer button
                if (this._addLayerBtnBounds) {
                    const ab = this._addLayerBtnBounds;
                    if (localPos[0] >= ab.x && localPos[0] <= ab.x + ab.w &&
                        localPos[1] >= ab.y && localPos[1] <= ab.y + ab.h) {
                        const newId = Math.max(...this.layers.map(l => l.id)) + 1;
                        const layerDef = {
                            id: newId,
                            name: `Layer ${newId}`,
                            visible: true,
                            locked: false,
                            opacity: 100,
                            expanded: true
                        };
                        this.layers.push(layerDef);
                        if (this.layerManager) {
                            this.layerManager.createLayer(newId);
                        }
                        this.selectedLayer = newId;
                        this.selectedSublayer = null;
                        this.expandedLayers.add(newId);
                        // Create undo command for add layer
                        this._pushCommand({
                            type: 'add_layer',
                            layerId: newId,
                            after: {
                                layerId: newId,
                                layerDef: { ...layerDef }
                            }
                        });
                        this.setDirtyCanvas(true);
                        return true;
                    }
                }

                // Check delete layer button
                if (this._delLayerBtnBounds) {
                    const db = this._delLayerBtnBounds;
                    if (localPos[0] >= db.x && localPos[0] <= db.x + db.w &&
                        localPos[1] >= db.y && localPos[1] <= db.y + db.h) {
                        // Skip if button is disabled
                        if (this._deleteDisabled) {
                            return true;
                        }
                        // If a sublayer is selected, delete the sublayer
                        if (this.selectedSublayer !== null) {
                            if (this.layerManager) {
                                const layer = this.layerManager.getLayer(this.selectedLayer);
                                const sublayer = layer?.sublayers[this.selectedSublayer];
                                // Snapshot before deleting for undo
                                const snapshot = sublayer ? this._cloneSublayer(sublayer) : null;
                                const deletedIndex = this.selectedSublayer;

                                this.layerManager.deleteSublayer(this.selectedLayer, this.selectedSublayer);
                                // Select next sublayer or deselect
                                const sublayerCount = this.layerManager.getSublayerCount(this.selectedLayer);
                                if (sublayerCount === 0) {
                                    this.selectedSublayer = null;
                                } else if (this.selectedSublayer >= sublayerCount) {
                                    this.selectedSublayer = sublayerCount - 1;
                                }

                                // Create undo command for delete sublayer
                                if (snapshot) {
                                    this._pushCommand({
                                        type: 'delete_sublayer',
                                        layerId: this.selectedLayer,
                                        sublayerIndex: deletedIndex,
                                        before: { snapshot: snapshot }
                                    });
                                }
                            }
                            this.setDirtyCanvas(true);
                            return true;
                        }
                        // Otherwise delete the layer
                        if (this.layers.length > 1) {
                            const layerToDelete = this.layers.find(l => l.id === this.selectedLayer);
                            if (layerToDelete && !layerToDelete.locked) {
                                // Snapshot layer and all sublayers before deleting for undo
                                const layerData = this.layerManager?.getLayer(layerToDelete.id);
                                const sublayerSnapshots = layerData?.sublayers.map(sl => this._cloneSublayer(sl)) || [];

                                const idx = this.layers.indexOf(layerToDelete);
                                const deletedId = layerToDelete.id;
                                this.layers.splice(idx, 1);
                                if (this.layerManager) {
                                    this.layerManager.deleteLayer(deletedId);
                                }
                                this.expandedLayers.delete(deletedId);
                                this.selectedLayer = this.layers[Math.max(0, idx - 1)].id;
                                this.selectedSublayer = null;

                                // Create undo command for delete layer
                                this._pushCommand({
                                    type: 'delete_layer',
                                    layerId: deletedId,
                                    before: {
                                        layerDef: { ...layerToDelete },
                                        sublayerSnapshots: sublayerSnapshots
                                    }
                                });

                                this.setDirtyCanvas(true);
                                return true;
                            }
                        }
                        return true;
                    }
                }

                // Check clear layer button
                if (this._clearLayerBtnBounds) {
                    const cb = this._clearLayerBtnBounds;
                    if (localPos[0] >= cb.x && localPos[0] <= cb.x + cb.w &&
                        localPos[1] >= cb.y && localPos[1] <= cb.y + cb.h) {
                        // Skip if button is disabled
                        if (this._clearDisabled) {
                            return true;
                        }
                        // Clear all sublayers from the selected layer
                        if (this.layerManager) {
                            const layer = this.layerManager.getLayer(this.selectedLayer);
                            if (layer && layer.sublayers.length > 0) {
                                // Snapshot all sublayers before clearing for undo
                                const sublayerSnapshots = layer.sublayers.map(sl => this._cloneSublayer(sl));

                                // Clear all sublayers
                                layer.sublayers = [];
                                layer.needsRecomposite = true;
                                this.selectedSublayer = null;

                                // Create undo command for clear layer
                                this._pushCommand({
                                    type: 'clear_layer',
                                    layerId: this.selectedLayer,
                                    before: {
                                        sublayerSnapshots: sublayerSnapshots
                                    }
                                });

                                this.setDirtyCanvas(true);
                            }
                        }
                        return true;
                    }
                }

                // Check sublayer row clicks first (they're drawn on top)
                if (this._sublayerRowBounds) {
                    for (const bounds of this._sublayerRowBounds) {
                        if (localPos[0] >= bounds.x && localPos[0] <= bounds.x + bounds.w &&
                            localPos[1] >= bounds.y && localPos[1] <= bounds.y + bounds.h) {
                            // Check if clicking delete button
                            if (bounds.delX !== undefined &&
                                localPos[0] >= bounds.delX && localPos[0] <= bounds.delX + bounds.delW &&
                                localPos[1] >= bounds.delY && localPos[1] <= bounds.delY + bounds.delH) {
                                // Delete this sublayer (with undo support)
                                if (this.layerManager) {
                                    const layer = this.layerManager.getLayer(bounds.layerId);
                                    const sublayer = layer?.sublayers[bounds.sublayerIndex];
                                    // Snapshot before deleting for undo
                                    const snapshot = sublayer ? this._cloneSublayer(sublayer) : null;
                                    const deletedIndex = bounds.sublayerIndex;

                                    this.layerManager.deleteSublayer(bounds.layerId, bounds.sublayerIndex);

                                    // Clear selection if deleted sublayer was selected
                                    if (this.selectedLayer === bounds.layerId && this.selectedSublayer === bounds.sublayerIndex) {
                                        const sublayerCount = this.layerManager.getSublayerCount(bounds.layerId);
                                        if (sublayerCount === 0) {
                                            this.selectedSublayer = null;
                                        } else if (this.selectedSublayer >= sublayerCount) {
                                            this.selectedSublayer = sublayerCount - 1;
                                        }
                                    }

                                    // Create undo command for delete sublayer
                                    if (snapshot) {
                                        this._pushCommand({
                                            type: 'delete_sublayer',
                                            layerId: bounds.layerId,
                                            sublayerIndex: deletedIndex,
                                            before: { snapshot: snapshot }
                                        });
                                    }
                                }
                            }
                            // Check if clicking visibility toggle
                            else if (localPos[0] >= bounds.visX && localPos[0] <= bounds.visX + bounds.visW + 10) {
                                // Toggle sublayer visibility
                                if (this.layerManager) {
                                    this.layerManager.toggleSublayerVisible(bounds.layerId, bounds.sublayerIndex);
                                }
                            } else {
                                // Select this sublayer and prepare for potential drag
                                this.selectedLayer = bounds.layerId;
                                this.selectedSublayer = bounds.sublayerIndex;
                                // Setup for potential drag reorder
                                this._dragStartPos = { x: localPos[0], y: localPos[1] };
                                this._draggedItem = {
                                    type: 'sublayer',
                                    layerId: bounds.layerId,
                                    sublayerIndex: bounds.sublayerIndex
                                };
                            }
                            this.setDirtyCanvas(true);
                            return true;
                        }
                    }
                }

                // Check layer row clicks
                if (this._layerRowBounds) {
                    for (const bounds of this._layerRowBounds) {
                        if (localPos[0] >= bounds.x && localPos[0] <= bounds.x + bounds.w &&
                            localPos[1] >= bounds.y && localPos[1] <= bounds.y + bounds.h) {
                            const layer = this.layers.find(l => l.id === bounds.id);
                            if (layer) {
                                // Check if clicking visibility icon
                                if (localPos[0] < bounds.visX + bounds.visW) {
                                    layer.visible = !layer.visible;
                                }
                                // Check if clicking expand/collapse arrow
                                else if (localPos[0] >= bounds.expandX && localPos[0] <= bounds.expandX + bounds.expandW) {
                                    if (this.expandedLayers.has(layer.id)) {
                                        this.expandedLayers.delete(layer.id);
                                    } else {
                                        this.expandedLayers.add(layer.id);
                                    }
                                }
                                // Otherwise select the layer and prepare for potential drag
                                else {
                                    this.selectedLayer = layer.id;
                                    this.selectedSublayer = null;  // Select layer, not sublayer
                                    // Setup for potential drag reorder
                                    this._dragStartPos = { x: localPos[0], y: localPos[1] };
                                    this._draggedItem = {
                                        type: 'layer',
                                        layerId: layer.id
                                    };
                                }
                                this.setDirtyCanvas(true);
                                return true;
                            }
                        }
                    }
                }

                return true; // Consume clicks in toolbar
            }

            // Check if click is in canvas area for drawing
            if (this._isInCanvasArea(localPos)) {
                const layerCoords = this._screenToLayerCoords(localPos[0], localPos[1]);
                const currentLayer = this.layers.find(l => l.id === this.selectedLayer);

                // Prevent node dragging when clicking in canvas area
                if (graphCanvas) {
                    graphCanvas.node_dragged = false;
                    graphCanvas.dragging_canvas = false;
                }

                // Block the event from propagating to node drag
                if (e && e.stopPropagation) {
                    e.stopPropagation();
                }
                if (e && e.preventDefault) {
                    e.preventDefault();
                }

                // Set flag to indicate we're handling this interaction
                this._handlingCanvasInteraction = true;

                // Handle hand tool (doesn't need layer)
                if (this.selectedTool === 'hand') {
                    this.isPanning = true;
                    this._panStart = { x: localPos[0], y: localPos[1] };
                    this._panOffsetStart = { x: this.viewOffsetX, y: this.viewOffsetY };
                    return true;
                }

                // Handle move tool
                if (this.selectedTool === 'move' && this.layerManager) {
                    // Check if clicking on a rotation zone first (outside corners)
                    if (this._rotationZones && this.selectedSublayer !== null && this._selectionCenter) {
                        for (const zone of this._rotationZones) {
                            if (localPos[0] >= zone.x && localPos[0] <= zone.x + zone.w &&
                                localPos[1] >= zone.y && localPos[1] <= zone.y + zone.h) {
                                // Start rotating
                                const sublayer = this.layerManager.getSublayer(this.selectedLayer, this.selectedSublayer);
                                if (sublayer) {
                                    this.isRotating = true;
                                    // Calculate initial angle from center to mouse position
                                    const dx = localPos[0] - this._selectionCenter.x;
                                    const dy = localPos[1] - this._selectionCenter.y;
                                    this._rotateStartAngle = Math.atan2(dy, dx);
                                    this._rotateTargetStartRotation = sublayer.rotation || 0;
                                    // Create pending command for undo (capture full sublayer since baking changes canvas)
                                    this._pendingCommand = {
                                        type: 'transform',
                                        layerId: this.selectedLayer,
                                        sublayerIndex: this.selectedSublayer,
                                        before: { snapshot: this._cloneSublayer(sublayer) }
                                    };
                                    return true;
                                }
                            }
                        }
                    }

                    // Check if clicking on a resize handle
                    if (this._resizeHandles && this.selectedSublayer !== null) {
                        for (const handle of this._resizeHandles) {
                            if (localPos[0] >= handle.x && localPos[0] <= handle.x + handle.w &&
                                localPos[1] >= handle.y && localPos[1] <= handle.y + handle.h) {
                                // Start resizing
                                const sublayer = this.layerManager.getSublayer(this.selectedLayer, this.selectedSublayer);
                                if (sublayer) {
                                    this.isResizing = true;
                                    this._resizeHandle = handle.id;
                                    this._resizeStart = { x: localPos[0], y: localPos[1] };
                                    // Get content bounds for more responsive resizing
                                    const contentBounds = this.layerManager.getSublayerBounds(this.selectedLayer, this.selectedSublayer);
                                    this._resizeTargetStart = {
                                        x: sublayer.x,
                                        y: sublayer.y,
                                        scaleX: sublayer.scaleX,
                                        scaleY: sublayer.scaleY,
                                        contentWidth: contentBounds?.contentWidth || this.layerManager.width,
                                        contentHeight: contentBounds?.contentHeight || this.layerManager.height
                                    };
                                    // Create pending command for undo (capture full sublayer since baking changes canvas)
                                    this._pendingCommand = {
                                        type: 'transform',
                                        layerId: this.selectedLayer,
                                        sublayerIndex: this.selectedSublayer,
                                        before: { snapshot: this._cloneSublayer(sublayer) }
                                    };
                                    return true;
                                }
                            }
                        }
                    }

                    // Otherwise handle move
                    if (layerCoords) {
                        const layer = this.layerManager.getLayer(this.selectedLayer);
                        if (layer) {
                            // If a sublayer is selected, move just that sublayer
                            if (this.selectedSublayer !== null && layer.sublayers[this.selectedSublayer]) {
                                const sublayer = layer.sublayers[this.selectedSublayer];
                                this.isMoving = true;
                                this._moveStart = { x: layerCoords.x, y: layerCoords.y };
                                this._moveTargetStart = { x: sublayer.x, y: sublayer.y };
                                this._moveTarget = { type: 'sublayer', layerId: this.selectedLayer, sublayerIndex: this.selectedSublayer };
                                // Create pending command for undo (capture full sublayer since baking changes canvas)
                                this._pendingCommand = {
                                    type: 'transform',
                                    layerId: this.selectedLayer,
                                    sublayerIndex: this.selectedSublayer,
                                    before: { snapshot: this._cloneSublayer(sublayer) }
                                };
                                return true;
                            }
                            // If layer is selected (no sublayer), move all sublayers together
                            else if (layer.sublayers.length > 0) {
                                this.isMoving = true;
                                this._moveStart = { x: layerCoords.x, y: layerCoords.y };
                                // Store starting positions of all sublayers
                                this._moveTargetStarts = layer.sublayers.map(sl => ({ x: sl.x, y: sl.y }));
                                this._moveTarget = { type: 'layer', layerId: this.selectedLayer };
                                // Create pending command for undo (layer move)
                                this._pendingCommand = {
                                    type: 'move',
                                    layerId: this.selectedLayer,
                                    sublayerIndex: undefined,
                                    before: {
                                        sublayerStarts: layer.sublayers.map(sl => ({ x: sl.x, y: sl.y }))
                                    }
                                };
                                return true;
                            }
                        }
                    }
                    return true;
                }

                // Handle eyedropper mode from color picker
                if (this._eyedropperMode && layerCoords) {
                    const pickedColor = this._pickColorFromCanvas(layerCoords.x, layerCoords.y);
                    if (pickedColor) {
                        if (this._editingForeground !== false) {
                            this.foregroundColor = pickedColor;
                        } else {
                            this.backgroundColor = pickedColor;
                        }
                        // Update color picker to reflect new color
                        const hsv = hexToHsv(pickedColor);
                        this._colorPickerHue = hsv.h;
                        this._colorPickerSat = hsv.s;
                        this._colorPickerVal = hsv.v;
                        // Disable eyedropper mode after picking
                        this._eyedropperMode = false;
                        this.setDirtyCanvas(true);
                    }
                    return true;
                }

                // Handle drawing tools (need valid layer)
                if (layerCoords && currentLayer && !currentLayer.locked) {
                    // Start drawing
                    if (this.selectedTool === 'brush') {
                        this.isDrawing = true;
                        this.lastDrawPoint = layerCoords;
                        // Create new sublayer for this stroke
                        this.layerManager.createSublayer(this.selectedLayer);
                        const layer = this.layerManager.getLayer(this.selectedLayer);
                        const sublayerIndex = layer ? layer.sublayers.length - 1 : 0;
                        // Select the new sublayer
                        this.selectedSublayer = sublayerIndex;
                        // Start pending command for undo
                        this._pendingCommand = {
                            type: 'brush_stroke',
                            layerId: this.selectedLayer,
                            sublayerIndex: sublayerIndex
                        };
                        this.drawingTools.brushSize = this.brushSize;
                        this.drawingTools.brushFeather = this.brushFeather;
                        this.drawingTools.drawBrushDot(this.selectedLayer, layerCoords.x, layerCoords.y, this.foregroundColor);
                        this.setDirtyCanvas(true);
                        return true;
                    } else if (this.selectedTool === 'eraser') {
                        this.isDrawing = true;
                        this.lastDrawPoint = layerCoords;
                        // Eraser works on selected sublayer, or all sublayers if layer is selected
                        // Snapshot canvases before erasing for undo
                        const layer = this.layerManager.getLayer(this.selectedLayer);
                        if (layer) {
                            if (this.selectedSublayer !== null && layer.sublayers[this.selectedSublayer]) {
                                // Single sublayer erase
                                this._pendingCommand = {
                                    type: 'erase',
                                    layerId: this.selectedLayer,
                                    sublayerIndex: this.selectedSublayer,
                                    before: {
                                        canvas: cloneCanvas(layer.sublayers[this.selectedSublayer].canvas)
                                    }
                                };
                            } else {
                                // Erase from all sublayers - snapshot all
                                const snapshots = layer.sublayers.map((sl, i) => ({
                                    index: i,
                                    canvas: cloneCanvas(sl.canvas)
                                }));
                                this._pendingCommand = {
                                    type: 'erase',
                                    layerId: this.selectedLayer,
                                    sublayerIndex: null,
                                    before: {
                                        sublayerSnapshots: snapshots
                                    }
                                };
                            }
                        }
                        this.drawingTools.brushSize = this.brushSize;
                        this.drawingTools.brushFeather = this.brushFeather;
                        // Pass selectedSublayer (null means erase from all sublayers)
                        this.drawingTools.eraseDot(this.selectedLayer, layerCoords.x, layerCoords.y, null, null, this.selectedSublayer);
                        this.setDirtyCanvas(true);
                        return true;
                    } else if (this.selectedTool === 'fill') {
                        // Create new sublayer for this fill
                        this.layerManager.createSublayer(this.selectedLayer);
                        const layer = this.layerManager.getLayer(this.selectedLayer);
                        const sublayerIndex = layer ? layer.sublayers.length - 1 : 0;
                        // Select the new sublayer
                        this.selectedSublayer = sublayerIndex;
                        this.drawingTools.floodFill(this.selectedLayer, layerCoords.x, layerCoords.y, this.foregroundColor);
                        // Create undo command for fill (immediate, not pending)
                        const sublayer = layer?.sublayers[sublayerIndex];
                        if (sublayer) {
                            this._pushCommand({
                                type: 'fill',
                                layerId: this.selectedLayer,
                                sublayerIndex: sublayerIndex,
                                after: {
                                    snapshot: this._cloneSublayer(sublayer)
                                }
                            });
                        }
                        this.setDirtyCanvas(true);
                        return true;
                    }
                }

                // Even if we can't draw (locked layer, etc.), still consume the event
                // to prevent node dragging when clicking on canvas
                return true;
            }

            if (onMouseDown) {
                return onMouseDown.apply(this, arguments);
            }
            return false;
        };

        // Handle mouse move for drawing
        const onMouseMove = nodeType.prototype.onMouseMove;
        nodeType.prototype.onMouseMove = function(e, localPos, graphCanvas) {
            // Set default cursor while over the node
            if (app.canvas && app.canvas.canvas) {
                app.canvas.canvas.style.cursor = 'default';
            }

            // Store for brush cursor
            this._lastMousePos = { x: localPos[0], y: localPos[1] };

            // Handle layer/sublayer drag reordering
            if (this._dragStartPos && this._draggedItem) {
                const dragThreshold = 5;
                const dx = localPos[0] - this._dragStartPos.x;
                const dy = localPos[1] - this._dragStartPos.y;

                // Start dragging if threshold exceeded
                if (!this._isDraggingLayerItem && (Math.abs(dx) > dragThreshold || Math.abs(dy) > dragThreshold)) {
                    this._isDraggingLayerItem = true;
                }

                if (this._isDraggingLayerItem) {
                    // Find drop target based on current position
                    let newDropTarget = null;

                    // Check sublayer rows for drop targets
                    // Build list of drop gaps - one per boundary between sublayers
                    if (this._sublayerRowBounds && this._draggedItem.type === 'sublayer') {
                        const dropGaps = [];

                        // Filter to only sublayers of the same layer
                        const sameLaverSublayers = this._sublayerRowBounds.filter(
                            b => b.layerId === this._draggedItem.layerId
                        );

                        for (let i = 0; i < sameLaverSublayers.length; i++) {
                            const bounds = sameLaverSublayers[i];

                            // Gap above this sublayer
                            dropGaps.push({
                                y: bounds.y,
                                layerId: bounds.layerId,
                                sublayerIndex: bounds.sublayerIndex,
                                position: 'after'  // 'after' in reverse order = visually above
                            });

                            // Only add bottom gap for the last sublayer
                            if (i === sameLaverSublayers.length - 1) {
                                dropGaps.push({
                                    y: bounds.y + bounds.h,
                                    layerId: bounds.layerId,
                                    sublayerIndex: bounds.sublayerIndex,
                                    position: 'before'
                                });
                            }
                        }

                        // Find the closest gap to mouse Y
                        let closestGap = null;
                        let closestDist = Infinity;
                        for (const gap of dropGaps) {
                            const dist = Math.abs(localPos[1] - gap.y);
                            if (dist < closestDist) {
                                closestDist = dist;
                                closestGap = gap;
                            }
                        }

                        // Only show indicator if reasonably close to a gap
                        if (closestGap && closestDist < 50) {
                            newDropTarget = {
                                type: 'sublayer',
                                layerId: closestGap.layerId,
                                sublayerIndex: closestGap.sublayerIndex,
                                position: closestGap.position,
                                y: closestGap.y
                            };
                        }
                    }

                    // Check layer rows for drop targets
                    // Build list of drop gaps - one per boundary between layers
                    if (this._layerRowBounds && this._draggedItem.type === 'layer') {
                        const dropGaps = [];

                        for (let i = 0; i < this._layerRowBounds.length; i++) {
                            const bounds = this._layerRowBounds[i];

                            // Gap above this layer (at top of layer row)
                            dropGaps.push({
                                y: bounds.y,
                                layerId: bounds.id,
                                position: 'after'  // 'after' in reverse order = visually above
                            });

                            // Only add bottom gap for the last layer in the list
                            if (i === this._layerRowBounds.length - 1) {
                                let bottomY = bounds.y + bounds.h;
                                if (this._sublayerRowBounds) {
                                    for (const subBounds of this._sublayerRowBounds) {
                                        if (subBounds.layerId === bounds.id) {
                                            const subBottom = subBounds.y + subBounds.h;
                                            if (subBottom > bottomY) {
                                                bottomY = subBottom;
                                            }
                                        }
                                    }
                                }
                                dropGaps.push({
                                    y: bottomY,
                                    layerId: bounds.id,
                                    position: 'before'
                                });
                            }
                        }

                        // Find the closest gap to mouse Y
                        let closestGap = null;
                        let closestDist = Infinity;
                        for (const gap of dropGaps) {
                            const dist = Math.abs(localPos[1] - gap.y);
                            if (dist < closestDist) {
                                closestDist = dist;
                                closestGap = gap;
                            }
                        }

                        // Only show indicator if reasonably close to a gap
                        if (closestGap && closestDist < 50) {
                            newDropTarget = {
                                type: 'layer',
                                layerId: closestGap.layerId,
                                position: closestGap.position,
                                y: closestGap.y
                            };
                        }
                    }

                    // Update drop target (keep last valid one if mouse moved off)
                    if (newDropTarget) {
                        this._dropTarget = newDropTarget;
                    }

                    if (app.canvas && app.canvas.canvas) {
                        app.canvas.canvas.style.cursor = 'grabbing';
                    }
                    this.setDirtyCanvas(true);
                    return true;
                }
            }

            // Handle brush slider dragging
            if (this._draggingBrushSlider && this._brushSliderBounds) {
                const sb = this._brushSliderBounds;
                const percent = Math.max(0, Math.min(1, (localPos[0] - sb.x) / sb.w));
                this.brushSize = Math.max(1, Math.min(200, Math.round(percent * 200)));
                this.setDirtyCanvas(true);
                return true;
            }

            // Handle feather slider dragging
            if (this._draggingFeatherSlider && this._featherSliderBounds) {
                const fb = this._featherSliderBounds;
                const percent = Math.max(0, Math.min(1, (localPos[0] - fb.x) / fb.w));
                this.brushFeather = Math.max(0, Math.min(100, Math.round(percent * 100)));
                this.setDirtyCanvas(true);
                return true;
            }

            // Handle SV square dragging
            if (this._draggingSV && this._svSquareBounds) {
                const sv = this._svSquareBounds;
                this._colorPickerSat = Math.max(0, Math.min(1, (localPos[0] - sv.x) / sv.w));
                this._colorPickerVal = Math.max(0, Math.min(1, 1 - (localPos[1] - sv.y) / sv.h));
                this._updateColorFromPicker();
                this.setDirtyCanvas(true);
                return true;
            }

            // Handle Hue slider dragging
            if (this._draggingHue && this._hueSliderBounds) {
                const hs = this._hueSliderBounds;
                this._colorPickerHue = Math.max(0, Math.min(1, (localPos[1] - hs.y) / hs.h));
                this._updateColorFromPicker();
                this.setDirtyCanvas(true);
                return true;
            }

            // If we're drawing, panning, moving, resizing, or rotating, prevent node movement
            if (this.isDrawing || this.isPanning || this.isMoving || this.isResizing || this.isRotating || this._handlingCanvasInteraction) {
                if (graphCanvas) {
                    graphCanvas.node_dragged = false;
                    graphCanvas.dragging_canvas = false;
                }
                if (e && e.stopPropagation) {
                    e.stopPropagation();
                }
            }

            // Handle resizing sublayer
            if (this.isResizing && this._resizeStart && this._resizeHandle) {
                const sublayer = this.layerManager.getSublayer(this.selectedLayer, this.selectedSublayer);
                if (sublayer && this._imageDrawBounds) {
                    const zoom = this._imageDrawBounds.zoom;
                    const canvasWidth = this.layerManager.width;
                    const canvasHeight = this.layerManager.height;

                    // Use content dimensions for more responsive resizing of small objects
                    const start = this._resizeTargetStart;
                    const contentWidth = start.contentWidth || canvasWidth;
                    const contentHeight = start.contentHeight || canvasHeight;

                    // Calculate delta in screen pixels
                    const dx = localPos[0] - this._resizeStart.x;
                    const dy = localPos[1] - this._resizeStart.y;

                    // Convert delta to layer scale units using content dimensions
                    const dScaleX = dx / (contentWidth * zoom);
                    const dScaleY = dy / (contentHeight * zoom);

                    // Apply resize based on which handle is being dragged
                    const handle = this._resizeHandle;

                    // Calculate new scale and position based on handle
                    let newScaleX = start.scaleX;
                    let newScaleY = start.scaleY;
                    let newX = start.x;
                    let newY = start.y;

                    // Horizontal resize
                    if (handle.includes('e')) {
                        newScaleX = Math.max(0.01, start.scaleX + dScaleX);
                    } else if (handle.includes('w')) {
                        newScaleX = Math.max(0.01, start.scaleX - dScaleX);
                        // Move position to compensate (use content dimensions, not canvas)
                        newX = start.x + (start.scaleX - newScaleX) * contentWidth;
                    }

                    // Vertical resize
                    if (handle.includes('s')) {
                        newScaleY = Math.max(0.01, start.scaleY + dScaleY);
                    } else if (handle.includes('n')) {
                        newScaleY = Math.max(0.01, start.scaleY - dScaleY);
                        // Move position to compensate (use content dimensions, not canvas)
                        newY = start.y + (start.scaleY - newScaleY) * contentHeight;
                    }

                    sublayer.scaleX = newScaleX;
                    sublayer.scaleY = newScaleY;
                    sublayer.x = newX;
                    sublayer.y = newY;

                    const layer = this.layerManager.getLayer(this.selectedLayer);
                    if (layer) layer.needsRecomposite = true;
                    this.setDirtyCanvas(true);
                }
                return true;
            }

            // Handle rotating sublayer
            if (this.isRotating && this._selectionCenter) {
                const sublayer = this.layerManager.getSublayer(this.selectedLayer, this.selectedSublayer);
                if (sublayer) {
                    // Calculate current angle from center to mouse position
                    const dx = localPos[0] - this._selectionCenter.x;
                    const dy = localPos[1] - this._selectionCenter.y;
                    const currentAngle = Math.atan2(dy, dx);

                    // Calculate rotation delta
                    const deltaAngle = currentAngle - this._rotateStartAngle;

                    // Apply rotation
                    sublayer.rotation = this._rotateTargetStartRotation + deltaAngle;

                    const layer = this.layerManager.getLayer(this.selectedLayer);
                    if (layer) layer.needsRecomposite = true;
                    this.setDirtyCanvas(true);
                }
                return true;
            }

            // Handle panning with hand tool
            if (this.isPanning && this._panStart) {
                const dx = localPos[0] - this._panStart.x;
                const dy = localPos[1] - this._panStart.y;
                this.viewOffsetX = this._panOffsetStart.x + dx;
                this.viewOffsetY = this._panOffsetStart.y + dy;
                this.setDirtyCanvas(true);
                return true;
            }

            // Handle moving with move tool
            if (this.isMoving && this._moveStart && this._moveTarget) {
                const layerCoords = this._screenToLayerCoords(localPos[0], localPos[1]);
                if (layerCoords) {
                    const layer = this.layerManager.getLayer(this._moveTarget.layerId);
                    if (layer) {
                        const dx = layerCoords.x - this._moveStart.x;
                        const dy = layerCoords.y - this._moveStart.y;

                        if (this._moveTarget.type === 'sublayer') {
                            // Move single sublayer
                            if (layer.sublayers[this._moveTarget.sublayerIndex]) {
                                const sublayer = layer.sublayers[this._moveTarget.sublayerIndex];
                                sublayer.x = this._moveTargetStart.x + dx;
                                sublayer.y = this._moveTargetStart.y + dy;
                            }
                        } else if (this._moveTarget.type === 'layer') {
                            // Move all sublayers together
                            for (let i = 0; i < layer.sublayers.length; i++) {
                                layer.sublayers[i].x = this._moveTargetStarts[i].x + dx;
                                layer.sublayers[i].y = this._moveTargetStarts[i].y + dy;
                            }
                        }
                        layer.needsRecomposite = true;
                        this.setDirtyCanvas(true);
                    }
                }
                return true;
            }

            // Handle drawing
            if (this.isDrawing && this.lastDrawPoint) {
                // Check if mouse button is no longer pressed (e.g., released outside canvas)
                if (e && e.buttons === 0) {
                    this._finalizePendingCommand();
                    this._resetInteractionState();
                    this.setDirtyCanvas(true);
                    return true;
                }

                const layerCoords = this._screenToLayerCoords(localPos[0], localPos[1]);
                if (layerCoords) {
                    // Check if mouse re-entered canvas (large distance from last point)
                    // If so, update lastDrawPoint to current position to avoid line jump
                    const dx = layerCoords.x - this.lastDrawPoint.x;
                    const dy = layerCoords.y - this.lastDrawPoint.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    const jumpThreshold = this.brushSize * 3; // If moved more than 3x brush size, likely re-entered

                    if (dist > jumpThreshold) {
                        // Mouse likely left and re-entered - just update position without drawing line
                        this.lastDrawPoint = layerCoords;
                        this.setDirtyCanvas(true);
                        return true;
                    }

                    // Update drawing tools with current settings
                    this.drawingTools.brushSize = this.brushSize;
                    this.drawingTools.brushFeather = this.brushFeather;

                    if (this.selectedTool === 'brush') {
                        this.drawingTools.drawBrushSegment(
                            this.selectedLayer,
                            this.lastDrawPoint.x, this.lastDrawPoint.y,
                            layerCoords.x, layerCoords.y,
                            this.foregroundColor
                        );
                    } else if (this.selectedTool === 'eraser') {
                        this.drawingTools.eraseSegment(
                            this.selectedLayer,
                            this.lastDrawPoint.x, this.lastDrawPoint.y,
                            layerCoords.x, layerCoords.y,
                            null, null, this.selectedSublayer
                        );
                    }
                    this.lastDrawPoint = layerCoords;
                    this.setDirtyCanvas(true);
                }
                return true;
            }

            // Trigger redraw for brush cursor or eyedropper cursor
            if (this.selectedTool === 'brush' || this.selectedTool === 'eraser' || this._eyedropperMode) {
                // Update eyedropper preview color
                if (this._eyedropperMode) {
                    const layerCoords = this._screenToLayerCoords(localPos[0], localPos[1]);
                    if (layerCoords) {
                        this._eyedropperPreviewColor = this._pickColorFromCanvas(layerCoords.x, layerCoords.y);
                    } else {
                        this._eyedropperPreviewColor = null;
                    }
                }
                this.setDirtyCanvas(true);
            }

            // Update cursor when hovering over resize handles or rotation zones
            if (this.selectedTool === 'move' && this._resizeHandles && !this.isResizing && !this.isMoving && !this.isRotating) {
                let foundHandle = false;

                // Check rotation handle first (above top-center)
                if (this._rotationZones) {
                    for (const zone of this._rotationZones) {
                        if (localPos[0] >= zone.x && localPos[0] <= zone.x + zone.w &&
                            localPos[1] >= zone.y && localPos[1] <= zone.y + zone.h) {
                            if (app.canvas && app.canvas.canvas) {
                                // Use a custom rotation cursor or grab cursor
                                app.canvas.canvas.style.cursor = 'grab';
                            }
                            foundHandle = true;
                            break;
                        }
                    }
                }

                // Then check resize handles
                if (!foundHandle) {
                    for (const handle of this._resizeHandles) {
                        if (localPos[0] >= handle.x && localPos[0] <= handle.x + handle.w &&
                            localPos[1] >= handle.y && localPos[1] <= handle.y + handle.h) {
                            if (app.canvas && app.canvas.canvas) {
                                app.canvas.canvas.style.cursor = handle.cursor;
                            }
                            foundHandle = true;
                            break;
                        }
                    }
                }

                if (!foundHandle && app.canvas && app.canvas.canvas) {
                    app.canvas.canvas.style.cursor = 'move';
                }
            }

            // Show grabbing cursor while rotating
            if (this.isRotating && app.canvas && app.canvas.canvas) {
                app.canvas.canvas.style.cursor = 'grabbing';
            }

            if (onMouseMove) {
                return onMouseMove.apply(this, arguments);
            }
            return false;
        };

        // Helper to reset all interaction states
        nodeType.prototype._resetInteractionState = function() {
            this.isDrawing = false;
            this.lastDrawPoint = null;
            this.isPanning = false;
            this._panStart = null;
            this.isMoving = false;
            this._moveStart = null;
            this.isResizing = false;
            this._resizeStart = null;
            this._resizeHandle = null;
            this.isRotating = false;
            this._rotateStartAngle = null;
            this._rotateTargetStartRotation = null;
            this._handlingCanvasInteraction = false;
            this._draggingBrushSlider = false;
            this._draggingFeatherSlider = false;
            this._draggingSV = false;
            this._draggingHue = false;
        };

        // Handle mouse up to stop drawing
        const onMouseUp = nodeType.prototype.onMouseUp;
        nodeType.prototype.onMouseUp = function(e, localPos, graphCanvas) {
            // Layer drag/drop is handled in _globalMouseUpHandler (runs first in capture phase)

            const wasInteracting = this.isDrawing || this.isPanning || this.isMoving || this.isResizing || this.isRotating || this._handlingCanvasInteraction || this._draggingBrushSlider || this._draggingFeatherSlider || this._draggingSV || this._draggingHue;

            // Bake sublayer transform after move/resize/rotate to commit pixels
            if ((this.isMoving || this.isResizing || this.isRotating) &&
                this.selectedSublayer !== null && this.layerManager) {
                this.layerManager.bakeSublayerTransform(this.selectedLayer, this.selectedSublayer);
            }

            // Finalize pending undo commands before resetting state
            this._finalizePendingCommand();

            this._resetInteractionState();

            if (wasInteracting) {
                this.setDirtyCanvas(true);
                return true;
            }

            if (onMouseUp) {
                return onMouseUp.apply(this, arguments);
            }
            return false;
        };

        // Also handle mouse leave to stop interactions
        const onMouseLeave = nodeType.prototype.onMouseLeave;
        nodeType.prototype.onMouseLeave = function(e) {
            // Reset layer drag state
            if (this._isDraggingLayerItem || this._dragStartPos) {
                this._isDraggingLayerItem = false;
                this._draggedItem = null;
                this._dragStartPos = null;
                this._dropTarget = null;
            }

            // Reset all interaction states when mouse leaves (to prevent stuck states)
            const wasInteracting = this.isDrawing || this.isPanning || this.isMoving || this.isResizing || this.isRotating || this._draggingBrushSlider || this._draggingFeatherSlider || this._draggingSV || this._draggingHue || this._handlingCanvasInteraction;
            if (wasInteracting) {
                // Finalize pending undo commands before resetting state
                this._finalizePendingCommand();
                this._resetInteractionState();
                this.setDirtyCanvas(true);
            }
            // Reset cursor when leaving the node
            if (app.canvas && app.canvas.canvas) {
                app.canvas.canvas.style.cursor = '';
            }
            if (onMouseLeave) {
                return onMouseLeave.apply(this, arguments);
            }
        };

        // Handle mouse wheel for zoom
        const onMouseWheel = nodeType.prototype.onMouseWheel;
        nodeType.prototype.onMouseWheel = function(e, localPos, graphCanvas) {
            if (this._isInCanvasArea(localPos)) {
                const delta = e.deltaY > 0 ? 0.9 : 1.1;
                this.viewZoom = Math.max(0.1, Math.min(5, (this.viewZoom || 1) * delta));
                this.setDirtyCanvas(true);
                return true;
            }

            if (onMouseWheel) {
                return onMouseWheel.apply(this, arguments);
            }
            return false;
        };

        // Handle keyboard shortcuts
        const onKeyDown = nodeType.prototype.onKeyDown;
        nodeType.prototype.onKeyDown = function(e) {
            const key = e.key.toLowerCase();

            // Undo/Redo shortcuts (Ctrl+Z / Cmd+Z, Ctrl+Y / Cmd+Y / Ctrl+Shift+Z / Cmd+Shift+Z)
            if ((e.ctrlKey || e.metaKey) && key === 'z' && !e.shiftKey) {
                e.preventDefault();
                e.stopPropagation();
                this.undo();
                return true;
            }
            if ((e.ctrlKey || e.metaKey) && (key === 'y' || (e.shiftKey && key === 'z'))) {
                e.preventDefault();
                e.stopPropagation();
                this.redo();
                return true;
            }

            // Tool shortcuts - only for enabled tools
            const toolShortcuts = {
                'b': 'brush', 'e': 'eraser', 'g': 'fill', 'h': 'hand'
            };

            if (toolShortcuts[key]) {
                this.selectedTool = toolShortcuts[key];
                this.setDirtyCanvas(true);
                return true;
            }

            // Brush size with [ and ]
            if (key === '[') {
                this.brushSize = Math.max(1, this.brushSize - 2);
                this.setDirtyCanvas(true);
                return true;
            }
            if (key === ']') {
                this.brushSize = Math.min(200, this.brushSize + 2);
                this.setDirtyCanvas(true);
                return true;
            }

            // Swap colors with X
            if (key === 'x') {
                const temp = this.foregroundColor;
                this.foregroundColor = this.backgroundColor;
                this.backgroundColor = temp;
                this.setDirtyCanvas(true);
                return true;
            }

            // Reset colors with D
            if (key === 'd') {
                this.foregroundColor = '#000000';
                this.backgroundColor = '#ffffff';
                this.setDirtyCanvas(true);
                return true;
            }

            if (onKeyDown) {
                return onKeyDown.apply(this, arguments);
            }
            return false;
        };

        // Method to paste image from clipboard or URL
        nodeType.prototype.pasteImage = async function(imageSource) {
            const self = this;

            const loadImage = (src) => {
                return new Promise((resolve, reject) => {
                    const img = new Image();
                    img.crossOrigin = 'anonymous';
                    img.onload = () => resolve(img);
                    img.onerror = reject;
                    img.src = src;
                });
            };

            try {
                let img;
                if (imageSource instanceof Blob) {
                    const url = URL.createObjectURL(imageSource);
                    img = await loadImage(url);
                    URL.revokeObjectURL(url);
                } else if (typeof imageSource === 'string') {
                    img = await loadImage(imageSource);
                } else if (imageSource instanceof HTMLImageElement) {
                    img = imageSource;
                } else {
                    console.warn('Unknown image source type');
                    return false;
                }

                // Check if image dimensions differ from canvas
                const imageDiffers = img.width !== this.canvasWidth || img.height !== this.canvasHeight;

                // Function to do the actual paste
                const doPaste = (resizeToImage) => {
                    if (resizeToImage) {
                        // Resize canvas to image dimensions
                        self.canvasWidth = img.width;
                        self.canvasHeight = img.height;
                        if (self.layerManager) {
                            self.layerManager.resize(img.width, img.height);
                        }
                        // Invalidate cached bounds to force recalculation on next draw
                        self._imageDrawBounds = null;
                    }

                    // Paste onto selected layer (centered if not resizing, or at 0,0 if resizing)
                    const x = resizeToImage ? 0 : Math.max(0, (self.canvasWidth - img.width) / 2);
                    const y = resizeToImage ? 0 : Math.max(0, (self.canvasHeight - img.height) / 2);

                    if (self.layerManager) {
                        self.layerManager.pasteImage(self.selectedLayer, img, x, y);
                        // Select the newly created sublayer (it's the last one in the array)
                        const sublayerCount = self.layerManager.getSublayerCount(self.selectedLayer);
                        if (sublayerCount > 0) {
                            self.selectedSublayer = sublayerCount - 1;
                            // Create undo command for paste
                            const layer = self.layerManager.getLayer(self.selectedLayer);
                            const sublayer = layer?.sublayers[self.selectedSublayer];
                            if (sublayer) {
                                self._pushCommand({
                                    type: 'paste',
                                    layerId: self.selectedLayer,
                                    sublayerIndex: self.selectedSublayer,
                                    after: {
                                        snapshot: self._cloneSublayer(sublayer)
                                    }
                                });
                            }
                        }
                        self.setDirtyCanvas(true);
                    }
                };

                // If image dimensions differ, show modal to ask user
                if (imageDiffers) {
                    // Remove existing modal if any
                    const existingModal = document.getElementById('trev-paste-modal');
                    if (existingModal) existingModal.remove();

                    // Create modal overlay
                    const overlay = document.createElement('div');
                    overlay.id = 'trev-paste-modal';
                    overlay.style.cssText = `
                        position: fixed;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        background: rgba(0, 0, 0, 0.6);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        z-index: 10000;
                        font-family: 'Segoe UI', Arial, sans-serif;
                    `;

                    // Create modal dialog
                    const modal = document.createElement('div');
                    modal.style.cssText = `
                        background: #2a2a2a;
                        border-radius: 8px;
                        padding: 20px;
                        min-width: 300px;
                        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
                        border: 1px solid #444;
                    `;

                    // Title
                    const title = document.createElement('h3');
                    title.textContent = 'Resize Canvas?';
                    title.style.cssText = `
                        margin: 0 0 12px 0;
                        color: #fff;
                        font-size: 16px;
                        font-weight: 500;
                    `;
                    modal.appendChild(title);

                    // Message
                    const message = document.createElement('p');
                    message.innerHTML = `Image size: <strong>${img.width} × ${img.height}</strong><br>Canvas size: <strong>${this.canvasWidth} × ${this.canvasHeight}</strong>`;
                    message.style.cssText = `
                        margin: 0 0 16px 0;
                        color: #aaa;
                        font-size: 13px;
                        line-height: 1.5;
                    `;
                    modal.appendChild(message);

                    // Button container
                    const btnContainer = document.createElement('div');
                    btnContainer.style.cssText = 'display: flex; gap: 8px; justify-content: flex-end;';

                    // No button (paste without resizing)
                    const noBtn = document.createElement('button');
                    noBtn.textContent = 'No';
                    noBtn.style.cssText = `
                        padding: 8px 16px;
                        background: #444;
                        border: none;
                        border-radius: 4px;
                        color: #fff;
                        font-size: 13px;
                        cursor: pointer;
                    `;
                    noBtn.onclick = () => {
                        overlay.remove();
                        doPaste(false);
                    };
                    btnContainer.appendChild(noBtn);

                    // Yes button (resize canvas)
                    const yesBtn = document.createElement('button');
                    yesBtn.textContent = 'Yes, Resize';
                    yesBtn.style.cssText = `
                        padding: 8px 16px;
                        background: #3d8eff;
                        border: none;
                        border-radius: 4px;
                        color: #fff;
                        font-size: 13px;
                        cursor: pointer;
                    `;
                    yesBtn.onclick = () => {
                        overlay.remove();
                        doPaste(true);
                    };
                    btnContainer.appendChild(yesBtn);

                    modal.appendChild(btnContainer);
                    overlay.appendChild(modal);

                    // Close on Escape key (paste without resizing)
                    const escHandler = (e) => {
                        if (e.key === 'Escape') {
                            overlay.remove();
                            doPaste(false);
                            document.removeEventListener('keydown', escHandler);
                        }
                    };
                    document.addEventListener('keydown', escHandler);

                    document.body.appendChild(overlay);
                } else {
                    // Same dimensions, just paste
                    doPaste(false);
                }

                return true;
            } catch (e) {
                console.error('Failed to paste image:', e);
            }
            return false;
        };

        // Method to paste image from clipboard (triggered by button click)
        nodeType.prototype.pasteFromClipboard = async function() {
            try {
                // Use the Clipboard API to read image from clipboard
                const clipboardItems = await navigator.clipboard.read();
                for (const item of clipboardItems) {
                    // Check for image types
                    const imageType = item.types.find(type => type.startsWith('image/'));
                    if (imageType) {
                        const blob = await item.getType(imageType);
                        await this.pasteImage(blob);
                        return true;
                    }
                }
                console.log('No image found in clipboard');
            } catch (e) {
                console.error('Failed to read clipboard:', e);
                // Fallback: prompt user to use Ctrl+V
                console.log('Try using Ctrl+V to paste, or ensure clipboard permissions are granted');
            }
            return false;
        };

        // Method to flip selected sublayer horizontally
        nodeType.prototype.flipHorizontal = function() {
            if (this.selectedTool !== 'move' || this.selectedSublayer === null || !this.layerManager) {
                return false;
            }

            const sublayer = this.layerManager.getSublayer(this.selectedLayer, this.selectedSublayer);
            if (!sublayer) return false;

            // Get the sublayer's canvas and create a flipped version
            const canvas = sublayer.canvas;
            const width = canvas.width;
            const height = canvas.height;

            // Create a temporary canvas to hold the flipped image
            let tempCanvas;
            if (typeof OffscreenCanvas !== 'undefined') {
                tempCanvas = new OffscreenCanvas(width, height);
            } else {
                tempCanvas = document.createElement('canvas');
                tempCanvas.width = width;
                tempCanvas.height = height;
            }
            const tempCtx = tempCanvas.getContext('2d');

            // Flip horizontally: scale(-1, 1) and translate
            tempCtx.translate(width, 0);
            tempCtx.scale(-1, 1);
            tempCtx.drawImage(canvas, 0, 0);

            // Clear original and draw flipped version
            sublayer.ctx.clearRect(0, 0, width, height);
            sublayer.ctx.drawImage(tempCanvas, 0, 0);

            // Mark layer for recomposite
            const layer = this.layerManager.getLayer(this.selectedLayer);
            if (layer) layer.needsRecomposite = true;

            this.setDirtyCanvas(true);
            return true;
        };

        // Method to flip selected sublayer vertically
        nodeType.prototype.flipVertical = function() {
            if (this.selectedTool !== 'move' || this.selectedSublayer === null || !this.layerManager) {
                return false;
            }

            const sublayer = this.layerManager.getSublayer(this.selectedLayer, this.selectedSublayer);
            if (!sublayer) return false;

            // Get the sublayer's canvas and create a flipped version
            const canvas = sublayer.canvas;
            const width = canvas.width;
            const height = canvas.height;

            // Create a temporary canvas to hold the flipped image
            let tempCanvas;
            if (typeof OffscreenCanvas !== 'undefined') {
                tempCanvas = new OffscreenCanvas(width, height);
            } else {
                tempCanvas = document.createElement('canvas');
                tempCanvas.width = width;
                tempCanvas.height = height;
            }
            const tempCtx = tempCanvas.getContext('2d');

            // Flip vertically: scale(1, -1) and translate
            tempCtx.translate(0, height);
            tempCtx.scale(1, -1);
            tempCtx.drawImage(canvas, 0, 0);

            // Clear original and draw flipped version
            sublayer.ctx.clearRect(0, 0, width, height);
            sublayer.ctx.drawImage(tempCanvas, 0, 0);

            // Mark layer for recomposite
            const layer = this.layerManager.getLayer(this.selectedLayer);
            if (layer) layer.needsRecomposite = true;

            this.setDirtyCanvas(true);
            return true;
        };

        // Method to show resize modal
        nodeType.prototype.showResizeModal = function() {
            // Remove existing modal if any
            const existingModal = document.getElementById('trev-resize-modal');
            if (existingModal) existingModal.remove();

            const self = this;

            // Common aspect ratios (orientation is handled separately)
            const ratios = [
                { name: '1:1 (Square)', w: 1, h: 1 },
                { name: '4:3', w: 4, h: 3 },
                { name: '3:2', w: 3, h: 2 },
                { name: '16:9', w: 16, h: 9 },
                { name: '16:10', w: 16, h: 10 },
                { name: '21:9 (Ultrawide)', w: 21, h: 9 }
            ];

            // Size presets (widths)
            const sizes = [500, 1000, 1500, 2000, 2500, 3000, 4000];

            // Track current state
            let currentOrientation = 'landscape';
            let currentRatioIdx = 0;
            let currentSizeIdx = 1; // 1000px default

            const selectStyle = `
                width: 100%;
                padding: 8px;
                margin-bottom: 12px;
                background: #1a1a1a;
                border: 1px solid #444;
                border-radius: 4px;
                color: #fff;
                font-size: 14px;
                box-sizing: border-box;
                cursor: pointer;
            `;

            const labelStyle = 'display: block; color: #aaa; font-size: 12px; margin-bottom: 4px;';

            // Calculate dimensions based on current selections
            const calcDimensions = () => {
                const ratio = ratios[currentRatioIdx];
                const baseWidth = sizes[currentSizeIdx];
                let w, h;

                if (currentOrientation === 'landscape') {
                    w = baseWidth;
                    h = Math.round(baseWidth * ratio.h / ratio.w);
                } else {
                    h = baseWidth;
                    w = Math.round(baseWidth * ratio.h / ratio.w);
                }
                return { w, h };
            };

            // Update preview text
            const updatePreview = () => {
                const dims = calcDimensions();
                previewText.textContent = `${dims.w} × ${dims.h} px`;
            };

            // Create modal overlay
            const overlay = document.createElement('div');
            overlay.id = 'trev-resize-modal';
            overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.6);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                font-family: 'Segoe UI', Arial, sans-serif;
            `;

            // Create modal dialog
            const modal = document.createElement('div');
            modal.style.cssText = `
                background: #2a2a2a;
                border-radius: 8px;
                padding: 20px;
                min-width: 280px;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
                border: 1px solid #444;
            `;

            // Title
            const title = document.createElement('h3');
            title.textContent = 'Canvas Size';
            title.style.cssText = `
                margin: 0 0 16px 0;
                color: #fff;
                font-size: 16px;
                font-weight: 500;
            `;
            modal.appendChild(title);

            // Orientation dropdown
            const orientLabel = document.createElement('label');
            orientLabel.style.cssText = labelStyle;
            orientLabel.textContent = 'Orientation';
            modal.appendChild(orientLabel);

            const orientSelect = document.createElement('select');
            orientSelect.style.cssText = selectStyle;
            orientSelect.innerHTML = `
                <option value="landscape">Landscape</option>
                <option value="portrait">Portrait</option>
            `;
            orientSelect.onchange = () => {
                currentOrientation = orientSelect.value;
                updatePreview();
            };
            modal.appendChild(orientSelect);

            // Ratio dropdown
            const ratioLabel = document.createElement('label');
            ratioLabel.style.cssText = labelStyle;
            ratioLabel.textContent = 'Aspect Ratio';
            modal.appendChild(ratioLabel);

            const ratioSelect = document.createElement('select');
            ratioSelect.style.cssText = selectStyle;
            ratios.forEach((r, i) => {
                const opt = document.createElement('option');
                opt.value = i;
                opt.textContent = r.name;
                ratioSelect.appendChild(opt);
            });
            ratioSelect.onchange = () => {
                currentRatioIdx = parseInt(ratioSelect.value);
                updatePreview();
            };
            modal.appendChild(ratioSelect);

            // Size dropdown
            const sizeLabel = document.createElement('label');
            sizeLabel.style.cssText = labelStyle;
            sizeLabel.textContent = 'Size (Width)';
            modal.appendChild(sizeLabel);

            const sizeSelect = document.createElement('select');
            sizeSelect.style.cssText = selectStyle;
            sizes.forEach((s, i) => {
                const opt = document.createElement('option');
                opt.value = i;
                opt.textContent = `${s}px`;
                if (i === currentSizeIdx) opt.selected = true;
                sizeSelect.appendChild(opt);
            });
            sizeSelect.onchange = () => {
                currentSizeIdx = parseInt(sizeSelect.value);
                updatePreview();
            };
            modal.appendChild(sizeSelect);

            // Preview text
            const previewText = document.createElement('div');
            previewText.style.cssText = `
                text-align: center;
                color: #3d8eff;
                font-size: 18px;
                font-weight: 500;
                margin: 16px 0;
                padding: 12px;
                background: #1a1a1a;
                border-radius: 4px;
            `;
            modal.appendChild(previewText);

            // Initialize preview
            updatePreview();

            // Button container
            const btnContainer = document.createElement('div');
            btnContainer.style.cssText = 'display: flex; gap: 8px; justify-content: flex-end;';

            // Cancel button
            const cancelBtn = document.createElement('button');
            cancelBtn.textContent = 'Cancel';
            cancelBtn.style.cssText = `
                padding: 8px 16px;
                background: #444;
                border: none;
                border-radius: 4px;
                color: #fff;
                font-size: 13px;
                cursor: pointer;
            `;
            cancelBtn.onclick = () => overlay.remove();
            btnContainer.appendChild(cancelBtn);

            // Apply button
            const applyBtn = document.createElement('button');
            applyBtn.textContent = 'Apply';
            applyBtn.style.cssText = `
                padding: 8px 16px;
                background: #3d8eff;
                border: none;
                border-radius: 4px;
                color: #fff;
                font-size: 13px;
                cursor: pointer;
            `;
            applyBtn.onclick = () => {
                const dims = calcDimensions();

                // Close modal immediately
                overlay.remove();

                if (dims.w > 0 && dims.h > 0 && dims.w <= 8192 && dims.h <= 8192) {
                    self.canvasWidth = dims.w;
                    self.canvasHeight = dims.h;
                    if (self.layerManager) {
                        self.layerManager.resize(dims.w, dims.h);
                    }
                    // Invalidate cached bounds to force recalculation on next draw
                    self._imageDrawBounds = null;
                    self.setDirtyCanvas(true);
                }
            };
            btnContainer.appendChild(applyBtn);

            modal.appendChild(btnContainer);
            overlay.appendChild(modal);

            // Close on overlay click
            overlay.onclick = (e) => {
                if (e.target === overlay) overlay.remove();
            };

            // Close on Escape key
            const escHandler = (e) => {
                if (e.key === 'Escape') {
                    overlay.remove();
                    document.removeEventListener('keydown', escHandler);
                }
            };
            document.addEventListener('keydown', escHandler);

            document.body.appendChild(overlay);
        };

        // Method to load image from file
        nodeType.prototype.loadImageFile = function(file) {
            if (!file || !file.type.startsWith('image/')) return;

            const reader = new FileReader();
            reader.onload = (e) => {
                this.pasteImage(e.target.result);
            };
            reader.readAsDataURL(file);
        };

        // Setup clipboard paste listener when node is selected
        const onSelected = nodeType.prototype.onSelected;
        nodeType.prototype.onSelected = function() {
            if (onSelected) onSelected.apply(this, arguments);

            // Store reference for paste handler
            const self = this;
            this._pasteHandler = async (e) => {
                if (!e.clipboardData) return;

                // Check for image in clipboard
                const items = e.clipboardData.items;
                for (const item of items) {
                    if (item.type.startsWith('image/')) {
                        e.preventDefault();
                        const blob = item.getAsFile();
                        if (blob) {
                            await self.pasteImage(blob);
                        }
                        return;
                    }
                }
            };

            document.addEventListener('paste', this._pasteHandler);
        };

        // Remove paste listener when deselected
        const onDeselected = nodeType.prototype.onDeselected;
        nodeType.prototype.onDeselected = function() {
            if (onDeselected) onDeselected.apply(this, arguments);

            if (this._pasteHandler) {
                document.removeEventListener('paste', this._pasteHandler);
                this._pasteHandler = null;
            }
        };

        // Handle file drop onto node
        const onDropFile = nodeType.prototype.onDropFile;
        nodeType.prototype.onDropFile = function(file) {
            if (file && file.type.startsWith('image/')) {
                this.loadImageFile(file);
                return true;
            }

            if (onDropFile) {
                return onDropFile.apply(this, arguments);
            }
            return false;
        };

        // Method to export canvas as image
        nodeType.prototype.exportImage = function(format = 'image/png', quality = 0.92) {
            if (!this.layerManager) return null;

            const compositeCanvas = this.layerManager.composite(this.layers);

            // Create a regular canvas if needed (for toDataURL)
            let exportCanvas;
            if (compositeCanvas.toDataURL) {
                exportCanvas = compositeCanvas;
            } else {
                exportCanvas = document.createElement('canvas');
                exportCanvas.width = this.canvasWidth;
                exportCanvas.height = this.canvasHeight;
                const ctx = exportCanvas.getContext('2d');
                ctx.drawImage(compositeCanvas, 0, 0);
            }

            return exportCanvas.toDataURL(format, quality);
        };

        // Method to clear current layer
        nodeType.prototype.clearCurrentLayer = function() {
            const currentLayer = this.layers.find(l => l.id === this.selectedLayer);
            if (currentLayer && !currentLayer.locked && this.layerManager) {
                this.layerManager.clearLayer(this.selectedLayer);
                this.setDirtyCanvas(true);
            }
        };

        // Serialize node state for saving in workflow
        const onSerialize = nodeType.prototype.onSerialize;
        nodeType.prototype.onSerialize = function(o) {
            if (onSerialize) {
                onSerialize.apply(this, arguments);
            }

            // Save canvas dimensions
            o.canvasWidth = this.canvasWidth;
            o.canvasHeight = this.canvasHeight;

            // Save tool settings
            o.selectedTool = this.selectedTool;
            o.foregroundColor = this.foregroundColor;
            o.backgroundColor = this.backgroundColor;
            o.brushSize = this.brushSize;
            o.brushFeather = this.brushFeather;

            // Save view state
            o.viewOffsetX = this.viewOffsetX;
            o.viewOffsetY = this.viewOffsetY;
            o.viewZoom = this.viewZoom;

            // Save layers metadata
            o.layers = this.layers;
            o.selectedLayer = this.selectedLayer;
            o.selectedSublayer = this.selectedSublayer;
            o.expandedLayers = Array.from(this.expandedLayers || []);

            // Save layer image data from layerManager
            if (this.layerManager) {
                o.layerData = {};
                for (const layer of this.layers) {
                    const layerObj = this.layerManager.getLayer(layer.id);
                    if (layerObj && layerObj.sublayers) {
                        o.layerData[layer.id] = {
                            sublayers: layerObj.sublayers.map(sl => ({
                                x: sl.x,
                                y: sl.y,
                                scaleX: sl.scaleX,
                                scaleY: sl.scaleY,
                                rotation: sl.rotation,
                                visible: sl.visible,
                                opacity: sl.opacity,
                                // Save canvas as base64 PNG (with safety check)
                                imageData: sl.canvas && typeof sl.canvas.toDataURL === 'function'
                                    ? sl.canvas.toDataURL('image/png')
                                    : null
                            }))
                        };
                    }
                }
            }
        };

        // Restore node state when loading workflow
        const onConfigure = nodeType.prototype.onConfigure;
        nodeType.prototype.onConfigure = function(info) {
            if (onConfigure) {
                onConfigure.apply(this, arguments);
            }

            // Restore canvas dimensions
            if (info.canvasWidth && info.canvasHeight) {
                this.canvasWidth = info.canvasWidth;
                this.canvasHeight = info.canvasHeight;
            }

            // Restore tool settings
            if (info.selectedTool) this.selectedTool = info.selectedTool;
            if (info.foregroundColor) this.foregroundColor = info.foregroundColor;
            if (info.backgroundColor) this.backgroundColor = info.backgroundColor;
            if (info.brushSize !== undefined) this.brushSize = info.brushSize;
            if (info.brushFeather !== undefined) this.brushFeather = info.brushFeather;

            // Restore view state
            if (info.viewOffsetX !== undefined) this.viewOffsetX = info.viewOffsetX;
            if (info.viewOffsetY !== undefined) this.viewOffsetY = info.viewOffsetY;
            if (info.viewZoom !== undefined) this.viewZoom = info.viewZoom;

            // Restore layers metadata
            if (info.layers) this.layers = info.layers;
            if (info.selectedLayer !== undefined) this.selectedLayer = info.selectedLayer;
            if (info.selectedSublayer !== undefined) this.selectedSublayer = info.selectedSublayer;
            if (info.expandedLayers) this.expandedLayers = new Set(info.expandedLayers);

            // Reinitialize layer manager with correct dimensions
            if (this.layerManager) {
                this.layerManager.resize(this.canvasWidth, this.canvasHeight);
            } else {
                this.layerManager = new LayerManager(this.canvasWidth, this.canvasHeight);
                this.drawingTools = new DrawingTools(this.layerManager);
            }

            // Restore layer image data
            if (info.layerData) {
                const self = this;

                // Create layers first
                for (const layer of this.layers) {
                    if (!this.layerManager.getLayer(layer.id)) {
                        this.layerManager.createLayer(layer.id);
                    }
                }

                // Load sublayer images
                for (const layerId in info.layerData) {
                    const layerInfo = info.layerData[layerId];
                    const layerObj = this.layerManager.getLayer(parseInt(layerId));

                    if (layerObj && layerInfo.sublayers) {
                        // Clear existing sublayers
                        layerObj.sublayers = [];

                        // Load each sublayer
                        layerInfo.sublayers.forEach((slData, index) => {
                            const img = new Image();
                            img.onload = function() {
                                // Create sublayer with the loaded image
                                const sublayer = new Sublayer(self.canvasWidth, self.canvasHeight);
                                sublayer.x = slData.x || 0;
                                sublayer.y = slData.y || 0;
                                sublayer.scaleX = slData.scaleX || 1;
                                sublayer.scaleY = slData.scaleY || 1;
                                sublayer.rotation = slData.rotation || 0;
                                sublayer.visible = slData.visible !== false;
                                sublayer.opacity = slData.opacity !== undefined ? slData.opacity : 100;

                                // Draw image onto sublayer canvas
                                sublayer.ctx.drawImage(img, 0, 0);

                                // Add to layer
                                layerObj.sublayers[index] = sublayer;
                                layerObj.needsRecomposite = true;

                                self.setDirtyCanvas(true);
                            };
                            img.src = slData.imageData;
                        });
                    }
                }
            }

            this.setDirtyCanvas(true);
        };
    }
});
