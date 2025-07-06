import { memo } from "react";
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
  hasCachedData?: boolean;
  onRemove?: (stationId: string) => void;
  onMoveUp?: (stationId: string) => void;
  onMoveDown?: (stationId: string) => void;
  stationId: string;
}

const DraggableStationCardComponent = ({
  id,
  stationCode,
  data,
  loading,
  error,
  hasCachedData = false,
  onRemove,
  onMoveUp,
  onMoveDown,
  stationId,
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

  const handleRemove = onRemove ? () => onRemove(stationId) : undefined;
  const handleMoveUp = onMoveUp ? () => onMoveUp(stationId) : undefined;
  const handleMoveDown = onMoveDown ? () => onMoveDown(stationId) : undefined;

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <StationCard
        stationCode={stationCode}
        data={data}
        loading={loading}
        error={error}
        hasCachedData={hasCachedData}
        onRemove={handleRemove}
        onMoveUp={handleMoveUp}
        onMoveDown={handleMoveDown}
        isDragging={isDragging}
        dragHandleProps={listeners}
      />
    </div>
  );
};

// Custom comparison function - only re-render if this station's props actually changed
const areEqual = (
  prevProps: DraggableStationCardProps,
  nextProps: DraggableStationCardProps
) => {
  return (
    prevProps.id === nextProps.id &&
    prevProps.stationCode === nextProps.stationCode &&
    prevProps.data === nextProps.data && // This uses object reference equality from our hook optimization
    prevProps.loading === nextProps.loading &&
    prevProps.error === nextProps.error &&
    prevProps.hasCachedData === nextProps.hasCachedData &&
    prevProps.onRemove === nextProps.onRemove &&
    prevProps.onMoveUp === nextProps.onMoveUp &&
    prevProps.onMoveDown === nextProps.onMoveDown &&
    prevProps.stationId === nextProps.stationId
  );
};

export const DraggableStationCard = memo(
  DraggableStationCardComponent,
  areEqual
);
