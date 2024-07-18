import { Dispatch, RefObject, SetStateAction } from "react";
import { ShapeContainer } from "../../interfaces/shapeContainer";
import { resizeButtons } from "../../utilities/data";
import "./shapePanel.css";
const ShapePanel = ({
  shapeContainer,
  canvasRef,
  buttonsRef,
  setResizeButtonId,
}: {
  shapeContainer: Pick<ShapeContainer, "width" | "height" | "left" | "top">;
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
        left: shapeContainer.left,
        top: shapeContainer.top,
        width: shapeContainer.width,
        height: shapeContainer.height,
      }}
    >
      <div className="btn-container">
        <canvas className="aux-canvas" ref={canvasRef}></canvas>
        {shapeContainer.width > 0 && shapeContainer.height > 0 && (
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
