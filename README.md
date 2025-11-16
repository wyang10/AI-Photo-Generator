<!--
 * @Author: Audrey Yang 97855340+wyang10@users.noreply.github.com
 * @Date: 2025-11-15 23:58:46
 * @LastEditors: Audrey Yang 97855340+wyang10@users.noreply.github.com
 * @LastEditTime: 2025-11-16 00:11:10
 * @FilePath: /AI-Photo-Generator/README-1.md
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->

<div align="center">

# 🪪 AI Photo Generator

</div>

End-to-end system for generating compliant ID photos from user uploads, featuring a production-style workflow from raw images → segmentation/matting → face-aligned cropping → background synthesis → standardized outputs via API + Web UI.

This project replicates the architecture used in real-world ID-photo services and demonstrates how to wrap open-source models such as **HivisionIDPhotos / MODNet / RMBG / BiRefNet / RetinaFace** into a modern **frontend + backend + model-processing** pipeline.

---

## 🔥 What I Built

* Designed a **full-stack ID-photo generation service**.
* Integrated open-source segmentation & face-detection models into a **unified pipeline**.
* Built **Next.js UI + Node.js API** with async job flow.
* Added **CPU stub mode** so anyone can clone & run locally.
* Deployed original version on **industrial GPU cluster** with remote inference.
* Structured the project like a **real production system**, not a classroom app.

---

## 🎯 Problem

Given a user portrait photo, the system must:

* Remove background accurately.
* Detect, crop, and align faces.
* Generate ID-compliant output sizes, including:
    * 2×2 inch
    * 35×45 mm
    * US Visa / Passport / Driving License, etc.
* Allow background color options (white / blue / red / custom).
* Provide both a **REST API** and a **Next.js Web UI**.

---

## 🧩 Key Features

* **✔ Full Production-Style Pipeline**
    * Upload ingestion & file validation
    * Segmentation / matting
    * Face detection & alignment
    * Cropping & resizing
    * Background synthesis
    * Export to PNG/JPG/DPI presets
* **✔ Modular Model Integration**
    * Supports plugging in various models: `MODNet`, `RMBG`, `BiRefNet`, `HivisionIDPhotos` pipeline
    * Face Detection support: `MTCNN`, `RetinaFace`, `Face++`
* **✔ Full Stack Implementation**
    * **Next.js (TS)** → Upload UI / templates / preview
    * **Node.js API** → Validation / processing orchestration
    * Optional Python bridge for GPU-accelerated models (`onnxruntime-gpu`)
* **✔ Developer-Friendly**
    * Clear API contract
    * Easy `.env` setup
    * Optional Docker / Compose
    * Ability to run **stub mode** for demos without GPU

---

## 🏗️ Architecture

### 🖼️ Architecture Diagram (Mermaid)

```mermaid
flowchart LR
  subgraph Client
    U[User Browser]
  end

  subgraph Frontend [Next.js Web App]
    FE[/Upload UI, Options, Preview/]
  end

  subgraph Backend [Node.js API Service]
    API((REST API))
    PIPE[Processing Pipeline\n• Validation\n• Segmentation/Matting\n• Face Detection\n• Alignment & Crop\n• Background Synthesis\n• Resize & Export]
  end

  subgraph ModelLayer [Model Integration Layer]
    MOD[MODNet/RMBG/BiRefNet]
    FD[Face Detector]
  end

  subgraph Storage [Persistent Storage]
    INP[(Original Uploads)]
    OUT[(Final Outputs)]
  end

  U --> FE --> API
  API --> INP
  API --> PIPE --> ModelLayer --> PIPE --> OUT
  API -->|Result URLs| FE --> U
````

### 🧱 Component Breakdown

#### 🟦 Frontend (Next.js + TS)

  * Upload interface
  * Background/color/template selection
  * Output preview
  * Downloads
  * Handles only UI logic → no heavy processing

#### 🟩 Backend (Node.js)

  * Receives uploads
  * Validates inputs (size, ratio, EXIF)
  * Calls processing pipeline
  * Returns job status + URLs
  * Logs + error handling

#### 🟥 Model Layer

  * Optional Python service if GPU models are used
  * Unified interface: `processImage(inputPath, { bgColor, size, dpi })`

#### 🟨 Storage

  * Originals → `uploads/`
  * Final images → `outputs/`
  * Can be swapped for S3/GCS easily

-----

## 📁 Repository Structure

```
ai-photo-generator/
├─ ai_id_photo_backend_api/     # API service
├─ ai_id_photo_web_app/         # Next.js frontend
├─ docs/                        # Architecture, API docs, diagrams
├─ demos/                       # Sample inputs/outputs, demo video
├─ docker-compose.yml           # (Optional) multi-service dev setup
└─ scripts/                     # Helpers & tools
```

-----

## 🛠️ Tech Stack

| Component | Technology |
| :--- | :--- |
| **Frontend** | Next.js (TypeScript), React, Tailwind / custom design |
| **Backend** | Node.js (Express), Multer (file upload), Sharp (image transform), Optional Python (GPU models) |
| **Infra** | Docker / Compose, `.env` config, Cross-platform (macOS/Linux/Windows) |

-----

## ⚡ Quick Start

### 1\. Backend

```bash
cd ai_id_photo_backend_api
npm install
nodemon server.js
# Default: http://localhost:4000
```

### 2\. Frontend

```bash
cd ai_id_photo_web_app
npm install
npm run dev
# Open: http://localhost:3000
```

**Setup `.env.development`:**

```
NEXT_PUBLIC_REACT_APP_BASE_API_URL=http://localhost:4000
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
```

### 3\. Docker (Optional)

```bash
docker compose up --build
```

-----

## 🧪 API Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/v1/generate` | Generate ID photo from upload. |
| `GET` | `/api/v1/jobs/{job_id}` | Async job tracking. |
| `GET` | `/api/v1/templates` | Available output sizes. |
| `GET` | `/health` | Health probe. |

-----

## 🎬 Demo Assets

Store your screenshots & video here:

```
demos/
  ├─ sample_input.jpg
  ├─ sample_output.png
  └─ demo_video.mp4
```

-----

## 🛠️ Development Notes

  * `nodemon` for backend hot reload
  * `npm run dev` for frontend
  * `.env`, `.env.development`, `.env.production` supported
  * Use stub mode for CPU-only demo
  * GPU integration documented in `docs/deployment_gpu.md`

-----

## 🔮 Roadmap

  * Webhooks for async callbacks
  * Batch generation / zip export
  * Pose correction
  * Country-specific templates (JP/KR/EU)
  * Full GPU inference pipeline with BiRefNet + RetinaFace
  * Access control + signed URLs
  * Preprocessing API (EXIF fix, color balance)

-----

## 📜 License & Acknowledgments

**License:** MIT License

**Thanks to:**

  * MODNet
  * RMBG
  * BiRefNet
  * MTCNN / RetinaFace / Face++
  * HivisionIDPhotos

https://github.com/Zeyi-Lin/HivisionIDPhotos.git