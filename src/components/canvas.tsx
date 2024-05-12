import { useEffect, useRef, useState } from "react";
import { Point } from "../interfaces/point";
import { IconTool } from "../interfaces/IconTool";
import { ShapeContainer } from "../interfaces/shapeContainer";
import "../styles/canvas.css";

const DynamicComponent = (shapeContainer: ShapeContainer) => {
  return (
    // <div className="main-container">
    //   <div
    //     className="canvas-button-container"
    //     style={{
    //       left: shapeContainer.left,
    //       top: shapeContainer.top,
    //       width: shapeContainer.width,
    //       height: shapeContainer.height,
    //       border: "1px solid blue",
    //     }}
    //   >
    //     <div className="aux-canvas-container">
    //       <canvas className="aux-canvas"></canvas>
    //     </div>
    //   </div>
    // </div>

    <div
      style={{
        position: "absolute",
        left: shapeContainer.left,
        top: shapeContainer.top,
        width: shapeContainer.width,
        height: shapeContainer.height,
        backgroundColor: shapeContainer.background,
      }}
    ></div>
  );
};

const Canvas = ({
  width,
  height,
  positionDown,
  positionMove,
  currentTool,
}: {
  width: number;
  height: number;
  positionDown: Point;
  positionMove: Point;
  currentTool: IconTool;
}) => {
  const canvasRef: React.Ref<HTMLCanvasElement> = useRef(null);
  const [ctx, setContext] = useState<CanvasRenderingContext2D>();
  const [isInside, setIsInside] = useState(false);
  const [isComponentVisible, setComponentVisible] = useState(true);

  const [shapeContainer, setShapeContainer] = useState({
    top: 0,
    left: 0,
    width: 0,
    height: 0,
    background: "",
    componentClass: "",
    referenceTop: 0,
    referenceLeft: 0,
    referenceWidth: 0,
    referenceHeight: 0,
    isRendered: false,
    rotation: 0,
  });

  useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        setContext(ctx);
        ctx.strokeStyle = "blue";
      }
    }
  }, [ctx]);

  useEffect(() => {
    // if (isInside) {
    switch (currentTool.toolGroupID) {
      case 1:
      case 2:
        drawShapeContainer();
        break;
      case 3:
        drawLine();
        break;

      case 4:
        erase();
        break;
      default:
        break;
    }
    // }
  }, [positionMove]);

  useEffect(() => {
    if (currentTool.toolGroupID === 2) {
      setShapeContainer((s) => ({ ...s, background: "transparent" }));
    } else {
      setShapeContainer((s) => ({ ...s, background: "blue" }));
    }
    switch (currentTool.toolGroupID) {
      case 1:
        paintShape();
        break;

      default:
        break;
    }
  }, [positionDown]);

  const paintShape = () => {
    switch (shapeContainer.componentClass) {
      case "Rectangle":
        drawRectangle();
        break;

      default:
        break;
    }
  };
  const drawLine = (): void => {
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(positionDown.x, positionDown.y);
      ctx.lineTo(positionMove.x, positionMove.y);
      ctx.stroke();
      positionDown.x = positionMove.x;
      positionDown.y = positionMove.y;
    }
  };

  const drawRectangle = () => {
    if (ctx) {
      ctx.fillStyle = shapeContainer.background;
      ctx.fillRect(
        shapeContainer.left,
        shapeContainer.top,
        shapeContainer.width,
        shapeContainer.height
      );

      console.log(canvasRef.current?.toDataURL());
    }
  };

  //
  //SHAPES
  const drawShapeContainer = () => {
    let rectangleWidth = positionMove.x - positionDown.x;
    let rectangleHeight = positionMove.y - positionDown.y;
    let newWidth = Math.abs(rectangleWidth);
    let newHeight = Math.abs(rectangleHeight);

    setShapeContainer((s) => ({
      ...s,
      width: newWidth,
      height: newHeight,
      referenceWidth: newWidth,
      referenceHeight: newHeight,
      componentClass: currentTool.name,
    }));

    // Quadrant 1
    if (rectangleWidth > 0 && rectangleHeight < 0) {
      setShapeContainer((s) => ({
        ...s,
        top: positionMove.y,
        left: positionDown.x,
        referenceTop: positionMove.y,
        referenceLeft: positionDown.x,
      }));
    }
    // Quadrant 2
    else if (rectangleWidth < 0 && rectangleHeight < 0) {
      setShapeContainer((s) => ({
        ...s,
        top: positionMove.y,
        left: positionMove.x,
        referenceTop: positionMove.y,
        referenceLeft: positionMove.x,
      }));
    }
    // Quadrant 3
    else if (rectangleWidth < 0 && rectangleHeight > 0) {
      setShapeContainer((s) => ({
        ...s,
        top: positionDown.y,
        left: positionMove.x,
        referenceTop: positionDown.y,
        referenceLeft: positionMove.x,
      }));
    }
    //Quadrant 4
    else {
      setShapeContainer((s) => ({
        ...s,
        top: positionDown.y,
        left: positionDown.x,
        referenceTop: positionDown.y,
        referenceLeft: positionDown.x,
      }));
    }
  };
  //

  const erase = () => {
    if (ctx) {
      ctx.clearRect(positionMove.x, positionMove.y, 20, 20);
    }
  };

  const handelMouseLeave = () => {
    setIsInside(false);
  };

  const handleMouseEnter = () => {
    setIsInside(true);
  };

  return (
    <div className="canvas-container">
      <DynamicComponent
        top={shapeContainer.top}
        left={shapeContainer.left}
        width={shapeContainer.width}
        height={shapeContainer.height}
        referenceTop={shapeContainer.referenceTop}
        referenceLeft={shapeContainer.referenceLeft}
        referenceWidth={shapeContainer.referenceWidth}
        referenceHeight={shapeContainer.referenceHeight}
        background={shapeContainer.background}
        componentClass={""}
        isRendered={false}
        rotation={0}
      ></DynamicComponent>

      <canvas
        className="canvas"
        onMouseLeave={handelMouseLeave}
        onMouseEnter={handleMouseEnter}
        ref={canvasRef}
        width={width}
        height={height}
      ></canvas>

      <div
        className="canvas-shield"
        style={{ width: width, height: height }}
      ></div>
    </div>
  );
};

export default Canvas;
