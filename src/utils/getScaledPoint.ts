import { Point } from "../interfaces/Point";
import { Position } from "../interfaces/Position";

const getScaledPoint = (
  point: Point,
  zoomFactor: number,
  elementPosition: Position
): Point => {
  const scaledPoint = {
    x: (point.x - elementPosition.left) / zoomFactor,
    y: (point.y - elementPosition.top) / zoomFactor,
  };

  return scaledPoint;
};

export default getScaledPoint;
