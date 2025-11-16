
## ⚡ GPU Acceleration Support (NVIDIA CUDA)

HivisionIDPhotos supports GPU acceleration for select models via **CUDA + onnxruntime-gpu**.

### Current Accelerable Models

| Model | GPU Supported | Notes |
| :--- | :--- | :--- |
| **birefnet-v1-lite** | ✅ Yes | Recommended GPU ≥16GB VRAM |
| MODNet | ❌ No | CPU inference is sufficient |
| hivision_modnet | ❌ No | CPU inference is sufficient |
| rmbg-1.4 | ❌ No | CPU inference is sufficient |

### Quick Setup

#### 🔧 1. Install CUDA & cuDNN

Install the appropriate versions from NVIDIA's official sites:

* **CUDA:** [https://developer.nvidia.com/cuda-downloads](https://developer.nvidia.com/cuda-downloads)
* **cuDNN:** [https://developer.nvidia.com/cudnn](https://developer.nvidia.com/cudnn)

> **Note:** CUDA supports a degree of backward compatibility (e.g., CUDA 12.6 can run cu121 PyTorch wheels).


#### 🔧 2. Install `onnxruntime-gpu`

The project defaults to CPU. To enable GPU, install the corresponding CUDA version:

```bash
pip install onnxruntime-gpu==1.18.0
````

This version corresponds to CUDA 12.x. For other versions, refer to the [onnxruntime documentation](https://onnxruntime.ai/docs/execution-providers/CUDA-ExecutionProvider.html).

#### 🚀 3. Enable GPU Inference

No extra parameters are required. Simply select a GPU-supported model:

```bash
python inference.py \
  -i demo/images/test0.jpg \
  -o output.png \
  --matting_model birefnet-v1-lite
```

GPU is confirmed enabled if the terminal output includes:

```
Providers: ['CUDAExecutionProvider', 'CPUExecutionProvider']
```

### 📊 GPU Inference Speed Reference (764×1146)

| Model | CPU Time (s) | GPU Time (s) (RTX 3090/4090) |
| :--- | :--- | :--- |
| birefnet-v1-lite | \~7.1s | 0.3–0.6s |

GPU provides significant acceleration for high-precision matting models.