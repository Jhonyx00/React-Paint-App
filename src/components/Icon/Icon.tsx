import { Svg } from "../../interfaces/Svg";
import "./icon.css";

const Icon = ({ shape, color }: { color: string; shape: Svg }) => {
  return (
    <>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="-10 -10 120 120">
        {shape?.tagname === "ellipse" ? (
          <ellipse
            cx={shape.attributes.cx}
            cy={shape.attributes.cy}
            rx={shape.attributes.rx}
            ry={shape.attributes.ry}
            className="svg-icon"
            style={{
              stroke: color,
            }}
          />
        ) : shape?.tagname === "path" ? (
          <path
            d={shape.attributes.d}
            transform={shape.attributes.transform}
            className="svg-icon"
            style={{
              stroke: color,
              fill: color,
            }}
          ></path>
        ) : shape?.tagname === "text" ? (
          <text
            x={shape.attributes.x}
            y={shape.attributes.y}
            fontFamily={shape.attributes.fontFamily}
            fontSize={shape.attributes.fontSize}
            fontWeight={shape.attributes.fontWeight}
            fill={color}
          >
            {shape.attributes.content}
          </text>
        ) : (
          <polygon
            className="svg-icon"
            style={{
              stroke: color,
            }}
            points={shape?.attributes?.points}
          />
        )}
      </svg>
    </>
  );
};

export default Icon;
