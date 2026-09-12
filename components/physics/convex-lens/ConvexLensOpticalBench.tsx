import type { CanonicalRayChoice } from "@/content/physics-models/convex-lens-imaging/construction";
import { LENS_COPY } from "@/lib/content/convex-lens-optical-bench";
import {
  officialBenchDisplay,
  type ConvexLensSceneState,
} from "@/lib/physics/convex-lens-optical-bench";

interface ConvexLensOpticalBenchProps {
  state: ConvexLensSceneState;
  frozen?: boolean;
  showOfficialImage?: boolean;
  studentRays?: CanonicalRayChoice[];
  hideOfficialRays?: boolean;
}

const WIDTH = 640;
const HEIGHT = 280;
const CX = 320;
const AXIS_Y = 150;
const UNIT = 72;

function toX(benchX: number): number {
  return CX + benchX * UNIT;
}

export function ConvexLensOpticalBench({
  state,
  frozen = false,
  showOfficialImage = true,
  studentRays = [],
  hideOfficialRays = false,
}: ConvexLensOpticalBenchProps) {
  const display = officialBenchDisplay(state);
  const { geometry, imaging, screenReceive, cover } = display;
  const objectX = toX(geometry.objectX);
  const imageX = geometry.imageX === null ? null : toX(geometry.imageX);
  const screenX = toX(geometry.screenX);
  const showImage =
    showOfficialImage && imaging.finiteImage && imageX !== null && imaging.imageNature !== "none";
  const virtual = imaging.imageNature === "virtual";
  const imageOnScreen = screenReceive === "clear" && imaging.imageNature === "real";
  const rays = hideOfficialRays ? studentRays : studentRays.length > 0 ? studentRays : [];

  return (
    <div
      className="space-y-3"
      data-testid="convex-lens-optical-bench"
      data-object-station={state.objectStation}
      data-image-side={imaging.imageSide}
      data-image-nature={imaging.imageNature}
      data-image-size={imaging.imageSizeRelation}
      data-image-orientation={imaging.imageOrientation}
      data-finite-image={imaging.finiteImage ? "true" : "false"}
      data-screen-receive={screenReceive}
      data-image-x={geometry.imageX ?? "none"}
      data-screen-x={geometry.screenX}
      data-cover-complete={cover.imageComplete ? "true" : "false"}
      data-cover-brightness={cover.brightness}
      data-frozen={frozen ? "true" : "false"}
    >
      <p className="text-center text-sm text-[var(--ink-muted)]">
        {frozen ? LENS_COPY.modelFrozenCaption : LENS_COPY.observeCaption}
      </p>
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        role="img"
        aria-label="凸透镜光具座"
        className="h-auto w-full rounded-2xl border border-[var(--line)] bg-white"
      >
        <line
          x1="24"
          y1={AXIS_Y}
          x2={WIDTH - 24}
          y2={AXIS_Y}
          stroke="currentColor"
          strokeWidth="1.5"
          data-testid="principal-axis"
        />
        <line
          x1={CX}
          y1="48"
          x2={CX}
          y2="252"
          stroke="currentColor"
          strokeWidth="3"
          data-testid="convex-lens"
          data-quantity-id="optical-center"
        />
        <text x={CX + 8} y="42" fontSize="12">
          透镜
        </text>
        <Landmark x={toX(-1)} label="F" testId="near-f" />
        <Landmark x={toX(-2)} label="2F" testId="near-2f" />
        <Landmark x={toX(1)} label="F" testId="far-f" />
        <Landmark x={toX(2)} label="2F" testId="far-2f" />
        <ArrowObject
          x={objectX}
          height={geometry.objectHeight}
          inverted={false}
          label="物体"
          testId="physical-object"
          quantityId="object-distance"
        />
        {showImage ? (
          <ArrowObject
            x={imageX!}
            height={geometry.imageHeight}
            inverted={geometry.imageInverted}
            label={virtual ? "虚像" : "像"}
            testId="optical-image"
            quantityId="image-distance"
            dashed={virtual}
            dimmed={cover.brightness === "reduced"}
          />
        ) : null}
        <rect
          x={screenX - 6}
          y={AXIS_Y - 70}
          width="12"
          height="140"
          fill={imageOnScreen ? "var(--heat)" : "transparent"}
          stroke="currentColor"
          strokeWidth="2"
          data-testid="screen"
          data-quantity-id="screen-receivable"
          opacity={imageOnScreen ? (cover.brightness === "reduced" ? 0.45 : 0.85) : 1}
        />
        <text x={screenX - 14} y={AXIS_Y + 92} fontSize="12">
          光屏
        </text>
        {rays.map((ray, index) => (
          <StudentRay
            key={`${ray.kind}-${index}`}
            ray={ray}
            objectX={objectX}
            imageX={imageX}
            virtual={virtual}
          />
        ))}
      </svg>
    </div>
  );
}

function Landmark({
  x,
  label,
  testId,
}: {
  x: number;
  label: string;
  testId: string;
}) {
  return (
    <g data-testid={testId} data-quantity-id={label === "F" ? "focal-point" : "twice-focal-length"}>
      <circle cx={x} cy={AXIS_Y} r="3.5" fill="currentColor" />
      <text x={x - 8} y={AXIS_Y + 22} fontSize="12">
        {label}
      </text>
    </g>
  );
}

function ArrowObject({
  x,
  height,
  inverted,
  label,
  testId,
  quantityId,
  dashed = false,
  dimmed = false,
}: {
  x: number;
  height: number;
  inverted: boolean;
  label: string;
  testId: string;
  quantityId: string;
  dashed?: boolean;
  dimmed?: boolean;
}) {
  const top = inverted ? AXIS_Y + height : AXIS_Y - height;
  const tip = inverted ? AXIS_Y + height - 8 : AXIS_Y - height + 8;
  return (
    <g data-testid={testId} data-quantity-id={quantityId} opacity={dimmed ? 0.45 : 1}>
      <line
        x1={x}
        y1={AXIS_Y}
        x2={x}
        y2={top}
        stroke="currentColor"
        strokeWidth="2.5"
        strokeDasharray={dashed ? "6 4" : undefined}
      />
      <polygon
        points={
          inverted
            ? `${x},${top} ${x - 5},${tip} ${x + 5},${tip}`
            : `${x},${top} ${x - 5},${tip} ${x + 5},${tip}`
        }
        fill="currentColor"
      />
      <text x={x - 14} y={inverted ? AXIS_Y + height + 16 : AXIS_Y - height - 8} fontSize="12">
        {label}
      </text>
    </g>
  );
}

function StudentRay({
  ray,
  objectX,
  imageX,
  virtual,
}: {
  ray: CanonicalRayChoice;
  objectX: number;
  imageX: number | null;
  virtual: boolean;
}) {
  const backwardOnly = ray.incidentPath === "backward-extension";
  const throughCenter = ray.kind === "through-center";
  const beforeY = throughCenter ? AXIS_Y - 28 : AXIS_Y - 36;
  const lensY = throughCenter ? AXIS_Y : beforeY;
  const outgoingY = throughCenter ? AXIS_Y + 18 : AXIS_Y - 20;
  const rightEnd = CX + 196;
  const showBackwardToImage = virtual && !backwardOnly && imageX !== null;
  return (
    <g
      data-testid={`ray-${ray.kind}`}
      data-ray-style={backwardOnly ? "dashed" : "solid"}
      data-outgoing-style={backwardOnly ? "none" : "solid"}
      data-backward-style={showBackwardToImage || backwardOnly ? "dashed" : "none"}
    >
      <line
        x1={objectX}
        y1={beforeY}
        x2={CX}
        y2={lensY}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeDasharray={backwardOnly ? "6 4" : undefined}
        data-ray-segment="incident"
      />
      {backwardOnly ? null : (
        <line
          x1={CX}
          y1={lensY}
          x2={rightEnd}
          y2={outgoingY}
          stroke="currentColor"
          strokeWidth="1.5"
          data-ray-segment="outgoing-actual"
        />
      )}
      {showBackwardToImage ? (
        <line
          x1={CX}
          y1={lensY}
          x2={imageX}
          y2={AXIS_Y - 48}
          stroke="currentColor"
          strokeWidth="1.5"
          strokeDasharray="6 4"
          data-ray-segment="backward-extension"
        />
      ) : null}
      {backwardOnly && imageX !== null ? (
        <line
          x1={objectX}
          y1={beforeY}
          x2={imageX}
          y2={AXIS_Y - 48}
          stroke="currentColor"
          strokeWidth="1.5"
          strokeDasharray="6 4"
          data-ray-segment="backward-extension"
        />
      ) : null}
    </g>
  );
}
