import React, { useEffect, useRef, useState } from "react";
import Canvas from "./components/canvas.tsx";
import { Dimension } from "./interfaces/dimension.ts";
import "./App.css";
import { Point } from "./interfaces/point.ts";
import { IconTool } from "./interfaces/IconTool.ts";

import pencil from "./assets/pencil.svg";
import eraser from "./assets/eraser.svg";
import oval from "./assets/oval.svg";
import rectangle from "./assets/rectangle.svg";

const DynamicComponent = () => {
  return (
    <div className="main-container">
      <h1>Dynamic component</h1>
    </div>
  );
};

const App = () => {
  const canvasContainer: React.Ref<HTMLDivElement> = useRef(null);
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

  const [isComponentVisible, setComponentVisible] = useState(false);

  const [toolId, setToolId] = useState(1);

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

      if (isComponentVisible) {
        setComponentVisible(false);
      } else {
        setComponentVisible(true);
      }
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
    //setComponentVisible(false);
  };

  const handleClick = (itemId: number) => {
    setToolId(itemId);
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

  return (
    <div className="toolbar-canvas-container">
      <div className="toolbar-container">
        {/*  */}
        <div className="tool-item-container">
          <span className="text">Tools</span>

          <div className="tool">
            {toolsItems.map((item) => (
              <button
                key={item.toolId}
                onClick={() => handleClick(item.toolId)}
              >
                <img className="icon" src={item.icon} alt="" />
              </button>
            ))}
          </div>
        </div>
        {/*  */}
      </div>

      <div className="canvas-statusbar-container">
        <div
          className="canvas-main-container"
          ref={canvasContainer}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          {/* {isComponentVisible && (
            <DynamicComponent></DynamicComponent>
          )} */}

          <Canvas
            width={parentDimension.width}
            height={parentDimension.height}
            positionDown={mouseDownPosition}
            positionMove={mouseMovePosition}
            toolId={toolId}
          ></Canvas>
        </div>
        <div className="status-bar-container">
          {parentDimension.width} × {parentDimension.height}pixels
        </div>
      </div>
    </div>
  );
};

export default App;
