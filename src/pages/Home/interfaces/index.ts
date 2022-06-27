export interface FormInput {
  selectedPlanet: string | undefined;
  selectedvehicle: string | undefined;
}

export interface AvailableUnits {
  [key: string]: number;
}

export * from './form.interface';
