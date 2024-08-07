import "./cursor.css";

const Cursor = ({
  top,
  left,
  width,
  height,
}: {
  top: number;
  left: number;
  width: number;
  height: number;
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
        pointerEvents: "none",
        borderRadius: "50%",
      }}
    ></div>
  );
};

export default Cursor;
