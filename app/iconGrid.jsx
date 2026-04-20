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
    let slotList = [];

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
          isSlot: true,
          isFalling: false,
          isNewSlot: false
        })
      
      } else if(slotType < 50){
        // Diamond
        slotList.push({
          id: "",
          grid: 0,
          src: "/icons/Diamond_Icon.png",
          type: "diamond",
          isSlot: true,
          isFalling: false,
          isNewSlot: false
        })

      } else if(slotType < 75){
        // Spade
        slotList.push({
          id: "",
          grid: 0,
          src: "/icons/Spade_Icon.png",
          type: "spade",
          isSlot: true,
          isFalling: false,
          isNewSlot: false
        })

      } else if(slotType < 95){
        // Clover
        slotList.push({
          id: "",
          grid: 0,
          src: "/icons/Clover_Icon.png",
          type: "clover",
          isSlot: true,
          isFalling: false,
          isNewSlot: false
        })

      } else {
        // 7
        slotList.push({
          id: "",
          grid: 0,
          src: "/icons/7_Icon.png",
          type: "7",
          isSlot: true,
          isFalling: false,
          isNewSlot: false
        })
      }
    }
    // Ensures the slots can't start as all the same
    if(slotList[0].type == slotList[1].type && slotList[0].type == slotList[2].type){
      slotList[2] = genRandIcon(slotList[2].grid, slotList[2].type, true);
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
      isSlot: false,
      isFalling: false,
          isNewSlot: false
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
        isSlot: false,
        isFalling: false,
        isNewSlot: false
      }
      
    } else if(iconType < 32){
      // Earth
      icon = {
        id: `icon${index.toString()}`,
        grid: index,
        src: "/icons/Earth_Icon.png",
        type: "earth",
        isSlot: false,
        isFalling: false,
        isNewSlot: false
      }

    } else if(iconType < 48){
      // Fire
      icon = {
        id: `icon${index.toString()}`,
        grid: index,
        src: "/icons/Fire_Icon.png",
        type: "fire",
        isSlot: false,
        isFalling: false,
        isNewSlot: false
      }

    } else if(iconType < 64){
      // Air
      icon = {
        id: `icon${index.toString()}`,
        grid: index,
        src: "/icons/Air_Icon.png",
        type: "air",
        isSlot: false,
        isFalling: false,
        isNewSlot: false
      }

    } else if(iconType < 80){
      // Salt
      icon = {
        id: `icon${index.toString()}`,
        grid: index,
        src: "/icons/Salt_Icon.png",
        type: "salt",
        isSlot: false,
        isFalling: false,
        isNewSlot: false
      }
      
    } else if(iconType < 96){
      // Sulfur
      icon = {
        id: `icon${index.toString()}`,
        grid: index,
        src: "/icons/Sulfur_Icon.png",
        type: "sulfur",
        isSlot: false,
        isFalling: false,
        isNewSlot: false
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
          isSlot: true,
          isFalling: false,
          isNewSlot: false
        }
      
      } else if(slotType < 50){
        // Diamond
        icon = {
          id: `icon${index.toString()}`,
          grid: index,
          src: "/icons/Diamond_Icon.png",
          type: "diamond",
          isSlot: true,
          isFalling: false,
          isNewSlot: false
        }

      } else if(slotType < 75){
        // Spade
        icon = {
          id: `icon${index.toString()}`,
          grid: index,
          src: "/icons/Spade_Icon.png",
          type: "spade",
          isSlot: true,
          isFalling: false,
          isNewSlot: false
        }

      } else if(slotType < 95){
        // Clover
        icon = {
          id: `icon${index.toString()}`,
          grid: index,
          src: "/icons/Clover_Icon.png",
          type: "clover",
          isSlot: true,
          isFalling: false,
          isNewSlot: false
        }

      } else {
        // 7
        icon = {
          id: `icon${index.toString()}`,
          grid: index,
          src: "/icons/7_Icon.png",
          type: "7",
          isSlot: true,
          isFalling: false,
          isNewSlot: false
        }
      }
    }
    if(icon.type == excludeType){
      icon = genRandIcon(icon.grid, excludeType, genSlotIcon);
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

    if (draggedId === targetId) return;

    setIconList((currentList) => {
      const tempBoard = [...currentList];

      const index1 = tempBoard.findIndex(icon => icon.id === draggedId);
      const index2 = tempBoard.findIndex(icon => icon.id === targetId);

      const item1 = tempBoard[index1];
      const item2 = tempBoard[index2];

      // Ensures move is allowed
      if (!isAdjacent(item1.grid, item2.grid)) return currentList;

      tempBoard[index1] = { ...item2, id: item1.id, grid: item1.grid };
      tempBoard[index2] = { ...item1, id: item2.id, grid: item2.grid };

      const indexes = isValidMove(tempBoard, item1, item2);

      if (indexes.length > 0){
        const finalBoard = processMatch(indexes, tempBoard);
        console.log("Final Board");
        finalBoard.forEach(icon => {
        console.log(`Icon Type: ${icon.type}\n Index: ${icon.grid}`);
      });
        return finalBoard;
      }
      
      return currentList;
    });
    
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
      indexes.push(item2.grid, item1.grid);

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

            if(itemList[i].type == tempIconList[check1].type && itemList[(i)].type == tempIconList[check2].type){
              matchType.push(MATCH_TYPE[j]); 
              indexes.push(itemList[i].grid, check1, check2);
              console.log(`Match Found: ${MATCH_TYPE[j]}\n Item #${2-i}, itemList[i].grid: ${itemList[i].grid}, check1: ${check1}, check2: ${check2},`);
            }
          }
        }
      }
    } 
    console.log(`Matches Found: ${matchType.toString()}`);
    console.log(`\nEnd\n`);
    return indexes;
  }

  // const processMatch = (indexes, tempBoard) => {
  //   const gridNumber = num;
  //   const CHECK_HORIZONTAL = 1;
  //   const BASIC_MATCH = 3;
  //   const centerSquare = Math.floor((num * num) / 2);
  //   const tempIconList = [...tempBoard];
  //   let newIndexes = [];

  //   // If move was between 2 slot icons, stop processing
  //   if(indexes.length >= BASIC_MATCH){

  //     // Remove duplicate indexes
  //     for (let i = 0; i < indexes.length; i++){
  //       console.log(`Matched Indexes: ${indexes[i]}`);
  //       if(!newIndexes.includes(indexes[i])){
  //         console.log(`New Index: ${indexes[i]}`);
  //         newIndexes.push(indexes[i]);
  //       }
  //     }

  //     console.log(`New Index Length: ${indexes.length}`);

  //     // Set the matched Icons to null
  //     newIndexes.forEach(index => {
  //       console.log(`Changed to null: Index: ${index}\n Prev Type: ${tempIconList[index].type}`);
  //       tempIconList[index].type = null; 
  //       console.log(`Changed to null: Index: ${index}\n New Type: ${tempIconList[index].type}`);
  //     });

  //     // If matching above basic, make moved icon a slot symbol
  //     if(newIndexes.length > BASIC_MATCH) {
  //       console.log(`Above Basic: ${newIndexes.length}`);
  //       const newSlot = genRandIcon(newIndexes[0], "", true);
  //       tempIconList[newIndexes[0]] = {...newSlot, isNewSlot: true};
  //       console.log(`New Slot Symbol: ${tempIconList[newIndexes[0]].type}`);
  //       console.log(`New first Index: ${newIndexes[0]}`);
  //     }

  //     console.log(`\n#####START#####\n`);
  //     // Go through each row of the board
  //     for (let i = 0; i < gridNumber; i++) {
  //       let nextIndex;
  //       // Checks through each column and moves icon down if there's null icons
  //       for (let j = gridNumber - 1; j >= 0; j--) {
  //         let index = j * gridNumber + i;

  //         // Skip new slot icons
  //         if (tempIconList[index].isNewSlot) continue;
          
  //         if(nextIndex === undefined){
  //           nextIndex = index;
  //         }

  //         nextIndex -= gridNumber;

  //         console.log(`Index: ${index}, nextIndex: ${nextIndex}`);
  //         // Generate new icon if the top has been reached
  //         if (nextIndex < 0 && tempIconList[index].type == null) {
  //           console.log(`Top Reached: Before Generation: ${tempIconList[index].type}`);
  //           const newIcon = genRandIcon(index);
  //           tempIconList[index] = {...newIcon, isFalling: true};

  //           console.log(`Top Reached: New Icon: ${tempIconList[index].type}`);

  //         } else if(tempIconList[index].type == null) {
  //           console.log(`Null found, switching Icons`);
            
  //           // Switch the null icon with the icon above
  //           const item1 = tempIconList[index];
  //           let item2 = tempIconList[nextIndex];

  //           while(item2.type == null && newIndexes.includes(nextIndex) || item2.isNewSlot){
  //             console.log(`Part of Match: ${nextIndex}`);
  //             nextIndex -= gridNumber;
  //             if(nextIndex > 0){
  //               item2 = tempIconList[nextIndex];
  //               console.log(`Changed: ${nextIndex}`);
  //             } else {
  //               console.log(`Reached the top: ${nextIndex}`);
  //               break;
  //             }
  //           }

  //           if (nextIndex > 0) {
  //             console.log(`Before change: ${item1.type}, ${item2.type}`);

  //             tempIconList[index] = { ...item2, id: item1.id, grid: item1.grid, isFalling: true };
  //             tempIconList[nextIndex] = { ...item1, id: item2.id, grid: item2.grid, isFalling: true };

  //             console.log(`After change: ${tempIconList[index].type}, ${tempIconList[nextIndex].type}`);
  //           }
  //         }
  //       }
  //     }      

  //     setIconList(() => [...tempIconList]);

  //     console.log("####Process List####");
  //     tempIconList.forEach(icon => {
  //       console.log(`Icon Type: ${icon.type}\n Index: ${icon.grid}`);
  //     });

  //     // Resets falling animation
  //     setTimeout(() => {
  //       setIconList(currentList => 
  //         currentList.map(icon => ({ ...icon, isFalling: false, isNewSlot: false }))
  //       );
  //     }, 300);
  //   }

  //   if(checkWin(tempIconList)){
  //     setGameOver(true);
  //   }
  //   console.log(`\n#####END#####\n`);
  //   return tempIconList;
    
  // };

  const processMatch = (indexes, tempBoard) => {
    const gridNumber = num;
    const BASIC_MATCH = 3;
    const tempIconList = [...tempBoard];
    let newIndexes = [];

    // If move was between 2 slot icons, stop processing
    if(indexes.length >= BASIC_MATCH){

      // Remove duplicate indexes
      for (let i = 0; i < indexes.length; i++){
        if(!newIndexes.includes(indexes[i])){
          newIndexes.push(indexes[i]);
        }
      }

      // Set the matched Icons to null
      newIndexes.forEach(index => {
        tempIconList[index] = { ...tempIconList[index], type: null, src: "/icons/error.png" };
      });

      // If matching above basic, make moved icon a slot symbol
      if(newIndexes.length > BASIC_MATCH) {
        const newSlot = genRandIcon(newIndexes[0], "", true);
        tempIconList[newIndexes[0]] = {...newSlot, isNewSlot: true};
      }

      // Go through each row of the board
      for (let col = 0; col < gridNumber; col++) {
        let columnIndexes = [];
        for (let row = 0; row < gridNumber; row++) {
          columnIndexes.push(row * gridNumber + col);
        }

        const newSlotRowIndex = columnIndexes.findIndex(index => tempIconList[index].isNewSlot);

        let updatedColumn;

        if (newSlotRowIndex !== -1) {
          const anchoredSlot = tempIconList[columnIndexes[newSlotRowIndex]];

          // Get icons above the slot
          const topIcons = columnIndexes
            .slice(0, newSlotRowIndex)
            .map(index => tempIconList[index])
            .filter(icon => icon.type !== null);

          const bottomIcons = columnIndexes
            .slice(newSlotRowIndex + 1)
            .map(index => tempIconList[index])
            .filter(icon => icon.type !== null);

          const topMissingCount = newSlotRowIndex - topIcons.length;
          let topNewIcons = [];
          for (let i = 0; i < topMissingCount; i++) {
              topNewIcons.push({ ...genRandIcon(col), isFalling: true });
          }

          const bottomMissingCount = (gridNumber - 1 - newSlotRowIndex) - bottomIcons.length;
          let bottomNewIcons = [];
          for (let i = 0; i < bottomMissingCount; i++) {
              bottomNewIcons.push({ ...genRandIcon(col), isFalling: true });
          }

          updatedColumn = [
              ...topNewIcons, 
              ...topIcons, 
              anchoredSlot, 
              ...bottomNewIcons, 
              ...bottomIcons
          ];
        } else {
          // Pull the icon objects from the board for this column
          let currentColumnIcons = columnIndexes.map(index => tempIconList[index]);

          // Filter out null icons
          let remainingIcons = currentColumnIcons.filter(icon => icon.type !== null);

          const missingCount = gridNumber - remainingIcons.length;

          let newIcons = [];
          for (let i = 0; i < missingCount; i++) {
            const icon = genRandIcon(col); // Pass col as a placeholder index
            newIcons.push({ ...icon, isFalling: true });
          }

          updatedColumn = [...newIcons, ...remainingIcons];
        }

        columnIndexes.forEach((actualGridIndex, i) => {
          const targetIcon = updatedColumn[i];
          
          // Determine if it actually moved or if it's new
          // If the icon's original grid position isn't where it is now, it's falling
          const hasMoved = targetIcon.grid !== actualGridIndex;

          tempIconList[actualGridIndex] = {
            ...targetIcon,
            id: tempIconList[actualGridIndex].id,
            grid: actualGridIndex,
            isFalling: hasMoved || targetIcon.isFalling
          };
        });
      }    

      // Resets falling animation
      setTimeout(() => {
        setIconList(currentList => 
          currentList.map(icon => ({ ...icon, isFalling: false, isNewSlot: false }))
        );
      }, 300);
    }

    if(checkWin(tempIconList)){
      setGameOver(true);
    }
    console.log(`\n#####END#####\n`);
    return tempIconList;
    
  };

  // Checks the whole board after a move is completed for cascading matches
  const checkMatches = () => {

  }

  const checkWin = (tempBoard) => {
    const centerSquare = Math.floor((num * num) / 2);
    if(tempBoard[centerSquare - 1].type == tempBoard[centerSquare].type && tempBoard[centerSquare].type == tempBoard[centerSquare + 1].type){
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
            className={`
              icon 
              ${icon.isSlot ? 'isSlot' : ''} 
              ${icon.isFalling ? 'iconFalling' : ''} 
              ${icon.isNewSlot ? 'iconPopForward' : ''}
            `}
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