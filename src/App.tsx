import React, {useState, useEffect} from "react";
import {DndContext, closestCorners, DragEndEvent} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import {itemForList} from "./components/types";
import {useScrollInfinite} from "./components/useScrollInfinite";
import {ItemCard} from "./components/ItemCard";
import SearchPostItems from "./components/searchPostItems";
import "./App.css";

function App() {
  const [lines, setLines] = useState<itemForList[]>([]); //массив данных
  const [scrLoad, setScrLoad] = useState<boolean>(true); //нужна ли сейчас загрузка данных или нет
  const [catchErr, setCatchErr] = useState<boolean>(false); //отображение ошибки бд
  //бесконечный скрол который вызывает подгрузку данных обновлением компонента
  const [searchTerm, setSearchTerm] = useState<string>(""); //значение поиска
  const [lastLinesLength, setlastLinesLength] = useState<number>(0);
  const [showSele, setShowSele] = useState<boolean>(false);
  const [numbORstrFind, setnumbORstrFind] = useState<boolean>(true); 

  useScrollInfinite(() => {
    setScrLoad(true);
  });

  const addLine = async () => {
    try {
      console.log(lines.length, lastLinesLength);

      const response = await fetch("http://103.137.251.210:801", {
        method: "POST",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
        },
        body: JSON.stringify({
          message: lines.length,
          messageTurn: searchTerm,
          messageShow: showSele,
        }),
      });
      const data: any = await response.json();
      setLines([...lines, ...data.mess]);
      setScrLoad(false);
      setlastLinesLength(data.mess1);
    } catch (err) {
      setCatchErr(true);
      console.log(err);
    }
  };
  
  useEffect(() => {
    console.log(showSele,window.innerHeight,document.body.clientHeight,scrLoad,
      searchTerm.length
    )
    if(scrLoad===false&&
      window.innerHeight>document.body.clientHeight&&!showSele){
      addLine();
    }
  }, [lines])

  useEffect(() => {
    if (scrLoad) addLine();
  }, [scrLoad, showSele]); // делаем запросы на подгрузку данных

  const turnChecked = (elemOrdNum: number) => {
    setLines(
      lines.map((itemLine: itemForList) =>
        elemOrdNum === itemLine.orderNumber
          ? {...itemLine, selected: !itemLine.selected}
          : itemLine
      )
    );
  }; //меняем значение чекбоксов

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const {active, over} = event;
    if (!over || active.id === over.id) return;

    setLines(prev => {
      const oldIndex = prev.findIndex(item => item.orderNumber === active.id);
      const newIndex = prev.findIndex(item => item.orderNumber === over.id);
      return arrayMove(prev, oldIndex, newIndex);
    });

    await fetch("http://103.137.251.210:801/update-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({message: {activeId: active.id, overId: over.id}}),
    });
  };

  return (
    <div>
      <div id="uoi">Тестовое задание "Цифровые Решения"</div>
      {catchErr ? (
        <p>БД не отвечает</p>
      ) : (
        <div>
          <p></p>
          <SearchPostItems
            comSearchTerm={searchTerm}
            comSetSearchTerm={setSearchTerm}
            comHandleSearch={handleSearch}
            comSetLines={setLines}
            comSetlastLinesLengt={setlastLinesLength}
            comSetScrLoad={setScrLoad}
            comShowSele={showSele}
            comSetShowSele={setShowSele}
            comNumbORstrFind={numbORstrFind}
            comSetNumbORstrFind={setnumbORstrFind}
          />
          <p></p>
          <DndContext
            collisionDetection={closestCorners}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={lines.map(item => item.orderNumber)}
              strategy={rectSortingStrategy}
            >
              <div className="block-card">
                {lines.map((element: itemForList, ind: number) => (
                  <ItemCard
                    key={element.orderNumber}
                    item={element}
                    itemTurnChecked={turnChecked}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
          {scrLoad && lines.length < lastLinesLength ? <p>Загрузка...</p> : ""}
        </div>
      )}
    </div>
  );
}

export default App;
