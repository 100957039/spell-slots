'use client';
import { useState, useEffect, useRef } from 'react';
import './iconGrid.css';

/* 
  Takes provided icons and returns them in grid formation
*/
function IconGrid({num}){
  // Initialize Icons
  const [iconList, setIconList] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  const dragItem = useRef(null);

  useEffect(() => {
    setHasMounted(true);

    function genIconList(slotList){
      const NUM_OF_SLOTS = 3;
      const tempIconList = []
      let hasMatch = true;
      let icon;

      if(!Number.isInteger(num)){
        console.log(`Not Int`);
        return;
      } else if (num < 3) {
        console.log(`Too Small`);
        return;
      }

      const fullBoard = num * num;
      const centerSlot = Math.floor(fullBoard / 2);

      for(let i=0; i < fullBoard; i++){
        if(i == (centerSlot - 1)){
          for(let j=0; j < NUM_OF_SLOTS; j++){
            slotList[j].id = `icon${i.toString()}`;
            slotList[j].grid = i;

            tempIconList.push(slotList[j]);
            i++;
          }
        }
        hasMatch = true;

        while(hasMatch){
          hasMatch = false;

          icon = genRandIcon(i);
          hasMatch = checkInitialMatches(i, icon.type, tempIconList);
        }
        
        tempIconList.push(icon);
      }
      setIconList(tempIconList);
    }

    genIconList(genSlots());
  }, []);

  function genSlots(){
    const ICON_CHANCE = 100;
    const NUM_OF_SLOTS = 3;
    const slotList = [];

    for(let i=0; i < NUM_OF_SLOTS; i++){
      // Slot symbol
      const slotType = Math.floor(Math.random() * ICON_CHANCE);

      if(slotType < 25){
        // Heart
        slotList.push({
          id: "",
          grid: 0,
          src: "/icons/Heart_Icon.png",
          type: "heart",
          isSlot: true
        })
      
      } else if(slotType < 50){
        // Diamond
        slotList.push({
          id: "",
          grid: 0,
          src: "/icons/Diamond_Icon.png",
          type: "diamond",
          isSlot: true
        })

      } else if(slotType < 75){
        // Spade
        slotList.push({
          id: "",
          grid: 0,
          src: "/icons/Spade_Icon.png",
          type: "spade",
          isSlot: true
        })

      } else if(slotType < 95){
        // Clover
        slotList.push({
          id: "",
          grid: 0,
          src: "/icons/Clover_Icon.png",
          type: "clover",
          isSlot: true
        })

      } else {
        // 7
        slotList.push({
          id: "",
          grid: 0,
          src: "/icons/7_Icon.png",
          type: "7",
          isSlot: true
        })
      }
    }
    return slotList;
  }

  function genRandIcon(index, excludeType = "", genSlotIcon = false){
    const ICON_CHANCE = 100;
    let icon = {
      id: "",
      grid: -1,
      src: "",
      type: "",
      isSlot: false
    }
    let iconType;

    if(genSlotIcon){
      iconType = 100;
    } else {
      iconType = Math.floor(Math.random() * ICON_CHANCE);
    }
    
    
    if(iconType < 16){
      // Water
      icon = {
        id: `icon${index.toString()}`,
        grid: index,
        src: "/icons/Water_Icon.png",
        type: "water",
        isSlot: false
      }
      
    } else if(iconType < 32){
      // Earth
      icon = {
        id: `icon${index.toString()}`,
        grid: index,
        src: "/icons/Earth_Icon.png",
        type: "earth",
        isSlot: false
      }

    } else if(iconType < 48){
      // Fire
      icon = {
        id: `icon${index.toString()}`,
        grid: index,
        src: "/icons/Fire_Icon.png",
        type: "fire",
        isSlot: false
      }

    } else if(iconType < 64){
      // Air
      icon = {
        id: `icon${index.toString()}`,
        grid: index,
        src: "/icons/Air_Icon.png",
        type: "air",
        isSlot: false
      }

    } else if(iconType < 80){
      // Salt
      icon = {
        id: `icon${index.toString()}`,
        grid: index,
        src: "/icons/Salt_Icon.png",
        type: "salt",
        isSlot: false
      }
      
    } else if(iconType < 96){
      // Sulfur
      icon = {
        id: `icon${index.toString()}`,
        grid: index,
        src: "/icons/Sulfur_Icon.png",
        type: "sulfur",
        isSlot: false
      }
      
    } else {
      // Slot symbol
      const slotType = Math.floor(Math.random() * ICON_CHANCE);

      if(slotType < 25){
        // Heart
        icon = {
          id: `icon${index.toString()}`,
          grid: index,
          src: "/icons/Heart_Icon.png",
          type: "heart",
          isSlot: true
        }
      
      } else if(slotType < 50){
        // Diamond
        icon = {
          id: `icon${index.toString()}`,
          grid: index,
          src: "/icons/Diamond_Icon.png",
          type: "diamond",
          isSlot: true
        }

      } else if(slotType < 75){
        // Spade
        icon = {
          id: `icon${index.toString()}`,
          grid: index,
          src: "/icons/Spade_Icon.png",
          type: "spade",
          isSlot: true
        }

      } else if(slotType < 95){
        // Clover
        icon = {
          id: `icon${index.toString()}`,
          grid: index,
          src: "/icons/Clover_Icon.png",
          type: "clover",
          isSlot: true
        }

      } else {
        // 7
        icon = {
          id: `icon${index.toString()}`,
          grid: index,
          src: "/icons/7_Icon.png",
          type: "7",
          isSlot: true
        }
      }
    }
    if(icon.type == excludeType){
      icon = genRandIcon(excludeType);
    }

    return icon;
  }

  function checkInitialMatches (currentIndex, type, boardToCheck){
    const checkVertical = num;
    const CHECK_HORIZONTAL = 1;
    const MIN_COORD = 1;
    const checkList = [
      [checkVertical, (checkVertical*2)],
      [CHECK_HORIZONTAL, (CHECK_HORIZONTAL*2)]
    ];
    const indexX = currentIndex % num;
    const indexY = Math.floor(currentIndex / num);
    const requireCheck = [
      (indexY > MIN_COORD),
      (indexX > MIN_COORD)
    ];

      for(let i = 0; i < checkList.length; i++){
        const check1 = currentIndex - checkList[i][0];
        const check2 = currentIndex - checkList[i][1];

        if(requireCheck[i]){
          if(type == boardToCheck[check1].type && type == boardToCheck[check2].type){
            return true;
          }
        }
      }
    return false;
  }

  if (!hasMounted) return null;

  const dragstartHandler = (ev) => {
    if (gameOver) return;

    dragItem.current = ev.target;
    ev.dataTransfer.setData("text", ev.target.id);
    ev.dataTransfer.effectAllowed = "move";

    setTimeout(() => {
      ev.target.style.opacity = '0';
    }, 0);
  };

  const dragEndHandler = (ev) => {
    ev.target.style.opacity = '1';
  };

  const dragoverHandler = (ev) => {
    ev.preventDefault();
  };

  const dropHandler = (ev) => {
    if(gameOver) return;

    ev.preventDefault();
    const draggedId = ev.dataTransfer.getData("text");
    const targetId = ev.target.id;
    const tempBoard = [...iconList];

    if (draggedId === targetId) return;

    const index1 = iconList.findIndex(icon => icon.id === draggedId);
    const index2 = iconList.findIndex(icon => icon.id === targetId);

    const item1 = iconList[index1];
    const item2 = iconList[index2];

    tempBoard[index1] = { ...item2, id: item1.id, grid: item1.grid };
    tempBoard[index2] = { ...item1, id: item2.id, grid: item2.grid };

    const {matchType, indexes} = isValidMove(tempBoard, item1, item2);

    // Ensures move is allowed
    if (isAdjacent(item1.grid, item2.grid) && matchType.length > 0) {
      const newIcons = [...iconList];

      newIcons[index1] = { ...item2, id: item1.id, grid: item1.grid };
      newIcons[index2] = { ...item1, id: item2.id, grid: item2.grid };

      setIconList(newIcons);
      //processMatch(matchType, indexes);
      if(checkWin()){
        setGameOver(true);
      }
    }
    
    if (dragItem.current) dragItem.current.style.opacity = '1';
  }; 

  const isAdjacent = (grid1, grid2) => {
    const checkVertical = num;
    const CHECK_HORIZONTAL = 1;
    const checkList = [
      grid1 - checkVertical,
      grid1 + checkVertical,
      grid1 - CHECK_HORIZONTAL,
      grid1 + CHECK_HORIZONTAL
    ];

    for(const check of checkList){
      if(grid2 == check){
        return true;
      }
    }
    return false; 
  };

  const isValidMove = (tempIconList, item1, item2) => {
    console.log(`\nStart\n`);
    const checkVertical = num;
    const CHECK_HORIZONTAL = 1;
    const centerSquare = Math.floor((num * num) / 2);
    const isCenterSquare = (
      (item1.grid >= (centerSquare - 1)) &&
      (item1.grid <= (centerSquare + 1)) ||
      (item2.grid >= (centerSquare - 1)) &&
      (item2.grid <= (centerSquare + 1))
    );
    const MIN_COORD = 1;
    const maxCoord = num - 2;
    const MATCH_TYPE = [
      "up",
      "left",
      "down",
      "right",
      "vertical",
      "horizontal",
      "slot"
    ];
    // Check Up, Left, Down, Right, Vertical, Horizontal
    const checkList = [
      [checkVertical, (checkVertical*2)],
      [CHECK_HORIZONTAL, (CHECK_HORIZONTAL*2)],
      [-checkVertical, -(checkVertical*2)],
      [-CHECK_HORIZONTAL, -(CHECK_HORIZONTAL*2)],
      [checkVertical, -checkVertical],
      [CHECK_HORIZONTAL, -CHECK_HORIZONTAL],
    ];
    const itemList = [tempIconList[item2.grid], tempIconList[item1.grid]];
    let matchType = [];
    let indexes = [];

    // Slot icons can always be switched with each other
    if(item1.isSlot && item2.isSlot){
      matchType.push(MATCH_TYPE[6]); 
      indexes.push([item1.grid, item2.grid]);

    } else if(!isCenterSquare) {
      for(let i = 0; i < (itemList.length); i++){
        console.log(`i = ${i}`);
        for(let j = 0; j < checkList.length; j++){
          console.log(`j = ${j}`);
          const indexX = itemList[i].grid % num;
          const indexY = Math.floor(itemList[i].grid / num);
          console.log(`Index: (${indexX}, ${indexY})`);
          // Check Up, Left, Down, Right, Vertical, Horizontal
          const requireCheck = [
            (indexY > MIN_COORD),
            (indexX > MIN_COORD),
            (indexY < maxCoord),
            (indexX < maxCoord),
            (indexY > (MIN_COORD - 1) && indexY < (maxCoord + 1)),
            (indexX > (MIN_COORD - 1) && indexX < (maxCoord + 1))
          ];
          const check1 = itemList[i].grid - checkList[j][0];
          const check2 = itemList[i].grid - checkList[j][1];

          console.log(`Required Check: ${MATCH_TYPE[j]}, ${requireCheck[j]}`);
          console.log(`Check 1: ${check1}\nCheck 2: ${check2}`);
          console.log(`itemList: ${itemList[(i)].type}`);
          if(requireCheck[j]){
            console.log(`\nMoved Item Type: ${itemList[i].type}\nCheck 1 Type: ${tempIconList[check1].type} \nCheck 2 Type: ${tempIconList[check2].type}`);

            if(itemList[(i)].type == tempIconList[check1].type && itemList[(i)].type == tempIconList[check2].type){
              matchType.push(MATCH_TYPE[j]); 
              indexes.push([(i), check1, check2]);
              console.log(`Match Found: ${MATCH_TYPE[j]}`);
            }
          }
        }
      }
    } 
    console.log(`Matches Found: ${matchType.toString()}`);
    console.log(`\nEnd\n`);
    return {matchType, indexes};
  }

  const processMatch = (matchType, indexes) => {
    const tempIconList = [...iconList];
    const MATCH_TYPE = [
      "up",
      "left",
      "down",
      "right",
      "vertical",
      "horizontal",
      "slot"
    ];
    const newIndexes = [...indexes];

    for (let i = 0; i < newIndexes.length; i++){
      for (let j = 0; j < matchType.length; j++){
        switch(matchType[j]){
          case MATCH_TYPE[0]: // Up
            newIndexes[i] = checkBigMatch(matchType[j], newIndexes[i]);
            break;
          case MATCH_TYPE[1]: // Left
            break;
          case MATCH_TYPE[2]: // Down
            break;
          case MATCH_TYPE[3]: // Right
            break;
          case MATCH_TYPE[4]: // Vertical
            break;
          case MATCH_TYPE[5]: // Horizontal
            break;
          case MATCH_TYPE[6]: // Slot
            break;
        }
      }
    }
    setIconList(tempIconList);
  }

  const checkBigMatch = (matchType, indexes) => {
    const MATCH_TYPE = [
      "up",
      "left",
      "down",
      "right",
      "vertical",
      "horizontal",
      "slot"
    ];
    const newIndexes = [...indexes];

    switch(matchType[i]){
        case MATCH_TYPE[0]: // Up
          checkBigMatch
          break;
        case MATCH_TYPE[1]: // Left
          break;
        case MATCH_TYPE[2]: // Down
          break;
        case MATCH_TYPE[3]: // Right
          break;
        case MATCH_TYPE[4]: // Vertical
          break;
        case MATCH_TYPE[5]: // Horizontal
          break;
        case MATCH_TYPE[6]: // Slot
          break;
      }
  }

  const checkMatches = () => {

  }

  const checkWin = () => {
    const centerSquare = Math.floor((num * num) / 2);
    if(iconList[centerSquare - 1].type == iconList[centerSquare].type && iconList[centerSquare].type == iconList[centerSquare + 1].type){
      return true;
    }
    return false;
  }

  return (
    <div className='container' style={{ position: 'relative'}}>
      {iconList.map((icon) => {
        const centerSquare = Math.floor((num * num) / 2);
        const isCenterSquare = (icon.grid == (centerSquare - 1)) || (icon.grid == centerSquare) || (icon.grid == (centerSquare + 1));

      return (
        <div key={icon.id} className={`tile ${isCenterSquare ? 'centerZone' : ''}`}>
          <img
            id={icon.id}
            src={icon.src}
            grid={icon.grid}
            type={icon.type}
            isslot={(icon.isSlot).toString()}
            draggable="true"
            onDragStart={dragstartHandler}
            onDragEnd={dragEndHandler}
            onDrop={dropHandler}
            onDragOver={dragoverHandler}
            className={`icon ${icon.isSlot ? 'isSlot' : ''}`}
          />
        </div>
      );
    })}

      {gameOver && (
        <div className="overlay">
          <div className="modal">
            <h1>JACKPOT!</h1>
            <p>You matched the center slots!</p>
            <button onClick={() => window.location.reload()}>Play Again</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default IconGrid;