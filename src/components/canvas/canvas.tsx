import React, { useEffect, useRef, useState } from "react";

//interfaces
import { Point } from "../../interfaces/point";
import { CurrentTool } from "../../interfaces/IconTool";
import { ShapeContainer } from "../../interfaces/shapeContainer";

//data
import { resizeButtons, shapes } from "../../utilities/data";

//styles
import "./canvas.css";
import { Position } from "../../interfaces/position";

const Canvas = ({
  width,
  height,
  currentTool,
  currentColor,
  canvasPosition,
  lineWidth,
}: {
  width: number;
  height: number;
  currentTool: CurrentTool;
  currentColor: string;
  canvasPosition: Position;
  lineWidth: number;
}) => {
  //refs
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const auxCanvas = useRef<HTMLCanvasElement>(null);
  const ctxAux = auxCanvas.current?.getContext("2d");
  //useState

  const [XY, setXY] = useState<Point>({ x: 0, y: 0 });
  const [shapePath, setShapePath] = useState<Path2D>();
  const [lassoPath, setLassoPath] = useState<Point[]>([]);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [lassoPoints, setLassoPoints] = useState<Point[]>([]);
  const [ctx, setContext] = useState<CanvasRenderingContext2D>();
  const [pngImage, setPngImage] = useState<HTMLImageElement>(new Image());
  // const [isPngImage, setIsPngImage] = useState<boolean | undefined>(false);
  const [imageData, setImageData] = useState<ImageData | undefined>(undefined);
  const [resizeButtonId, setResizeButtonId] = useState<number>(0);

  const [resizedImage, setResizedImage] = useState<
    HTMLImageElement | undefined
  >();

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

  const [positionDown, setMouseDownPosition] = useState<Point>({
    x: 0,
    y: 0,
  });

  const [positionMove, setMouseMovePosition] = useState<Point>({
    x: 0,
    y: 0,
  });

  const [bounding, setBounding] = useState({
    minX: 0,
    minY: 0,
    maxX: 0,
    maxY: 0,
  });

  const buttons = useRef<HTMLDivElement>(null);
  const canvasContainer = useRef<HTMLDivElement>(null);
  const [cursorState, setCursorState] = useState<
    "onShapeContainer" | "onResizeButton" | "onCanvas"
  >();

  useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d", {
        willReadFrequently: true,
      });
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
      setLassoPoints((prev) => [...prev, positionMove]);
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
    if (!ctxAux) return;
    if (id < 0) {
      ctxAux.clearRect(0, 0, 300, 150);
    } else {
      const path = new Path2D(shapes[id - 1].path);
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

  //MAIN CONTAINER
  const handleMainContainerMouseDown = (event: React.MouseEvent) => {
    setIsDrawing(true);

    setMouseDownPosition({
      x: event.clientX - canvasPosition.left,
      y: event.clientY - canvasPosition.top,
    });

    if (event.target === canvasRef.current) {
      resetShapeContainerProps();
      setCursorState("onCanvas");
      if (!auxCanvas.current) return; //inside canvas area
      auxCanvas.current.style.backgroundColor = "transparent";

      if (ctx) {
        ctx.strokeStyle = currentColor;
        ctx.fillStyle = currentColor;
        shapeContainer.background = currentColor;
        ctx.lineWidth = lineWidth;
        ctx.lineCap = "round";
      }

      switch (currentTool.toolGroupID) {
        case 1:
          paintShape();
          resetAuxCanvasDimension();
          setPath(currentTool.toolId);
          break;

        case 2:
          resetSelection();
          drawImage();
          ctxAux?.clearRect(0, 0, 300, 150);
          break;

        case 5:
          resetFreeFormShape();
          drawLassoImage();
          setLassoPoints([]);
          setBounding({ minX: 0, minY: 0, maxX: 0, maxY: 0 });
          setBounding((prev) => ({
            ...prev,
            minX: event.clientX,
            minY: event.clientY,
          }));
          break;

        case 10:
          drawLassoImage();
          resetSelection();
          setResizedImage(undefined);
          setPath(-1);
          setLassoPoints([]);
          /* set an initial value to start comparing in setMinMaxXY function,
          in order to get box dimensions of shapeContainer */
          setBounding({ minX: 0, minY: 0, maxX: 0, maxY: 0 });
          setBounding((prev) => ({
            ...prev,
            minX: event.clientX,
            minY: event.clientY,
          }));
          break;

        default:
          break;
      }
    } else if (event.target === buttons.current) {
      setCursorState("onShapeContainer");
      setXY({
        x: event.clientX - shapeContainer.left - canvasPosition.left,
        y: event.clientY - shapeContainer.top - canvasPosition.top,
      });

      if (currentTool.toolGroupID === 2 && !imageData) {
        setSelection("white");
        clearCanvasArea();
      }

      if (currentTool.toolGroupID === 10 && !imageData) {
        setSelection("transparent");
        setLassoImage();
        clearLassoSelection();
      }

      if (currentTool.toolGroupID === 5 && !imageData) {
        setIrregularShape();
      }
    } else {
      setCursorState("onResizeButton");

      // if (currentTool.toolGroupID === 5 && !imageData) {
      //   setIrregularShape();
      // }
      setMouseDownPosition({ x: event.clientX, y: event.clientY });
    }
  };

  const drawLassoImage = () => {
    const { left, top, width, height } = shapeContainer;
    ctx?.drawImage(pngImage, left, top, width, height);
  };

  const resetAuxCanvasDimension = () => {
    if (auxCanvas.current) {
      auxCanvas.current.width = 300;
      auxCanvas.current.height = 150;
    }
  };

  const resetSelection = () => {
    const { width, height } = shapeContainer;

    ctxAux?.clearRect(0, 0, width, height);
    setImageData(undefined);
    setResizedImage(undefined);
    if (!auxCanvas.current) return;
    auxCanvas.current.style.backgroundColor = "transparent";
  };

  const resetFreeFormShape = () => {
    const { width, height } = shapeContainer;
    if (!ctxAux) return;
    ctxAux.clearRect(0, 0, width, height);
    setImageData(undefined);
    ctxAux.fillStyle = currentColor;
    if (!auxCanvas.current) return;

    auxCanvas.current.style.backgroundColor = "transparent";
  };

  const drawImage = () => {
    const { left, top, width, height } = shapeContainer;
    if (!ctx) return;
    if (imageData && resizedImage) {
      ctx.fillStyle = "white"; //only if selection style is not transparent
      ctx.fillRect(left, top, width, height);
      ctx.drawImage(resizedImage, left, top, width, height);
    } else if (imageData && !resizedImage) {
      ctx?.putImageData(imageData, left, top);
    }
  };

  const setSelection = (background: string) => {
    const { left, top, width, height } = shapeContainer;
    if (!(width > 0 && height > 0)) return;
    const image = ctx?.getImageData(left, top, width, height);
    if (!image) return;
    if (!auxCanvas.current) return;
    auxCanvas.current.width = image.width;
    auxCanvas.current.height = image.height;
    ctxAux?.putImageData(image, 0, 0);
    auxCanvas.current.style.backgroundColor = background;
    setImageData(image);
  };

  const clearCanvasArea = () => {
    const { left, top, width, height } = shapeContainer;
    if (!ctx) return;
    ctx.clearRect(left, top, width, height);
  };

  const clearLassoSelection = () => {
    const { left, top } = shapeContainer;
    if (!shapePath || !pngImage || !ctx) return;
    pngImage.onload = () => {
      ctx.translate(left, top);
      ctx.fillStyle = "white";
      ctx.fill(shapePath);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
    };
  };

  const setIrregularShape = () => {
    const { left, top, width, height } = shapeContainer;
    const shapePath = new Path2D();
    ///
    setImageData(new ImageData(300, 150));
    //
    if (!ctxAux || !auxCanvas.current || !shapePath) return;
    auxCanvas.current.width = width;
    auxCanvas.current.height = height;

    for (let i = 0; i < lassoPath.length; i++)
      shapePath.lineTo(lassoPath[i].x - left, lassoPath[i].y - top);

    shapePath.closePath();
    ctxAux.clip(shapePath);
    ctxAux.fillStyle = currentColor;
    ctxAux.fill(shapePath);
    auxCanvas.current.style.backgroundColor = "transparent";
    const base64 = auxCanvas.current.toDataURL();
    pngImage.src = base64;
  };
  //
  //this needs an imagedata of shapeContainer
  //
  const setLassoImage = () => {
    const { left, top, width, height } = shapeContainer;
    const img = new Image();
    if (!auxCanvas.current) return;
    img.src = auxCanvas.current.toDataURL();
    img.onload = () => {
      ctxAux?.clearRect(0, 0, width, height);
      setShapePath(new Path2D());
      if (!shapePath || !ctxAux || !auxCanvas.current) return;

      for (let i = 0; i < lassoPath.length; i++)
        shapePath.lineTo(lassoPath[i].x - left, lassoPath[i].y - top);

      shapePath.closePath();
      ctxAux.clip(shapePath);
      ctxAux.drawImage(img, 0, 0);
      const base64 = auxCanvas.current.toDataURL();
      pngImage.src = base64;
      ctxAux.drawImage(pngImage, 0, 0);
    };
  };

  const setResizedImageValues = () => {
    if (!auxCanvas.current) return;
    if (cursorState !== "onResizeButton") return;
    const img = new Image();
    img.src = auxCanvas.current.toDataURL();
    setResizedImage(img);
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

    setMouseMovePosition(precisePoint);

    switch (cursorState) {
      case "onCanvas":
        setAction();
        break;

      case "onShapeContainer":
        moveShapeContainer(precisePoint);
        break;

      case "onResizeButton":
        setResizeValues(point);
        break;

      default:
        break;
    }
  };

  ///// cuando cambio de color no se quita el ultimo path en el drawFreeFormShape
  const setAction = () => {
    if (!isDrawing) return;
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
      case 5:
      case 10:
        drawLasso();
        break;
      default:
        break;
    }
  };

  const drawLasso = () => {
    drawLine();
    setMinMaxXY();
  };
  // set bounding of shapeContainer after drawing
  const setMinMaxXY = () => {
    if (positionMove.x < bounding.minX) {
      setBounding((prev) => ({ ...prev, minX: positionMove.x }));
    }
    if (positionMove.y < bounding.minY) {
      setBounding((prev) => ({ ...prev, minY: positionMove.y }));
    }
    if (positionMove.x > bounding.maxX) {
      setBounding((prev) => ({ ...prev, maxX: positionMove.x }));
    }
    if (positionMove.y > bounding.maxY) {
      setBounding((prev) => ({ ...prev, maxY: positionMove.y }));
    }
  };

  const handleMainContainerMouseUp = () => {
    setIsDrawing(false);
    if (!(shapeContainer.width && shapeContainer.height)) {
      if (imageData) return;
      if (lassoPoints.length <= 0) return;
      setLassoValues();
      setLassoPath(lassoPoints);
    } else {
      if (currentTool.toolGroupID === 2) {
        setResizedImageValues();
      }
      resetShapeContainerReferenceProps();
    }
  };

  const setLassoValues = () => {
    if (currentTool.toolGroupID === 10) {
      setLassoFrame("Lasso");
    } else if (currentTool.toolGroupID === 5) {
      setLassoFrame("IrregularShape");
    }
  };

  const setLassoFrame = (toolName: string) => {
    const frameWidth = bounding.maxX - bounding.minX;
    const frameHeight = bounding.maxY - bounding.minY;

    setShapeContainer((s) => ({
      ...s,
      left: bounding.minX,
      top: bounding.minY,
      width: frameWidth,
      height: frameHeight,
      componentClass: toolName,
    }));
  };

  const setResizeValues = (point: Point) => {
    if (!isDrawing) return;
    //calculate value from mousedown to offset
    const dX = point.x - positionDown.x;
    const dY = point.y - positionDown.y;
    //calculate new top, left, width and height from original width and height
    const newTop = shapeContainer.referenceTop + dY;
    const newLeft = shapeContainer.referenceLeft + dX;
    const newWidth = shapeContainer.referenceWidth - dX;
    const newHeight = shapeContainer.referenceHeight - dY;
    const newInverseWidth = shapeContainer.referenceWidth + dX;
    const newInverseHeight = shapeContainer.referenceHeight + dY;
    //set new values to shapeContainer if the new values are greather than zero

    switch (resizeButtonId) {
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
    setResizeButtonId(buttonId);
  };

  const moveShapeContainer = (point: Point) => {
    if (!isDrawing) return;
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
      onPointerDown={handleMainContainerMouseDown}
      onPointerMove={handleMainContainerMouseMove}
      onPointerUp={handleMainContainerMouseUp}
      ref={canvasContainer}
    >
      <div
        className="canvas-buttons"
        style={{
          left: shapeContainer.left,
          top: shapeContainer.top,
          width: shapeContainer.width,
          height: shapeContainer.height,
          outline: "1px dashed gray",
          boxShadow: "0px 0px 0px 1px white",
        }}
      >
        <div className="btn-container">
          <canvas className="shape-container" ref={auxCanvas}></canvas>
          {!isDrawing && (
            <div className="buttons" ref={buttons}>
              {resizeButtons.map((button) => (
                <button
                  key={button.id}
                  className={button.class}
                  onPointerDown={() => handleButtonMouseDown(button.id)}
                ></button>
              ))}
            </div>
          )}
        </div>
      </div>

      <canvas
        ref={canvasRef}
        height={height}
        width={width}
        className="canvas"
      ></canvas>
    </div>
  );
};

export default Canvas;
