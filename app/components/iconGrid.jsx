'use client';
import { useState, useEffect, useRef } from 'react';
import '../../styles/iconGrid.css';

/* 
  Takes provided icons and returns them in grid formation
*/
export default function IconGrid({num, returnToMenu, slots}){
  const MIN_TIME = 9999;
  const MAX_TIME = 99999;
  const getRandomTime = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };
  const [iconList, setIconList] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(() => getRandomTime(MIN_TIME, MAX_TIME));
  const [isCountingDown, setIsCountingDown] = useState(true);
  const [countdown, setCountdown] = useState(3);
  const [isReshuffling, setIsReshuffling] = useState(false);
  const [timePotion, setTimePotion] = useState(10);
  const dragItem = useRef(null);
  
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setIsCountingDown(false);
    }
  }, [countdown]);

  useEffect(() => {
    setHasMounted(true);
    const newSlotList = structuredClone(slots);

    function genIconList(slotList){
      const NUM_OF_SLOTS = 5;
      const tempIconList = [];
      let hasMatch = true;
      let icon = {};

      if(!Number.isInteger(num)){
        console.log(`Not Int`);
        return;
      } else if (num < 3) {
        console.log(`Too Small`);
        return;
      }

      const fullBoard = num * num;
      // Calculates the center of the second to last row for the slot icons
      const centerSlot = (num * (num-1)) + (Math.floor(num/2));

      for(let i=0; i < fullBoard; i++){
        if(i == (centerSlot - 2)){
          for(let j=0; j < NUM_OF_SLOTS; j++){
            slotList[j].id = `icon${i.toString()}`;
            slotList[j].grid = i;
            slotList[j].type = null;

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
    
    genIconList(newSlotList);
  }, []);

  useEffect(() => {
    const isAnimating = iconList.some(icon => icon.isFalling);
    if (isAnimating || iconList.length === 0 || gameOver) return;

    const matchedIndexes = checkMatches(iconList);

    if (matchedIndexes.length > 0) {
      const timer = setTimeout(() => {
        setIconList(currentBoard => {
          const freshMatches = checkMatches(currentBoard);
          if (freshMatches.length === 0) return currentBoard;
          
          return processMatch(freshMatches, currentBoard);
        });
      }, 300);

      return () => clearTimeout(timer);
    } else {
      if (checkWin(iconList)) {
        setGameOver(true);
      } else if (!hasPossibleMoves(iconList)){
        setIconList(currentBoard => reshuffleBoard(currentBoard));
      }
    }
  }, [iconList, hasMounted, gameOver]);

  useEffect(() => {
    // Stop the timer if game is over
    if (gameOver || timeLeft <= 0 || isCountingDown || isReshuffling) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setGameOver(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, gameOver, isCountingDown, isReshuffling]);

  useEffect(() => {
      const timer = setTimeout(() => setIsReshuffling(false), 1500);
      return () => clearTimeout(timer);
  }, [isReshuffling]);

  function genRandIcon(index, excludeType, genSlotIcon = false, genOnlyNormalIcon = false) {
    const iconChance = genOnlyNormalIcon ? 95 : 100;
    let icon = {
      id: "",
      grid: -1,
      src: "",
      type: "",
      isSlot: false,
      isFalling: false,
      isNewSlot: false,
      isSlotFilled: true
    }
    let iconType;

    if(genSlotIcon){
      iconType = 100;
    } else {
      iconType = Math.floor(Math.random() * iconChance);
    }
    
    if(iconType < 19){
      // Water
      icon = {
        id: `icon${index.toString()}`,
        grid: index,
        src: "/icons/Water_Icon.png",
        type: "water",
        isSlot: false,
        isFalling: false,
        isNewSlot: false,
        isSlotFilled: true
      }
      
    } else if(iconType < 38){
      // Earth
      icon = {
        id: `icon${index.toString()}`,
        grid: index,
        src: "/icons/Earth_Icon.png",
        type: "earth",
        isSlot: false,
        isFalling: false,
        isNewSlot: false,
        isSlotFilled: true
      }

    } else if(iconType < 57){
      // Fire
      icon = {
        id: `icon${index.toString()}`,
        grid: index,
        src: "/icons/Fire_Icon.png",
        type: "fire",
        isSlot: false,
        isFalling: false,
        isNewSlot: false,
        isSlotFilled: true
      }

    } else if(iconType < 76){
      // Air
      icon = {
        id: `icon${index.toString()}`,
        grid: index,
        src: "/icons/Air_Icon.png",
        type: "air",
        isSlot: false,
        isFalling: false,
        isNewSlot: false,
        isSlotFilled: true
      }

    } else if(iconType < 95){
      // Salt
      icon = {
        id: `icon${index.toString()}`,
        grid: index,
        src: "/icons/Salt_Icon.png",
        type: "salt",
        isSlot: false,
        isFalling: false,
        isNewSlot: false,
        isSlotFilled: true
      }
      
    // } else if(iconType < 90){
    //   // Sulfur
    //   icon = {
    //     id: `icon${index.toString()}`,
    //     grid: index,
    //     src: "/icons/Sulfur_Icon.png",
    //     type: "sulfur",
    //     isSlot: false,
    //     isFalling: false,
    //     isNewSlot: false,
    //     isSlotFilled: true
    //   }
      
    } else {
      // Slot symbol
      const slotType = Math.floor(Math.random() * iconChance);

      if(slotType < 20){
        // Heart
        icon = {
          id: `icon${index.toString()}`,
          grid: index,
          src: "/icons/Heart_Icon.png",
          type: "heart",
          isSlot: true,
          isFalling: false,
          isNewSlot: false,
          isSlotFilled: true
        }
      
      } else if(slotType < 40){
        // Diamond
        icon = {
          id: `icon${index.toString()}`,
          grid: index,
          src: "/icons/Diamond_Icon.png",
          type: "diamond",
          isSlot: true,
          isFalling: false,
          isNewSlot: false,
          isSlotFilled: true
        }

      } else if(slotType < 60){
        // Spade
        icon = {
          id: `icon${index.toString()}`,
          grid: index,
          src: "/icons/Spade_Icon.png",
          type: "spade",
          isSlot: true,
          isFalling: false,
          isNewSlot: false,
          isSlotFilled: true
        }

      } else if(slotType < 80){
        // Clover
        icon = {
          id: `icon${index.toString()}`,
          grid: index,
          src: "/icons/Clover_Icon.png",
          type: "clover",
          isSlot: true,
          isFalling: false,
          isNewSlot: false,
          isSlotFilled: true
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
          isNewSlot: false,
          isSlotFilled: true
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
    if (gameOver || isCountingDown) return;

    dragItem.current = ev.target;
    ev.target.classList.add('dragging');
    ev.dataTransfer.setData("text", ev.target.id);
    ev.dataTransfer.effectAllowed = "move";
  };

  const dragEndHandler = (ev) => {
    ev.target.classList.remove('dragging');
    dragItem.current = null;
  };

  const dragoverHandler = (ev) => {
    ev.preventDefault();
  };

  const dropHandler = (ev) => {
    if(gameOver || isCountingDown) return;
    ev.preventDefault();

    const draggedId = ev.dataTransfer.getData("text");
    const targetId = ev.target.id;

    if (draggedId === targetId) return;

    const tempBoard = [...iconList];
    const index1 = tempBoard.findIndex(icon => icon.id === draggedId);
    const index2 = tempBoard.findIndex(icon => icon.id === targetId);

    const item1 = tempBoard[index1];
    const item2 = tempBoard[index2];

    // Ensures move is allowed
    if (!isAdjacent(item1.grid, item2.grid)) return;

    tempBoard[index1] = { ...item2, id: item1.id, grid: item1.grid };
    tempBoard[index2] = { ...item1, id: item2.id, grid: item2.grid };

    const indexes = isValidMove(tempBoard, item1, item2);

    if (indexes.length > 0){
      const finalBoard = processMatch(indexes, tempBoard);
      setIconList(finalBoard);
    } else {
      return ([...tempBoard]);
    }
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
    const checkVertical = num;
    const CHECK_HORIZONTAL = 1;
    const finalRow = num * (num - 1);
    const centerSquare = (checkVertical * (checkVertical-1)) + (Math.floor(checkVertical/2));
    const centerIndexes = [centerSquare - 2, centerSquare - 1, centerSquare, centerSquare + 1, centerSquare + 2];
    const isCenterSquare = (
      (item1.grid >= (centerSquare - 2)) &&
      (item1.grid <= (centerSquare + 2)) ||
      (item2.grid >= (centerSquare - 2)) &&
      (item2.grid <= (centerSquare + 2))
    );
    const MIN_COORD = 1;
    const maxCoord = num - 2;
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
    let indexes = [];

    if(!isCenterSquare) {
      for(let i = 0; i < (itemList.length); i++){
        for(let j = 0; j < checkList.length; j++){
          const indexX = itemList[i].grid % num;
          const indexY = Math.floor(itemList[i].grid / num);
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

          if(requireCheck[j]){

            if(itemList[i].type == tempIconList[check1].type && itemList[(i)].type == tempIconList[check2].type){
              indexes.push(itemList[i].grid, check1, check2);
            }
          }
        }
      }
    } else {
      const centerIndex = (item2.grid - finalRow) - 2;
      if(!centerIndexes.includes(item1.grid) && item1.type == slots[centerIndex].type && !item2.isSlotFilled){
        indexes.push(item2.grid, item1.grid);
      }
    }
    
    if(indexes.length == 0 && (item1.isSlot && item2.isSlot) && !isCenterSquare){
      indexes.push(item2.grid, item1.grid);
    } 

    return indexes;
  }

  const processMatch = (indexes, tempBoard) => {
    const gridNumber = num;
    const BASIC_MATCH = 3;
    const centerRow = gridNumber - 1;
    const centerColumnSlot = Math.floor(gridNumber/2);
    const centerColumn = [centerColumnSlot - 2, centerColumnSlot - 1, centerColumnSlot, centerColumnSlot + 1, centerColumnSlot + 2];
    const centerIndexes = centerColumn.map(col => (centerRow * gridNumber) + col);
    let tempIconList = [...tempBoard];
    let newIndexes = [];
    const isCenterMove = indexes.some(r=> centerIndexes.includes(r));

    // If move was between 2 slot icons, stop processing
    if(indexes.length >= BASIC_MATCH){

      // Remove duplicate & center indexes
      for (let i = 0; i < indexes.length; i++){
        if(!newIndexes.includes(indexes[i]) && !centerIndexes.includes(indexes[i])){
          newIndexes.push(indexes[i]);
        }
      }

      if(newIndexes.length < BASIC_MATCH){
        return tempIconList;
      }

      let isSlotMatch = true;
      const slotType = tempIconList[newIndexes[0]].type;

      // Check if the match is a slot match
      for(let i = 0; i < newIndexes.length - 1; i++){
        if(!tempIconList[newIndexes[i]].isSlot){
          console.log(`Not slot match: ${tempIconList[newIndexes[i]].type}`);
          isSlotMatch = false;
          break;
        }
      }

      // Set the matched Icons to null
      newIndexes.forEach(index => {
        tempIconList[index] = { ...tempIconList[index], type: null, src: "/icons/error.png" };
      });

      // If matching above basic, make moved icon a slot symbol
      if (isSlotMatch){
        // If it's a slot match, generate a new slot that's not the same type
        console.log(`Slot Match: ${slotType}`);
        const newSlot = genRandIcon(newIndexes[0], slotType, true);
        tempIconList[newIndexes[0]] = {...newSlot, isNewSlot: true};
      } else if(newIndexes.length > BASIC_MATCH) {
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
        const isCenter = centerColumn.includes(col);

        let updatedColumn = new Array(gridNumber);

        if(isCenter && newSlotRowIndex == -1){
          const centerIcon = tempIconList[columnIndexes[centerRow]];
          let movableIcons = columnIndexes
            .filter((_, rowIndex) => rowIndex !== centerRow)
            .map(index => tempIconList[index])
            .filter(icon => icon.type !== null);

          const missingCount = (gridNumber - 1) - movableIcons.length;
          let newIcons = [];
          for (let i = 0; i < missingCount; i++) {
              newIcons.push({ ...genRandIcon(col), isFalling: true });
          }

          const combinedMovable = [...newIcons, ...movableIcons];
          
          let movablePointer = 0;
          for (let i = 0; i < gridNumber; i++) {
            if (i === centerRow) {
                updatedColumn[i] = centerIcon;
            } else {
                updatedColumn[i] = combinedMovable[movablePointer++];
            }
          }
        } else if(isCenter && newSlotRowIndex !== -1){
          let anchors = [];
          anchors.push({ row: centerRow, icon: tempIconList[columnIndexes[centerRow]] });
          anchors.push({ row: newSlotRowIndex, icon: tempIconList[columnIndexes[newSlotRowIndex]] });

          anchors.sort((a, b) => a.row - b.row);

          const anchorRows = anchors.map(a => a.row);
          let movableIcons = columnIndexes
              .filter((_, rowIndex) => !anchorRows.includes(rowIndex))
              .map(index => tempIconList[index])
              .filter(icon => icon.type !== null);

          const missingCount = gridNumber - anchors.length - movableIcons.length;
          let newIcons = [];
          for (let i = 0; i < missingCount; i++) {
            newIcons.push({ ...genRandIcon(col), isFalling: true });
          }

          const allFallingIcons = [...newIcons, ...movableIcons];

          let fallingPointer = 0;
          for (let i = 0; i < gridNumber; i++) {
              const anchorMatch = anchors.find(a => a.row === i);
              if (anchorMatch) {
                  updatedColumn[i] = anchorMatch.icon;
              } else {
                  updatedColumn[i] = allFallingIcons[fallingPointer++];
              }
          }

        } else if (newSlotRowIndex !== -1) {
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

    } else if(isCenterMove) {
      console.log("Center");
      // If the match includes the center, only clear the center and make the rest fall
      tempIconList[indexes[0]] = { ...tempIconList[indexes[0]], isNewSlot: true, isSlotFilled: true };
      tempIconList[indexes[1]] = { ...tempIconList[indexes[1]], type: null, src: "/icons/error.png" };

      const column = indexes[0] - (gridNumber * (gridNumber - 1));
      let columnIndexes = [];
      for (let row = 0; row < gridNumber; row++) {
        columnIndexes.push(row * gridNumber + column);
      }

      let updatedColumn = new Array(gridNumber);

      const centerIcon = tempIconList[columnIndexes[centerRow]];
      let movableIcons = columnIndexes
        .filter((_, rowIndex) => rowIndex !== centerRow)
        .map(index => tempIconList[index])
        .filter(icon => icon.type !== null);

      const missingCount = (gridNumber - 1) - movableIcons.length;
      let newIcons = [];
      for (let i = 0; i < missingCount; i++) {
          newIcons.push({ ...genRandIcon(column), isFalling: true });
      }

      const combinedMovable = [...newIcons, ...movableIcons];
      
      let movablePointer = 0;
      for (let i = 0; i < gridNumber; i++) {
        if (i === centerRow) {
            updatedColumn[i] = centerIcon;
        } else {
            updatedColumn[i] = combinedMovable[movablePointer++];
        }
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

    return tempIconList;
  };

  // Checks the whole board after a move is completed for cascading matches
  function checkMatches(tempIconList){
    const indexes = new Set();
    const size = num;
    const centerRow = size - 1;
    const centerColumnSlot = Math.floor(size/2);
    const centerColumn = [centerColumnSlot - 2, centerColumnSlot - 1, centerColumnSlot, centerColumnSlot + 1, centerColumnSlot + 2];
    const centerIndexes = centerColumn.map(col => (centerRow * size) + col);

    for (let i = 0; i < tempIconList.length; i++) {
      const x = i % size;
      const y = Math.floor(i / size);
      const current = tempIconList[i];
      let notCenter;

      // Skip nulls and empty types
      if (!current.type) continue;
 
      // Only check if we have at least 2 tiles remaining to the right
      if (x <= size - 3) {
        const right1 = tempIconList[i + 1];
        const right2 = tempIconList[i + 2];
        notCenter = !centerIndexes.includes(i) && !centerIndexes.includes(i + 1) && !centerIndexes.includes(i + 2);
        
        if (current.type === right1.type && current.type === right2.type && notCenter) {
          indexes.add(i);
          indexes.add(i + 1);
          indexes.add(i + 2);
        }
      }

      // Only check if we have at least 2 tiles remaining below
      if (y <= size - 3) {
        const down1 = tempIconList[i + size];
        const down2 = tempIconList[i + (size * 2)];
        notCenter = !centerIndexes.includes(i) && !centerIndexes.includes(i + size) && !centerIndexes.includes(i + (size * 2));

        if (current.type === down1.type && current.type === down2.type && notCenter) {
          indexes.add(i);
          indexes.add(i + size);
          indexes.add(i + (size * 2));
        }
      }
    }

    return Array.from(indexes);
  }

  const hasPossibleMoves = (tempBoard) => {
    const size = num;
    const centerRow= (size* (size-1)) + (Math.floor(size/2));
    const centerStartIndex = centerRow * size + (centerRow - 2);
    const centerColumnIndexes = [centerStartIndex, centerStartIndex + 1, centerStartIndex + 2, centerStartIndex + 3, centerStartIndex + 4];

    for (let i = 0; i < tempBoard.length; i++) {
      if (centerColumnIndexes.includes(i)) continue;

      const x = i % size;
      const y = Math.floor(i / size);

      const neighbors = [];
      if (x < size - 1) neighbors.push(i + 1); // Right
      if (y < size - 1) neighbors.push(i + size); // Down

      for (let neighborIndex of neighbors) {
        if (centerColumnIndexes.includes(neighborIndex)) continue;
        
        const virtualBoard = [...tempBoard];
        const item1 = virtualBoard[i];
        const item2 = virtualBoard[neighborIndex];

        if (item1.isSlot && item2.isSlot) continue;

        virtualBoard[i] = { ...item2, grid: i };
        virtualBoard[neighborIndex] = { ...item1, grid: neighborIndex };

        const foundMatches = checkMatches(virtualBoard);

        if (foundMatches.length > 0) {
          console.log(`Possible move ${i} and ${neighborIndex}`);
          return true;
        }
      }
    }
    return false;
  };

  const reshuffleBoard = (currentBoard) => {
    let movableIcons = currentBoard.filter(icon => !icon.isSlot);

    let isBoardValid = false;
    let reshuffledFullBoard = [];
    setIsReshuffling(true);

    while (!isBoardValid) {
      for (let i = movableIcons.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [movableIcons[i], movableIcons[j]] = [movableIcons[j], movableIcons[i]];
      }

      let movablePointer = 0;
      reshuffledFullBoard = currentBoard.map((originalSlot) => {
        if (originalSlot.isSlot) {
          return originalSlot;
        }
        const newIcon = movableIcons[movablePointer++];
        return { ...newIcon, grid: originalSlot.grid, id: originalSlot.id };
      });

      const immediateMatches = checkMatches(reshuffledFullBoard);
      if (immediateMatches.length === 0 && hasPossibleMoves(reshuffledFullBoard)) {
        isBoardValid = true;
      }
    }

    return reshuffledFullBoard;
  };

  const checkWin = (tempBoard) => {
    const centerSquare = (num * (num-1)) + (Math.floor(num/2));
    if(
      tempBoard[centerSquare - 2].type == slots[0].type && 
      tempBoard[centerSquare - 1].type == slots[1].type && 
      tempBoard[centerSquare].type == slots[2].type && 
      tempBoard[centerSquare + 1].type == slots[3].type &&
      tempBoard[centerSquare + 2].type == slots[4].type
    ){
      return true;
    }
    return false;
  }

  const useTimePotion = () => {
    if (timePotion > 0 && !gameOver && !isCountingDown) {
      setTimeLeft(prev => prev + 30);
      setTimePotion(prev => prev - 1);
    }
  };

  return (
    <div className="game-wrapper">
      <div className="ui-header">
        <button className="back-to-menu-btn" onClick={returnToMenu}>
          <span>☰</span> Menu
        </button>
        <button className="time-potion-btn" onClick={useTimePotion} disabled={timePotion <= 0 || gameOver || isCountingDown}>
          <span>⏱️</span> Time Potion: ({timePotion})
        </button>
        <div className={`timer-box ${timeLeft < 10 ? 'critical' : ''}`}>
          <span className="label">TIME</span>
          <span className="value">{timeLeft}s</span>
        </div>
      </div>
      <div 
        className='container' 
        style={{ 
          display: 'grid',
          gridTemplateColumns: `repeat(${num}, var(--tile-size))`,
          gridTemplateRows: `repeat(${num}, var(--tile-size))` 
        }}
      >
        {iconList.map((icon) => {
          const centerSquare = (num * (num-1)) + (Math.floor(num/2));
          const isCenterSquare = (icon.grid == (centerSquare - 2)) || (icon.grid == (centerSquare - 1)) || (icon.grid == centerSquare) || (icon.grid == (centerSquare + 1)) || (icon.grid == (centerSquare + 2));

          const shouldShow = !isCountingDown || isCenterSquare;

          return (
            <div key={icon.id} className={`tile ${isCenterSquare ? 'centerZone' : ''}`}>
              {shouldShow && (
                <img
                  id={icon.id}
                  src={icon.src}
                  grid={icon.grid}
                  type={icon.type}
                  isslot={(icon.isSlot).toString()}
                  draggable={!isCenterSquare ? "true" : false}
                  onDragStart={!isCountingDown ? dragstartHandler : undefined}
                  onDragEnd={!isCountingDown ? dragEndHandler : undefined}
                  onDrop={!isCountingDown ? dropHandler : undefined}
                  onDragOver={!isCountingDown ? dragoverHandler : undefined}
                  className={`
                    ${!isCenterSquare ? 'icon' : 'centerIcon'} 
                    ${icon.isSlot ? 'isSlot' : ''} 
                    ${icon.isFalling ? 'iconFalling' : ''} 
                    ${icon.isNewSlot ? 'iconPopForward' : ''}
                    ${isCenterSquare && !icon.isSlotFilled ? 'isEmpty' : ''}
                  `}
                />
              )}
            </div>
          );
        })}
          {isCountingDown && (
            <div className="countdown-overlay">
              <div className="countdown-number">{countdown > 0 ? countdown : "GO!"}</div>
            </div>
          )}

          {isReshuffling && (
            <div className="reshuffle-overlay">
              <div className="reshuffle-text">{"No moves left.\nReshuffling..."}</div>
            </div>
          )}

          {gameOver && (
          <div className="overlay">
            <div className="modal">
              {timeLeft > 0 ? (
                <>
                  <h1 className="win-text">JACKPOT!</h1>
                  <p>You matched the center slots!</p>
                </>
              ) : (
                <>
                  <h1 className="loss-text">TIME UP!</h1>
                  <p>Better luck next time.</p>
                </>
              )}
              <button className="retry-btn" onClick={() => window.location.reload()}>Play Again</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}