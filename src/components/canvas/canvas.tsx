import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";

//interfaces
import { Point } from "../../interfaces/point";
import { CurrentTool } from "../../interfaces/IconTool";
import { ShapeContainer } from "../../interfaces/shapeContainer";

//data
import { shapes } from "../../utilities/data";

//styles
import "./canvas.css";
import { Position } from "../../interfaces/position";
import ShapePanel from "../shapePanel/ShapePanel";
import { Dimension } from "../../interfaces/dimension";

const Canvas = ({
  parentSize,
  currentTool,
  currentColor,
  canvasPosition,
  lineWidth,
  lineOpacity,
  setSelected,
}: {
  parentSize: Dimension;
  currentTool: CurrentTool;
  currentColor: string;
  canvasPosition: Position;
  lineWidth: number;
  lineOpacity: number;
  setSelected: Dispatch<SetStateAction<boolean>>;
}) => {
  //refs
  const buttons = useRef<HTMLDivElement>(null);
  const mainCanvas = useRef<HTMLCanvasElement>(null);
  const auxCanvas = useRef<HTMLCanvasElement>(null);
  const canvasContainer = useRef<HTMLDivElement>(null);

  //useState
  const [XY, setXY] = useState<Point>({ x: 0, y: 0 });
  const [shapePath, setShapePath] = useState<Path2D>();
  const [lassoPath, setLassoPath] = useState<Point[]>([]);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [lassoPoints, setLassoPoints] = useState<Point[]>([]);
  const [mainCtx, setContext] = useState<CanvasRenderingContext2D>();
  const [auxCtx, setAuxCtx] = useState<CanvasRenderingContext2D>();
  const [pngImage, setPngImage] = useState<HTMLImageElement>(new Image());
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

  const [pointerState, setPointerState] = useState<
    "onShapeContainer" | "onResizeButton" | "onCanvas"
  >();

  useEffect(() => {
    if (!mainCanvas.current) return;
    const mainCtx = mainCanvas.current.getContext("2d", {
      willReadFrequently: true,
    });
    if (!mainCtx) return;
    mainCtx.lineCap = "round";
    setContext(mainCtx);
  }, [mainCtx]);

  useEffect(() => {
    if (!auxCanvas.current) return;
    const auxCtx = auxCanvas.current.getContext("2d", {
      willReadFrequently: true,
    });
    if (!auxCtx) return;
    setAuxCtx(auxCtx);
  }, []);

  ///events
  const handleMouseDown = (event: React.MouseEvent) => {
    setIsDrawing(true);

    setMouseDownPosition({
      x: event.clientX - canvasPosition.left,
      y: event.clientY - canvasPosition.top,
    });

    switch (event.target) {
      case mainCanvas.current:
        resetShapeContainerProps();
        setPointerState("onCanvas");
        setSelected(false);
        setCanvasOptions();
        performAction({ x: event.clientX, y: event.clientY });
        break;
      case buttons.current:
        setPointerState("onShapeContainer");
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
        break;
      default:
        setPointerState("onResizeButton");

        // if (currentTool.toolGroupID === 5 && !imageData) {
        //   setIrregularShape();
        // }
        setMouseDownPosition({ x: event.clientX, y: event.clientY });
        break;
    }
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
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

    switch (pointerState) {
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

  const handleMouseUp = () => {
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

  const setCanvasOptions = () => {
    if (!auxCanvas.current) return;
    auxCanvas.current.style.backgroundColor = "transparent";

    if (mainCtx) {
      mainCtx.strokeStyle = currentColor;
      mainCtx.fillStyle = currentColor;
      shapeContainer.background = currentColor;
      mainCtx.lineWidth = lineWidth;
      mainCtx.globalAlpha = 1;
      if (currentTool.toolGroupID !== 3) return;
      mainCtx.globalAlpha = lineOpacity;
    }
  };
  ///
  const performAction = (point: Point) => {
    switch (currentTool.toolGroupID) {
      case 1:
        paintShape();
        resetAuxCanvasDimension();
        setPath(currentTool.toolId);
        break;

      case 2:
        resetSelection();
        drawImage();
        auxCtx?.clearRect(0, 0, 300, 150);
        break;

      case 5:
        resetFreeFormShape();
        drawLassoImage();
        setLassoPoints([]);
        setBounding({
          maxX: 0,
          maxY: 0,
          minX: point.x,
          minY: point.y,
        });
        break;

      case 10:
        drawLassoImage();
        resetSelection();
        setResizedImage(undefined);
        setPath(-1);
        setLassoPoints([]);
        /* set an initial value to start comparing in setMinMaxXY function,
      in order to get box dimensions of shapeContainer */
        setBounding({
          maxX: 0,
          maxY: 0,
          minX: point.x,
          minY: point.y,
        });
        break;

      default:
        break;
    }
  };
  ///

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
    if (mainCtx) {
      mainCtx.beginPath();
      mainCtx.moveTo(positionDown.x, positionDown.y);
      mainCtx.lineTo(positionMove.x, positionMove.y);
      mainCtx.stroke();
      positionDown.x = positionMove.x;
      positionDown.y = positionMove.y;
      setLassoPoints((prev) => [...prev, positionMove]);
    }
  };

  const drawRectangle = () => {
    if (mainCtx) {
      mainCtx.fillRect(
        shapeContainer.left,
        shapeContainer.top,
        shapeContainer.width,
        shapeContainer.height
      );
    }
  };

  const drawTriangle = () => {
    if (mainCtx) {
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

      mainCtx.beginPath();
      mainCtx.moveTo(polygonCoords[0].x, polygonCoords[0].y);

      for (let i = 0; i < polygonCoords.length; i++) {
        mainCtx.lineTo(polygonCoords[i].x, polygonCoords[i].y);
      }
      mainCtx.closePath();
      mainCtx.fill();
    }
  };

  const drawEllipse = () => {
    const { width, height, top, left } = shapeContainer;
    const endAngle = Math.PI * 2;
    if (mainCtx) {
      mainCtx.beginPath();
      mainCtx.ellipse(
        left + width * 0.5,
        top + height * 0.5,
        Math.abs(width) * 0.5,
        Math.abs(height) * 0.5,
        0,
        0,
        endAngle
      );
      mainCtx.fill();
    }
  };

  const drawPentagon = () => {
    const { width, height, top, left } = shapeContainer;
    if (mainCtx) {
      const polygonCoords: Point[] = [
        { x: left + width * 0.5, y: top },
        { x: left, y: top + height * 0.38 },
        { x: left + width * 0.18, y: top + height },
        { x: left + width * 0.82, y: top + height },
        { x: left + width, y: top + height * 0.38 },
      ];

      mainCtx.beginPath();
      mainCtx.moveTo(polygonCoords[0].x, polygonCoords[0].y);

      for (let i = 0; i < polygonCoords.length; i++) {
        mainCtx.lineTo(polygonCoords[i].x, polygonCoords[i].y);
      }
      mainCtx.closePath();
      mainCtx.fill();
    }
  };

  const drawHexagon = () => {
    const { width, height, top, left } = shapeContainer;
    /*Numerical values expressed in percentage indicate where to place each point 
      according to the width and height of aux component:
      width * 0.25 = 25% of aux component height 
      */
    if (mainCtx) {
      const polygonCoords: Point[] = [
        { x: left + width * 0.25, y: top },
        { x: left, y: top + height * 0.5 },
        { x: left + width * 0.25, y: top + height },
        { x: left + width * 0.75, y: top + height },
        { x: left + width, y: top + height * 0.5 },
        { x: left + width * 0.75, y: top },
      ];

      mainCtx.beginPath();
      mainCtx.moveTo(polygonCoords[0].x, polygonCoords[0].y);

      for (let i = 0; i < polygonCoords.length; i++) {
        mainCtx.lineTo(polygonCoords[i].x, polygonCoords[i].y);
      }
      mainCtx.closePath();
      mainCtx.fill();
    }
  };

  const drawStar = () => {
    const { width, height, top, left } = shapeContainer;

    if (mainCtx) {
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

      mainCtx.beginPath();
      mainCtx.moveTo(polygonCoords[0].x, polygonCoords[0].y);

      for (let i = 0; i < polygonCoords.length; i++) {
        mainCtx.lineTo(polygonCoords[i].x, polygonCoords[i].y);
      }
      mainCtx.closePath();
      mainCtx.fill();
    }
  };

  const drawRhombus = () => {
    const { width, height, top, left } = shapeContainer;
    if (mainCtx) {
      const polygonCoords: Point[] = [
        { x: left + width * 0.5, y: top },
        { x: left, y: top + height * 0.5 },
        { x: left + width * 0.5, y: top + height },
        { x: left + width, y: top + height * 0.5 },
      ];

      mainCtx.beginPath();
      mainCtx.moveTo(polygonCoords[0].x, polygonCoords[0].y);

      for (let i = 0; i < polygonCoords.length; i++) {
        mainCtx.lineTo(polygonCoords[i].x, polygonCoords[i].y);
      }
      mainCtx.closePath();
      mainCtx.fill();
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
    if (!auxCtx) return;
    if (id < 0) {
      auxCtx.clearRect(0, 0, 300, 150);
    } else {
      const path = new Path2D(shapes[id - 1].path);
      auxCtx.fillStyle = shapeContainer.background;
      auxCtx.clearRect(0, 0, 300, 150);
      auxCtx.fill(path);
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
    if (mainCtx) {
      mainCtx.clearRect(positionMove.x, positionMove.y, lineWidth, lineWidth);
    }
  };

  // canvas functions
  const drawLassoImage = () => {
    const { left, top, width, height } = shapeContainer;
    mainCtx?.drawImage(pngImage, left, top, width, height);
  };

  const resetAuxCanvasDimension = () => {
    if (auxCanvas.current) {
      auxCanvas.current.width = 300;
      auxCanvas.current.height = 150;
    }
  };

  const resetSelection = () => {
    const { width, height } = shapeContainer;

    auxCtx?.clearRect(0, 0, width, height);
    setImageData(undefined);
    setResizedImage(undefined);
    if (!auxCanvas.current) return;
    auxCanvas.current.style.backgroundColor = "transparent";
  };

  const resetFreeFormShape = () => {
    const { width, height } = shapeContainer;
    if (!auxCtx) return;
    auxCtx.clearRect(0, 0, width, height);
    setImageData(undefined);
    auxCtx.fillStyle = currentColor;
    if (!auxCanvas.current) return;

    auxCanvas.current.style.backgroundColor = "transparent";
  };

  const drawImage = () => {
    const { left, top, width, height } = shapeContainer;
    if (!mainCtx) return;
    if (imageData && resizedImage) {
      mainCtx.fillStyle = "white"; //only if selection style is not transparent
      mainCtx.fillRect(left, top, width, height);
      mainCtx.drawImage(resizedImage, left, top, width, height);
    } else if (imageData && !resizedImage) {
      mainCtx?.putImageData(imageData, left, top);
    }
  };

  const setSelection = (background: string) => {
    const { left, top, width, height } = shapeContainer;
    if (!(width > 0 && height > 0)) return;
    const image = mainCtx?.getImageData(left, top, width, height);
    if (!image) return;
    if (!auxCanvas.current) return;
    auxCanvas.current.width = image.width;
    auxCanvas.current.height = image.height;
    auxCtx?.putImageData(image, 0, 0);
    auxCanvas.current.style.backgroundColor = background;
    setImageData(image);
  };

  const clearCanvasArea = () => {
    const { left, top, width, height } = shapeContainer;
    if (!mainCtx) return;
    mainCtx.clearRect(left, top, width, height);
  };

  const clearLassoSelection = () => {
    const { left, top } = shapeContainer;
    if (!shapePath || !pngImage || !mainCtx) return;
    pngImage.onload = () => {
      mainCtx.translate(left, top);
      mainCtx.fillStyle = "white";
      mainCtx.fill(shapePath);
      mainCtx.setTransform(1, 0, 0, 1, 0, 0);
    };
  };

  const setIrregularShape = () => {
    const { left, top, width, height } = shapeContainer;
    const shapePath = new Path2D();
    ///
    setImageData(new ImageData(300, 150));
    //
    if (!auxCtx || !auxCanvas.current || !shapePath) return;
    auxCanvas.current.width = width;
    auxCanvas.current.height = height;

    for (let i = 0; i < lassoPath.length; i++)
      shapePath.lineTo(lassoPath[i].x - left, lassoPath[i].y - top);

    shapePath.closePath();
    auxCtx.clip(shapePath);
    auxCtx.fillStyle = currentColor;
    auxCtx.fill(shapePath);
    auxCanvas.current.style.backgroundColor = "transparent";
    const base64 = auxCanvas.current.toDataURL();
    pngImage.src = base64;
  };

  const setLassoImage = () => {
    const { left, top, width, height } = shapeContainer;
    const img = new Image();
    if (!auxCanvas.current) return;
    img.src = auxCanvas.current.toDataURL();
    img.onload = () => {
      auxCtx?.clearRect(0, 0, width, height);
      setShapePath(new Path2D());
      if (!shapePath || !auxCtx || !auxCanvas.current) return;

      for (let i = 0; i < lassoPath.length; i++)
        shapePath.lineTo(lassoPath[i].x - left, lassoPath[i].y - top);

      shapePath.closePath();
      auxCtx.clip(shapePath);
      auxCtx.drawImage(img, 0, 0);
      const base64 = auxCanvas.current.toDataURL();
      pngImage.src = base64;
      auxCtx.drawImage(pngImage, 0, 0);
    };
  };

  const setResizedImageValues = () => {
    if (!auxCanvas.current) return;
    if (pointerState !== "onResizeButton") return;
    const img = new Image();
    img.src = auxCanvas.current.toDataURL();
    setResizedImage(img);
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
      onPointerDown={handleMouseDown}
      onPointerMove={handleMouseMove}
      onPointerUp={handleMouseUp}
      ref={canvasContainer}
    >
      <ShapePanel
        shapeContainer={shapeContainer}
        canvasRef={auxCanvas}
        buttonsRef={buttons}
        setResizeButtonId={setResizeButtonId}
      />

      <canvas
        className="canvas"
        ref={mainCanvas}
        width={parentSize.width}
        height={parentSize.height}
      ></canvas>
    </div>
  );
};

export default Canvas;
