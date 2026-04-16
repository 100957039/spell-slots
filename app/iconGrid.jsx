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

    function genRandIcons(num, slotList){
      const ICON_CHANCE = 100;
      const NUM_OF_SLOTS = 3;
      const centerSlot = Math.floor(num / 2);

      console.log(`Center Slot: ${centerSlot}`);

      if(!Number.isInteger(num)){
        console.log(`Not Int`);
        return;
      }

      for(let i=0; i < num; i++){
        if(i == (centerSlot - 1)){
          for(let j=0; j < NUM_OF_SLOTS; j++){
            slotList[j].id = `icon${i.toString()}`;
            slotList[j].grid = i;

            iconList.push(slotList[j]);
            i++;
          }
        }

        const iconType = Math.floor(Math.random() * ICON_CHANCE);
        
        console.log(`ID: icon${i.toString()}`);
        if(iconType < 24){
          // Water
          iconList.push({
            id: `icon${i.toString()}`,
            grid: i,
            src: "/icons/Water_Icon.png",
            type: "water",
            isSlot: false
          })
          
        } else if(iconType < 48){
          // Earth
          iconList.push({
            id: `icon${i.toString()}`,
            grid: i,
            src: "/icons/Earth_Icon.png",
            type: "earth",
            isSlot: false
          })   

        } else if(iconType < 70){
          // Fire
          iconList.push({
            id: `icon${i.toString()}`,
            grid: i,
            src: "/icons/Fire_Icon.png",
            type: "fire",
            isSlot: false
          })

        } else if(iconType < 94){
          // Air
          iconList.push({
            id: `icon${i.toString()}`,
            grid: i,
            src: "/icons/Air_Icon.png",
            type: "air",
            isSlot: false
          })
          
        } else {
          // Slot symbol
          const slotType = Math.floor(Math.random() * ICON_CHANCE);

          if(slotType < 25){
            // Heart
            iconList.push({
              id: `icon${i.toString()}`,
              grid: i,
              src: "/icons/Heart_Icon.png",
              type: "heart",
              isSlot: true
            })
          
          } else if(slotType < 50){
            // Diamond
            iconList.push({
              id: `icon${i.toString()}`,
              grid: i,
              src: "/icons/Diamond_Icon.png",
              type: "diamond",
              isSlot: true
            })

          } else if(slotType < 75){
            // Spade
            iconList.push({
              id: `icon${i.toString()}`,
              grid: i,
              src: "/icons/Spade_Icon.png",
              type: "spade",
              isSlot: true
            })

          } else if(slotType < 95){
            // Clover
            iconList.push({
              id: `icon${i.toString()}`,
              grid: i,
              src: "/icons/Clover_Icon.png",
              type: "clover",
              isSlot: true
            })

          } else {
            // 7
            iconList.push({
              id: `icon${i.toString()}`,
              grid: i,
              src: "/icons/7_Icon.png",
              type: "7",
              isSlot: true
            })
          }
        }
      }
      setIconList(iconList);
    }

    genRandIcons(num, genSlots());
  }, []);

  if (!hasMounted) return null;

  const dragstartHandler = (ev) => {
    dragItem.current = ev.target;
    ev.dataTransfer.setData("text", ev.target.id);
    ev.dataTransfer.effectAllowed = "move";
    console.log("Set!");

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

    if (draggedId === targetId) return;

    const index1 = iconList.findIndex(icon => icon.id === draggedId);
    const index2 = iconList.findIndex(icon => icon.id === targetId);

    const item1 = iconList[index1];
    const item2 = iconList[index2];

    // Ensures move is allowed
    if (isAdjacent(item1.grid, item2.grid) && isMatch(item1.type, item1.isSlot, item2.type, item2.isSlot)) {
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
    const checkList = [];

    checkList.push(grid1 - CHECK_VERTICAL);
    checkList.push(grid1 + CHECK_VERTICAL);
    checkList.push(grid1 - CHECK_HORIZONTAL);
    checkList.push(grid1 + CHECK_HORIZONTAL);

    for(const check of checkList){
      console.log(`Check: ${check}`);
      if(grid2 == check){
        return true;
      }
    }
    return false; 
  };

  const isMatch = () => {
    return true;
  }

  return (
    <div className='container'>
      {iconList.map((icon) => {
        const centerSquare = Math.floor(num / 2);
        const isCenterSquare = (icon.grid == (centerSquare - 1)) || (icon.grid == centerSquare) || (icon.grid == (centerSquare + 1));
        console.log(`Is Center: ${isCenterSquare}`);

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