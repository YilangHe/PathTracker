import { useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Plus, X } from "lucide-react";
import { StationSelector } from "./StationSelector";
import { StationCode } from "../types/path";

interface AddStationCardProps {
  onAddStation: (stationCode: StationCode) => void;
  existingStations: StationCode[];
}

export const AddStationCard = ({
  onAddStation,
  existingStations,
}: AddStationCardProps) => {
  const [isAdding, setIsAdding] = useState(false);
  const [selectedStation, setSelectedStation] = useState<StationCode>("NWK");

  const handleAdd = () => {
    if (!existingStations.includes(selectedStation)) {
      onAddStation(selectedStation);
      setIsAdding(false);
    }
  };

  const handleCancel = () => {
    setIsAdding(false);
    setSelectedStation("NWK");
  };

  if (isAdding) {
    return (
      <Card className="bg-gray-800 border-2 border-dashed border-gray-600 text-white">
        <CardHeader>
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold">Add New Station</span>
            <button
              onClick={handleCancel}
              className="text-gray-400 hover:text-gray-200 transition-colors p-1 rounded-md hover:bg-gray-700"
              title="Cancel"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <StationSelector
            value={selectedStation}
            onChange={setSelectedStation}
          />
          <div className="flex gap-2">
            <button
              onClick={handleAdd}
              disabled={existingStations.includes(selectedStation)}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-2 px-4 rounded-md transition-colors"
            >
              {existingStations.includes(selectedStation)
                ? "Already Added"
                : "Add Station"}
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md transition-colors"
            >
              Cancel
            </button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-800 border-2 border-dashed border-gray-600 text-white hover:border-gray-500 transition-colors">
      <CardContent className="p-8">
        <button
          onClick={() => setIsAdding(true)}
          className="w-full flex flex-col items-center gap-2 text-gray-400 hover:text-gray-200 transition-colors"
        >
          <Plus className="w-8 h-8" />
          <span className="text-lg font-medium">Add Station</span>
        </button>
      </CardContent>
    </Card>
  );
};
