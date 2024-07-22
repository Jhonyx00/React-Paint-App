import { Dispatch, RefObject, SetStateAction } from "react";
import { ShapeContainer } from "../../interfaces/ShapeContainer";
import { resizeButtons } from "../../utilities/data";
import "./shapePanel.css";
const ShapePanel = ({
  dimension,
  canvasRef,
  buttonsRef,
  setResizeButtonId,
}: {
  dimension: Pick<ShapeContainer, "width" | "height" | "left" | "top">;
  canvasRef: RefObject<HTMLCanvasElement>;
  buttonsRef: RefObject<HTMLDivElement>;
  setResizeButtonId: Dispatch<SetStateAction<number>>;
}) => {
  const handleButtonMouseDown = (buttonId: number) => {
    setResizeButtonId(buttonId);
  };
  return (
    <div
      className="shape-container"
      style={{
        left: dimension.left,
        top: dimension.top,
        width: dimension.width,
        height: dimension.height,
      }}
    >
      <div className="btn-container">
        <canvas className="aux-canvas" ref={canvasRef}></canvas>
        {dimension.width > 0 && dimension.height > 0 && (
          <div className="buttons" ref={buttonsRef}>
            {resizeButtons.map((button) => (
              <button
                key={button.id}
                className={button.class}
                onPointerDown={() => handleButtonMouseDown(button.id)}
              ></button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShapePanel;
