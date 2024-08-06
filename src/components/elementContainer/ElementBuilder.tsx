import { Dispatch, RefObject, SetStateAction } from "react";
import { resizeButtons } from "../../data/data";
import { Rect } from "../../interfaces/Rect";
import Canvas from "../canvas/Canvas";
import "./elementBuilder.css";

const ElementBuilder = ({
  rect,
  canvasRef,
  buttonsRef,
  tool,
  textArea,
  zoomFactor,
  text,
  setText,
  setResizeButtonId,
}: {
  rect: Rect;
  canvasRef: RefObject<HTMLCanvasElement>;
  buttonsRef: RefObject<HTMLDivElement>;
  tool: number;
  textArea: RefObject<HTMLTextAreaElement>;
  zoomFactor: number;
  text: string;
  setText: Dispatch<SetStateAction<string>>;
  setResizeButtonId: Dispatch<SetStateAction<number>>;
}) => {
  const handleButtonMouseDown = (buttonId: number) => {
    setResizeButtonId(buttonId);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.currentTarget.value);
  };

  return (
    <div className="element-container" style={rect}>
      <div className="btn-container">
        {tool === 6 ? (
          <textarea
            ref={textArea}
            onChange={handleChange}
            style={{
              fontSize: `${16 * zoomFactor}px`,
            }}
            value={text}
          ></textarea>
        ) : (
          <Canvas canvasRef={canvasRef} />
        )}

        {rect.width > 0 && rect.height > 0 && (
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

export default ElementBuilder;
