# TrevTasticNodes

A collection of custom nodes for [ComfyUI](https://github.com/comfyanonymous/ComfyUI).

## Installation

1. Navigate to your ComfyUI custom nodes folder:
   ```bash
   cd ComfyUI/custom_nodes
   ```

2. Clone this repository:
   ```bash
   git clone https://github.com/trevelyen/TrevTasticNodes.git
   ```

3. Restart ComfyUI

## Nodes

### Trev Image Resizer
Resize images and latents with preset resolutions or custom dimensions.

- **Preset resolutions**: 4K, 1440p, 1080p, 720p, and more
- **Portrait mode**: Swap width/height for vertical images
- **Custom dimensions**: Set exact pixel sizes
- **Multiplier mode**: Scale by a factor (0.1x to 4x)
- **Bypass option**: Pass through inputs unchanged
- **Latent size presets**: Common SDXL/Flux latent dimensions

### Trev Photoshop
A full-featured painting node with Photoshop-style editing capabilities.

- **Layer system**: Multiple layers with visibility, opacity, and lock controls
- **Sublayers**: Non-destructive stroke organization within layers
- **Drawing tools**: Brush, eraser, and fill bucket
- **Brush settings**: Adjustable size and feather
- **Color picker**: HSV color selection with foreground/background colors
- **Transform tools**: Move, resize, and rotate content
- **Zoom & pan**: Navigate large canvases
- **Undo/Redo**: Full history support
- **Outputs**: IMAGE and MASK tensors

### Trev Route
A routing node that forwards one of multiple inputs to the output.

- **Multiple inputs**: Up to 10 input slots (any type)
- **Selector**: Choose which input to forward
- **Index output**: Outputs the selected index as INT
- **Universal type**: Works with any data type (images, latents, models, etc.)

### Trev Inverse Route
The opposite of Trev Route - sends a single input to one of multiple outputs.

- **Single input**: Accepts any type
- **Multiple outputs**: Up to 10 output slots
- **Selector**: Choose which output receives the data
- **Index output**: Outputs the selected index as INT

### Trev Slider
A customizable slider widget for parameter control.

- **Configurable range**: Set min, max, and step values
- **Custom label**: Name your slider
- **INT/FLOAT output**: Toggle between integer and float modes
- **Right-click settings**: Easy configuration via context menu

### Trev Model Chooser
A simple model selector that outputs an index.

- **Add/remove models**: Dynamic model list
- **Rename models**: Custom names for each entry
- **Index output**: Returns the selected model index (1-based)

### Trev Claude AI
Chat with Claude about your ComfyUI workflow.

- **Workflow awareness**: Claude can see your entire workflow structure
- **Interactive chat**: Ask questions and get suggestions
- **Markdown support**: Formatted responses with code blocks

**Requirements**: Set `ANTHROPIC_API_KEY` environment variable and install the Anthropic SDK:
```bash
pip install anthropic
```

## License

MIT License - feel free to use, modify, and distribute.

## Contributing

Issues and pull requests are welcome!
