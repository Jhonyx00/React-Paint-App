import "./cursor.css";

const Cursor = ({
  top,
  left,
  width,
  height,
  color,
  blur,
  opacity,
}: {
  top: number;
  left: number;
  width: number;
  height: number;
  color: string;
  blur: number;
  opacity: number;
}) => {
  return (
    <div
      className="cursor"
      style={{
        animationName: "grow",
        position: "absolute",
        top: top,
        left: left,
        width: width,
        height: height,
        // inset: -lineWidth * zoomFactor,
        pointerEvents: "none",
        borderRadius: "50%",
        border: `1px solid ${color}`,
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          opacity: opacity,
          borderRadius: "inherit",
          backgroundColor: color,
        }}
      ></div>
    </div>
  );
};

export default Cursor;
