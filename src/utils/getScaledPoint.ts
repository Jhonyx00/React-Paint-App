import { Point } from "../interfaces/Point";
import { Position } from "../interfaces/Position";

const getScaledPoint = (
  point: Point,
  zoomFactor: number,
  elementPosition: Position
): Point => {
  const scaledPoint = {
    x: (point.x - elementPosition.left) / zoomFactor - elementPosition.left,
    y: (point.y - elementPosition.top) / zoomFactor - elementPosition.top,
  };

  const offsetValues = {
    x: point.x / zoomFactor - elementPosition.left / zoomFactor,
    y: point.y / zoomFactor - elementPosition.top / zoomFactor,
  };

  const newValue = {
    x: scaledPoint.x - offsetValues.x,
    y: scaledPoint.y - offsetValues.y,
  };

  const newPoint: Point = {
    x: scaledPoint.x - newValue.x,
    y: scaledPoint.y - newValue.y,
  };

  return newPoint;
};

export default getScaledPoint;
