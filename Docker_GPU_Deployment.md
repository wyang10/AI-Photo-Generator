
## 2\. 🐳 Docker GPU Deployment Section

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

#### 3.1. Directory Structure

```
HivisionIDPhotos/
├── docker/
│   ├── gpu/
│   │   ├── Dockerfile
│   │   ├── README_GPU_DOCKER.md
│   │   └── entrypoint.sh (Optional)
```

#### 3.2. File: `docker/gpu/Dockerfile`

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

#### 3.3. File: `docker/gpu/README_GPU_DOCKER.md`

**GPU-Enabled Docker Image for HivisionIDPhotos**

This Dockerfile enables CUDA GPU acceleration through `onnxruntime-gpu`.

**Requirements**

* NVIDIA GPU
* NVIDIA Drivers
* NVIDIA Container Toolkit:
    [https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/install-guide.html](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/install-guide.html)

**Build**

```bash
docker build -t hivision_idphotos_gpu -f docker/gpu/Dockerfile .
````

**Run**

```bash
docker run -d --gpus all \
  -p 7860:7860 \
  hivision_idphotos_gpu
```

Visit: [http://127.0.0.1:7860](http://127.0.0.1:7860)
