import { Dispatch, SetStateAction, useEffect, useRef } from "react";
import "./colorPalette.css";

//data
import { colors } from "../../data/data";

const ColorPalette = ({
  setCurrentColor,
}: {
  setCurrentColor: Dispatch<SetStateAction<string>>;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = (color: string) => {
    setCurrentColor(color);
    if (inputRef.current) {
      inputRef.current.value = color;
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentColor(event.target.value);
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.value = "#808080";
    }
    setCurrentColor("#808080");
  }, []);

  return (
    <div className="tool-container">
      <span>Color</span>

      <div className="tool">
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
    </div>
  );
};

export default ColorPalette;
