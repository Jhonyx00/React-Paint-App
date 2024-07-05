//React
import { useEffect, useRef, useState } from "react";

//React JSX Elements
import Tool from "./components/tool/tool.tsx";
import Canvas from "./components/canvas/canvas.tsx";
import ColorPalette from "./components/colorPalette/colorPalette.tsx";

//Interfaces
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
import select from "./assets/select.svg";
import freeSelect from "./assets/free-form-select.svg";

//Styles
import "./App.css";
import { Position } from "./interfaces/position.ts";

const App = () => {
  const canvasContainer = useRef<HTMLDivElement>(null);
  const [currentColor, setCurrentColor] = useState<string>("");
  const canvasPosition: Position = {
    left: canvasContainer.current?.getBoundingClientRect().left!,
    top: canvasContainer.current?.getBoundingClientRect().top!,
  };

  const [parentDimension, setParentDimension] = useState<Dimension>({
    width: 0,
    height: 0,
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

  const selectItems: IconTool[] = [
    {
      toolGroupID: 2,
      toolId: 1,
      name: "Select",
      icon: select,
    },
    {
      toolGroupID: 10,
      toolId: 2,
      name: "FreeSelect",
      icon: freeSelect,
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
        <Tool
          toolGroupName={"Select"}
          toolItems={selectItems}
          setCurrentTool={setCurrentTool}
        />
        <ColorPalette setCurrentColor={setCurrentColor} />
      </div>

      <div className="canvas-statusbar-container">
        <div ref={canvasContainer} className="canvas-main-container">
          <Canvas
            currentTool={currentTool}
            currentColor={currentColor}
            width={parentDimension.width}
            height={parentDimension.height}
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
