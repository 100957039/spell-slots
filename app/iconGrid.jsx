'use client';
import { useState, useEffect, useRef } from 'react';
import './iconGrid.css';

/* 
  Takes provided icons and returns them in grid formation
*/
function IconGrid({num}){
  // Initialize Icons
  const [iconList, setIconList] = useState([]);
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

  function genRandIcon(index, excludeType = ""){
    const ICON_CHANCE = 100;
    let icon = {
      id: "",
      grid: -1,
      src: "",
      type: "",
      isSlot: false
    }

    const iconType = Math.floor(Math.random() * ICON_CHANCE);
    
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
    const CHECK_VERTICAL = num;
    const CHECK_HORIZONTAL = 1;
    const MIN_COORD = 1;
    const checkList = [
      [CHECK_VERTICAL, (CHECK_VERTICAL*2)],
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


    // Ensures move is allowed
    if (isAdjacent(item1.grid, item2.grid) && isValidMove(tempBoard, item1, item2)) {
      const newIcons = [...iconList];

      newIcons[index1] = { ...item2, id: item1.id, grid: item1.grid };
      newIcons[index2] = { ...item1, id: item2.id, grid: item2.grid };

      setIconList(newIcons);
    }
    
    if (dragItem.current) dragItem.current.style.opacity = '1';
  }; 

  const isAdjacent = (grid1, grid2) => {
    const CHECK_VERTICAL = 9;
    const CHECK_HORIZONTAL = 1;
    const checkList = [
      grid1 - CHECK_VERTICAL,
      grid1 + CHECK_VERTICAL,
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
    const CHECK_VERTICAL = num;
    const CHECK_HORIZONTAL = 1;
    const MIN_COORD = 1;
    const MAX_COORD = num - 2;
    // Check Up, Left, Down, Right, Vertical, Horizontal
    const checkList = [
      [CHECK_VERTICAL, (CHECK_VERTICAL*2)],
      [CHECK_HORIZONTAL, (CHECK_HORIZONTAL*2)],
      [-CHECK_VERTICAL, -(CHECK_VERTICAL*2)],
      [-CHECK_HORIZONTAL, -(CHECK_HORIZONTAL*2)],
      [CHECK_VERTICAL, -CHECK_VERTICAL],
      [CHECK_HORIZONTAL, -CHECK_HORIZONTAL],
    ];
    const matchName = [
            "Up",
            "Left",
            "Down",
            "Right",
            "Vertical",
            "Horizontal"
          ];
    const itemList = [item2, item1, item2];

    // Slot icons can always be switched with each other
    if(item1.isSlot && item2.isSlot){
      return true;

    } else {
      for(let i = 0; i < (itemList.length - 1); i++){
        for(let j = 0; j < checkList.length; j++){
          const indexX = itemList[i+1].grid % num;
          const indexY = Math.floor(itemList[i+1].grid / num);
          const requireCheck = [
            (indexY > MIN_COORD),
            (indexX > MIN_COORD),
            (indexY < MAX_COORD),
            (indexX < MAX_COORD),
            (indexY > (MIN_COORD - 1) && indexY < (MAX_COORD + 1)),
            (indexX > (MIN_COORD - 1) && indexX < (MAX_COORD + 1))
          ];

          const check1 = itemList[i].grid - checkList[j][0];
          const check2 = itemList[i].grid - checkList[j][1];

          if(requireCheck[j]){
            if(itemList[(i+1)].type == tempIconList[check1].type && itemList[(i+1)].type == tempIconList[check2].type){
              return true;
            }
          }
        }
      }
    }
    return false;
  }

  return (
    <div className='container'>
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
    </div>
  );
}

export default IconGrid;