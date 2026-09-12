# Scene 07 — Physical Representation Plan

> Design-time PRI locks under [`../../physics-representation-integrity-contract.md`](../../physics-representation-integrity-contract.md).  
> This is not a POST audit of a running UI.  
> Do not require photorealistic ray tracing.

## 1. Provenance chain

```text
convex-lens-imaging definition
  → physics-boundary.ts officialImagingState
  → future runtime objectStation / screenAtImagePlane
  → geometry binding
  → student-visible bench, rays, image marker
```

Forbidden later: drawing a finite image at `u = f`, or moving the official image when the student moves the screen.

## 2. Identity locks

| Display | Must mean | Must not mean |
|---|---|---|
| object / 物体 | the physical object | the image |
| image / 像 | optical image from official state | the screen card |
| F | focal point | 2F |
| 2F | twice-focal landmark | F |
| u | object distance | image distance |
| v | image distance, only if finite image exists | screen position |
| solid ray | actual light path | backward extension |
| dashed ray | backward extension only | actual outgoing ray |
| screen / 光屏 | receiver | image location |

## 3. Geometry locks

- Left/right object–lens–image orientation stays stable. Do not flip sides to “look nicer.”
- Real image, when it exists, is on the other side. Virtual image, when it exists, is on the object side and is not drawn as a projectable screen picture.
- `u = f` has **no** finite image marker.
- Moving the screen never moves `officialImagingState`. A real image is clear only when `screenAtImagePlane` is true. Virtual / no-finite-image screens stay `never`.
- Visual scale must agree with the official station (reduced / same / enlarged). Do not show a huge real image for `beyond-2f`.

### 3.1 Station-aware focal construction

Required MODEL rays remain **parallel-axis** and **through-center**. Both are actual light for every official station.

The third textbook focal ray is `VALID_OPTIONAL_REFERENCE` only:

| Station | Draw this | Do not draw this |
|---|---|---|
| `u > f` | A **solid** incident ray may pass through near F and emerge parallel | A dashed incoming segment pretending the actual path missed F |
| `u < f` | If shown at all, only a **dashed** backward extension through near F | A **solid** incident segment as if the ray physically passed through a focal point behind the object |
| `u = f` | No through-F construction from the object top | A generic “through near focus” token or a solid/dashed through-F incoming ray that treats this like `u > f` |

Solid lines remain actual light. Dashed lines remain backward extensions only.

## 4. Arrow / relation locks

Arrows may show a ray path or a before/after position of the **same** quantity.

Forbidden:

- object → image as if the object transforms into the image
- u → v as if object distance becomes image distance
- screen drag arrow that rewrites image position

## 5. What this plan does not do

- It does not authorize a ray-trace engine.
- It does not authorize a generic optics shell.
- It does not change Physics Truth. Official numbers/states stay in `physics-boundary.ts`.
