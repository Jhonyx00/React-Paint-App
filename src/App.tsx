//React
import { useEffect, useRef, useState } from "react";

//React JSX Elements
import Tool from "./components/tool/Tool.tsx";
import Canvas from "./components/canvas/Canvas.tsx";
import ColorPalette from "./components/colorPalette/ColorPalette.tsx";

//Interfaces
import { CurrentTool } from "./interfaces/IconTool.ts";
import { Dimension } from "./interfaces/Dimension.ts";

//Styles
import "./App.css";
import { Position } from "./interfaces/Position.ts";
import { shapeItems, toolsItems, selectItems } from "./utilities/data.ts";
import { Point } from "./interfaces/Point.ts";
import Menu from "./components/menu/Menu.tsx";
import ToolOptions from "./components/toolOptions/ToolOptions.tsx";

const App = () => {
  const canvasContainer = useRef<HTMLDivElement>(null);
  const [currentColor, setCurrentColor] = useState<string>("");
  const [selected, setSelected] = useState<boolean>(false);
  const [lineWidth, setLineWidth] = useState<number>(1);
  const [opacity, setOpacity] = useState<number>(100);
  const [shadowBlur, setShadowBlur] = useState<number>(0);
  const [isMoving, setIsMoving] = useState<boolean>(false);
  const prueba = useRef<HTMLDivElement>(null);
  const [XY, setXY] = useState<Point>({ x: 0, y: 0 });
  const [pos, setPos] = useState({ left: 0, top: 0 });
  const [transition, setTransition] = useState<boolean>(false);

  const [canvasPosition, setCanvasPosition] = useState<Position>({
    left: 0,
    top: 0,
  });

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

      setCanvasPosition({
        left: canvasContainer.current.getBoundingClientRect().left,
        top: canvasContainer.current.getBoundingClientRect().top,
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

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!e.ctrlKey) return;

    if (transition) setTransition(false);

    setIsMoving(true);
    setXY({
      x: e.clientX - pos.left,
      y: e.clientY - pos.top,
    });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target !== canvasContainer.current) {
      setCursorPosition({
        x: e.nativeEvent.offsetX,
        y: e.nativeEvent.offsetY,
      });
    }
    if (!isMoving) return;
    setPos({
      left: e.clientX - XY.x,
      top: e.clientY - XY.y,
    });
  };

  const handleMouseUp = () => {
    setIsMoving(false);
  };

  const handleDblClick = () => {
    if (pos.left || pos.top) {
      setTransition(true);
      setPos({ left: 0, top: 0 });
    }
  };

  return (
    <div className="toolbar-canvas-container">
      <div className="toolbar-container">
        <Tool
          toolGroupName={"Shapes"}
          toolItems={shapeItems}
          setCurrentTool={setCurrentTool}
          setSelected={setSelected}
        />
        <Tool
          toolGroupName={"Tools"}
          toolItems={toolsItems}
          setCurrentTool={setCurrentTool}
          setSelected={setSelected}
        />
        <Tool
          toolGroupName={"Select"}
          toolItems={selectItems}
          setCurrentTool={setCurrentTool}
          setSelected={setSelected}
        />
        <ColorPalette setCurrentColor={setCurrentColor} />
        <ToolOptions
          lineWidth={lineWidth}
          opacity={opacity}
          shadowBlur={shadowBlur}
          setShadowBlur={setShadowBlur}
          setLineWidth={setLineWidth}
          setOpacity={setOpacity}
        />
      </div>
      <div className="canvas-statusbar-container">
        <div
          ref={canvasContainer}
          className="canvas-main-container"
          onMouseMove={handleMouseMove}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onDoubleClick={handleDblClick}
          style={{
            cursor: isMoving ? "grabbing" : "crosshair",
          }}
        >
          {selected && <Menu />}

          <div
            className="moving-container"
            ref={prueba}
            style={{
              position: "absolute",
              left: pos.left + "px",
              top: pos.top + "px",
              transition: transition ? "left 400ms ease, top 400ms ease" : "",
            }}
          >
            <Canvas
              parentSize={parentSize}
              currentTool={currentTool}
              currentColor={currentColor}
              canvasPosition={canvasPosition}
              lineWidth={lineWidth}
              opacity={opacity / 100}
              shadowBlur={shadowBlur}
              setSelected={setSelected}
              pos={pos}
            />
          </div>
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
