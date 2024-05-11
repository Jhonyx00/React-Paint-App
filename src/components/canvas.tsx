import { useEffect, useRef, useState } from "react";
import "../styles/canvas.css";

const Canvas: React.FC<any> = ({
  width,
  height,
  positionDown,
  positionMove,
}) => {
  const canvasRef: React.Ref<HTMLCanvasElement> = useRef(null);
  const [ctx, setContext] = useState<CanvasRenderingContext2D>();
  const [isInside, setIsInside] = useState(false);
  //init
  useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        setContext(ctx);
      }
    }
  }, []);

  const drawLine = (): void => {
    if (ctx && isInside) {
      ctx.beginPath();
      ctx.moveTo(positionDown.x, positionDown.y);
      ctx.lineTo(positionMove.x, positionMove.y);
      ctx.stroke();
      positionDown.x = positionMove.x;
      positionDown.y = positionMove.y;
    }
  };

  useEffect(() => {
    drawLine();
  }, [positionMove]);

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
