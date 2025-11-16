<!--
 * @Author: Audrey Yang 97855340+wyang10@users.noreply.github.com
 * @Date: 2025-11-16 00:18:58
 * @LastEditors: Audrey Yang 97855340+wyang10@users.noreply.github.com
 * @LastEditTime: 2025-11-16 00:19:15
 * @FilePath: /AI-Photo-Generator/docs/deployment_gpu.md
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
# ⚡ GPU Deployment Guide

## Enable NVIDIA GPU Acceleration for HivisionIDPhotos

This guide will help you enable NVIDIA GPU acceleration for inference on your local machine or server, significantly boosting performance when using high-performance matting models like **BiRefNet**.

---

### 1. Overview

Currently, the only model officially supporting GPU acceleration is: **birefnet-v1-lite**.

If you wish to use the GPU, please ensure your local environment meets the following prerequisites:

* NVIDIA GPU (VRAM of **≥16GB** is recommended for BiRefNet).
* The corresponding versions of the following installed:
    * **CUDA Toolkit**
    * **cuDNN**
* Installation of the matching version of **`onnxruntime-gpu`**.
* (Optional) Installation of the matching **PyTorch CUDA** version.

GPU acceleration primarily benefits the following tasks:

* ID photo enhancement (matting + rotation + cropping flow).
* Generating high-definition matting results.
* Generating high-resolution six-inch layout photos (acceleration is most noticeable when using BiRefNet).

---

### 2. Environment Preparation

#### 2.1 Install CUDA & cuDNN

Please select the official installer packages based on the major version of CUDA you are using:

* **CUDA:** [https://developer.nvidia.com/cuda-downloads](https://developer.nvidia.com/cuda-downloads)
* **cuDNN:** [https://developer.nvidia.com/cudnn](https://developer.nvidia.com/cudnn)

> **Note:** CUDA supports a degree of **backward compatibility**. For example, a system with CUDA 12.6 installed can still typically use PyTorch's `cu121` wheel.

---

### 3. Install GPU Execution Provider (`onnxruntime-gpu`)

`HivisionIDPhotos` internally uses `onnxruntime` for ONNX model inference. To enable the GPU, simply install the `onnxruntime-gpu` package corresponding to your CUDA version:

```bash
pip install onnxruntime-gpu==1.18.0