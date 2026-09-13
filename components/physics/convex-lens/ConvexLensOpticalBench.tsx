import type { CanonicalRayChoice } from "@/content/physics-models/convex-lens-imaging/construction";
import type { LensProjectableRay } from "@/lib/learning/lens-student-ray-geometry";
import type { ObjectStation } from "@/content/physics-models/convex-lens-imaging/physics-boundary";
import { OBJECT_STATIONS } from "@/content/physics-models/convex-lens-imaging/physics-boundary";
import {
  interpretObjectMoveGesture,
  svgClientXToBenchX,
} from "@/lib/learning/lens-semantic-action";
import {
  projectLearnerRay,
  type LensProjectedRaySegment,
} from "@/lib/learning/lens-student-ray-geometry";
import {
  OBJECT_BENCH_X,
  officialBenchDisplay,
  type ConvexLensSceneState,
} from "@/lib/physics/convex-lens-optical-bench";

interface ConvexLensOpticalBenchProps {
  state: ConvexLensSceneState;
  frozen?: boolean;
  showOfficialImage?: boolean;
  studentRays?: Array<CanonicalRayChoice | LensProjectableRay>;
  hideOfficialRays?: boolean;
  caption?: string;
  allowStationSelect?: boolean;
  selectedStation?: string;
  onSelectStation?: (station: ObjectStation) => void;
}

const WIDTH = 640;
const HEIGHT = 280;
const CX = 320;
const AXIS_Y = 150;
const UNIT = 72;

function toX(benchX: number): number {
  return CX + benchX * UNIT;
}

const STATION_HIT_LABEL: Record<ObjectStation, string> = {
  "beyond-2f": "2F 外",
  "at-2f": "2F",
  "between-f-and-2f": "F–2F",
  "at-f": "F",
  "inside-f": "F 内",
};

export function ConvexLensOpticalBench({
  state,
  frozen = false,
  showOfficialImage = true,
  studentRays = [],
  hideOfficialRays = false,
  caption,
  allowStationSelect = false,
  selectedStation,
  onSelectStation,
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
      data-lens-partially-covered={state.lensPartiallyCovered ? "true" : "false"}
      data-frozen={frozen ? "true" : "false"}
      data-official-rays="hidden"
    >
      {caption ? (
        <p className="text-center text-sm text-[var(--ink-muted)]">{caption}</p>
      ) : null}
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        role="img"
        aria-label="凸透镜光具座"
        className="h-auto w-full rounded-2xl border border-[var(--line)] bg-white"
        data-interactive-stations={allowStationSelect ? "true" : "false"}
        onClick={(event) => {
          if (!allowStationSelect || !onSelectStation) {
            return;
          }
          const svg = event.currentTarget;
          const rect = svg.getBoundingClientRect();
          const action = interpretObjectMoveGesture({
            fromStation: state.objectStation,
            benchX: svgClientXToBenchX(event.clientX - rect.left, rect.width),
          });
          if (action) {
            onSelectStation(action.toStation);
          }
        }}
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
        {state.lensPartiallyCovered ? (
          <g data-testid="lens-partial-cover" data-cover-on="lens">
            <rect
              x={CX - 16}
              y="48"
              width="32"
              height={AXIS_Y - 44}
              fill="#334155"
              stroke="#0f172a"
              strokeWidth="1.5"
              opacity="0.9"
              data-testid="lens-partial-cover-shape"
              data-cover-x={CX - 16}
              data-cover-width="32"
              data-cover-y="48"
              data-lens-x={CX}
            />
            <text x={CX + 22} y="70" fontSize="12" fontWeight="700" fill="#0f172a">
              遮挡
            </text>
          </g>
        ) : null}
        <Landmark x={toX(-1)} label="F" testId="near-f" />
        <Landmark x={toX(-2)} label="2F" testId="near-2f" />
        <Landmark x={toX(1)} label="F" testId="far-f" />
        <Landmark x={toX(2)} label="2F" testId="far-2f" />
        {allowStationSelect
          ? OBJECT_STATIONS.map((station) => {
              const selected = (selectedStation ?? state.objectStation) === station;
              return (
                <g
                  key={station}
                  data-testid={`station-hit-${station}`}
                  data-station={station}
                  data-selected={selected ? "true" : "false"}
                  role="button"
                  tabIndex={0}
                  aria-label={`把物体放到${STATION_HIT_LABEL[station]}`}
                  onClick={(event) => {
                    event.stopPropagation();
                    onSelectStation?.(station);
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      onSelectStation?.(station);
                    }
                  }}
                >
                  <rect
                    x={toX(OBJECT_BENCH_X[station]) - 22}
                    y={AXIS_Y - 86}
                    width="44"
                    height="112"
                    fill={selected ? "rgba(37, 99, 235, 0.12)" : "transparent"}
                    stroke={selected ? "#2563eb" : "rgba(15, 23, 42, 0.18)"}
                    strokeDasharray={selected ? undefined : "3 3"}
                    rx="8"
                  />
                  <text
                    x={toX(OBJECT_BENCH_X[station]) - 16}
                    y={AXIS_Y + 104}
                    fontSize="11"
                    fill={selected ? "#1d4ed8" : "currentColor"}
                  >
                    {STATION_HIT_LABEL[station]}
                  </text>
                </g>
              );
            })
          : null}
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
            station={state.objectStation}
            objectHeight={geometry.objectHeight}
          />
        ))}
        {rays.length > 0 ? (
          <text x="28" y="28" fontSize="12" fill="#1d4ed8" data-testid="student-ray-legend">
            蓝线是你自己装的光线
          </text>
        ) : null}
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
  station,
  objectHeight,
}: {
  ray: CanonicalRayChoice | LensProjectableRay;
  station: ObjectStation;
  objectHeight: number;
}) {
  const projection = projectLearnerRay(ray, station, objectHeight);
  const hasOutgoing = projection.segments.some((segment) => segment.role === "outgoing-actual");
  const hasActualIncident = projection.segments.some((segment) => segment.role === "incident");
  const hasBackward = projection.segments.some((segment) => segment.role === "backward-extension");
  const groupStyle = hasOutgoing || hasActualIncident ? "solid" : hasBackward ? "dashed" : "none";
  const optionalReference = "optionalReference" in ray && ray.optionalReference === true;
  return (
    <g
      data-testid={`ray-${ray.kind}`}
      data-owner={optionalReference ? "optional-reference" : "learner"}
      data-before-lens={ray.beforeLens}
      data-after-lens={ray.afterLens}
      data-incident-path={ray.incidentPath}
      data-optional-reference={optionalReference ? "true" : "false"}
      data-representable={projection.representable ? "true" : "false"}
      data-ray-style={groupStyle}
      data-outgoing-style={hasOutgoing ? "solid" : "none"}
      data-backward-style={hasBackward ? "dashed" : "none"}
    >
      {projection.segments.map((segment, index) => (
        <StudentRaySegment key={`${segment.role}-${index}`} segment={segment} />
      ))}
    </g>
  );
}

function StudentRaySegment({ segment }: { segment: LensProjectedRaySegment }) {
  const dashed = segment.role === "backward-extension";
  return (
    <line
      x1={toX(segment.x1)}
      y1={AXIS_Y - segment.y1 * UNIT}
      x2={toX(segment.x2)}
      y2={AXIS_Y - segment.y2 * UNIT}
      stroke="#1d4ed8"
      strokeWidth="2"
      strokeDasharray={dashed ? "6 4" : undefined}
      data-ray-segment={segment.role}
      data-bench-x1={segment.x1}
      data-bench-y1={segment.y1}
      data-bench-x2={segment.x2}
      data-bench-y2={segment.y2}
    />
  );
}
