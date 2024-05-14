//React
import React, { useEffect, useRef, useState } from "react";

//React JSX Elements
import Tool from "./components/tool.tsx";
import Canvas from "./components/canvas.tsx";
import ColorPalette from "./components/colorPalette.tsx";

//Interfaces
import { Point } from "./interfaces/point.ts";
import { IconTool } from "./interfaces/IconTool.ts";
import { Dimension } from "./interfaces/dimension.ts";

//Images
import oval from "./assets/oval.svg";
import star from "./assets/star.svg";
import pencil from "./assets/pencil.svg";
import eraser from "./assets/eraser.svg";
import rhombus from "./assets/rhombus.svg";
import hexagon from "./assets/hexagon.svg";
import triangle from "./assets/triangle.svg";
import pentagon from "./assets/pentagon.svg";
import rectangle from "./assets/rectangle.svg";

//Styles
import "./App.css";
import { Position } from "./interfaces/position.ts";

const App = () => {
  const canvasContainer = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [currentColor, setCurrentColor] = useState<string>("");
  const [currentShape, setCurrentShape] = useState<boolean>(true);
  const canvasPosition: Position = {
    left: canvasContainer.current?.getBoundingClientRect().left!,
    top: canvasContainer.current?.getBoundingClientRect().top!,
  };

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

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>): void => {
    if (canvasContainer.current) {
      const x = event.nativeEvent.offsetX;
      const y = event.nativeEvent.offsetY;
      if (currentShape == true) {
        setIsDrawing(true);
        setMouseDownPosition({ x: x, y: y });
      }
    }
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!isDrawing) return;
    if (canvasContainer.current) {
      const x = event.nativeEvent.offsetX;
      const y = event.nativeEvent.offsetY;
      if (currentShape == true) {
        setMouseMovePosition({ x: x, y: y });
      }
    }
  };

  const handleMouseUp = () => {
    if (currentShape == true) {
      setIsDrawing(false);
    }
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
            isDrawing={isDrawing}
            currentTool={currentTool}
            currentColor={currentColor}
            width={parentDimension.width}
            height={parentDimension.height}
            positionDown={mouseDownPosition}
            positionMove={mouseMovePosition}
            setCurrentShape={setCurrentShape}
            canvasPosition={canvasPosition}
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
