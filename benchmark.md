<!--
 * @Author: Audrey Yang 97855340+wyang10@users.noreply.github.com
 * @Date: 2025-11-16 00:36:21
 * @LastEditors: Audrey Yang 97855340+wyang10@users.noreply.github.com
 * @LastEditTime: 2025-11-16 00:38:03
 * @FilePath: /AI-Photo-Generator/benchmark.md
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
## 4. 📊 GPU Benchmark Section


## 📊 GPU Benchmark

The following tests are based on:

* Image: 764×1146
* CPU: M1 Max / 64GB
* GPU: RTX 3090 / 4090

---

### ⏱ Raw Metrics Table

| Model | CPU Time (s) | GPU Time (s) | Speedup |
| :--- | :--- | :--- | :--- |
| birefnet-v1-lite | 7.06 | **0.38** | **18.6×** |
| birefnet-v1-lite (larger img) | 7.12 | **0.42** | **16.9×** |
| MODNet | 0.24 | — | — |

---

### 📈 ASCII Speed Chart (Suitable for GitHub README)

````

Speedup (lower is faster)
CPU (7.06s) | ██████████████████████████████████████
GPU (0.38s) | ██

```

Relative Speedup: **GPU is ~18× faster than CPU for BiRefNet.**

---

### 🧪 Conclusion

* GPU acceleration for the high-accuracy model **BiRefNet** is extremely significant (>15×).
* CPU is sufficient for lightweight models (MODNet).
* Recommended GPU VRAM is **≥16GB** (BiRefNet has large parameters).
