import { Dispatch, SetStateAction } from "react";
import { ToolItem } from "../../interfaces/ToolItem";
import "./tool.css";
import Icon from "../Icon/Icon";
import { ToolIcon } from "../../interfaces/ToolIcon";

const Tool = ({
  toolGroupName,
  toolItems,
  currentColor,
  setCurrentTool,
  setSelected,
}: {
  toolGroupName: string;
  toolItems: ToolIcon[];
  currentColor: string;
  setCurrentTool: Dispatch<SetStateAction<ToolItem>>;
  setSelected: Dispatch<SetStateAction<boolean>>;
}) => {
  const handleClick = (tool: ToolItem) => {
    setCurrentTool(tool);
  };

  const handleToolClick = () => {
    if (toolGroupName === "Shapes") {
      setSelected((prev) => !prev);
    }
  };

  return (
    <div className="tool-item-container">
      <span className="text" onClick={handleToolClick}>
        {toolGroupName} {toolGroupName === "Shapes" ? "›" : ""}
      </span>
      <div className={toolGroupName + " tool"}>
        {toolItems.map((item: ToolIcon) => (
          <button
            key={item.id}
            onClick={() =>
              handleClick({
                id: item.id,
                name: item.name,
                groupId: item.groupId,
              })
            }
          >
            {item.svg ? (
              <Icon color={currentColor} shape={item.svg} />
            ) : (
              <img className="icon" src={item.url} alt="" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Tool;
