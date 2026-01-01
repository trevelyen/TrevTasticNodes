import torch
import torch.nn.functional as F
import json
import os
from server import PromptServer
from aiohttp import web

# Web directory for frontend JavaScript
WEB_DIRECTORY = "./web"

# Try to import anthropic, will gracefully fail if not installed
try:
    import anthropic
    ANTHROPIC_AVAILABLE = True
except ImportError:
    ANTHROPIC_AVAILABLE = False

# Store for Claude conversation state
CLAUDE_SESSIONS = {}


class TrevImageResizer:
    """
    A simple node to resize images to preset or custom resolutions.
    """

    # Common landscape resolutions (width x height) - descending by size
    RESOLUTIONS = [
        "3840x2160 (4K)",
        "2560x1440 (1440p)",
        "1920x1080 (1080p)",
        "1536x1024 (3:2)",
        "1360x768 (16:9)",
        "1344x896 (3:2)",
        "1280x768 (5:3)",
        "1280x720 (720p)",
        "1216x832 (3:2)",
        "1152x896 (4:3)",
        "1024x768 (4:3)",
        "1024x576 (16:9)",
        "Custom",
    ]

    LATENT_SIZES = [
        "From Latent Input",
        "1024x1024 (1:1)",
        "1152x864 (4:3)",
        "1216x832 (3:2)",
        "1344x768 (16:9)",
        "1536x640 (21:9)",
    ]

    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
                "latent_size": (cls.LATENT_SIZES, {"default": "From Latent Input"}),
                "latent_portrait": ("BOOLEAN", {"default": False}),
                "bypass_resizing": ("BOOLEAN", {"default": False}),
                "multiplier": ("FLOAT", {"default": 1.0, "min": 0.1, "max": 4.0, "step": 0.1, "display": "slider"}),
                "use_custom_size": ("BOOLEAN", {"default": False}),
                "portrait_mode": ("BOOLEAN", {"default": False}),
                "resolution": (cls.RESOLUTIONS, {"default": "1920x1080 (1080p)"}),
                "custom_width": ("INT", {"default": 1024, "min": 64, "max": 8192, "step": 8}),
                "custom_height": ("INT", {"default": 1024, "min": 64, "max": 8192, "step": 8}),
            },
            "optional": {
                "image": ("IMAGE",),
                "latent": ("LATENT",),
            }
        }

    RETURN_TYPES = ("IMAGE", "LATENT")
    RETURN_NAMES = ("image", "latent")
    FUNCTION = "resize_image"
    CATEGORY = "TrevTastic Nodes/image"
    DESCRIPTION = "Resize images and/or latents by multiplier or preset/custom resolutions."

    def resize_image(self, latent_size, latent_portrait, bypass_resizing, multiplier, use_custom_size, portrait_mode, resolution, custom_width, custom_height, image=None, latent=None):
        # Bypass mode - pass through inputs unchanged
        if bypass_resizing:
            if latent is not None:
                output_latent = latent
            else:
                # Determine latent dimensions from latent_size dropdown
                if latent_size == "From Latent Input":
                    lat_w, lat_h = 128, 128  # Default 1024x1024 if no latent provided
                else:
                    # Parse "1024x1024 (1:1)" format - extract just the dimensions
                    size_part = latent_size.split(" ")[0]
                    w, h = map(int, size_part.split("x"))
                    if latent_portrait:
                        w, h = h, w
                    lat_w, lat_h = w // 8, h // 8
                output_latent = {"samples": torch.zeros([1, 4, lat_h, lat_w])}
            return (image, output_latent)

        # Determine target size
        if use_custom_size:
            if resolution == "Custom":
                target_width = custom_width
                target_height = custom_height
            else:
                res_part = resolution.split(" ")[0]
                target_width, target_height = map(int, res_part.split("x"))
                if portrait_mode:
                    target_width, target_height = target_height, target_width
        else:
            # Apply multiplier - need a reference size
            if image is not None:
                _, img_height, img_width, _ = image.shape
                target_width = int(img_width * multiplier)
                target_height = int(img_height * multiplier)
            elif latent is not None:
                _, _, lat_h, lat_w = latent["samples"].shape
                target_width = int(lat_w * 8 * multiplier)
                target_height = int(lat_h * 8 * multiplier)
            else:
                # Default to 1024x1024 if no inputs
                target_width = int(1024 * multiplier)
                target_height = int(1024 * multiplier)

        # Ensure minimum size
        target_width = max(8, target_width)
        target_height = max(8, target_height)

        # Resize image if provided
        resized_image = None
        if image is not None:
            image_permuted = image.permute(0, 3, 1, 2)
            resized = F.interpolate(image_permuted, size=(target_height, target_width), mode="bicubic", align_corners=False)
            resized_image = resized.permute(0, 2, 3, 1)

        # Resize or create latent
        latent_width = target_width // 8
        latent_height = target_height // 8
        if latent is not None:
            resized_samples = F.interpolate(latent["samples"], size=(latent_height, latent_width), mode="bicubic", align_corners=False)
            resized_latent = {"samples": resized_samples}
        else:
            # Create empty latent at target size
            resized_latent = {"samples": torch.zeros([1, 4, latent_height, latent_width])}

        return (resized_image, resized_latent)


class TrevModelChooser:
    """
    A simple model chooser that outputs an integer index.
    Models can be added and renamed via the UI.
    """

    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
                "selected_model": ("INT", {"default": 1, "min": 1, "max": 100, "step": 1}),
                "model_names": ("STRING", {"default": "Model 1", "multiline": False}),
            },
        }

    RETURN_TYPES = ("INT",)
    RETURN_NAMES = ("model_index",)
    FUNCTION = "choose_model"
    CATEGORY = "TrevTastic Nodes/utils"
    DESCRIPTION = "Select a model by index. Add and rename models via the UI."

    def choose_model(self, selected_model, model_names="Model 1"):
        return (selected_model,)


class TrevSlider:
    """
    A customizable slider node with configurable min/max/step values.
    Right-click to access slider settings.
    """

    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
                "value": ("FLOAT", {"default": 0.5, "min": -1000000, "max": 1000000, "step": 0.01}),
            },
        }

    RETURN_TYPES = ("FLOAT",)
    RETURN_NAMES = ("value",)
    FUNCTION = "get_value"
    CATEGORY = "TrevTastic Nodes/utils"
    DESCRIPTION = "A customizable slider. Right-click to configure min, max, step, and label."

    def get_value(self, value):
        return (value,)


class TrevPhotoshop:
    """
    A Photoshop-style painting node with layers, brushes, and full editing capabilities.
    Outputs the canvas as IMAGE and MASK tensors.
    """

    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {},
            "hidden": {
                "unique_id": "UNIQUE_ID",
            },
        }

    RETURN_TYPES = ("IMAGE", "MASK")
    RETURN_NAMES = ("image", "mask")
    FUNCTION = "process"
    CATEGORY = "TrevTastic Nodes"
    OUTPUT_NODE = False

    def process(self, unique_id):
        import numpy as np
        from PIL import Image
        import base64
        from io import BytesIO

        # Get canvas data from the global store
        canvas_data = PHOTOSHOP_CANVAS_DATA.get(unique_id)

        if canvas_data is None:
            # Return empty 512x512 image if no canvas data
            empty_image = torch.zeros([1, 512, 512, 3], dtype=torch.float32)
            empty_mask = torch.zeros([1, 512, 512], dtype=torch.float32)
            return (empty_image, empty_mask)

        try:
            # Decode base64 image data
            if canvas_data.startswith('data:image'):
                # Remove data URL prefix
                header, base64_data = canvas_data.split(',', 1)
            else:
                base64_data = canvas_data

            image_bytes = base64.b64decode(base64_data)
            img = Image.open(BytesIO(image_bytes))

            # Convert to RGBA if not already
            if img.mode != 'RGBA':
                img = img.convert('RGBA')

            # Split into RGB and Alpha
            r, g, b, a = img.split()
            rgb_img = Image.merge('RGB', (r, g, b))

            # Convert RGB to tensor (IMAGE format: [batch, height, width, channels])
            rgb_array = np.array(rgb_img).astype(np.float32) / 255.0
            image_tensor = torch.from_numpy(rgb_array)[None,]

            # Convert Alpha to mask tensor (MASK format: [batch, height, width])
            # In ComfyUI, mask is typically inverted (1 = masked/transparent, 0 = visible)
            alpha_array = np.array(a).astype(np.float32) / 255.0
            mask_tensor = torch.from_numpy(1.0 - alpha_array)[None,]

            return (image_tensor, mask_tensor)

        except Exception as e:
            print(f"TrevPhotoshop: Error processing canvas data: {e}")
            # Return empty image on error
            empty_image = torch.zeros([1, 512, 512, 3], dtype=torch.float32)
            empty_mask = torch.zeros([1, 512, 512], dtype=torch.float32)
            return (empty_image, empty_mask)

    @classmethod
    def IS_CHANGED(cls, unique_id):
        # Always re-execute to get fresh canvas data
        import time
        return time.time()


# Global store for photoshop canvas data
PHOTOSHOP_CANVAS_DATA = {}


# API endpoint to receive canvas data from frontend
@PromptServer.instance.routes.post("/trevphotoshop/canvas_data")
async def receive_canvas_data(request):
    try:
        data = await request.json()
        unique_id = data.get("unique_id")
        canvas_data = data.get("canvas_data")

        if unique_id and canvas_data:
            PHOTOSHOP_CANVAS_DATA[unique_id] = canvas_data
            return web.json_response({"status": "ok"}, status=200)
        else:
            return web.json_response({"error": "Missing unique_id or canvas_data"}, status=400)

    except Exception as e:
        return web.json_response({"error": str(e)}, status=500)


class AnyType(str):
    """A special type that matches any other type in ComfyUI's type system."""
    def __eq__(self, _):
        return True

    def __ne__(self, _):
        return False

    def __hash__(self):
        return hash("*")


# Singleton instance for use in type definitions
ANY_TYPE = AnyType("*")


class TrevRoute:
    """
    A routing node that accepts multiple inputs and forwards the selected one to the output.
    Use the selector to choose which input to route. Add more inputs as needed.
    """

    MAX_INPUTS = 10

    @classmethod
    def INPUT_TYPES(cls):
        inputs = {
            "required": {
                "selected": ("INT", {"default": 1, "min": 1, "max": cls.MAX_INPUTS, "step": 1}),
            },
            "optional": {},
        }
        # Add optional inputs dynamically with lazy=True so we can choose which to evaluate
        for i in range(1, cls.MAX_INPUTS + 1):
            inputs["optional"][f"input_{i}"] = (ANY_TYPE, {"lazy": True})
        return inputs

    RETURN_TYPES = (ANY_TYPE, "INT")
    RETURN_NAMES = ("output", "index")
    FUNCTION = "route"
    CATEGORY = "TrevTastic Nodes/utils"
    DESCRIPTION = "Route node: select which input to forward to the output. Also outputs the selected index."

    def check_lazy_status(self, selected, **kwargs):
        """Only request evaluation of the selected input."""
        print(f"[TrevRoute] check_lazy_status: selected={selected}, kwargs keys={list(kwargs.keys())}")
        input_key = f"input_{selected}"
        # If selected input is connected but not yet evaluated (None), request it
        if input_key in kwargs and kwargs[input_key] is None:
            print(f"[TrevRoute] Requesting lazy eval of {input_key}")
            return [input_key]
        # If selected input not in kwargs (not connected), find first connected input
        if input_key not in kwargs:
            print(f"[TrevRoute] {input_key} not in kwargs, searching for first connected...")
            for i in range(1, self.MAX_INPUTS + 1):
                key = f"input_{i}"
                if key in kwargs:
                    if kwargs[key] is None:
                        print(f"[TrevRoute] Found {key}, requesting lazy eval")
                        return [key]
                    break
        print(f"[TrevRoute] No lazy inputs needed")
        return []

    def route(self, selected, **kwargs):
        print(f"[TrevRoute] route: selected={selected}, kwargs={list(kwargs.keys())}")
        for k, v in kwargs.items():
            print(f"[TrevRoute]   {k}: {type(v).__name__} = {v is not None}")
        # Get the selected input
        input_key = f"input_{selected}"
        if input_key in kwargs and kwargs[input_key] is not None:
            print(f"[TrevRoute] Returning {input_key}")
            return (kwargs[input_key], selected)
        # If selected input not connected, try to find first connected input
        for i in range(1, self.MAX_INPUTS + 1):
            key = f"input_{i}"
            if key in kwargs and kwargs[key] is not None:
                print(f"[TrevRoute] Fallback to {key}")
                return (kwargs[key], i)
        # Return None if nothing connected
        print(f"[TrevRoute] WARNING: No valid input found!")
        return (None, selected)


class TrevInverseRoute:
    """
    Inverse routing node: takes a single input and routes it to one of multiple outputs.
    Use the selector to choose which output receives the data.
    """

    MAX_OUTPUTS = 10

    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
                "selected": ("INT", {"default": 1, "min": 1, "max": cls.MAX_OUTPUTS, "step": 1}),
            },
            "optional": {
                "input": (ANY_TYPE, {"lazy": True}),
            },
        }

    RETURN_TYPES = tuple([ANY_TYPE] * MAX_OUTPUTS + ["INT"])
    RETURN_NAMES = tuple([f"output_{i}" for i in range(1, MAX_OUTPUTS + 1)] + ["index"])
    FUNCTION = "route"
    CATEGORY = "TrevTastic Nodes/utils"
    DESCRIPTION = "Inverse route node: send a single input to one of multiple outputs based on selection."

    def check_lazy_status(self, selected, input=None):
        """Request the input to be evaluated."""
        print(f"[TrevInverseRoute] check_lazy_status: selected={selected}, input is None={input is None}")
        if input is None:
            return ["input"]
        return []

    def route(self, selected, input=None):
        print(f"[TrevInverseRoute] route: selected={selected}, input type={type(input).__name__}, input is None={input is None}")
        # Create output tuple with None for all except selected
        outputs = []
        for i in range(1, self.MAX_OUTPUTS + 1):
            if i == selected:
                outputs.append(input)
            else:
                outputs.append(None)
        outputs.append(selected)  # Add the index output
        print(f"[TrevInverseRoute] Sending data to output_{selected} (slot index {selected-1})")
        return tuple(outputs)


class TrevClaude:
    """
    A Claude AI assistant node that can see and help with ComfyUI workflows.
    Sends the current workflow context to Claude CLI for intelligent assistance.
    """

    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
                "prompt": ("STRING", {"default": "", "multiline": True}),
            },
            "hidden": {
                "unique_id": "UNIQUE_ID",
            },
        }

    RETURN_TYPES = ("STRING",)
    RETURN_NAMES = ("response",)
    FUNCTION = "ask_claude"
    CATEGORY = "TrevTastic Nodes/AI"
    DESCRIPTION = "Ask Claude AI for help with your ComfyUI workflow. Claude can see the workflow structure."
    OUTPUT_NODE = True

    def ask_claude(self, prompt, unique_id):
        # This is a placeholder - actual Claude interaction happens via the API endpoint
        # The frontend will handle sending workflow + prompt to Claude
        return (f"Use the chat interface in the node to interact with Claude.",)


# API endpoint to send message to Claude API
@PromptServer.instance.routes.post("/trevclaude/send")
async def claude_send_message(request):
    try:
        if not ANTHROPIC_AVAILABLE:
            return web.json_response({
                "response": "Error: Anthropic SDK not installed. Run: pip install anthropic"
            }, status=200)

        data = await request.json()
        prompt = data.get("prompt", "")
        workflow = data.get("workflow", {})
        node_id = data.get("node_id", "default")

        # Check for API key
        api_key = os.environ.get("ANTHROPIC_API_KEY")
        if not api_key:
            return web.json_response({
                "response": "Error: ANTHROPIC_API_KEY environment variable not set."
            }, status=200)

        # Format the context for Claude
        workflow_json = json.dumps(workflow, indent=2)

        # Truncate workflow if too large (keep under ~100k tokens)
        if len(workflow_json) > 200000:
            workflow_json = workflow_json[:200000] + "\n... (truncated)"

        system_prompt = """You are a helpful ComfyUI workflow assistant. You can see the user's current workflow structure.

## RESPONSE FORMAT - ALWAYS USE THIS STRUCTURE
When referencing ANY node, use this exact format:
**Node Title** (ID: X) | Class: ClassName
- Inputs: input_name → connected_from (node_id:slot) or value
- Outputs: output_name → connected_to (node_id:slot)
- Widgets: widget_name = current_value

When suggesting changes or new nodes:
- Node to add: ExactClassName
- Connect: (source_node_id:output_slot) → (target_node_id:input_slot)
- Set widget: node_id.widget_name = value

Be concise. NO vague English descriptions. ALWAYS provide exact node class names, node IDs, slot indices, widget names, and values."""

        user_message = f"""Here is my current ComfyUI workflow:

```json
{workflow_json}
```

{prompt}"""

        try:
            client = anthropic.Anthropic(api_key=api_key)

            message = client.messages.create(
                model="claude-sonnet-4-20250514",
                max_tokens=1024,
                system=system_prompt,
                messages=[
                    {"role": "user", "content": user_message}
                ]
            )

            response = message.content[0].text

        except anthropic.APIError as e:
            response = f"API Error: {str(e)}"
        except Exception as e:
            response = f"Error: {str(e)}"

        return web.json_response({"response": response}, status=200)

    except Exception as e:
        return web.json_response({"error": str(e)}, status=500)


# API endpoint to check status
@PromptServer.instance.routes.get("/trevclaude/status")
async def get_status(request):
    return web.json_response({
        "anthropic_available": ANTHROPIC_AVAILABLE,
        "api_key_set": bool(os.environ.get("ANTHROPIC_API_KEY"))
    }, status=200)


NODE_CLASS_MAPPINGS = {
    "TrevImageResizer": TrevImageResizer,
    "TrevModelChooser": TrevModelChooser,
    "TrevSlider": TrevSlider,
    "TrevPhotoshop": TrevPhotoshop,
    "TrevClaude": TrevClaude,
    "TrevRoute": TrevRoute,
    "TrevInverseRoute": TrevInverseRoute,
}

NODE_DISPLAY_NAME_MAPPINGS = {
    "TrevImageResizer": "Trev Image Resizer",
    "TrevModelChooser": "Trev Model Chooser",
    "TrevSlider": "Trev Slider",
    "TrevPhotoshop": "Trev Photoshop",
    "TrevClaude": "Trev Claude AI",
    "TrevRoute": "Trev Route",
    "TrevInverseRoute": "Trev Inverse Route",
}

__all__ = ['NODE_CLASS_MAPPINGS', 'NODE_DISPLAY_NAME_MAPPINGS', 'WEB_DIRECTORY']
