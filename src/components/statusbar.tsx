import { Dimension } from "../interfaces/dimension";

const StatusBar = ({
  parentDimension,
  toolName,
}: {
  parentDimension: Dimension;
  toolName: string;
}) => {
  return (
    <div className="status-bar-container">
      {parentDimension.width} × {parentDimension.height}pixels,
      {toolName}
    </div>
  );
};

export default StatusBar;
