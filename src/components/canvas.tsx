import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";

//interfaces
import { Point } from "../interfaces/point";
import { IconTool } from "../interfaces/IconTool";
import { ShapeContainer } from "../interfaces/shapeContainer";

//styles
import "../styles/canvas.css";
import { Position } from "../interfaces/position";

const Canvas = ({
  width,
  height,
  positionDown,
  positionMove,
  isDrawing,
  currentTool,
  currentColor,
  canvasPosition,
  setCurrentShape,
}: {
  width: number;
  height: number;
  positionDown: Point;
  positionMove: Point;
  isDrawing: boolean;
  currentTool: IconTool;
  currentColor: string;
  canvasPosition: Position;
  setCurrentShape: Dispatch<SetStateAction<boolean>>;
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dynamicCanvasRef = useRef<HTMLCanvasElement>(null);
  const ctxAux = dynamicCanvasRef.current?.getContext("2d");

  const [ctx, setContext] = useState<CanvasRenderingContext2D>();
  const [isInside, setIsInside] = useState(false);

  const [shapeContainer, setShapeContainer] = useState<ShapeContainer>({
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
    rotation: 0,
  });

  const shapes = [
    { name: "Rectangle", path: "M0 0, L0 150, L300 150, L300 0 Z" },
    { name: "Ellipse", path: "M0 75 A150 75 0 1 0 300 75 A150 75 0 1 0 0 75" },
    {
      name: "Hexagon",
      path: "M75 0, L0 75, L75 150, L225 150, L300 75, L225 0 Z",
    },
    { name: "Triangle", path: "M150 0, L0 150, L300 150 Z" },
    { name: "Pentagon", path: "M150 0, L0 57, L54 150, L246 150, L300 57 Z" },
    {
      name: "Star",
      path: "M150 0, L189 57, L300 57, L207 88.5, L246 150, L150 112.5, L54 150, L93 88.5, L0 57, L111 57, Z",
    },
    {
      name: "Rhombus",
      path: "M150 0, L0 75, L150,150 L300,75 Z",
    },
  ];

  const buttons = [
    { id: 1, class: "btn1" },
    { id: 2, class: "btn2" },
    { id: 3, class: "btn3" },
    { id: 4, class: "btn4" },
    { id: 5, class: "btn5" },
    { id: 6, class: "btn6" },
    { id: 7, class: "btn7" },
    { id: 8, class: "btn8" },
  ];

  const [isOnShapeContainer, setIsOnShapeContainer] = useState<boolean>(false);

  const [XY, setXY] = useState<Point>({ x: 0, y: 0 });

  useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        setContext(ctx);
      }
    }
  }, []);

  useEffect(() => {
    if (isInside) {
      if (ctx) {
        ctx.strokeStyle = currentColor;
        ctx.fillStyle = currentColor;
        shapeContainer.background = currentColor;
      }

      if (currentTool.toolGroupID === 2) {
        setShapeContainer((s) => ({ ...s, background: "transparent" }));
      } else {
        //setShapeContainer((s) => ({ ...s, background: currentColor })); // set Color from input
      }

      setPath(currentTool.toolId);

      switch (currentTool.toolGroupID) {
        case 1:
          paintShape();
          resetShapeContainerProps();
          break;
        default:
          break;
      }
    }
  }, [positionDown]);

  useEffect(() => {
    //mouse move
    if (isInside) {
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

      // moveShapeContainer(positionMove.x, positionMove.y);
    }
  }, [positionMove]);

  const paintShape = () => {
    switch (shapeContainer.componentClass) {
      case "Rectangle":
        drawRectangle();
        break;

      case "Triangle":
        drawTriangle();
        break;

      case "Ellipse":
        drawEllipse();
        break;

      case "Pentagon":
        drawPentagon();
        break;

      case "Hexagon":
        drawHexagon();
        break;

      case "Star":
        drawStar();
        break;

      case "Rhombus":
        drawRhombus();
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
      ctx.fillRect(
        shapeContainer.left,
        shapeContainer.top,
        shapeContainer.width,
        shapeContainer.height
      );
    }
  };

  const drawTriangle = () => {
    if (ctx) {
      const polygonCoords: Point[] = [
        {
          x: shapeContainer.left + shapeContainer.width * 0.5,
          y: shapeContainer.top,
        },
        {
          x: shapeContainer.left,
          y: shapeContainer.top + shapeContainer.height,
        },
        {
          x: shapeContainer.left + shapeContainer.width,
          y: shapeContainer.top + shapeContainer.height,
        },
      ];

      ctx.beginPath();
      ctx.moveTo(polygonCoords[0].x, polygonCoords[0].y);

      for (let i = 0; i < polygonCoords.length; i++) {
        ctx.lineTo(polygonCoords[i].x, polygonCoords[i].y);
      }
      ctx.closePath();
      ctx.fill();
    }
  };

  const drawEllipse = () => {
    const { width, height, top, left } = shapeContainer;
    const endAngle = Math.PI * 2;
    if (ctx) {
      ctx.beginPath();
      ctx.ellipse(
        left + width * 0.5,
        top + height * 0.5,
        Math.abs(width) * 0.5,
        Math.abs(height) * 0.5,
        0,
        0,
        endAngle
      );
      ctx.fill();
    }
  };

  const drawPentagon = () => {
    const { width, height, top, left } = shapeContainer;
    if (ctx) {
      const polygonCoords: Point[] = [
        { x: left + width * 0.5, y: top },
        { x: left, y: top + height * 0.38 },
        { x: left + width * 0.18, y: top + height },
        { x: left + width * 0.82, y: top + height },
        { x: left + width, y: top + height * 0.38 },
      ];

      ctx.beginPath();
      ctx.moveTo(polygonCoords[0].x, polygonCoords[0].y);

      for (let i = 0; i < polygonCoords.length; i++) {
        ctx.lineTo(polygonCoords[i].x, polygonCoords[i].y);
      }
      ctx.closePath();
      ctx.fill();
    }
  };

  const drawHexagon = () => {
    const { width, height, top, left } = shapeContainer;
    /*Numerical values expressed in percentage indicate where to place each point 
      according to the width and height of aux component:
      width * 0.25 = 25% of aux component height 
      */
    if (ctx) {
      const polygonCoords: Point[] = [
        { x: left + width * 0.25, y: top },
        { x: left, y: top + height * 0.5 },
        { x: left + width * 0.25, y: top + height },
        { x: left + width * 0.75, y: top + height },
        { x: left + width, y: top + height * 0.5 },
        { x: left + width * 0.75, y: top },
      ];

      ctx.beginPath();
      ctx.moveTo(polygonCoords[0].x, polygonCoords[0].y);

      for (let i = 0; i < polygonCoords.length; i++) {
        ctx.lineTo(polygonCoords[i].x, polygonCoords[i].y);
      }
      ctx.closePath();
      ctx.fill();
    }
  };

  const drawStar = () => {
    const { width, height, top, left } = shapeContainer;

    if (ctx) {
      const polygonCoords: Point[] = [
        { x: left + width * 0.5, y: top },
        { x: left + width * 0.37, y: top + height * 0.38 },
        { x: left, y: top + height * 0.38 },
        { x: left + width * 0.31, y: top + height * 0.59 },
        { x: left + width * 0.18, y: top + height * 1 },
        { x: left + width * 0.5, y: top + height * 0.75 },
        { x: left + width * 0.82, y: top + height * 1 },
        { x: left + width * 0.69, y: top + height * 0.59 },
        { x: left + width * 1, y: top + height * 0.38 },
        { x: left + width * 0.63, y: top + height * 0.38 },
      ];

      ctx.beginPath();
      ctx.moveTo(polygonCoords[0].x, polygonCoords[0].y);

      for (let i = 0; i < polygonCoords.length; i++) {
        ctx.lineTo(polygonCoords[i].x, polygonCoords[i].y);
      }
      ctx.closePath();
      ctx.fill();
    }
  };

  const drawRhombus = () => {
    const { width, height, top, left } = shapeContainer;
    if (ctx) {
      const polygonCoords: Point[] = [
        { x: left + width * 0.5, y: top },
        { x: left, y: top + height * 0.5 },
        { x: left + width * 0.5, y: top + height },
        { x: left + width, y: top + height * 0.5 },
      ];

      ctx.beginPath();
      ctx.moveTo(polygonCoords[0].x, polygonCoords[0].y);

      for (let i = 0; i < polygonCoords.length; i++) {
        ctx.lineTo(polygonCoords[i].x, polygonCoords[i].y);
      }
      ctx.closePath();
      ctx.fill();
    }
  };

  const resetShapeContainerProps = () => {
    setShapeContainer({
      top: 0,
      left: 0,
      width: 0,
      height: 0,
      referenceTop: 0,
      referenceLeft: 0,
      referenceWidth: 0,
      referenceHeight: 0,
      background: "",
      componentClass: "",
      rotation: 0,
    });
  };

  const setPath = (id: number) => {
    const path = new Path2D(shapes[id - 1].path);

    if (ctxAux) {
      ctxAux.fillStyle = shapeContainer.background;
      ctxAux.clearRect(0, 0, 300, 150);
      ctxAux.fill(path);
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

  //SHAPE CONTAINER
  const handleShapeContainerMouseLeave = () => {
    //console.log("outside");
    setCurrentShape(true);
  };

  const handleShapeContainerMouseEnter = () => {
    // console.log("inside");
    setCurrentShape(false);
  };

  const handleShapeContainerMouseDown = (
    event: React.MouseEvent<HTMLDivElement>
  ) => {
    setIsOnShapeContainer(true);
    setXY({
      x: event.clientX - shapeContainer.left - canvasPosition.left,
      y: event.clientY - shapeContainer.top - canvasPosition.top,
    });
  };

  //

  //MAIN CONTAINER
  const handleMainContainerMouseDown = (
    event: React.MouseEvent<HTMLDivElement>
  ) => {};

  const handleMainContainerMouseMove = (
    event: React.MouseEvent<HTMLDivElement>
  ) => {
    if (isOnShapeContainer === true) {
      console.log();
      moveShapeContainer(event.clientX - canvasPosition.left, event.clientY);
    }
  };

  const handleMainContainerMouseUp = () => {
    setIsOnShapeContainer(false);
  };
  //

  const handleButtonClick = (buttonId: number) => {
    console.log(buttonId);
  };

  const moveShapeContainer = (x: number, y: number) => {
    setShapeContainer((s) => ({
      ...s,
      top: y - XY.y,
      left: x - XY.x,
      referenceTop: y - XY.y,
      referenceLeft: x - XY.x,
    }));
  };

  return (
    <div
      className="canvas-container"
      onMouseLeave={handelMouseLeave}
      onMouseEnter={handleMouseEnter}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          position: "absolute",
          zIndex: isDrawing ? 2 : 4,
        }}
        onMouseDown={handleMainContainerMouseDown}
        onMouseMove={handleMainContainerMouseMove}
        onMouseUp={handleMainContainerMouseUp}
      >
        <div
          className="canvas-button-container"
          style={{
            left: shapeContainer.left,
            top: shapeContainer.top,
            width: shapeContainer.width,
            height: shapeContainer.height,
            outline: isDrawing ? "" : "1.4px dashed gray",
            position: "absolute",
            cursor: "move",
          }}
          onMouseLeave={handleShapeContainerMouseLeave}
          onMouseEnter={handleShapeContainerMouseEnter}
          onMouseDown={handleShapeContainerMouseDown}
        >
          <div
            className="canvas-button-container"
            style={{
              position: "relative",
              width: "100%",
              height: "100%",
            }}
          >
            <canvas
              ref={dynamicCanvasRef}
              style={{
                width: "100%",
                height: "100%",
                position: "absolute",
                inset: 0,
              }}
            ></canvas>
            <div
              className="btn-container"
              style={{
                position: "absolute",
                width: "100%",
                height: "100%",
              }}
            >
              {buttons.map((button) => (
                <button
                  key={button.id}
                  className={button.class}
                  onClick={() => handleButtonClick(button.id)}
                ></button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <canvas
        ref={canvasRef}
        height={height}
        width={width}
        className="canvas"
      ></canvas>

      <div
        className="canvas-shield"
        style={{ width: width, height: height }}
      ></div>
    </div>
  );
};

export default Canvas;
