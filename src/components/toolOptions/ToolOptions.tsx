import { Dispatch, SetStateAction } from "react";
import "./toolOptions.css";

const ToolOptions = ({
  lineWidth,
  opacity,
  shadowBlur,
  setLineWidth,
  setOpacity,
  setShadowBlur,
}: {
  lineWidth: number;
  opacity: number;
  shadowBlur: number;
  setLineWidth: Dispatch<SetStateAction<number>>;
  setOpacity: Dispatch<SetStateAction<number>>;
  setShadowBlur: Dispatch<SetStateAction<number>>;
}) => {
  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLineWidth(parseInt(value));
  };

  const handleOpaictyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setOpacity(parseInt(value));
  };

  const handleShadowBlurChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setShadowBlur(parseInt(value));
  };

  return (
    <div className="tool-options">
      {/* <span>Brush Control</span> */}
      <div className="option">
        <span>
          Size <b>{lineWidth}px</b>
        </span>
        <input
          type="range"
          min={1}
          max={100}
          onChange={handleWidthChange}
          value={lineWidth}
        />
      </div>
      <div className="option">
        <span>
          Opacity <b>{opacity}%</b>
        </span>
        <input
          type="range"
          min={1}
          max={100}
          onChange={handleOpaictyChange}
          value={opacity}
        />
      </div>
      <div className="option">
        <span>
          Shadow blur <b>{shadowBlur}</b>
        </span>
        <input
          type="range"
          min={0}
          max={100}
          onChange={handleShadowBlurChange}
          value={shadowBlur}
        />
      </div>
    </div>
  );
};

export default ToolOptions;
