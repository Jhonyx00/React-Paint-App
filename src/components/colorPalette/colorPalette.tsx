import { useRef } from "react";
import "../styles/colorPalette.css";

const ColorPalette = ({ setCurrentColor }: any): React.JSX.Element => {
  const colors = [
    { id: 1, color: "#ece6d0" },
    { id: 2, color: "#df9d81" },
    { id: 3, color: "#d7e235" },
    { id: 4, color: "#c5b82b" },
    { id: 5, color: "#f7512b" },
    { id: 6, color: "#008a93" },
    { id: 7, color: "#7b4b59" },
    { id: 8, color: "#b7ce5a" },
    { id: 9, color: "#5f89ca" },
    { id: 10, color: "#b070db" },
    { id: 11, color: "#3b4d1b" },
    { id: 12, color: "#ccdaf0" },
    { id: 13, color: "#ffcac0" },
    { id: 14, color: "#cdeaf0" },
    { id: 15, color: "#abdaf4" },
  ];

  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = (color: string) => {
    setCurrentColor(color);

    if (inputRef.current) {
      inputRef.current.value = color;
    }
  };

  const handleChange = (event: { target: any }) => {
    setCurrentColor(event.target.value);
  };

  return (
    <div className="tool-container">
      <span>Color</span>

      <div className="palette">
        {colors.map((color) => (
          <button
            onClick={() => handleClick(color.color)}
            key={color.id}
            className="palette-item"
            style={{ backgroundColor: color.color }}
          ></button>
        ))}
      </div>

      <div className="color-input-container">
        <input
          ref={inputRef}
          type="color"
          name="color"
          id="color-chooser"
          className="color-chooser"
          onChange={handleChange}
        />
      </div>
    </div>
  );
};

export default ColorPalette;
