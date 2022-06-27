import { ChangeEvent, useEffect, useState } from 'react';
import VehicleCard from '../../components/VehicleCard/VehicleCard';
import useApi from '../../hooks/useApi';
import { getDefaultVehicleUnits, getFormInputs, submitForm } from '../../lib/api';
import { PlanetInterface, VehicleInterface } from '../../shared/types';
import './Home.css';
import { AvailableUnits, FalconeFormData, FormInput } from './interfaces';

const Home: React.FC = () => {
  const { data: vehicles, loading: vehiclesLoading } = useApi<VehicleInterface[]>({ url: 'vehicles', method: 'GET' });
  const { data: planetsData } = useApi<PlanetInterface[]>({ url: 'planets', method: 'GET' });
  const { data: token } = useApi<{ token: string }>({ url: 'token', method: 'POST' });
  const [planetOptions, setPlanetOptions] = useState<string[]>([]);
  const [formInputs, setFormInputs] = useState<FormInput[]>(getFormInputs());
  const [availableUnits, setAvailableUnits] = useState<AvailableUnits>();
  const [formResp, setFormResp] = useState<{ planet_name: string; status: string }>();
  const [status, setStatus] = useState<boolean>();

  useEffect(() => {
    if (vehicles && !vehiclesLoading) {
      setAvailableUnits(getDefaultVehicleUnits(vehicles));
    }
  }, [vehicles]);

  useEffect(() => {
    if (!planetsData) return;
    const options = planetsData
      .filter((planet) => formInputs.find((input) => input.selectedPlanet !== planet.name))
      .map((planet) => planet.name);

    // set new form values to trigger a re-render
    setPlanetOptions(options);
  }, [formInputs, planetsData]);

  useEffect(() => {
    // TODO: this approach of updating availble units is not good and is very inefficient
    // please refactor this later
    if (!vehicles || !planetsData) return;

    // update available units for vehicle
    const updatedUnits = { ...availableUnits };

    Object.entries(updatedUnits).forEach(([key, value]) => {
      const vehicle = vehicles.filter((vehicle) => vehicle.name === key)[0];
      const selectedVehicleCount = formInputs.filter((input) => input.selectedvehicle === key).length;
      updatedUnits[key] = vehicle.total_no - selectedVehicleCount;
    });

    const options = planetsData
      .filter((planet) => formInputs.find((input) => input.selectedPlanet !== planet.name))
      .map((planet) => planet.name);

    // set new form values to trigger a re-render
    setPlanetOptions(options);
    setAvailableUnits(updatedUnits);
  }, [formInputs]);

  const onPlanetSelected = (inputIndex: number, planetName: string) => {
    const inputs = [...formInputs];
    inputs[inputIndex].selectedPlanet = planetName;
    // set new form values to trigger a re-render
    setFormInputs(inputs);
  };

  const onVehicleSelected = (event: ChangeEvent<HTMLInputElement>, inputIndex: number) => {
    const vehicleName = event.target.value;
    const inputs = [...formInputs];
    inputs[inputIndex].selectedvehicle = vehicleName;

    setFormInputs(inputs);
  };

  const handleSubmit = async () => {
    if (!token) {
      return;
    }
    const formData: FalconeFormData = {
      token: token.token,
      planet_names: formInputs.map((input) => input.selectedPlanet || ''),
      vehicle_names: formInputs.map((input) => input.selectedvehicle || ''),
    };

    const resp = await submitForm(formData);
    setFormResp(resp);
    resp.status === 'success' ? setStatus(true) : setStatus(false);
  };

  const reset = () => {
    setStatus(undefined);
    setFormResp(undefined);
  };

  if (typeof status === 'boolean') {
    return (
      <main className="homeContainer">
        {status ? (
          <h1>Success! Congratulations on Finding Falcone. King Shan is mighty pleased.</h1>
        ) : (
          <h1>Failure! Could not find Falcone. Please try again.</h1>
        )}

        {status && (
          <div className="contents">
            <h2>Time taken: 200</h2>
            <h2>Planet found: {formResp?.planet_name}</h2>
          </div>
        )}

        <div className="actions">
          <button className="btn submitBtn" onClick={reset}>
            Play Again!
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="homeContainer">
      <h2>Select planets you want to search in:</h2>

      <div className="inputContainer">
        {formInputs.map((formInput, idx) => (
          <div className="planetInputContainer" key={idx}>
            <label className="inputLabel">Destination {idx + 1}</label>
            <select
              className="selectbox"
              name="foo"
              value={formInput.selectedPlanet}
              onChange={(event) => onPlanetSelected(idx, event.target.value)}
              required
            >
              {planetOptions?.map((planet, index) => (
                <option key={index} value={planet}>
                  {planet}
                </option>
              ))}
            </select>

            {!!formInput.selectedPlanet && vehicles !== null && !vehiclesLoading && (
              <div className="vehicleContainer">
                {vehicles.map((vehicle, index) => (
                  <VehicleCard
                    key={index}
                    availableUnits={availableUnits ? availableUnits[vehicle.name] : 0}
                    checked={formInput.selectedvehicle == vehicle.name}
                    onChange={(event) => onVehicleSelected(event, idx)}
                    vehicle={vehicle}
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      <button className="btn submitBtn" onClick={handleSubmit}>
        Find Falcone!
      </button>
    </main>
  );
};

export default Home;
