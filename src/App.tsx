import { useEffect, useRef, useState } from "react";
import Canvas from "./components/canvas.tsx";
import { Dimension } from "./interfaces/dimension.ts";
import "./App.css";

const App = () => {
  const canvasContainer: React.Ref<HTMLDivElement> = useRef(null);
  const [parentDimension, setParentDimension] = useState<Dimension>({
    width: 0,
    height: 0,
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
  console.log(parentDimension);

  return (
    <div className="toolbar-canvas-container">
      <div className="toolbar-container">
        <div className="tool">tool</div>
      </div>
      <div className="canvas-statusbar-container">
        <div className="canvas-main-container" ref={canvasContainer}>
          <Canvas
            width={parentDimension.width}
            height={parentDimension.height}
          ></Canvas>
        </div>
        <div className="status-bar-container">status</div>
      </div>
    </div>
  );
};

export default App;
