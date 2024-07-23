import { Dispatch, SetStateAction } from "react";
import { Dimension } from "../../interfaces/Dimension";
import { Point } from "../../interfaces/Point";
import "./statusBar.css";
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
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setScaleValue(parseInt(value));
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
        <span>
          <b>{scaleValue}%</b>
        </span>
        <input
          type="range"
          name=""
          id=""
          min={15}
          max={1000}
          onChange={handleChange}
          value={scaleValue}
        />
      </div>
    </div>
  );
};

export default StatusBar;
