import { Dimension } from "../../interfaces/Dimension";
import "./canvas.css";
const Canvas = ({
  canvasRef,
  size,
}: {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  size: Dimension;
}) => {
  return (
    <canvas
      className="canvas"
      ref={canvasRef}
      width={size.width}
      height={size.height}
    ></canvas>
  );
};

export default Canvas;
