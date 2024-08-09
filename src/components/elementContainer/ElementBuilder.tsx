import { Dispatch, RefObject, SetStateAction, useEffect, useRef } from "react";
import { resizeButtons } from "../../data/data";
import { Rect } from "../../interfaces/Rect";
import Canvas from "../canvas/Canvas";
import "./elementBuilder.css";
import { Point } from "../../interfaces/Point";
import { Dimension } from "../../interfaces/Dimension";

const ElementBuilder = ({
  rect,
  canvasRef,
  buttonsRef,
  tool,
  textArea,
  zoomFactor,
  text,
  //positionDown,
  //lineWidth,
  //color,
  //viewportSize,
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
  // positionDown: Point;
  // lineWidth: number;
  // color: string;
  // viewportSize: Dimension;
  setText: Dispatch<SetStateAction<string>>;
  setResizeButtonId: Dispatch<SetStateAction<number>>;
}) => {
  const handleButtonMouseDown = (buttonId: number) => {
    setResizeButtonId(buttonId);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.currentTarget.value);
  };

  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d", {
      willReadFrequently: true,
    });
    ctxRef.current = ctx;
  }, [canvasRef]);

  // const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
  //   if (tool === 3 || tool === 4) {
  //     const point = {
  //       x: e.nativeEvent.offsetX / zoomFactor,
  //       y: e.nativeEvent.offsetY / zoomFactor,
  //     };

  //     if (!ctxRef.current) return;
  //     ctxRef.current.save();
  //     ctxRef.current.scale(zoomFactor, zoomFactor);
  //     ctxRef.current.beginPath();
  //     ctxRef.current.moveTo(positionDown.x, positionDown.y);
  //     ctxRef.current.lineTo(point.x, point.y);
  //     ctxRef.current.stroke();
  //     ctxRef.current.restore();
  //     positionDown.x = point.x;
  //     positionDown.y = point.y;
  //   }
  // };

  // const handleMouseOver = () => {
  //   if (ctxRef.current) {
  //     ctxRef.current.strokeStyle = tool === 4 ? "white" : color;
  //     ctxRef.current.lineCap = "round";
  //     ctxRef.current.lineWidth = lineWidth;
  //   }
  // };

  return (
    <div
      className="element-container"
      style={rect}
      // onMouseMove={handleMouseMove}
      // onMouseOver={handleMouseOver}
    >
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
          <Canvas
            canvasRef={canvasRef}
            // size={{
            //   width: tool === 3 || tool === 4 ? viewportSize.width : 300,
            //   height: tool === 3 || tool === 4 ? viewportSize.height : 150,
            // }}
            size={{ width: 300, height: 150 }}
          />
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
