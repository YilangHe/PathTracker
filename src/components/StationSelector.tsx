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
        <div className="flex items-center justify-between w-full">
          <span className="capitalize text-foreground">
            {STATIONS[value] || "Select station"}
          </span>
        </div>
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
