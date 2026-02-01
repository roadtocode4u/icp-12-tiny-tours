import { useState } from "react";
import Input from "./Input";

function MultiSelect({ selectedItems, placeholder, onRemoveItem, onAddItem }) {
  const [newItem, setNewItem] = useState("");
  return (
    <div>
      {selectedItems.map((item, index) => {
        return (
          <div
            className="border border-gray-600 bg-gray-200 mx-2 px-2 rounded-full inline-block my-1"
            key={index}
          >
            {item}{" "}
            <span
              className="ml-2 cursor-pointer text-gray-400 hover:text-gray-800"
              onClick={() => {
                onRemoveItem(item);
              }}
            >
              x
            </span>
          </div>
        );
      })}
      <Input
        type="text"
        placeholder={placeholder}
        value={newItem}
        onChange={(e) => setNewItem(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            onAddItem(e.target.value);
            setNewItem("");
          }
        }}
      />
    </div>
  );
}

export default MultiSelect;
