# API Reference

Base URL (local): `http://localhost:4000`

## Endpoints

- POST `/api/v1/generate`
  - Content-Type: `multipart/form-data`
  - Fields:
    - `file=@<image>` (required) — input portrait image
    - `bg_color=white|blue|red` (optional) — background color
    - `size=2x2|35x45` (optional) — output size preset
    - `dpi=300` (optional) — output DPI
    - `enhance=true|false` (optional) — optional enhancements
    - `matting_model=...` (optional) — segmentation model selector
    - `face_detect_model=...` (optional) — face detection backend selector
  - Returns (example, sync):
    ```json
    {
      "outputs": [
        "http://localhost:4000/outputs/abcd1234/idphoto_35x45_white.jpg"
      ]
    }
    ```
  - Returns (example, async):
    ```json
    {
      "job_id": "job_01HXY...",
      "status": "queued"
    }
    ```

- GET `/api/v1/jobs/{job_id}`
  - Returns job status and (if done) output URLs
  - Example:
    ```json
    {
      "status": "done",
      "outputs": [
        "http://localhost:4000/outputs/abcd1234/idphoto_35x45_white.jpg"
      ]
    }
    ```

- GET `/api/v1/templates`
  - Lists available sizes, DPIs, background colors

- GET `/health`
  - Health check
  - Example: `{ "status": "ok" }`

## Examples

Sync generation:

```bash
curl -X POST http://localhost:4000/api/v1/generate \
  -F "file=@/path/to/photo.jpg" \
  -F "bg_color=white" \
  -F "size=35x45" \
  -F "dpi=300"
```

Job polling:

```bash
curl http://localhost:4000/api/v1/jobs/<job_id>
```

Notes:
- Exact routes/fields depend on your backend implementation. Update this doc as endpoints evolve.
- If you serve files from a CDN/bucket, output URLs will reflect that domain instead.
