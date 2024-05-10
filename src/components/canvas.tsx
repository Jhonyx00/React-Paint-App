import { useEffect, useRef, useState } from "react";

import "../styles/canvas.css";
import { Dimension } from "../interfaces/dimension";
import { Point } from "../interfaces/point";

const Canvas: React.FC<Dimension> = ({ width, height }) => {
  const canvasRef: React.Ref<HTMLCanvasElement> = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [ctx, setContext] = useState<CanvasRenderingContext2D>();
  const [mouseDownPosition, setMouseDownPosition] = useState<Point>({
    x: 0,
    y: 0,
  });

  //init
  useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");

      if (ctx) {
        setContext(ctx);
        ctx.strokeStyle = "blue";
      }
    }
  }, []);

  //handle events
  const handleMouseDown = (event: { clientX: any; clientY: any }): void => {
    setIsDrawing(true);
    setMouseDownPosition({ x: event.clientX, y: event.clientY });
  };

  const handleMouseMove = (event: { clientX: number; clientY: number }) => {
    if (!isDrawing) return;
    //colocar un switch
    drawLine(event);
    setMouseDownPosition({ x: event.clientX, y: event.clientY });
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  //canvas painting
  const drawLine = (event: { clientX: number; clientY: number }) => {
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(mouseDownPosition.x, mouseDownPosition.y);
      ctx.lineTo(event.clientX, event.clientY);
      ctx.stroke();
    }
  };

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    ></canvas>
  );
};

export default Canvas;
