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
          Size:{" "}
          <b>
            {parentSize.width}, {parentSize.height}pixels
          </b>
        </span>
        <span className="current-tool">
          Selected: <b>{currentTool}</b>
        </span>
        <span className="position">
          Position:{" "}
          <b>
            {cursorPosition.x}, {cursorPosition.y}pixels
          </b>
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
