import { useEffect, useRef, useState } from "react";
import "../styles/canvas.css";

const Canvas: React.FC<any> = ({
  width,
  height,
  positionDown,
  positionMove,
  toolId,
}) => {
  const canvasRef: React.Ref<HTMLCanvasElement> = useRef(null);
  const [ctx, setContext] = useState<CanvasRenderingContext2D>();
  const [isInside, setIsInside] = useState(false);

  useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        setContext(ctx);
        ctx.strokeStyle = "blue";
      }
    }
  }, [ctx]);

  useEffect(() => {
    if (isInside) {
      switch (toolId) {
        case 1:
          drawLine();
          break;

        case 2:
          erase();
          break;
        default:
          break;
      }
    }
  }, [positionMove]);

  const drawLine = (): void => {
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(positionDown.x, positionDown.y);
      ctx.lineTo(positionMove.x, positionMove.y);
      ctx.stroke();
      positionDown.x = positionMove.x;
      positionDown.y = positionMove.y;
    }
  };

  const erase = () => {
    if (ctx) {
      ctx.clearRect(positionMove.x, positionMove.y, 20, 20);
    }
  };

  const handelMouseLeave = () => {
    setIsInside(false);
  };

  const handleMouseEnter = () => {
    setIsInside(true);
  };

  return (
    <canvas
      onMouseLeave={handelMouseLeave}
      onMouseEnter={handleMouseEnter}
      ref={canvasRef}
      width={width}
      height={height}
    ></canvas>
  );
};

export default Canvas;
