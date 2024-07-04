import React, { useEffect, useRef, useState } from "react";

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
  currentTool,
  currentColor,
  canvasPosition,
}: {
  width: number;
  height: number;
  currentTool: IconTool;
  currentColor: string;
  canvasPosition: Position;
}) => {
  //refs
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const auxCanvas = useRef<HTMLCanvasElement>(null);
  const shapeContainerRef = useRef<HTMLDivElement>(null);
  const ctxAux = auxCanvas.current?.getContext("2d");

  //useState
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

  const [isImageData, setIsImageData] = useState<boolean>(false);
  const [isOnShapeContainer, setIsOnShapeContainer] = useState<boolean>(false);
  const [isOnResizeButton, setIsOnResizeButton] = useState<boolean>(false);
  const [XY, setXY] = useState<Point>({ x: 0, y: 0 });
  const [buttonId, setButtonId] = useState<number>(0);
  const [isOutside, setIsOutside] = useState<boolean>(true);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [imageData, setImageData] = useState<ImageData | undefined>(undefined);

  const [resizePoint, setResizePoint] = useState<Point>({
    x: 0,
    y: 0,
  });

  const [positionDown, setMouseDownPosition] = useState<Point>({
    x: 0,
    y: 0,
  });

  const [positionMove, setMouseMovePosition] = useState<Point>({
    x: 0,
    y: 0,
  });

  //arrays
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

  useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        setContext(ctx);
      }
    }
  }, []);

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

  //SHAPES
  const drawShapeContainer = () => {
    let rectangleWidth = positionMove.x - positionDown.x;
    let rectangleHeight = positionMove.y - positionDown.y;
    let newWidth = Math.abs(rectangleWidth);
    let newHeight = Math.abs(rectangleHeight);

    setShapeContainer({
      ...shapeContainer,
      width: newWidth,
      height: newHeight,
      referenceWidth: newWidth,
      referenceHeight: newHeight,
      componentClass: currentTool.name,
    });

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

  const erase = () => {
    if (ctx) {
      ctx.clearRect(positionMove.x, positionMove.y, 20, 20);
    }
  };

  const handelMouseLeave = () => {
    setIsInside(false);

    paintShape();

    resetShapeContainerProps();
  };

  const handleMouseEnter = () => {
    setIsInside(true);
  };

  //SHAPE CONTAINER

  const handleShapeContainerMouseDown = (
    event: React.MouseEvent<HTMLDivElement>
  ) => {
    setIsOnShapeContainer(true);

    setXY({
      x: event.clientX - shapeContainer.left - canvasPosition.left,
      y: event.clientY - shapeContainer.top - canvasPosition.top,
    });
  };

  const handleShapeContainerMouseLeave = () => {
    setIsOutside(true);
  };

  const handleShapeContainerMouseEnter = () => {
    setIsOutside(false);
  };

  //MAIN CONTAINER //////////////////////////////////////////
  const handleMainContainerMouseDown = (
    event: React.MouseEvent<HTMLDivElement>
  ) => {
    setIsDrawing(true);
    // resetShapeContainerReferenceProps();
    const point: Point = {
      x: event.clientX,
      y: event.clientY,
    };

    if (!isInside) return; //inside canvas area

    //inside shape container
    setResizePoint({ x: point.x, y: point.y });
    //if "Selected is selected, cursor is inside shape container and there is no image yet"
    if (currentTool.toolGroupID === 2 && !isImageData) {
      setSelection();
    }

    if (!isOutside) return;
    auxCanvas.current!.style.backgroundColor = "transparent";

    //outside shape container
    setMouseDownPosition({
      x: point.x - canvasPosition.left,
      y: point.y - canvasPosition.top,
    });

    if (ctx) {
      ctx.strokeStyle = currentColor;
      ctx.fillStyle = currentColor;
      shapeContainer.background = currentColor;
    }

    if (currentTool.toolGroupID === 1) {
      paintShape();
      resetAuxCanvasDimension();
      setPath(currentTool.toolId);
    }
    // "Select is selected"
    if (currentTool.toolGroupID === 2) {
      resetSelection();
      ctxAux?.clearRect(0, 0, 300, 150); ////////
    }
  };

  const resetAuxCanvasDimension = () => {
    if (auxCanvas.current) {
      auxCanvas.current.width = 300;
      auxCanvas.current.height = 150;
    }
  };

  const resetSelection = () => {
    const { left, top, width, height } = shapeContainer;
    ctxAux?.clearRect(0, 0, width, height);
    setIsImageData(false);
    setImageData(undefined);

    if (!auxCanvas.current) return;
    auxCanvas.current.style.backgroundColor = "transparent";

    if (!ctx || !imageData) return;
    ctx?.putImageData(imageData, left, top);
  };

  const setSelection = () => {
    const { left, top, width, height } = shapeContainer;

    if (!(width > 0 && height > 0)) return;
    const image = ctx?.getImageData(left, top, width, height);

    if (!image) return;
    ctx?.clearRect(left, top, width, height);

    if (!auxCanvas.current) return;

    auxCanvas.current.width = image.width;
    auxCanvas.current.height = image.height;
    ctxAux?.putImageData(image, 0, 0);
    auxCanvas.current.style.backgroundColor = "white";

    setIsImageData(true);
    setImageData(image);
  };

  const handleMainContainerMouseMove = (
    event: React.MouseEvent<HTMLDivElement>
  ) => {
    const point: Point = {
      x: event.clientX,
      y: event.clientY,
    };

    // substract left value of canvas container (toolbar and possibly a menu on top)
    const precisePoint: Point = {
      x: point.x - canvasPosition.left,
      y: point.y - canvasPosition.top,
    };

    if (isOnResizeButton) {
      setResizeValues(point);
    } else if (isOnShapeContainer) {
      moveShapeContainer(precisePoint);
    } else {
      setMouseMovePosition(precisePoint);
      if (!isDrawing) return;
      if (!isInside) return;
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
    }
  };

  const handleMainContainerMouseUp = () => {
    setIsDrawing(false);
    setIsOnShapeContainer(false);
    setIsOnResizeButton(false);
    resetShapeContainerReferenceProps();
  };

  const setResizeValues = (point: Point) => {
    //calculate value from mousedown to offset
    const dX = point.x - resizePoint.x;
    const dY = point.y - resizePoint.y;
    //calculate new top, left, width and height from original width and height
    const newTop = shapeContainer.referenceTop + dY;
    const newLeft = shapeContainer.referenceLeft + dX;
    const newWidth = shapeContainer.referenceWidth - dX;
    const newHeight = shapeContainer.referenceHeight - dY;
    const newInverseWidth = shapeContainer.referenceWidth + dX;
    const newInverseHeight = shapeContainer.referenceHeight + dY;
    //set new values to shapeContainer if the new values are greather than zero

    switch (buttonId) {
      case 1:
        nwResize(newLeft, newTop, newWidth, newHeight);
        break;

      case 2:
        wResize(newLeft, newWidth);
        break;

      case 3:
        swResize(newLeft, newWidth, newInverseHeight);
        break;

      case 4:
        sResize(newInverseHeight);
        break;

      case 5:
        seResize(newInverseWidth, newInverseHeight);
        break;

      case 6:
        eResize(newInverseWidth);
        break;

      case 7:
        neResize(newTop, newHeight, newInverseWidth);
        break;

      case 8:
        nResize(newTop, newHeight);
        break;

      default:
        break;
    }
  };

  //RESIZE FUNCTIONS

  //1
  const nwResize = (
    newLeft: number,
    newTop: number,
    newWidth: number,
    newHeight: number
  ) => {
    if (newWidth > 0 && newHeight > 0) {
      setShapeContainer((s) => ({
        ...s,
        left: newLeft,
        top: newTop,
        width: newWidth,
        height: newHeight,
      }));
    } else if (newWidth < 0 && newHeight > 0) {
      setShapeContainer((s) => ({
        ...s,
        top: newTop,
        height: newHeight,
      }));
    } else if (newHeight < 0 && newWidth > 0) {
      setShapeContainer((s) => ({
        ...s,
        left: newLeft,
        width: newWidth,
      }));
    }
  };
  //2
  const wResize = (newLeft: number, newWidth: number) => {
    if (newWidth > 0) {
      setShapeContainer((s) => ({
        ...s,
        left: newLeft,
        width: newWidth,
      }));
    }
  };
  //3
  const swResize = (
    newLeft: number,
    newWidth: number,
    newInverseHeight: number
  ) => {
    if (newWidth > 0 && newInverseHeight > 0) {
      setShapeContainer((s) => ({
        ...s,
        left: newLeft,
        width: newWidth,
        height: newInverseHeight,
      }));
    } else if (newWidth < 0 && newInverseHeight > 0) {
      setShapeContainer((s) => ({
        ...s,
        height: newInverseHeight,
      }));
    } else if (newInverseHeight < 0 && newWidth > 0) {
      setShapeContainer((s) => ({
        ...s,
        left: newLeft,
        width: newWidth,
      }));
    }
  };
  //4
  const sResize = (newInverseHeight: number) => {
    if (newInverseHeight > 0) {
      setShapeContainer((s) => ({
        ...s,
        height: newInverseHeight,
      }));
    }
  };
  //5
  const seResize = (newInverseWidth: number, newInverseHeight: number) => {
    if (newInverseWidth > 0 && newInverseHeight > 0) {
      setShapeContainer((s) => ({
        ...s,
        width: newInverseWidth,
        height: newInverseHeight,
      }));
    } else if (newInverseWidth < 0 && newInverseHeight > 0) {
      setShapeContainer((s) => ({
        ...s,
        height: newInverseHeight,
      }));
    } else if (newInverseWidth > 0 && newInverseHeight < 0) {
      setShapeContainer((s) => ({
        ...s,
        width: newInverseWidth,
      }));
    }
  };
  //6
  const eResize = (newInverseWidth: number) => {
    if (newInverseWidth > 0) {
      //
      shapeContainer.width = newInverseWidth;
      setShapeContainer((s) => ({
        ...s,
        width: newInverseWidth,
      }));
    }
  };
  //7
  const neResize = (
    newTop: number,
    newHeight: number,
    newInverseWidth: number
  ) => {
    if (newHeight > 0 && newInverseWidth > 0) {
      setShapeContainer((s) => ({
        ...s,
        top: newTop,
        width: newInverseWidth,
        height: newHeight,
      }));
    } else if (newHeight > 0 && newInverseWidth < 0) {
      setShapeContainer((s) => ({
        ...s,
        top: newTop,
        height: newHeight,
      }));
    } else if (newHeight < 0 && newInverseWidth > 0) {
      setShapeContainer((s) => ({
        ...s,
        width: newInverseWidth,
      }));
    }
  };
  //8
  const nResize = (newTop: number, newHeight: number) => {
    if (newHeight > 0) {
      setShapeContainer((s) => ({
        ...s,
        top: newTop,
        height: newHeight,
      }));
    }
  };

  const handleButtonMouseDown = (buttonId: number) => {
    setButtonId(buttonId);
    setIsOnResizeButton(true);
  };

  const handleButtonMouseUp = () => {
    resetShapeContainerReferenceProps();
  };

  const moveShapeContainer = (point: Point) => {
    setShapeContainer((s) => ({
      ...s,
      top: point.y - XY.y,
      left: point.x - XY.x,
      referenceTop: point.y - XY.y,
      referenceLeft: point.x - XY.x,
    }));
  };

  const resetShapeContainerReferenceProps = () => {
    setShapeContainer((s) => ({
      ...s,
      referenceLeft: s.left,
      referenceTop: s.top,
      referenceWidth: s.width,
      referenceHeight: s.height,
    }));
  };

  return (
    <div
      className="canvas-container"
      onMouseLeave={handelMouseLeave}
      onMouseEnter={handleMouseEnter}
      onMouseUp={handleMainContainerMouseUp}
      onMouseDown={handleMainContainerMouseDown}
      onMouseMove={handleMainContainerMouseMove}
    >
      <div
        className="main-container"
        style={{
          zIndex: isDrawing ? 2 : 4,
        }}
      >
        <div
          className="shape-container"
          style={{
            left: shapeContainer.left,
            top: shapeContainer.top,
            width: shapeContainer.width,
            height: shapeContainer.height,
            outline: isDrawing ? "" : "1.4px dashed gray",
          }}
          onMouseDown={handleShapeContainerMouseDown}
          onMouseLeave={handleShapeContainerMouseLeave}
          onMouseEnter={handleShapeContainerMouseEnter}
          ref={shapeContainerRef}
        >
          <div className="aux-canvas-button-container">
            <canvas className="aux-canvas" ref={auxCanvas}></canvas>
            <div className="btn-container">
              {buttons.map((button) => (
                <button
                  key={button.id}
                  className={button.class}
                  onMouseDown={() => handleButtonMouseDown(button.id)}
                  onMouseUp={handleButtonMouseUp}
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
