import React, {
  Dispatch,
  RefObject,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";

//interfaces
import { Point } from "../../interfaces/Point";

//data
import { shapes } from "../../data/data";

//styles
import { Position } from "../../interfaces/Position";
import { Dimension } from "../../interfaces/Dimension";
import { ToolItem } from "../../interfaces/ToolItem";

//functions
import getScaledPoint from "../../utils/getScaledPoint";

//components
import Cursor from "../cursor/Cursor";
import Canvas from "../canvas/Canvas";

//style
import "./drawingCanvas.css";
import { ElementContainer } from "../../interfaces/ElementContainer";
import ElementBuilder from "../elementContainer/ElementBuilder";
import { Rect } from "../../interfaces/Rect";

const DrawingCanvas = ({
  rect,
  currentTool,
  currentColor,
  lineWidth,
  opacity,
  shadowBlur,
  zoomFactor,
  drawingCanvas,
  setSelected,
  viewportSize,
  parentOffset,
}: {
  currentTool: ToolItem;
  currentColor: string;
  lineWidth: number;
  opacity: number;
  shadowBlur: number;
  zoomFactor: number;
  drawingCanvas: RefObject<HTMLDivElement>;
  setSelected: Dispatch<SetStateAction<boolean>>;
  viewportSize: Dimension;
  rect: Rect;
  parentOffset: Position;
}) => {
  //refs
  const buttons = useRef<HTMLDivElement>(null);
  const mainCanvas = useRef<HTMLCanvasElement>(null);
  const auxCanvas = useRef<HTMLCanvasElement>(null);
  const textArea = useRef<HTMLTextAreaElement>(null);
  //useState
  const [XY, setXY] = useState<Point>({ x: 0, y: 0 });
  const [shapePath, setShapePath] = useState<Path2D>(new Path2D());
  const [lassoPath, setLassoPath] = useState<Point[]>([]);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [lassoPoints, setLassoPoints] = useState<Point[]>([]);

  const mainCtxRef = useRef<CanvasRenderingContext2D | null>(null);
  const auxCtxRef = useRef<CanvasRenderingContext2D | null>(null);

  const [isImagePlaced, setIsImagePlaced] = useState<boolean>(false);
  const [resizeButtonId, setResizeButtonId] = useState<number>(0);

  const [selectionImage, setSelectionImage] = useState<HTMLImageElement>(
    new Image()
  );

  const [elementContainer, setElementContainer] = useState<ElementContainer>({
    top: 0,
    left: 0,
    width: 0,
    height: 0,
    background: "",
    name: "",
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
    | "onElementContainer"
    | "onResizeButton"
    | "onCanvas"
    | "onTextArea"
    | "onDrawingPanel"
  >("onDrawingPanel");

  const [isRendered, setIsRendered] = useState<boolean>(false);
  //main canvas init
  useEffect(() => {
    if (!mainCanvas.current) return;
    const ctx = mainCanvas.current.getContext("2d", {
      willReadFrequently: true,
    });
    mainCtxRef.current = ctx;
  }, []);

  //Main canvas config
  useEffect(() => {
    if (!mainCtxRef.current) return;
    mainCtxRef.current.imageSmoothingEnabled = false;
    mainCtxRef.current.imageSmoothingQuality = "high";
  }, []);

  //Main Canvas options
  useEffect(() => {
    if (!mainCtxRef.current) return;
    mainCtxRef.current.globalAlpha = opacity;
    mainCtxRef.current.strokeStyle = currentColor;
    mainCtxRef.current.fillStyle = currentColor;
    mainCtxRef.current.lineWidth = lineWidth;
    mainCtxRef.current.lineCap = "round";

    if (currentTool.groupId !== 4) {
      mainCtxRef.current.shadowBlur = shadowBlur;
      mainCtxRef.current.shadowColor = currentColor;
    }
  }, [opacity, currentColor, lineWidth, shadowBlur, zoomFactor]);

  //Aux canvas init
  useEffect(() => {
    if (!auxCanvas.current) return;
    const auxCtx = auxCanvas.current.getContext("2d", {
      willReadFrequently: true,
    });
    auxCtxRef.current = auxCtx;
  }, []);

  // //Aux Canvas options
  // useEffect(() => {
  //   if (!auxCtxRef.current) return;
  //   auxCtxRef.current.shadowColor = currentColor;
  //   auxCtxRef.current.globalAlpha = opacity;
  //   auxCtxRef.current.fillStyle = currentColor;
  //   // auxCtxRef.current.lineWidth = lineWidth;
  // }, [opacity, shadowBlur, currentColor]);

  useEffect(() => {
    setElementContainer((prev) => ({ ...prev, background: currentColor }));
    if (textArea.current) textArea.current.style.color = currentColor;
  }, [currentColor]);

  useEffect(() => {
    // const hasSize = elementContainer.width > 0 && elementContainer.height > 0;
    // if (pointerState === "onElementContainer" && hasSize) {
    //   // console.log("pintar todo");
    // }
  }, [currentTool]);

  ///events
  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.ctrlKey) return;
    setIsDrawing(true);

    if (!mainCanvas.current) return;

    const point = { x: event.clientX, y: event.clientY };
    const { left, top } = mainCanvas.current.getBoundingClientRect();
    const scaledPoint = getScaledPoint(point, zoomFactor, {
      left,
      top,
    });

    switch (event.target) {
      case mainCanvas.current:
        /// click on canvas, and perform the last action
        if (
          currentTool.groupId === 3 ||
          currentTool.groupId === 4 ||
          currentTool.groupId === 5 ||
          currentTool.groupId === 10
        ) {
          setMouseDownPosition({
            x: (point.x - parentOffset.left) / zoomFactor,
            y: (point.y - parentOffset.top) / zoomFactor,
          });
        } else {
          setMouseDownPosition(scaledPoint);
        }

        setPointerState("onCanvas");

        setSelected(false);
        setIsRendered(false);

        if (elementContainer.width > 0 && elementContainer.height > 0)
          resetElementContainerProps();

        setElementContainer((prev) => ({
          ...prev,
          name: currentTool.name,
        }));
        performCanvasAction(scaledPoint);

        break;

      case buttons.current:
        setPointerState("onElementContainer");
        setXY({
          x: scaledPoint.x - elementContainer.left,
          y: scaledPoint.y - elementContainer.top,
        });
        checkSetAction();
        break;

      case textArea.current:
        setPointerState("onTextArea");
        break;

      default:
        setPointerState("onResizeButton");
        setMouseDownPosition(scaledPoint);
        checkSetAction();
        break;
    }
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!mainCanvas.current) return;
    const { left, top } = mainCanvas.current.getBoundingClientRect();
    const point = { x: event.clientX, y: event.clientY };
    const scaledPoint = getScaledPoint(point, zoomFactor, {
      left,
      top,
    });
    setMouseMovePosition(scaledPoint);

    if (!isDrawing) return;

    switch (pointerState) {
      case "onCanvas":
        setMouseMoveAction();
        break;

      case "onElementContainer":
        moveElementContainer(scaledPoint);
        break;
      // case "onTextArea":
      //   break;
      case "onResizeButton":
        setResizeValues(scaledPoint);
        break;

      default:
        break;
    }
  };

  const handleMouseUp = () => {
    setIsDrawing(false);

    switch (currentTool.groupId) {
      case 1:
        resetElementContainerRefProps();
        break;

      case 3:
        drawLine();
        resetElementContainerProps();
        //clear auxCanvas path to prevent overlap with the main canvas
        setAuxCanvasDimension(viewportSize);
        break;

      case 2:
        setSelectionImageValues();
        resetElementContainerRefProps();
        break;

      case 4:
        if (mainCtxRef.current) {
          mainCtxRef.current.globalCompositeOperation = "destination-out";
        }
        drawLine();
        resetElementContainerProps();
        setAuxCanvasDimension(viewportSize);
        break;

      case 5:
        resetElementContainerRefProps();
        // if (isRendered) return;
        // if (pointerState === "onCanvas") {
        if (!isRendered && pointerState === "onCanvas") {
          clearElementContainer();
          resetElementContainerProps();
          if (!isImagePlaced && lassoPoints.length > 0) setLassoFrame();
          setLassoPath(lassoPoints);
          setScaleRelativeToParent();
          fillPath();
        }
        setIsRendered(true);
        break;

      case 10:
        resetElementContainerRefProps();
        if (isRendered) return;
        if (!isRendered && pointerState === "onCanvas") {
          clearElementContainer();
          resetElementContainerProps();
          if (!isImagePlaced && lassoPoints.length > 0) setLassoFrame();
          setLassoPath(lassoPoints);
        }
        setIsRendered(true);
        break;

      case 6:
        resetElementContainerRefProps();
        break;

      default:
        break;
    }
  };

  const fillPath = () => {
    const shapePath = getLassoPath({
      x: bounding.minX,
      y: bounding.minY,
    });

    auxCtxRef.current?.fill(shapePath);
  };

  const clearElementContainer = () => {
    const { width, height } = elementContainer;
    auxCtxRef.current?.clearRect(0, 0, width * zoomFactor, height * zoomFactor);
  };
  // scale the aux canvas to fit its boundaries
  const setScaleRelativeToParent = () => {
    const elementSize: Dimension = {
      width: bounding.maxX - bounding.minX,
      height: bounding.maxY - bounding.minY,
    };

    auxCtxRef.current?.scale(
      viewportSize.width / elementSize.width,
      viewportSize.height / elementSize.height
    );
  };

  const getLassoPath = (initialPoint: Point) => {
    const { left, top } = elementContainer;
    const shapePath = new Path2D();
    auxCtxRef.current?.translate(-initialPoint.x + left, -initialPoint.y + top);

    for (let i = 0; i < lassoPoints.length; i++) {
      const path = lassoPoints[i];
      shapePath.lineTo(path.x - left, path.y - top);
    }
    shapePath.closePath();

    return shapePath;
  };

  const drawLine = () => {
    const { left, top } = elementContainer;
    const img = new Image();
    if (auxCanvas.current) img.src = auxCanvas.current.toDataURL();
    requestAnimationFrame(() => {
      if (mainCtxRef.current) {
        mainCtxRef.current.drawImage(
          img,
          left,
          top,
          viewportSize.width / zoomFactor,
          viewportSize.height / zoomFactor
        );
      }
    });
  };

  const [isOverCanvas, setIsOverCanvas] = useState<boolean>(false);
  const handleMouseOver = () => {
    setIsOverCanvas(true);
  };

  const handleMouseLeave = () => {
    setIsOverCanvas(false);
  };

  // if shape container is moved or resized, now has a background image
  const checkSetAction = () => {
    if (isImagePlaced) return;
    if (currentTool.groupId === 2) {
      setSelection("white");
      clearCanvasArea();
    } else if (currentTool.groupId === 10) {
      setSelection("transparent");
      setLassoImage();
      clearLassoSelection();

      // setIrregularShape()
    } else if (currentTool.groupId === 5) {
      setIrregularShape();
    }
  };

  const performCanvasAction = (point: Point) => {
    if (mainCtxRef.current)
      mainCtxRef.current.globalCompositeOperation = "source-over";

    switch (currentTool.groupId) {
      case 1:
        paintShape();
        setAuxCanvasDimension({ width: 300, height: 150 });
        setPath(currentTool.id);

        break;

      case 3:
        // drawDot();
        paintShape();
        setElementContainer((prev) => ({
          ...prev,
          left: 0 - rect.left / zoomFactor,
          top: 0 - rect.top / zoomFactor,
          width: viewportSize.width * (1 / zoomFactor),
          height: viewportSize.height * (1 / zoomFactor),
        }));
        break;

      case 4:
        if (mainCtxRef.current)
          mainCtxRef.current.globalCompositeOperation = "destination-out";

        setElementContainer((prev) => ({
          ...prev,
          left: 0 - rect.left / zoomFactor,
          top: 0 - rect.top / zoomFactor,
          width: viewportSize.width * (1 / zoomFactor),
          height: viewportSize.height * (1 / zoomFactor),
        }));

        break;
      case 2:
        /* if the tool is changed, 
        shape container background needs to be cleared by setting its width and height */
        setAuxCanvasDimension({ width: 300, height: 150 });
        if (!isImagePlaced) return;
        resetCtxAux(); // reset options like opacity, shadow blur, etc
        fillWhite();
        drawSelection();
        resetSelection();
        setAuxCanvasBg("transparent");
        break;

      case 5:
        setAuxCanvasDimension(viewportSize);
        // setAuxCanvasDimension({ width: 300, height: 150 });
        setBounding({
          maxX: 0,
          maxY: 0,
          minX: point.x,
          minY: point.y,
        });
        setElementContainer((prev) => ({
          ...prev,
          left: 0 - rect.left / zoomFactor,
          top: 0 - rect.top / zoomFactor,
          width: viewportSize.width * (1 / zoomFactor),
          height: viewportSize.height * (1 / zoomFactor),
        }));
        if (lassoPoints.length > 0) setLassoPoints([]);

        if (!isImagePlaced) return;
        //resetCtxAux();
        drawLassoImage();
        resetSelection();
        break;

      case 10:
        setAuxCanvasDimension(viewportSize);
        /* set an initial value to start comparing in setMinMaxXY function, in order to get box dimensions of ElementContainer */
        setBounding({
          maxX: 0,
          maxY: 0,
          minX: point.x,
          minY: point.y,
        });
        setElementContainer((prev) => ({
          ...prev,
          left: 0 - rect.left / zoomFactor,
          top: 0 - rect.top / zoomFactor,
          width: viewportSize.width * (1 / zoomFactor),
          height: viewportSize.height * (1 / zoomFactor),
        }));
        if (lassoPoints.length > 0) setLassoPoints([]);

        if (!isImagePlaced) return;
        resetCtxAux();
        drawLassoImage();
        resetSelection();
        setPath(-1);
        break;

      //Text
      case 6:
        setText("");
        drawText();
        break;

      default:
        break;
    }
  };

  const [text, setText] = useState<string>("");

  const drawText = () => {
    const { left, top } = elementContainer;
    if (!mainCtxRef.current) return;
    mainCtxRef.current.font = "16px arial";
    if (text) {
      mainCtxRef.current.fillText(text, left, top + 16);
    }
  };

  const setAuxCanvasBg = (bg: string) => {
    if (!auxCanvas.current) return;
    auxCanvas.current.style.backgroundColor = bg;
  };

  const setAuxCanvasImageData = (image: ImageData) => {
    auxCtxRef.current?.putImageData(image, 0, 0);
  };

  const setAuxCanvasDimension = (dimension: Dimension) => {
    if (!auxCanvas.current) return;
    auxCanvas.current.width = dimension.width;
    auxCanvas.current.height = dimension.height;
  };

  const paintShape = () => {
    switch (elementContainer.name) {
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

  // const drawLine = (): void => {
  //   if (!mainCtxRef.current) return;
  //   mainCtxRef.current.save();
  //   mainCtxRef.current.scale(zoomFactor, zoomFactor);
  //   mainCtxRef.current.beginPath();
  //   mainCtxRef.current.moveTo(
  //     positionDown.x / zoomFactor,
  //     positionDown.y / zoomFactor
  //   );
  //   mainCtxRef.current.lineTo(
  //     positionMove.x / zoomFactor,
  //     positionMove.y / zoomFactor
  //   );
  //   mainCtxRef.current.stroke();
  //   mainCtxRef.current.restore();
  //   positionDown.x = positionMove.x;
  //   positionDown.y = positionMove.y;
  //   setLassoPoints((prev) => [...prev, positionMove]);
  // };

  const drawDot = () => {
    if (!mainCtxRef.current) return;
    mainCtxRef.current.beginPath();
    mainCtxRef.current.lineTo(positionMove.x, positionMove.y);
    mainCtxRef.current.stroke();
  };

  const drawRectangle = () => {
    mainCtxRef.current?.fillRect(
      elementContainer.left,
      elementContainer.top,
      elementContainer.width,
      elementContainer.height
    );
  };

  const drawTriangle = () => {
    const polygonCoords: Point[] = [
      {
        x: elementContainer.left + elementContainer.width * 0.5,
        y: elementContainer.top,
      },
      {
        x: elementContainer.left,
        y: elementContainer.top + elementContainer.height,
      },
      {
        x: elementContainer.left + elementContainer.width,
        y: elementContainer.top + elementContainer.height,
      },
    ];

    if (!mainCtxRef.current) return;

    mainCtxRef.current.beginPath();
    mainCtxRef.current.moveTo(polygonCoords[0].x, polygonCoords[0].y);

    for (let i = 0; i < polygonCoords.length; i++)
      mainCtxRef.current.lineTo(polygonCoords[i].x, polygonCoords[i].y);

    mainCtxRef.current.closePath();
    mainCtxRef.current.fill();
  };

  const drawEllipse = () => {
    const { width, height, top, left } = elementContainer;
    const endAngle = Math.PI * 2;
    if (!mainCtxRef.current) return;
    mainCtxRef.current.beginPath();
    mainCtxRef.current.ellipse(
      left + width * 0.5,
      top + height * 0.5,
      Math.abs(width) * 0.5,
      Math.abs(height) * 0.5,
      0,
      0,
      endAngle
    );
    mainCtxRef.current.fill();
  };

  const drawPentagon = () => {
    const { width, height, top, left } = elementContainer;
    const polygonCoords: Point[] = [
      { x: left + width * 0.5, y: top },
      { x: left, y: top + height * 0.38 },
      { x: left + width * 0.18, y: top + height },
      { x: left + width * 0.82, y: top + height },
      { x: left + width, y: top + height * 0.38 },
    ];

    if (!mainCtxRef.current) return;

    mainCtxRef.current.beginPath();
    mainCtxRef.current.moveTo(polygonCoords[0].x, polygonCoords[0].y);

    for (let i = 0; i < polygonCoords.length; i++)
      mainCtxRef.current.lineTo(polygonCoords[i].x, polygonCoords[i].y);

    mainCtxRef.current.closePath();
    mainCtxRef.current.fill();
  };

  const drawHexagon = () => {
    const { width, height, top, left } = elementContainer;
    /*Numerical values expressed in percentage indicate where to place each point 
      according to the width and height of aux component:
      width * 0.25 = 25% of aux component height 
      */
    const polygonCoords: Point[] = [
      { x: left + width * 0.25, y: top },
      { x: left, y: top + height * 0.5 },
      { x: left + width * 0.25, y: top + height },
      { x: left + width * 0.75, y: top + height },
      { x: left + width, y: top + height * 0.5 },
      { x: left + width * 0.75, y: top },
    ];

    if (!mainCtxRef.current) return;

    mainCtxRef.current.beginPath();
    mainCtxRef.current.moveTo(polygonCoords[0].x, polygonCoords[0].y);

    for (let i = 0; i < polygonCoords.length; i++)
      mainCtxRef.current.lineTo(polygonCoords[i].x, polygonCoords[i].y);

    mainCtxRef.current.closePath();
    mainCtxRef.current.fill();
  };

  const drawStar = () => {
    const { width, height, top, left } = elementContainer;

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

    if (!mainCtxRef.current) return;

    mainCtxRef.current.beginPath();
    mainCtxRef.current.moveTo(polygonCoords[0].x, polygonCoords[0].y);

    for (let i = 0; i < polygonCoords.length; i++)
      mainCtxRef.current.lineTo(polygonCoords[i].x, polygonCoords[i].y);

    mainCtxRef.current.closePath();
    mainCtxRef.current.fill();
  };

  const drawRhombus = () => {
    const { width, height, top, left } = elementContainer;
    const polygonCoords: Point[] = [
      { x: left + width * 0.5, y: top },
      { x: left, y: top + height * 0.5 },
      { x: left + width * 0.5, y: top + height },
      { x: left + width, y: top + height * 0.5 },
    ];

    if (!mainCtxRef.current) return;

    mainCtxRef.current.beginPath();
    mainCtxRef.current.moveTo(polygonCoords[0].x, polygonCoords[0].y);

    for (let i = 0; i < polygonCoords.length; i++)
      mainCtxRef.current.lineTo(polygonCoords[i].x, polygonCoords[i].y);

    mainCtxRef.current.closePath();
    mainCtxRef.current.fill();
  };

  const resetElementContainerProps = () => {
    setElementContainer({
      top: 0,
      left: 0,
      width: 0,
      height: 0,
      referenceTop: 0,
      referenceLeft: 0,
      referenceWidth: 0,
      referenceHeight: 0,
      background: "",
      name: "",
      rotation: 0,
    });
  };

  const setPath = (id: number) => {
    if (!auxCtxRef.current) return;
    if (id < 0) {
      clearElementContainer();
    } else {
      const path = new Path2D(shapes[id - 1].path);
      auxCtxRef.current.fillStyle = currentColor;
      clearElementContainer();
      auxCtxRef.current.fill(path);
    }
  };

  //SHAPES
  const drawElementContainer = () => {
    let rectangleWidth = positionMove.x - positionDown.x;
    let rectangleHeight = positionMove.y - positionDown.y;
    let newWidth = Math.abs(rectangleWidth);
    let newHeight = Math.abs(rectangleHeight);

    setElementContainer({
      ...elementContainer,
      width: newWidth,
      height: newHeight,
      referenceWidth: newWidth,
      referenceHeight: newHeight,
    });

    // Quadrant 1
    if (rectangleWidth > 0 && rectangleHeight < 0) {
      setElementContainer((prev) => ({
        ...prev,
        top: positionMove.y,
        left: positionDown.x,
        referenceTop: positionMove.y,
        referenceLeft: positionDown.x,
      }));
    }
    // Quadrant 2
    else if (rectangleWidth < 0 && rectangleHeight < 0) {
      setElementContainer((prev) => ({
        ...prev,
        top: positionMove.y,
        left: positionMove.x,
        referenceTop: positionMove.y,
        referenceLeft: positionMove.x,
      }));
    }
    // Quadrant 3
    else if (rectangleWidth < 0 && rectangleHeight > 0) {
      setElementContainer((prev) => ({
        ...prev,
        top: positionDown.y,
        left: positionMove.x,
        referenceTop: positionDown.y,
        referenceLeft: positionMove.x,
      }));
    }
    //Quadrant 4
    else {
      setElementContainer((prev) => ({
        ...prev,
        top: positionDown.y,
        left: positionDown.x,
        referenceTop: positionDown.y,
        referenceLeft: positionDown.x,
      }));
    }
  };

  const drawLassoImage = () => {
    const { left, top, width, height } = elementContainer;
    mainCtxRef.current?.drawImage(selectionImage, left, top, width, height);
  };

  const resetSelection = () => {
    setIsImagePlaced(false);
    setSelectionImage((prev) => {
      prev.src = "";
      return prev;
    });
  };

  const resetCtxAux = () => {
    if (!mainCtxRef.current) return;
    mainCtxRef.current.globalAlpha = 1;
    mainCtxRef.current.shadowBlur = 0;
  };

  const fillWhite = () => {
    const { left, top, width, height } = elementContainer;
    if (!mainCtxRef.current) return;
    mainCtxRef.current.fillStyle = "white";
    if (!isImagePlaced) return;
    mainCtxRef.current?.fillRect(left, top, width, height);
  };

  const drawSelection = () => {
    const { left, top, width, height } = elementContainer;
    if (!selectionImage) return;
    if (
      pointerState === "onElementContainer" ||
      pointerState === "onResizeButton"
    ) {
      setSelectionImageValues();
      mainCtxRef.current?.drawImage(selectionImage, left, top, width, height);
    }
  };

  // tool: Select & lasso
  const setSelection = (background: string) => {
    const { left, top, width, height } = elementContainer;
    if (!mainCtxRef.current) return;
    if (width <= 0 && height <= 0) return;
    const image = mainCtxRef.current.getImageData(left, top, width, height);
    setAuxCanvasDimension({ width: image.width, height: image.height });
    setAuxCanvasBg(background);
    setAuxCanvasImageData(image);
    setIsImagePlaced(true);
  };

  const clearCanvasArea = () => {
    const { left, top, width, height } = elementContainer;
    mainCtxRef.current?.clearRect(left, top, width, height);
  };

  const clearLassoSelection = () => {
    const { left, top } = elementContainer;

    selectionImage.onload = () => {
      if (!mainCtxRef.current) return;
      mainCtxRef.current.translate(left, top);
      mainCtxRef.current.save();
      mainCtxRef.current.clip(shapePath);
      mainCtxRef.current.clearRect(
        0,
        0,
        elementContainer.width,
        elementContainer.height
      );
      mainCtxRef.current.restore();
      mainCtxRef.current.setTransform(1, 0, 0, 1, 0, 0);
    };
  };

  // tool: IrregularShape
  const setIrregularShape = () => {
    const { left, top, width, height } = elementContainer;
    const shapePath = new Path2D();

    if (!auxCanvas.current) return;
    auxCanvas.current.width = width;
    auxCanvas.current.height = height;

    for (let i = 0; i < lassoPath.length; i++)
      shapePath.lineTo(lassoPath[i].x - left, lassoPath[i].y - top);

    shapePath.closePath();
    if (!auxCtxRef.current) return;
    auxCtxRef.current.globalAlpha = opacity;
    auxCtxRef.current.fillStyle = currentColor;
    // auxCtxRef.current.shadowBlur = shadowBlur;
    // auxCtxRef.current.shadowColor = currentColor;

    auxCtxRef.current.clip(shapePath);
    auxCtxRef.current.fill(shapePath);
    const base64 = auxCanvas.current.toDataURL();
    setSelectionImage((prev) => {
      prev.src = base64;
      return prev;
    });

    setIsImagePlaced(true);
  };

  const setLassoImage = () => {
    const { left, top } = elementContainer;
    const img = new Image();
    if (!auxCanvas.current) return;
    img.src = auxCanvas.current.toDataURL();

    img.onload = () => {
      clearElementContainer(); //important
      setShapePath(new Path2D()); //reset the path in each selection to erase correctly on canvas

      for (let i = 0; i < lassoPath.length; i++)
        shapePath.lineTo(lassoPath[i].x - left, lassoPath[i].y - top);

      shapePath.closePath();
      auxCtxRef.current?.clip(shapePath);
      auxCtxRef.current?.drawImage(img, 0, 0);

      if (!auxCanvas.current) return;
      const base64 = auxCanvas.current.toDataURL();

      setSelectionImage((prev) => {
        prev.src = base64;
        return prev;
      });
    };
  };

  const setSelectionImageValues = () => {
    if (!auxCanvas.current) return;
    const img = new Image();
    img.src = auxCanvas.current.toDataURL();
    setSelectionImage(img);
  };

  const setMouseMoveAction = () => {
    switch (currentTool.groupId) {
      case 1:
      case 2:
      case 6:
        drawElementContainer();
        break;
      case 5:
      case 10:
        setMinMaxXY();
        setLassoPoints((prev) => [...prev, positionMove]);
        break;
      default:
        break;
    }
  };

  // const drawLasso = () => {
  //   // drawLine();
  //   setMinMaxXY();
  // };

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

  const setLassoFrame = () => {
    const frameWidth = bounding.maxX - bounding.minX;
    const frameHeight = bounding.maxY - bounding.minY;

    setElementContainer((prev) => ({
      ...prev,
      left: bounding.minX,
      top: bounding.minY,
      width: frameWidth,
      height: frameHeight,
    }));
  };

  const setResizeValues = (point: Point) => {
    //calculate value from mousedown to offset
    const dX = point.x - positionDown.x;
    const dY = point.y - positionDown.y;
    //calculate new top, left, width and height from original width and height
    const newTop = elementContainer.referenceTop + dY;
    const newLeft = elementContainer.referenceLeft + dX;
    const newWidth = elementContainer.referenceWidth - dX;
    const newHeight = elementContainer.referenceHeight - dY;
    const newInverseWidth = elementContainer.referenceWidth + dX;
    const newInverseHeight = elementContainer.referenceHeight + dY;
    //set new values to elementContainer if the new values are greather than zero

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
      setElementContainer((prev) => ({
        ...prev,
        left: newLeft,
        top: newTop,
        width: newWidth,
        height: newHeight,
      }));
    } else if (newWidth < 0 && newHeight > 0) {
      setElementContainer((prev) => ({
        ...prev,
        top: newTop,
        height: newHeight,
      }));
    } else if (newHeight < 0 && newWidth > 0) {
      setElementContainer((prev) => ({
        ...prev,
        left: newLeft,
        width: newWidth,
      }));
    }
  };
  //2
  const wResize = (newLeft: number, newWidth: number) => {
    if (newWidth > 0) {
      setElementContainer((prev) => ({
        ...prev,
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
      setElementContainer((prev) => ({
        ...prev,
        left: newLeft,
        width: newWidth,
        height: newInverseHeight,
      }));
    } else if (newWidth < 0 && newInverseHeight > 0) {
      setElementContainer((prev) => ({
        ...prev,
        height: newInverseHeight,
      }));
    } else if (newInverseHeight < 0 && newWidth > 0) {
      setElementContainer((prev) => ({
        ...prev,
        left: newLeft,
        width: newWidth,
      }));
    }
  };
  //4
  const sResize = (newInverseHeight: number) => {
    if (newInverseHeight > 0) {
      setElementContainer((prev) => ({
        ...prev,
        height: newInverseHeight,
      }));
    }
  };
  //5
  const seResize = (newInverseWidth: number, newInverseHeight: number) => {
    if (newInverseWidth > 0 && newInverseHeight > 0) {
      setElementContainer((prev) => ({
        ...prev,
        width: newInverseWidth,
        height: newInverseHeight,
      }));
    } else if (newInverseWidth < 0 && newInverseHeight > 0) {
      setElementContainer((prev) => ({
        ...prev,
        height: newInverseHeight,
      }));
    } else if (newInverseWidth > 0 && newInverseHeight < 0) {
      setElementContainer((prev) => ({
        ...prev,
        width: newInverseWidth,
      }));
    }
  };
  //6
  const eResize = (newInverseWidth: number) => {
    if (newInverseWidth > 0) {
      elementContainer.width = newInverseWidth;
      setElementContainer((prev) => ({
        ...prev,
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
      setElementContainer((prev) => ({
        ...prev,
        top: newTop,
        width: newInverseWidth,
        height: newHeight,
      }));
    } else if (newHeight > 0 && newInverseWidth < 0) {
      setElementContainer((prev) => ({
        ...prev,
        top: newTop,
        height: newHeight,
      }));
    } else if (newHeight < 0 && newInverseWidth > 0) {
      setElementContainer((prev) => ({
        ...prev,
        width: newInverseWidth,
      }));
    }
  };
  //8
  const nResize = (newTop: number, newHeight: number) => {
    if (newHeight > 0) {
      setElementContainer((prev) => ({
        ...prev,
        top: newTop,
        height: newHeight,
      }));
    }
  };

  const moveElementContainer = (point: Point) => {
    // if (currentTool.groupId === 3) return;

    setElementContainer((prev) => ({
      ...prev,
      top: point.y - XY.y,
      left: point.x - XY.x,
      referenceTop: point.y - XY.y,
      referenceLeft: point.x - XY.x,
    }));
  };

  const resetElementContainerRefProps = () => {
    setElementContainer((prev) => ({
      ...prev,
      referenceLeft: prev.left,
      referenceTop: prev.top,
      referenceWidth: prev.width,
      referenceHeight: prev.height,
    }));
  };

  return (
    <div
      className="drawing-canvas"
      onPointerDown={handleMouseDown}
      onPointerMove={handleMouseMove}
      onPointerUp={handleMouseUp}
      onMouseOver={handleMouseOver}
      onMouseLeave={handleMouseLeave}
      ref={drawingCanvas}
      style={{
        left: `${rect.left}px`,
        top: `${rect.top}px`,
        width: `${zoomFactor * rect.width}px`,
        height: `${zoomFactor * rect.height}px`,
        // transition: transition ? "left 400ms ease-in-out" : "",
      }}
    >
      <Canvas canvasRef={mainCanvas} size={rect} />

      {isOverCanvas &&
        (currentTool.groupId === 3 || currentTool.groupId === 4) && (
          <Cursor
            left={positionMove.x * zoomFactor - (lineWidth * zoomFactor) / 2}
            top={positionMove.y * zoomFactor - (lineWidth * zoomFactor) / 2}
            width={lineWidth * zoomFactor}
            height={lineWidth * zoomFactor}
          />
        )}

      <ElementBuilder
        canvasRef={auxCanvas}
        buttonsRef={buttons}
        textArea={textArea}
        tool={currentTool.groupId}
        text={text}
        zoomFactor={zoomFactor}
        rect={{
          top: elementContainer.top * zoomFactor,
          left: elementContainer.left * zoomFactor,
          width: elementContainer.width * zoomFactor,
          height: elementContainer.height * zoomFactor,
        }}
        positionDown={positionDown}
        lineWidth={lineWidth}
        color={currentColor}
        viewportSize={viewportSize}
        setText={setText}
        setResizeButtonId={setResizeButtonId}
        pointerState={pointerState}
        isRendered={isRendered}
        shadowBlur={shadowBlur}
        opacity={opacity}
      />
    </div>
  );
};

export default DrawingCanvas;
