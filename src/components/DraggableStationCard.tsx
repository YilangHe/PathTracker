import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { StationCard } from "./StationCard";
import { StationResult, StationCode } from "../types/path";

interface DraggableStationCardProps {
  id: string;
  stationCode: StationCode;
  data: StationResult | null;
  loading: boolean;
  error: string | null;
  isClosest?: boolean;
  onRemove?: () => void;
}

export const DraggableStationCard = ({
  id,
  stationCode,
  data,
  loading,
  error,
  isClosest,
  onRemove,
}: DraggableStationCardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <StationCard
        stationCode={stationCode}
        data={data}
        loading={loading}
        error={error}
        isClosest={isClosest}
        onRemove={onRemove}
        isDragging={isDragging}
        dragHandleProps={listeners}
      />
    </div>
  );
};
