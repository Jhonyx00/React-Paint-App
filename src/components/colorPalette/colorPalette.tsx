import { useRef } from "react";
import "./colorPalette.css";

//data
import { colors } from "../../utilities/data";

const ColorPalette = ({ setCurrentColor }: any): React.JSX.Element => {
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
