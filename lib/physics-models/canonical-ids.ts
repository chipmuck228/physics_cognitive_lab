/**
 * Canonical Physics Model IDs from spec/physics-model-library.md.
 * Do not invent IDs here. Add them to the Library first.
 */
export const CANONICAL_PHYSICS_MODEL_IDS = [
  "measurement-length",
  "measurement-time",
  "measurement-mass",
  "measurement-temperature",
  "measurement-volume",
  "measurement-error-and-estimation",
  "density-mass-volume",
  "force-changes-motion-state",
  "force-equilibrium",
  "inertia-motion-state",
  "friction-force",
  "pressure-force-area",
  "liquid-pressure",
  "atmospheric-pressure",
  "buoyancy-displaced-fluid",
  "mechanical-work-energy-transfer",
  "kinetic-energy-motion",
  "gravitational-potential-energy",
  "mechanical-energy-conversion",
  "energy-internal-energy-temperature",
  "temperature-microscopic-motion",
  "heat-transfer-direction",
  "internal-energy-change-mechanisms",
  "specific-heat-capacity",
  "phase-change-energy",
  "energy-conversion",
  "energy-form-system-description",
  "chemical-energy-internal-energy-mechanical-energy",
  "electrical-energy-conversion",
  "electric-current",
  "voltage-potential-difference",
  "electrical-resistance",
  "ohms-law",
  "series-circuit",
  "parallel-circuit",
  "electric-power",
  "electrical-energy",
  "magnetic-field-interaction",
  "magnetic-effect-of-current",
  "electric-motor",
  "electromagnetic-induction",
  "light-rectilinear-propagation",
  "light-reflection",
  "light-refraction",
  "plane-mirror-imaging",
  "convex-lens-imaging",
  "sound-vibration-source",
  "sound-propagation-medium",
  "sound-pitch-frequency",
  "sound-loudness-amplitude",
  "sound-timbre",
] as const;

export type CanonicalPhysicsModelId =
  (typeof CANONICAL_PHYSICS_MODEL_IDS)[number];

export const CHEMICAL_ENERGY_INTERNAL_ENERGY_MECHANICAL_ENERGY_ID =
  "chemical-energy-internal-energy-mechanical-energy" as const;

export const FORCE_CHANGES_MOTION_STATE_ID =
  "force-changes-motion-state" as const;

export const DENSITY_MASS_VOLUME_ID = "density-mass-volume" as const;

export const SPECIFIC_HEAT_CAPACITY_ID = "specific-heat-capacity" as const;

export const ENERGY_INTERNAL_ENERGY_TEMPERATURE_ID =
  "energy-internal-energy-temperature" as const;

export function isCanonicalPhysicsModelId(
  id: string,
): id is CanonicalPhysicsModelId {
  return (CANONICAL_PHYSICS_MODEL_IDS as readonly string[]).includes(id);
}
