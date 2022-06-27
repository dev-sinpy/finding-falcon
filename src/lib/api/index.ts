import { CONFIG } from '../../config';
import { AvailableUnits, FalconeFormData, FormInput } from '../../pages/Home/interfaces';
import { VehicleInterface } from '../../shared/types';
import { client } from '../axios';

export function getFormInputs(): FormInput[] {
  const inputSelections: FormInput[] = [];

  for (let i = 0; i < CONFIG.planetsToTravel; i++) {
    inputSelections.push({
      selectedPlanet: undefined,
      selectedvehicle: undefined,
    });
  }

  return inputSelections;
}

export function getDefaultVehicleUnits(vehicles: VehicleInterface[]): AvailableUnits {
  const availableUnits: AvailableUnits = vehicles.reduce((preValue, currVal) => {
    return { ...preValue, [currVal.name]: currVal.total_no };
  }, {} as AvailableUnits);

  return availableUnits;
}

export async function submitForm(formData: FalconeFormData) {
  const { data } = await client.post<{ planet_name: string; status: string }>('find', formData);
  return data;
}
