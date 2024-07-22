import { Dispatch, SetStateAction } from "react";
import { CurrentTool, IconTool } from "../../interfaces/IconTool";
import "./tool.css";

const Tool = ({
  toolGroupName,
  toolItems,
  setCurrentTool,
  setSelected,
}: {
  toolGroupName: string;
  toolItems: IconTool[];
  setCurrentTool: Dispatch<SetStateAction<CurrentTool>>;
  setSelected: Dispatch<SetStateAction<boolean>>;
}) => {
  const handleClick = (tool: CurrentTool) => {
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
        {toolItems.map((item: IconTool) => (
          <button
            key={item.toolId}
            onClick={() =>
              handleClick({
                toolId: item.toolId,
                name: item.name,
                toolGroupID: item.toolGroupID,
              })
            }
          >
            <img className="icon" src={item.icon} alt="" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default Tool;
