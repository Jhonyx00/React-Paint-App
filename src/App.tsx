//React
import React, { useEffect, useRef, useState } from "react";

//components
import Canvas from "./components/canvas.tsx";
import Tool from "./components/tool.tsx";

//Interfaces
import { Dimension } from "./interfaces/dimension.ts";
import { Point } from "./interfaces/point.ts";
import { IconTool } from "./interfaces/IconTool.ts";

//Images
import pencil from "./assets/pencil.svg";
import eraser from "./assets/eraser.svg";
import oval from "./assets/oval.svg";
import rectangle from "./assets/rectangle.svg";
import star from "./assets/star.svg";
import rhombus from "./assets/rhombus.svg";
import pentagon from "./assets/pentagon.svg";
import hexagon from "./assets/hexagon.svg";
import triangle from "./assets/triangle.svg";

//Styles
import "./App.css";
import ColorPalette from "./components/colorPalette.tsx";

const App = () => {
  const canvasContainer = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
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

  const [currentTool, setCurrentTool] = useState<IconTool>({
    toolGroupID: 3,
    toolId: 1,
    name: "Line",
    icon: pencil,
  });

  const [currentColor, setCurrentColor] = useState("");

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
      setMouseMovePosition({ x: x, y: y });
    }
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  //list items

  const toolsItems: IconTool[] = [
    {
      toolGroupID: 3,
      toolId: 1,
      name: "Line",
      icon: pencil,
    },
    {
      toolGroupID: 4,
      toolId: 2,
      name: "Eraser",
      icon: eraser,
    },
    {
      toolGroupID: 3,
      toolId: 3,
      name: "Pencil",
      icon: rectangle,
    },
    {
      toolGroupID: 4,
      toolId: 4,
      name: "Eraser 2",
      icon: oval,
    },
  ];

  //
  const shapeItems: IconTool[] = [
    {
      toolGroupID: 1,
      toolId: 1,
      name: "Rectangle",
      icon: rectangle,
    },
    {
      toolGroupID: 1,
      toolId: 2,
      name: "Ellipse",
      icon: oval,
    },
    {
      toolGroupID: 1,
      toolId: 3,
      name: "Hexagon",
      icon: hexagon,
    },
    {
      toolGroupID: 1,
      toolId: 4,
      name: "Triangle",
      icon: triangle,
    },
    {
      toolGroupID: 1,
      toolId: 5,
      name: "Pentagon",
      icon: pentagon,
    },
    {
      toolGroupID: 1,
      toolId: 6,
      name: "Star",
      icon: star,
    },

    {
      toolGroupID: 1,
      toolId: 7,
      name: "Rhombus",
      icon: rhombus,
    },
  ];

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

        <ColorPalette setCurrentColor={setCurrentColor} />
      </div>

      <div className="canvas-statusbar-container">
        <div
          ref={canvasContainer}
          className="canvas-main-container"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          <Canvas
            width={parentDimension.width}
            height={parentDimension.height}
            positionDown={mouseDownPosition}
            positionMove={mouseMovePosition}
            currentTool={currentTool}
            currentColor={currentColor}
          ></Canvas>
        </div>

        <div className="status-bar-container">
          {parentDimension.width} × {parentDimension.height}pixels,
          {currentTool.name}
        </div>
      </div>
    </div>
  );
};

export default App;
