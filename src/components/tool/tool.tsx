import React, { Dispatch, SetStateAction } from "react";
import { CurrentTool, IconTool } from "../../interfaces/IconTool";
import "./tool.css";

const Tool = ({
  toolGroupName,
  toolItems,
  setCurrentTool,
}: {
  toolGroupName: string;
  toolItems: IconTool[];
  setCurrentTool: Dispatch<SetStateAction<CurrentTool>>;
}): React.JSX.Element => {
  const handleClick = (tool: CurrentTool) => {
    setCurrentTool(tool);
  };

  return (
    <div className="tool-item-container">
      <span className="text">{toolGroupName}</span>
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
