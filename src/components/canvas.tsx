import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { Point } from "../interfaces/point";
import { IconTool } from "../interfaces/IconTool";
import { ShapeContainer } from "../interfaces/shapeContainer";
import "../styles/canvas.css";

const DynamicComponent = forwardRef((shapeContainer: ShapeContainer, ref) => {
  const auxCanvasRef: React.Ref<HTMLCanvasElement> = useRef(null);
  const [ctxAux, setContext] = useState<CanvasRenderingContext2D>();
  const ctxAuxCanvas = auxCanvasRef.current?.getContext("2d");

  useImperativeHandle(ref, () => ({
    getContext: () => ctxAux,
  }));

  useEffect(() => {
    if (ctxAuxCanvas) {
      setContext(ctxAuxCanvas);
    }
  }, [ctxAuxCanvas]);

  return (
    <canvas
      ref={auxCanvasRef}
      style={{
        position: "absolute",
        left: shapeContainer.left,
        top: shapeContainer.top,
        width: shapeContainer.width,
        height: shapeContainer.height,
      }}
    ></canvas>
  );
});

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
  const dynamicCanvasRef: React.Ref<HTMLCanvasElement> = useRef(null);
  const ctxAux = dynamicCanvasRef.current?.getContext("2d");

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

  useEffect(() => {
    //main canvas
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
      setShapeContainer((s) => ({ ...s, background: "green" })); // set Color from input
    }

    if (ctx) {
      ctx.fillStyle = shapeContainer.background;
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
  }, [positionDown]);

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
      isRendered: false,
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
        componentClass={shapeContainer.componentClass}
        isRendered={false}
        rotation={0}
        ref={dynamicCanvasRef}
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
