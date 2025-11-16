
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

-----

## 2\. 🐳 Docker GPU Deployment Section

以下内容可放入您的 `README.md` 或单独的 Docker 文档中。

### Docker GPU Deployment

Requires **NVIDIA Container Toolkit** to run GPU containers:
[https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/install-guide.html](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/install-guide.html)

**Run Official GPU Container:**

```bash
docker run -d --gpus all \
  -p 7860:7860 \
  linzeyi/hivision_idphotos
```

For a custom GPU-specialized image, please refer to `docker/gpu/Dockerfile`.

-----

## 3\. 📁 Docker GPU Structure and Files

以下是您建议的 Docker GPU 分支结构和文件内容。

### 3.1. Directory Structure

```
HivisionIDPhotos/
├── docker/
│   ├── gpu/
│   │   ├── Dockerfile
│   │   ├── README_GPU_DOCKER.md
│   │   └── entrypoint.sh (Optional)
```

### 3.2. File: `docker/gpu/Dockerfile`

```dockerfile
FROM python:3.10-slim

# Enable NVIDIA GPU inside Docker
ENV NVIDIA_VISIBLE_DEVICES=all
ENV NVIDIA_DRIVER_CAPABILITIES=all

WORKDIR /app

# Install system libs
RUN apt-get update && apt-get install -y git wget && rm -rf /var/lib/apt/lists/*

# Copy project
COPY . /app

# Install base requirements
RUN pip install -r requirements.txt
RUN pip install -r requirements-app.txt

# Install GPU execution provider
RUN pip install onnxruntime-gpu==1.18.0

# Optional: Install CUDA PyTorch
# RUN pip install torch --index-url [https://download.pytorch.org/whl/cu121](https://download.pytorch.org/whl/cu121)

EXPOSE 7860

CMD ["python3", "app.py"]
```

### 3.3. File: `docker/gpu/README_GPU_DOCKER.md`

# GPU-Enabled Docker Image for HivisionIDPhotos

This Dockerfile enables CUDA GPU acceleration through `onnxruntime-gpu`.

## Requirements

* NVIDIA GPU
* NVIDIA Drivers
* NVIDIA Container Toolkit:
    [https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/install-guide.html](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/install-guide.html)

## Build

```bash
docker build -t hivision_idphotos_gpu -f docker/gpu/Dockerfile .
````

## Run

```bash
docker run -d --gpus all \
  -p 7860:7860 \
  hivision_idphotos_gpu
```

Visit: [http://127.0.0.1:7860](http://127.0.0.1:7860)
