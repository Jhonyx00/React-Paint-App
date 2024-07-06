//React
import { useEffect, useRef, useState } from "react";

//React JSX Elements
import Tool from "./components/tool/tool.tsx";
import Canvas from "./components/canvas/canvas.tsx";
import ColorPalette from "./components/colorPalette/colorPalette.tsx";

//Interfaces
import { CurrentTool } from "./interfaces/IconTool.ts";
import { Dimension } from "./interfaces/dimension.ts";

//Styles
import "./App.css";
import { Position } from "./interfaces/position.ts";
import { shapeItems, toolsItems, selectItems } from "./utilities/data.ts";
import { Point } from "./interfaces/point.ts";

const App = () => {
  const canvasContainer = useRef<HTMLDivElement>(null);
  const [currentColor, setCurrentColor] = useState<string>("");
  const canvasPosition: Position = {
    left: canvasContainer.current?.getBoundingClientRect().left!,
    top: canvasContainer.current?.getBoundingClientRect().top!,
  };

  const [parentSize, setParentSize] = useState<Dimension>({
    width: 0,
    height: 0,
  });

  const [currentTool, setCurrentTool] = useState<CurrentTool>({
    toolGroupID: 3,
    toolId: 1,
    name: "Line",
  });

  const [cursorPosition, setCursorPosition] = useState<Point>({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    if (canvasContainer.current) {
      setParentSize({
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

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const precisePoint: Point = {
      x: e.clientX - canvasPosition.left,
      y: e.clientY - canvasPosition.top,
    };
    setCursorPosition(precisePoint);
  };

  return (
    <div className="toolbar-canvas-container">
      <div className="toolbar-container">
        <Tool
          toolGroupName={"Shapes"}
          toolItems={shapeItems}
          setCurrentTool={setCurrentTool}
        />
        <Tool
          toolGroupName={"Tools"}
          toolItems={toolsItems}
          setCurrentTool={setCurrentTool}
        />
        <Tool
          toolGroupName={"Select"}
          toolItems={selectItems}
          setCurrentTool={setCurrentTool}
        />
        <ColorPalette setCurrentColor={setCurrentColor} />
      </div>

      <div className="canvas-statusbar-container">
        <div
          ref={canvasContainer}
          className="canvas-main-container"
          onMouseMove={handleMouseMove}
        >
          <Canvas
            currentTool={currentTool}
            currentColor={currentColor}
            width={parentSize.width}
            height={parentSize.height}
            canvasPosition={canvasPosition}
          ></Canvas>
        </div>

        <div className="status-bar-container">
          <span className="dimension">
            Size:{" "}
            <b>
              {parentSize.width}, {parentSize.height}pixels
            </b>
          </span>
          <span className="current-tool">
            Selected: <b>{currentTool.name}</b>
          </span>
          <span className="position">
            Position:{" "}
            <b>
              {cursorPosition.x}, {cursorPosition.y}pixels
            </b>
          </span>
        </div>
      </div>
    </div>
  );
};

export default App;
