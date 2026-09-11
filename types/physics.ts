export interface MicrowavePhysicsState {
  initialTemperatureC: number;
  currentTemperatureC: number;
  powerW: number;
  heatingTimeSec: number;
  breadFactor: number;
}

export interface MicrowaveExperimentInput {
  initialTemperatureC: number;
  powerW: number;
  heatingTimeSec: number;
  breadFactor: number;
}

export interface MicrowaveExperimentResult {
  finalTemperatureC: number;
  energyInputJ: number;
  deltaTemperatureC: number;
}
