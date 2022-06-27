import { ChangeEvent, useState } from 'react';
import { VehicleInterface } from '../../shared/types';
import './VehicleCard.css';

interface Props {
  availableUnits: number;
  checked: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  vehicle: VehicleInterface;
}

const VehicleCard: React.FC<Props> = (props) => {
  const { availableUnits, checked, vehicle, onChange } = props;

  return (
    <label className="labl">
      <input
        disabled={availableUnits === 0}
        type="radio"
        value={vehicle.name}
        checked={checked}
        onChange={(event) => onChange(event)}
      />
      <div className="toggleName">
        <p>{vehicle.name}</p>
        <div className="badge">{`${availableUnits}`}</div>
      </div>
    </label>
  );
};

export default VehicleCard;
