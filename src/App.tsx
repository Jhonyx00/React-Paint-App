//React
import { useEffect, useRef, useState } from "react";

//React JSX Elements
import Tool from "./components/tool/Tool.tsx";
import Menu from "./components/menu/Menu.tsx";
import StatusBar from "./components/statusBar/StatusBar.tsx";
import ToolOptions from "./components/toolOptions/ToolOptions.tsx";
import ColorPalette from "./components/colorPalette/ColorPalette.tsx";
import DrawingCanvas from "./components/drawingCanvas/DrawingCanvas.tsx";

//utils
import getScaledPoint from "./utils/getScaledPoint.ts";

//Interfaces
import { Point } from "./interfaces/Point.ts";
import { ToolItem } from "./interfaces/ToolItem.ts";
import { Dimension } from "./interfaces/Dimension.ts";
import { Position } from "./interfaces/Position.ts";

//Data
import { toolItems, selectItems, iconShapes } from "./data/data.ts";

//const
import { ZOOM_STEP } from "./constants/canvasConfig.ts";

//Styles
import "./App.css";

const App = () => {
  //Refs
  const drawingCanvasRef = useRef<HTMLDivElement>(null);
  const drawingPanelRef = useRef<HTMLDivElement>(null);

  //state
  const [currentColor, setCurrentColor] = useState<string>("");
  const [selected, setSelected] = useState<boolean>(false);
  const [lineWidth, setLineWidth] = useState<number>(2);
  const [opacity, setOpacity] = useState<number>(100);
  const [shadowBlur, setShadowBlur] = useState<number>(0);
  const [isMoving, setIsMoving] = useState<boolean>(false);
  const [XY, setXY] = useState<Point>({ x: 0, y: 0 });
  const [elementPosition, setElementPosition] = useState({ left: 0, top: 0 });

  const [transition, setTransition] = useState<boolean>(false);
  const [zoomFactor, setZoomFactor] = useState<number>(100);
  const [parentSize, setParentSize] = useState<Dimension>({
    width: 0,
    height: 0,
  });

  const [currentTool, setCurrentTool] = useState<ToolItem>({
    groupId: 3,
    id: 1,
    name: "Line",
  });

  const [cursorPosition, setCursorPosition] = useState<Point>({
    x: 0,
    y: 0,
  });

  const [pixelOffset, setPixelOffset] = useState<Position>({
    left: 0,
    top: 0,
  });

  const [key, setKey] = useState<string>("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key;
      const zoomControlKey = key === "+" || key === "-" || key === "=";
      if (e.ctrlKey && zoomControlKey) {
        e.preventDefault();
        setKey(key);
        performKeyAction(key);
      }
    };

    const performKeyAction = (key: string) => {
      if (key === "-") {
        // increase zoom
        setZoomFactor((prev) => prev - ZOOM_STEP);
        // set new element position based on new zoom origin
        setElementPosition((prev) => ({
          left: prev.left + pixelOffset.left,
          top: prev.top + pixelOffset.top,
        }));
      } else {
        setZoomFactor((prev) => prev + ZOOM_STEP);
        setElementPosition((prev) => ({
          left: prev.left - pixelOffset.left,
          top: prev.top - pixelOffset.top,
        }));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [pixelOffset, key]);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey) {
        e.preventDefault();
      }
    };
    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      window.removeEventListener("wheel", handleWheel);
    };
  }, []);

  const calculatePixelOffset = () => {
    const halfWidth = parentSize.width / 2;
    const halfHeight = parentSize.height / 2;
    //zoom origin (always center of the viewport)
    const viewportCenterX = halfWidth - elementPosition.left;
    const viewportCenterY = halfHeight - elementPosition.top;
    //
    const leftDiff = viewportCenterX / zoomFactor;
    const topDiff = viewportCenterY / zoomFactor;
    const newLeft = leftDiff * ZOOM_STEP;
    const newTop = topDiff * ZOOM_STEP;
    setPixelOffset({ left: newLeft, top: newTop });
  };

  // init component
  useEffect(() => {
    if (!drawingPanelRef.current) return;
    // initial size
    setParentSize({
      width: drawingPanelRef.current.clientWidth,
      height: drawingPanelRef.current.clientHeight,
    });
    // first zoom origin is center of canvas
    setInitialZoomOrigin();
  }, []);

  const setInitialZoomOrigin = () => {
    if (drawingPanelRef.current)
      setPixelOffset({
        left: drawingPanelRef.current.clientWidth / 2 / ZOOM_STEP,
        top: drawingPanelRef.current.clientHeight / 2 / ZOOM_STEP,
      });
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!e.ctrlKey) return;
    if (transition) setTransition(false);
    setIsMoving(true);
    setXY({
      x: e.clientX - elementPosition.left,
      y: e.clientY - elementPosition.top,
    });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const point = { x: e.clientX, y: e.clientY };
    //on canvas container
    if (e.target !== drawingPanelRef.current) {
      if (!drawingCanvasRef.current) return;
      const { left, top } = drawingCanvasRef.current.getBoundingClientRect();

      const scaledPoint = getScaledPoint(point, zoomFactor / 100, {
        left,
        top,
      });

      setCursorPosition({
        x: Math.round(scaledPoint.x),
        y: Math.round(scaledPoint.y),
      });
    }
    // on canvas-container (move from any mouse position inside main drawing canvas)
    if (isMoving) {
      setElementPosition({
        left: point.x - XY.x,
        top: point.y - XY.y,
      });
      calculatePixelOffset();
    }
  };

  const handleMouseUp = () => {
    setIsMoving(false);
  };

  // const handleDblClick = () => {
  //   //reset canvas position
  //   if (elementPosition.left || elementPosition.top) {
  //     setTransition(true);
  //     setElementPosition({ left: 0, top: 0 });
  //   }
  //   //reset zoom
  //   if (zoomFactor !== 100) {
  //     setZoomFactor(100);
  //   }
  //   //reset zoom origin
  //   if (pixelOffset.left) {
  //     setInitialZoomOrigin();
  //   }
  // };

  return (
    <div className="app">
      <div className="toolbar">
        <Tool
          toolGroupName={"Shapes"}
          setCurrentTool={setCurrentTool}
          setSelected={setSelected}
          currentColor={currentColor}
          toolItems={iconShapes}
        />
        <Tool
          toolGroupName={"Tools"}
          toolItems={toolItems}
          setCurrentTool={setCurrentTool}
          setSelected={setSelected}
          currentColor={currentColor}
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
      <div className="main-content">
        <div
          ref={drawingPanelRef}
          className="drawing-panel"
          onMouseMove={handleMouseMove}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          // onDoubleClick={handleDblClick}
          style={{
            cursor: isMoving ? "grabbing" : "crosshair",
          }}
        >
          {selected && <Menu />}

          <DrawingCanvas
            drawingCanvas={drawingCanvasRef}
            parentSize={parentSize}
            currentTool={currentTool}
            currentColor={currentColor}
            lineWidth={lineWidth}
            opacity={opacity / 100}
            shadowBlur={shadowBlur}
            elementPosition={elementPosition}
            zoomFactor={zoomFactor / 100}
            setSelected={setSelected}
          />
        </div>

        <StatusBar
          parentSize={parentSize}
          cursorPosition={cursorPosition}
          currentTool={currentTool.name}
          scaleValue={zoomFactor}
          setScaleValue={setZoomFactor}
        />
      </div>
    </div>
  );
};

export default App;
