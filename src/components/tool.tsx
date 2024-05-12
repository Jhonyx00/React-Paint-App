import React from "react";
import { CurrentTool, IconTool } from "../interfaces/IconTool";
import "../styles/tool.css";

const Tool = ({
  toolGroupName,
  toolItems,
  setCurrentTool,
}: any): React.JSX.Element => {
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
