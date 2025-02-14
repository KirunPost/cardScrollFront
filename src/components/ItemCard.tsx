import React, {useState, useEffect} from "react";
import "../App.css";
import {itemForList} from "./types";
import {CSS} from "@dnd-kit/utilities";
import {useSortable} from "@dnd-kit/sortable";

interface InterItemCard {
  item: itemForList;
  itemTurnChecked: (orderNumber: number) => void;
}

export const ItemCard: React.FC<InterItemCard> = ({item, itemTurnChecked}) => {
  const updateCheckBox = async (numberElem: number) => {
    const response = await fetch("http://103.137.251.210:801/updateCheckbox", {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify({message: numberElem}),
    });
    const data = await response.json();
    console.log(data);
  };

  const {attributes, listeners, setNodeRef, transform, transition} =
    useSortable({
      id: item.orderNumber,
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div className="card" key={item.orderNumber} style={style} ref={setNodeRef}>
      <div style={{display: "flex", justifyContent: "flex-end"}}>
        <div className="order-number">№{item.orderNumber}</div>
        <div
          {...listeners}
          {...attributes}
          className="drag-handle"
          style={{
            cursor: "pointer",
          }}
        >
          ⠿⠿⠿⠿⠿⠿⠿⠿
        </div>
      </div>
      <div
        style={{display: "flex", marginTop: "45px", flexDirection: "column"}}
      >
        <p style={{marginTop: "46px"}}>{item.value}</p>
        <p style={{marginTop: "46px", textAlign: "center"}}>{item.value2}</p>
      </div>
      <p className="checkbox">
        <label>
          Выбрать карточку
          <input
            type="checkbox"
            checked={item.selected}
            onChange={() => {
              itemTurnChecked(item.orderNumber);
              updateCheckBox(item.orderNumber);
            }}
          />
        </label>
      </p>
    </div>
  );
};
