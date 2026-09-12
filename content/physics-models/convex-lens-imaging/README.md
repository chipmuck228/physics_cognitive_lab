# convex-lens-imaging

Reusable Physics Model. Not a page, and not a pretty lens drawing.

## Model

`convex-lens-imaging`

Chinese title: 凸透镜成像：物距相对焦点几何如何决定像

This canonical ID already existed in [`spec/physics-model-library.md`](../../../spec/physics-model-library.md). This folder fills the previously empty definition. It does **not** invent a duplicate ID.

`metadata.status` is **draft**. PRE exists. No production Scene. Not learner-validated.

## Primary reusable structure

```text
object position relative to F / 2F
        ↓
emergent rays after the convex lens
        ↓
actual convergence
  or backward-extension intersection
  or no finite meeting
        ↓
image position
        ↓
image properties
```

This is **not** “背 F 和 2F 的五种情况”, and **not** `1/f = 1/u + 1/v`.

MODEL presentation: **spatial-ray relation construction**.

Selecting a memorized case row is not valid MODEL evidence.

**MODEL completeness** (designer checklist, not student evidence):

1. object position relative to F and 2F
2. ray-meeting mode
3. image position as intersection or backward extension
4. nature / orientation / size as consequences
5. screen receivability follows real vs virtual
6. `u = f` is not a finite image

**L4 construction evidence** is one coherent spatial-ray act. A completed diagram shown to the student, or six correct property clicks, must fail.

## Distinctions the model must keep

- object ≠ image
- image position ≠ screen position
- real ≠ “inside the screen”
- virtual ≠ receivable on a screen
- no screen image ≠ no image in every case
- upright/inverted ≠ real/virtual, even when they travel together
- `u = f` is a limiting case, not an ordinary finite image
- covering part of the lens does not cut away part of the image

## Out of scope for this primary

- lens-maker equation
- refractive-index derivation
- spherical / chromatic aberration
- thick-lens optics
- multi-lens microscope or telescope derivation
- advanced sign conventions
- `1/f = 1/u + 1/v` as the taught cause

## Secondary models

None.

Nearby Library IDs `light-rectilinear-propagation`, `light-refraction`, and `plane-mirror-imaging` are not Scene 07 teaching targets.

## Intended anchor Scene

Convex-lens optical bench.

Scene id: `convex-lens-optical-bench`

Named engine: `deterministic-convex-lens-imaging`

No production Scene in this pass.

## Official contract

Official stations live in `physics-boundary.ts`. They are pedagogical engine truth. They must not become a student-facing lookup table.

## Quality

PRE: `spec/reviews/pre/convex-lens-imaging.md`

Evidence Claim Design: `spec/scenes/convex-lens-optical-bench/evidence-claim-design.md`

Readiness: `IMPLEMENTATION_READY` as an information gate only. `metadata.status` stays **draft**.

Do not implement Scene 07 from this README.
