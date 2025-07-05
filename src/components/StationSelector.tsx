import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { STATIONS } from "../constants/stations";
import { StationCode } from "../types/path";

interface StationSelectorProps {
  value: StationCode;
  onChange: (value: StationCode) => void;
}

export const StationSelector = ({ value, onChange }: StationSelectorProps) => {
  return (
    <Select value={value} onValueChange={(v) => onChange(v as StationCode)}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select station" />
      </SelectTrigger>
      <SelectContent>
        {Object.entries(STATIONS).map(([code, name]) => (
          <SelectItem key={code} value={code} className="capitalize">
            {name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
