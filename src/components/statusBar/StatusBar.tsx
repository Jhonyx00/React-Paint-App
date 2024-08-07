import { Dispatch, SetStateAction } from "react";
import { Dimension } from "../../interfaces/Dimension";
import { Point } from "../../interfaces/Point";
import "./statusBar.css";
import { ZOOM_STEP } from "../../constants/canvasConfig";
const StatusBar = ({
  parentSize,
  cursorPosition,
  currentTool,
  scaleValue,
  setScaleValue,
}: {
  parentSize: Dimension;
  cursorPosition: Point;
  currentTool: string;
  scaleValue: number;
  setScaleValue: Dispatch<SetStateAction<number>>;
}) => {
  const handleClick = (key: number) => {
    key === 1
      ? setScaleValue((prev) => prev - ZOOM_STEP)
      : setScaleValue((prev) => prev + ZOOM_STEP);
  };
  return (
    <div className="status-bar">
      <div className="text">
        <span className="dimension">
          Size: {`${parentSize.width},${parentSize.height}pixels`}
        </span>
        <span className="current-tool">Selected: {`${currentTool}`}</span>
        <span className="position">
          Position: {`${cursorPosition.x}, ${cursorPosition.y}pixels`}
        </span>
      </div>

      <div className="zoom">
        <button onClick={() => handleClick(1)}>−</button>

        <span className="scale-value">
          <b>{scaleValue}%</b>
        </span>

        <button onClick={() => handleClick(2)}>+</button>
      </div>
    </div>
  );
};

export default StatusBar;
