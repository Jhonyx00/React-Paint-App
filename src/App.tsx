import { useEffect, useRef, useState } from "react";
import Canvas from "./components/canvas.tsx";
import { Dimension } from "./interfaces/dimension.ts";
import "./App.css";
import { Point } from "./interfaces/point.ts";

const App = () => {
  const [isDrawing, setIsDrawing] = useState(false);

  const canvasContainer: React.Ref<HTMLDivElement> = useRef(null);
  const [parentDimension, setParentDimension] = useState<Dimension>({
    width: 0,
    height: 0,
  });

  const [mouseDownPosition, setMouseDownPosition] = useState<Point>({
    x: 0,
    y: 0,
  });

  const [mouseMovePosition, setMouseMovePosition] = useState<Point>({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    if (canvasContainer.current) {
      setParentDimension({
        width: canvasContainer.current.clientWidth,
        height: canvasContainer.current.clientHeight,
      });
    }
    const handleWheel = (event: WheelEvent) => {
      if (event.ctrlKey) {
        event.preventDefault();
      }
    };
    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      window.removeEventListener("wheel", handleWheel);
    };
  }, []);

  //handle events
  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>): void => {
    setIsDrawing(true);

    if (canvasContainer.current) {
      const x = event.nativeEvent.offsetX;
      const y = event.nativeEvent.offsetY;
      setMouseDownPosition({ x: x, y: y });
    }
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!isDrawing) return;
    if (canvasContainer.current) {
      const x = event.nativeEvent.offsetX;
      const y = event.nativeEvent.offsetY;
      console.log(x, y);

      setMouseMovePosition({ x: x, y: y });
    }
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  //

  return (
    <div className="toolbar-canvas-container">
      <div className="toolbar-container">
        <div className="tool">tool</div>
        <div className="tool">tool</div>
        <div className="tool">tool</div>
        <div className="tool">tool</div>
      </div>

      <div className="canvas-statusbar-container">
        <div
          className="canvas-main-container"
          ref={canvasContainer}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          <Canvas
            width={parentDimension.width}
            height={parentDimension.height}
            positionDown={mouseDownPosition}
            positionMove={mouseMovePosition}
          ></Canvas>
        </div>
        <div className="status-bar-container">status</div>
      </div>
    </div>
  );
};

export default App;
