import React, { useState, useEffect } from "react";
import "../App.css";
import { itemForList } from "./types";

interface interSearPostIt {
  comSearchTerm: string;
  comSetSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  comHandleSearch: (event: any) => void;
  comSetLines: React.Dispatch<React.SetStateAction<Array<itemForList>>>;
  comSetlastLinesLengt: React.Dispatch<React.SetStateAction<number>>;
  comSetScrLoad: React.Dispatch<React.SetStateAction<boolean>>;
  comShowSele: boolean;
  comSetShowSele: React.Dispatch<React.SetStateAction<boolean>>;
  comNumbORstrFind: boolean;
  comSetNumbORstrFind: React.Dispatch<React.SetStateAction<boolean>>;
}

const SearchPostItems: React.FC<interSearPostIt> = ({
  comSearchTerm,
  comSetSearchTerm,
  comHandleSearch,
  comSetLines,
  comSetlastLinesLengt,
  comSetScrLoad,
  comShowSele,
  comSetShowSele,
  comNumbORstrFind,
  comSetNumbORstrFind,
}) => {
  const resPostSearch = async () => {
    try {
      const response = await fetch("http://103.137.251.210:801/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
        }, 
        body: JSON.stringify({ 
          message: comSearchTerm, 
          messageShow: comShowSele,
          messageNumbORStr: comNumbORstrFind
        }),
      });
      const data = await response.json();
      comSetLines(data);
      comSetlastLinesLengt(0);
    } catch (error) {
      console.error("Ошибка поиска:", error);
    }
  };

  useEffect(() => {
    resPostSearch(); // вызываем поиск при изменении фильтра
  }, [comShowSele]);

  return (
    <div>
      <input
        type="text"
        placeholder={comNumbORstrFind?"поиск по содержимому":"поиск по номеру"}
        value={comSearchTerm}
        onChange={comHandleSearch}
      />
      <input type="button" value="Найти" onClick={resPostSearch} />
      <input
        type="button"
        value="Отчистить"
        onClick={() => {
          comSetLines([]);
          comSetlastLinesLengt(0);
          comSetSearchTerm('');
          comSetScrLoad(true);
        }}
      />
      <input
        type="button"
        disabled={!comNumbORstrFind}
        value={comShowSele?"Отмеченные":"Не отмеченные"}
        onClick={() => { 
          let turmShow = !comShowSele; 
          comSetShowSele(turmShow);
        }}
      />
      <p></p>
      <label>
      <input type="checkbox" onClick={()=>
      comSetNumbORstrFind(!comNumbORstrFind) }/>
        {comNumbORstrFind?"поиск по содержимому":"поиск по номеру"} 
      </label>
    </div>
  );
};

export default SearchPostItems;
