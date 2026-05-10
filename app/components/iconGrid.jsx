'use client';
import { useState, useEffect, useRef } from 'react';
import '../../styles/iconGrid.css';

/* 
  Takes provided icons and returns them in grid formation
*/
export default function IconGrid({num, slots, time}){
  const [iconList, setIconList] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  const [timeLeft, setTimeLeft] = useState(time);
  const [timeDisplay, setTimeDisplay] = useState([0, 0, 0]);
  const [timerOffsets, setTimerOffsets] = useState([0, 0, 0]);
  const [isCountingDown, setIsCountingDown] = useState(true);
  const [countdown, setCountdown] = useState(3);

  const [points, setPoints] = useState(0);

  const [isReshuffling, setIsReshuffling] = useState(false);
  const [isTimePotionUsed, setIsTimePotionUsed] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [isArrowActive, setIsArrowActive] = useState(false);
  const [isDiagonalActive, setIsDiagonalActive] = useState(false);
  const [isUserShuffle, setIsUserShuffle] = useState(false);

  const [canPlay, setCanPlay] = useState(true);
  const [placeTimePotion, setPlaceTimePotion] = useState(false);
  
  const dragItem = useRef(null);
  const timerRoll = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  let glowingIcons = [];
  

  // Tick countdown
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setIsCountingDown(false);
    }
  }, [countdown]);

  // Create initial board
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

  // Check board for more matches
  useEffect(() => {
    const isAnimating = iconList.some(icon => icon.isFalling);
    if (isAnimating || iconList.length === 0 || gameOver) return;

    const matchedIndexes = checkMatches(iconList);

    if(matchedIndexes.length === 0){
      setCanPlay(true);
    }

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

  // Tick Timer
  useEffect(() => {
    // Stop the timer if game is over
    if (gameOver || (timeLeft <= 0 && !isLooping) || isCountingDown || isReshuffling || isTimePotionUsed) return;

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
  }, [timeLeft, gameOver, isCountingDown, isReshuffling, isTimePotionUsed]);

  // Reset isReshuffling and userShuffle check
  useEffect(() => {
      const timer = setTimeout(() => (setIsReshuffling(false), setIsUserShuffle(false)), 1500);
      return () => clearTimeout(timer);
  }, [isReshuffling]);

  function genRandIcon(index, excludeType, genSlotIcon = false, genWinIcon = false, genTimePotion = false, genOnlyNormalIcon = false) {
    const iconChance = genOnlyNormalIcon ? 95 : 100;
    const SPECIAL_ICON_CHANCE = 1000;
    const specialIcon = genTimePotion ? 0 : Math.floor(Math.random() * SPECIAL_ICON_CHANCE);

    let icon = {
      id: "",
      grid: -1,
      src: "",
      type: "",
      isSlot: false,
      isFalling: false,
      isNewSlot: false,
      isSlotFilled: true,
      isSpecial: false
    }
    let iconType;

    if(!genSlotIcon && !genOnlyNormalIcon && !genWinIcon && specialIcon <= 4 ){
      // Time Potion
      icon = {
        id: `icon${index.toString()}`,
        grid: index,
        src: "/icons/Time_Potion_Icon.png",
        type: "time",
        isSlot: false,
        isFalling: false,
        isNewSlot: false,
        isSlotFilled: true,
        isSpecial: true
      };
      // // Arrow
      // icon = {
      //   id: `icon${index.toString()}`,
      //   grid: index,
      //   src: "/icons/Arrow_Icon.png",
      //   type: "arrow",
      //   isSlot: false,
      //   isFalling: false,
      //   isNewSlot: false,
      //   isSlotFilled: true,
      //   isSpecial: true
      // }
      return icon;
    }

    if(genSlotIcon || genWinIcon){
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
        isSlotFilled: true,
        isSpecial: false
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
        isSlotFilled: true,
        isSpecial: false
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
        isSlotFilled: true,
        isSpecial: false
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
        isSlotFilled: true,
        isSpecial: false
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
        isSlotFilled: true,
        isSpecial: false
      }
      
    // } else if(iconType < 96){
    //   // Sulfur
    //   icon = {
    //     id: `icon${index.toString()}`,
    //     grid: index,
    //     src: "/icons/Sulfur_Icon.png",
    //     type: "sulfur",
    //     isSlot: false,
    //     isFalling: false,
    //     isNewSlot: false,
    //     isSlotFilled: true,
    //     isSpecial: false
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
          isSlotFilled: true,
          isSpecial: false
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
          isSlotFilled: true,
          isSpecial: false
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
          isSlotFilled: true,
          isSpecial: false
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
          isSlotFilled: true,
          isSpecial: false
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
          isSlotFilled: true,
          isSpecial: false
        }
      }
    }

    let isWinIcon = false;

    if(genWinIcon){
      for (const winIcon of slots) {
        if (winIcon.type === icon.type) {
          isWinIcon = true;
          break; 
        } 
      }
    }
    
    if(icon.type == excludeType){
      icon = genRandIcon(icon.grid, excludeType, genSlotIcon);
    } else if(genWinIcon && !isWinIcon){
      icon = genRandIcon(icon.grid, excludeType, genSlotIcon, genWinIcon);
    }

    return icon;
  }

  function checkInitialMatches (currentIndex, type, boardToCheck){
    const checkVertical = num;
    const CHECK_HORIZONTAL = 1;
    const checkDiagonal1 = checkVertical + CHECK_HORIZONTAL;
    const checkDiagonal2 = checkVertical - CHECK_HORIZONTAL;
    const MIN_COORD = 1;
    const maxCoord = num - 2;
    const checkList = [
      [checkVertical, (checkVertical*2)],
      [CHECK_HORIZONTAL, (CHECK_HORIZONTAL*2)],
      [checkDiagonal1, (checkDiagonal1*2)],
      [checkDiagonal2, (checkDiagonal2*2)]
    ];

    const indexX = currentIndex % num;
    const indexY = Math.floor(currentIndex / num);
    const requireCheck = [
      (indexY > MIN_COORD),
      (indexX > MIN_COORD),
      (indexY > MIN_COORD && indexX > MIN_COORD),
      (indexY > MIN_COORD && indexX < maxCoord)
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
      // Doesn't let the player move icons until cascading matches are resolved
      setCanPlay(false);
      const finalBoard = processMatch(indexes, tempBoard);
      setIconList(finalBoard);
    } else {
      return ([...tempBoard]);
    }
  }; 

  const isAdjacent = (grid1, grid2) => {
    const checkVertical = num;
    const CHECK_HORIZONTAL = 1;
    const checkDiagonal1 = checkVertical + CHECK_HORIZONTAL;
    const checkDiagonal2 = checkVertical - CHECK_HORIZONTAL;
    const checkList = [
      grid1 - checkVertical,
      grid1 + checkVertical,
      grid1 - CHECK_HORIZONTAL,
      grid1 + CHECK_HORIZONTAL
    ];
    const diagonalCheck = [
      grid1 - checkDiagonal1,
      grid1 + checkDiagonal1,
      grid1 - checkDiagonal2,
      grid1 + checkDiagonal2
    ];

    if(isDiagonalActive && points >= 500){
      checkList.push(...diagonalCheck);
    }

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
    const checkDiagonal1 = checkVertical + CHECK_HORIZONTAL;
    const checkDiagonal2 = checkVertical - CHECK_HORIZONTAL;
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
    // Check Up, Left, Down, Right, Vertical, Horizontal, DiagonalLU, DiagonalRD, DiagonalUD, DiagonalRU, DiagonalLD, DiagonalDU 
    const checkList = [
      [checkVertical, (checkVertical*2)],
      [CHECK_HORIZONTAL, (CHECK_HORIZONTAL*2)],
      [-checkVertical, -(checkVertical*2)],
      [-CHECK_HORIZONTAL, -(CHECK_HORIZONTAL*2)],
      [checkVertical, -checkVertical],
      [CHECK_HORIZONTAL, -CHECK_HORIZONTAL],

      [checkDiagonal1, (checkDiagonal1*2)],
      [-checkDiagonal1, -(checkDiagonal1*2)],
      [checkDiagonal1, -checkDiagonal1],
      [checkDiagonal2, (checkDiagonal2*2)],
      [-checkDiagonal2, -(checkDiagonal2*2)],
      [checkDiagonal2, -checkDiagonal2],
    ];

    const itemList = [tempIconList[item2.grid], tempIconList[item1.grid]];
    let indexes = [];

    // If the move doesn't include the center tiles
    if(!isCenterSquare) {
      for(let i = 0; i < (itemList.length); i++){
        for(let j = 0; j < checkList.length; j++){
          const indexX = itemList[i].grid % num;
          const indexY = Math.floor(itemList[i].grid / num);
          // Check Up, Left, Down, Right, Vertical, Horizontal, DiagonalLU, DiagonalRD, DiagonalUD, DiagonalRU, DiagonalLD, DiagonalDU 
          const requireCheck = [
            (indexY > MIN_COORD),
            (indexX > MIN_COORD),
            (indexY < maxCoord),
            (indexX < maxCoord),
            (indexY > (MIN_COORD - 1) && indexY < (maxCoord + 1)),
            (indexX > (MIN_COORD - 1) && indexX < (maxCoord + 1)),

            (indexY > MIN_COORD && indexX > MIN_COORD),
            (indexY < maxCoord && indexX < maxCoord),
            (indexY > (MIN_COORD - 1) && indexX > (MIN_COORD - 1) && indexY < (maxCoord + 1) && indexX < (maxCoord + 1)),
            (indexY > MIN_COORD && indexX < maxCoord),
            (indexY < maxCoord && indexX > MIN_COORD),
            (indexY > (MIN_COORD - 1) && indexX > (MIN_COORD - 1) && indexY < (maxCoord + 1) && indexX < (maxCoord + 1)),
          ];

          const check1 = itemList[i].grid - checkList[j][0];
          const check2 = itemList[i].grid - checkList[j][1];

          if(requireCheck[j]){

            if(itemList[i].type == tempIconList[check1].type && itemList[i].type == tempIconList[check2].type){
              indexes.push(itemList[i].grid, check1, check2);
            }
          }
        }
      }
    // If the move is with the center, ensure the icon 
    } else {
      const centerIndex = (item2.grid - finalRow) - 2;
      if(!centerIndexes.includes(item1.grid) && item1.type == slots[centerIndex].type && !item2.isSlotFilled){
        indexes.push(item2.grid, item1.grid);
      }
    }
    
    if(indexes.length == 0 && (item1.isSlot && item2.isSlot) && !isCenterSquare){
      indexes.push(item2.grid, item1.grid);
    } else if(indexes.length == 0 && !isCenterSquare && isArrowActive && points >= 500){
      indexes.push(item2.grid, item1.grid);
      setIsArrowActive(false);
      updatePoints(-500);
    } else if(indexes.length != 0 && (item1.isSpecial || item2.isSpecial)){
      if(item1.isSpecial){
        indexes.push(item2.grid);
      } else{
        indexes.push(item1.grid);
      }
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
    let isSpecialMatch = false;
    let pointTotal = 0;
    let potionPlaced = false;

    // If move was between 2 slot icons, stop processing
    if(indexes.length >= BASIC_MATCH){

      // Remove duplicate & center indexes
      for (let i = 0; i < indexes.length; i++){
        if(!newIndexes.includes(indexes[i]) && !centerIndexes.includes(indexes[i])){
          newIndexes.push(indexes[i]);
        }
      }

      // Return if not a full match
      if(newIndexes.length < BASIC_MATCH){
        return tempIconList;
      }

      // Checks if match is all specialIcons
      let specialCounter = 0;

      for(let index of indexes){
        if(tempBoard[index].isSpecial){
          specialCounter++;
        }
      }

      // Check if a special index was included in the match
      const lastIndex = newIndexes.length - 1;

      // Match made of time potions, big amount
      if(specialCounter >= 3){
        useTimePotion(true, true);
        pointTotal += 20;

      } else if(tempBoard[newIndexes[lastIndex]].isSpecial){
        isSpecialMatch = true;
        useTimePotion(true, false);
        pointTotal += 20;
      }

      // Check if the match is a slot match by seeing if 3 slots are included in the match
      let isSlotMatch = false;
      let counter = 0;
      let slotType = tempIconList[newIndexes[0]].type;

      for(let i = 0; i < newIndexes.length; i++){
        if(tempIconList[newIndexes[i]].isSlot){
          counter += 1;

          if(counter >=3){
            isSlotMatch = true;
            slotType = tempIconList[newIndexes[i]].type;
            break;
          }
        }
      }

      // Check if diagonal was used and adjust
      if(isDiagonalActive){
        updatePoints(-500);
        setIsDiagonalActive(false);
      }

      // Set the matched Icons to null
      newIndexes.forEach(index => {
        tempIconList[index] = { ...tempIconList[index], type: null, src: "/icons/error.png" };
      });

      // If matching above basic, make moved icon a slot symbol
      if (isSlotMatch){
        // If it's a slot match, generate a new slot that's not the same type
        const newSlot = genRandIcon(newIndexes[0], slotType, true);
        tempIconList[newIndexes[0]] = {...newSlot, isNewSlot: true};
        pointTotal += 20;
      
      // If it's a 5+ icon match
      } else if(newIndexes.length > BASIC_MATCH + 1 && !isSpecialMatch || newIndexes.length > (BASIC_MATCH + 2)) {
        const newSlot = genRandIcon(newIndexes[0], "", true);
        tempIconList[newIndexes[0]] = {...newSlot, isNewSlot: true};
        pointTotal += 40;
      // If it's a 4 icon match
      } else if(newIndexes.length > BASIC_MATCH && !isSpecialMatch || newIndexes.length > (BASIC_MATCH + 1)) {
        const newSlot = genRandIcon(newIndexes[0], "", true);
        tempIconList[newIndexes[0]] = {...newSlot, isNewSlot: true};
        pointTotal += 20;
      }

      // Add 10 points for making any kind of match
      pointTotal += 10;

      // Go through each row of the board
      for (let col = 0; col < gridNumber; col++) {
        let columnIndexes = [];

        // Get each index for the column
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

          if(placeTimePotion && !potionPlaced && missingCount > 0){
            newIcons.shift();
            newIcons.splice(0, 0, {...genRandIcon(col, "", false, false, true), isNewSlot: true, isFalling: true})
            potionPlaced = true;
            setPlaceTimePotion(false);
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

          if(placeTimePotion && !potionPlaced && missingCount > 0){
            newIcons.shift();
            newIcons.splice(0, 0, {...genRandIcon(col, "", false, false, true), isNewSlot: true, isFalling: true})
            potionPlaced = true;
            setPlaceTimePotion(false);
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

          if(placeTimePotion && !potionPlaced && topMissingCount > 0){
            topNewIcons.shift();
            topNewIcons.splice(0, 0, {...genRandIcon(col, "", false, false, true), isNewSlot: true, isFalling: true})
            potionPlaced = true;
            setPlaceTimePotion(false);
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

          if(placeTimePotion && !potionPlaced && missingCount > 0){
            newIcons.shift();
            newIcons.splice(0, 0, {...genRandIcon(col, "", false, false, true), isNewSlot: true, isFalling: true})
            potionPlaced = true;
            setPlaceTimePotion(false);
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
      
      // Update point count
      updatePoints(pointTotal);

      // Resets falling animation
      setTimeout(() => {
        setIconList(currentList => 
          currentList.map(icon => ({ ...icon, isFalling: false, isNewSlot: false }))
        );
      }, 300);

    } else if(isCenterMove) {
      // If the match includes the center, only clear the center and make the rest fall
      tempIconList[indexes[0]] = { ...tempIconList[indexes[0]], isNewSlot: true, isSlotFilled: true };
      tempIconList[indexes[1]] = { ...tempIconList[indexes[1]], type: null, src: "/icons/error.png" };

      const row = Math.floor(indexes[1] / gridNumber)
      const column = indexes[1] - (gridNumber * row);
      const isCenter = centerColumn.includes(column);
      let updatedColumn = [];
      let columnIndexes = [];

      for (let row = 0; row < gridNumber; row++) {
        columnIndexes.push(row * gridNumber + column);
      }

      const centerIcon = tempIconList[columnIndexes[centerRow]];

      if(isCenter){
        let movableIcons = columnIndexes
        .filter((_, rowIndex) => rowIndex !== centerRow)
        .map(index => tempIconList[index])
        .filter(icon => icon.type !== null);

        const missingCount = (gridNumber - 1) - movableIcons.length;
        let newIcons = [];
        for (let i = 0; i < missingCount; i++) {
          newIcons.push({ ...genRandIcon(column), isFalling: true });
        }

        if(placeTimePotion && missingCount > 0){
            newIcons.shift();
            newIcons.splice(0, 0, {...genRandIcon(column, "", false, false, true), isNewSlot: true, isFalling: true})
            setPlaceTimePotion(false);
          }

        updatedColumn = [...newIcons, ...movableIcons, centerIcon];
      } else {
        let movableIcons = columnIndexes
        .map(index => tempIconList[index])
        .filter(icon => icon.type !== null);

        const missingCount = (gridNumber) - movableIcons.length;
        let newIcons = [];
        for (let i = 0; i < missingCount; i++) {
            newIcons.push({ ...genRandIcon(column), isFalling: true });
        }

        if(placeTimePotion && missingCount > 0){
            newIcons.shift();
            newIcons.splice(0, 0, {...genRandIcon(column, "", false, false, true), isNewSlot: true, isFalling: true})
            setPlaceTimePotion(false);
          }

        updatedColumn = [...newIcons, ...movableIcons];
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

      // Add 100 points for filling a center slot
      updatePoints(100);

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
    const indexes = [];
    const size = num;
    const centerRow = size - 1;
    const centerColumnSlot = Math.floor(size/2);
    const centerColumn = [centerColumnSlot - 2, centerColumnSlot - 1, centerColumnSlot, centerColumnSlot + 1, centerColumnSlot + 2];
    const centerIndexes = centerColumn.map(col => (centerRow * size) + col);

    for (let i = tempIconList.length - 1; i >= 0; i--) {
      const x = i % size;
      const y = Math.floor(i / size);
      const current = tempIconList[i];
      let notCenter;

      // Skip nulls and empty types
      if (!current.type) continue;
 
      // Only check if we have at least 2 tiles remaining to the Left
      if (x >= 2) {
        const left1 = tempIconList[i - 1];
        const left2 = tempIconList[i - 2];
        const left3 = x >= 3 ? tempIconList[i - 3] : null;
        const left4 = x >= 4 ? tempIconList[i - 4] : null;

        notCenter = !centerIndexes.includes(i) && !centerIndexes.includes(i - 1) && !centerIndexes.includes(i - 2);

        if (current.type === left1.type && current.type === left2.type && notCenter) {
          indexes.push(i);
          indexes.push(i - 1);
          indexes.push(i - 2);

          if(left3 != null && !centerIndexes.includes(i - 3) && current.type === left3.type){
            indexes.push(i - 3);

            if(left4 != null && !centerIndexes.includes(i - 4) && current.type === left4.type){
              indexes.push(i - 4);
            }
          }
        }  
      }

      // Only check if we have at least 2 tiles remaining above
      if (y >= 2) {
        const up1 = tempIconList[i - size];
        const up2 = tempIconList[i - (size * 2)];
        const up3 = y >= 3 ? tempIconList[i - (size * 3)] : null;
        const up4 = y >= 4 ? tempIconList[i - (size * 4)] : null;

        notCenter = !centerIndexes.includes(i) && !centerIndexes.includes(i - size) && !centerIndexes.includes(i - (size * 2));

        if (current.type === up1.type && current.type === up2.type && notCenter) {
          indexes.push(i);
          indexes.push(i - size);
          indexes.push(i - (size * 2));

          if(up3 != null && !centerIndexes.includes(i - (size * 3)) && current.type === up3.type){
            indexes.push(i - (size * 3));

            if(up4 != null && !centerIndexes.includes(i - (size * 4)) && current.type === up4.type){
              indexes.push(i - (size * 4));
            }
          }
        }
      }

      // Only check if we have at least 1 tiles remaining left and right
      if (x > 0 && x < size - 1) {
        const horizontal1 = tempIconList[i - 1];
        const horizontal2 = tempIconList[i + 1];

        notCenter = !centerIndexes.includes(i) && !centerIndexes.includes(i - 1) && !centerIndexes.includes(i + 1);

        if (current.type === horizontal1.type && current.type === horizontal2.type && notCenter) {
          indexes.push(i);
          indexes.push(i - 1);
          indexes.push(i + 1);
        }
      }

      // Only check if we have at least 1 tiles remaining up and down
      if (y > 0 && y < size - 1) {
        const vertical1 = tempIconList[i - size];
        const vertical2 = tempIconList[i + size];

        notCenter = !centerIndexes.includes(i) && !centerIndexes.includes(i - size) && !centerIndexes.includes(i + size);

        if (current.type === vertical1.type && current.type === vertical2.type && notCenter) {
          indexes.push(i);
          indexes.push(i - size);
          indexes.push(i + size);
        }
      }

      // Only check if we have at least 2 tiles remaining left and up
      if (x >= 2 && y >= 2) {
        const diagonalLU1 = tempIconList[i - (size + 1)];
        const diagonalLU2 = tempIconList[i - ((size + 1) * 2)];
        const diagonalLU3 = (x >= 3 && y >= 3) ? tempIconList[i - ((size + 1) * 3)] : null;
        const diagonalLU4 = (x >= 4 && y >= 4) ? tempIconList[i - ((size + 1) * 4)] : null;

        notCenter = !centerIndexes.includes(i) && !centerIndexes.includes(i - (size + 1)) && !centerIndexes.includes(i - ((size + 1) * 2));

        if (current.type === diagonalLU1.type && current.type === diagonalLU2.type && notCenter) {
          indexes.push(i);
          indexes.push(i - (size + 1));
          indexes.push(i - ((size + 1) * 2));

          if(diagonalLU3 != null && !centerIndexes.includes(i - ((size + 1) * 3)) && current.type === diagonalLU3.type){
            indexes.push(i - ((size + 1) * 3));

            if(diagonalLU4 != null && !centerIndexes.includes(i - ((size + 1) * 4)) && current.type === diagonalLU4.type){
              indexes.push(i - ((size + 1) * 4));
            }
          }
        }
      }

      // Only check if we have at least 2 tiles remaining right and up
      if (x <= size - 3 && y >= 2) {
        const diagonalRU1 = tempIconList[i - (size - 1)];
        const diagonalRU2 = tempIconList[i - ((size - 1) * 2)];
        const diagonalRU3 = (x <= size - 4 && y >= 3) ? tempIconList[i - ((size - 1) * 3)] : null;
        const diagonalRU4 = (x <= size - 5 && y >= 4) ? tempIconList[i - ((size - 1) * 4)] : null;

        notCenter = !centerIndexes.includes(i) && !centerIndexes.includes(i - (size - 1)) && !centerIndexes.includes(i - ((size - 1) * 2));

        if (current.type === diagonalRU1.type && current.type === diagonalRU2.type && notCenter) {
          indexes.push(i);
          indexes.push(i - (size - 1));
          indexes.push(i - ((size - 1) * 2));

          if(diagonalRU3 != null && !centerIndexes.includes(i - ((size - 1) * 3)) && current.type === diagonalRU3.type){
            indexes.push(i - ((size - 1) * 3));

            if(diagonalRU4 != null && !centerIndexes.includes(i - ((size - 1) * 4)) && current.type === diagonalRU4.type){
              indexes.push(i - ((size - 1) * 4));
            }
          }
        }
      }

      // Only check if we have at least 1 tiles remaining up left and down right
      if ((x > 0 && x < size - 1) && (y > 0 && y < size - 1)) {
        const diagonalUD1 = tempIconList[i - (size + 1)];
        const diagonalUD2 = tempIconList[i + (size + 1)];

        notCenter = !centerIndexes.includes(i) && !centerIndexes.includes(i - (size + 1)) && !centerIndexes.includes(i + (size + 1));

        if (current.type === diagonalUD1.type && current.type === diagonalUD2.type && notCenter) {
          indexes.push(i);
          indexes.push(i - (size + 1));
          indexes.push(i + (size + 1));
        }
      }

      // Only check if we have at least 1 tiles remaining down left and up right
      if ((x > 0 && x < size - 1) && (y > 0 && y < size - 1)) {
        const diagonalDU1 = tempIconList[i - (size - 1)];
        const diagonalDU2 = tempIconList[i + (size - 1)];

        notCenter = !centerIndexes.includes(i) && !centerIndexes.includes(i - (size - 1)) && !centerIndexes.includes(i + (size - 1));

        if (current.type === diagonalDU1.type && current.type === diagonalDU2.type && notCenter) {
          indexes.push(i);
          indexes.push(i - (size - 1));
          indexes.push(i + (size - 1));
        }
      }

      if(indexes > 0){
        return indexes;
      }
    }

    return indexes;
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

        virtualBoard[i] = { ...item2, grid: i };
        virtualBoard[neighborIndex] = { ...item1, grid: neighborIndex };

        const foundMatches = checkMatches(virtualBoard);

        if (foundMatches.length > 0) {
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
      for (let i = movableIcons.length - 1; i >= 0; i--) {
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
      updatePoints(1000);
      return true;
    }
    return false;
  }

  const useTimePotion = (isFree = false, isBigPotion = false) => {
    const timePotionMin = isBigPotion ? 180 : 60;
    const timePotionMax = isBigPotion ? 300 : 120;

    if ((points < 1000 && !isFree) || gameOver || isCountingDown || isReshuffling || timeLeft === undefined) return;

    setIsArrowActive(false);
    setIsDiagonalActive(false);

    const addTime = Math.floor(Math.random() * (timePotionMax - timePotionMin + 1)) + timePotionMin;
    const finalTime = timeLeft + addTime;
    const timeElement = document.querySelector('.timer-box');
    const digits = addTime.toString().padStart(3, '0').split('').map(Number);
    const offsets = digits.map(d => -(d * 200) - 200);
    
    setTimeDisplay(digits);
    setTimerOffsets(offsets);
    setIsLooping(true);
    setIsTimePotionUsed(true);

    if(!isFree){
      updatePoints(-1000);
    }

    setTimeout(() => {
      setIsLooping(false);
      
      setTimeout(() => {
        setTimeLeft(finalTime);
        setIsTimePotionUsed(false);
        triggerFlash(timeElement);
      }, 500);
    }, 500);
  };

  const useDropTimePotion = () => {
    if (points < 500 || gameOver || isCountingDown || isReshuffling || timeLeft === undefined) return;

    setIsArrowActive(false);
    setIsDiagonalActive(false);
    updatePoints(-500);
    setPlaceTimePotion(true);
  };

  const useArrow = () => {
    if (points >= 500 && !gameOver && !isCountingDown && !isReshuffling && !isLooping) {
      isArrowActive ? setIsArrowActive(false) : setIsArrowActive(true);
      setIsDiagonalActive(false);
    }
  };

  const useDiagonal = () => {
    if (points >= 500 && !gameOver && !isCountingDown && !isReshuffling && !isLooping) {
      isDiagonalActive ? setIsDiagonalActive(false) : setIsDiagonalActive(true);
      setIsArrowActive(false);
    }
  };

  const useReshuffle = () => {
    if (points >= 500 && !gameOver && !isCountingDown && !isReshuffling && !isLooping) {
      setIsUserShuffle(true);
      setIsArrowActive(false);
      setIsDiagonalActive(false);
      setIconList(currentBoard => reshuffleBoard(currentBoard));
      updatePoints(-500);
    }
  };

  const useHint = () => {
    if (points >= 50 && !gameOver && !isCountingDown && !isReshuffling && !isLooping) {
      const tempBoard = [...iconList];
      setIsDiagonalActive(false);
      setIsArrowActive(false);
      updatePoints(-50);

      const size = num;
      const centerRow= (size* (size-1)) + (Math.floor(size/2));
      const centerStartIndex = centerRow * size + (centerRow - 2);
      const centerColumnIndexes = [centerStartIndex, centerStartIndex + 1, centerStartIndex + 2, centerStartIndex + 3, centerStartIndex + 4];

      for (let i = tempBoard.length - 1; i >= 0; i--) {
        if (centerColumnIndexes.includes(i)) continue;

        const x = i % size;
        const y = Math.floor(i / size);

        const neighbors = [];
        if (x > 0) neighbors.push(i - 1); // Left
        if (y > 0) neighbors.push(i - size); // Up

        for (let neighborIndex of neighbors) {
          if (centerColumnIndexes.includes(neighborIndex)) continue;
          
          const virtualBoard = [...tempBoard];
          const item1 = virtualBoard[i];
          const item2 = virtualBoard[neighborIndex];

          virtualBoard[i] = { ...item2, grid: i };
          virtualBoard[neighborIndex] = { ...item1, grid: neighborIndex };

          const foundMatches = checkMatch(item1, item2, virtualBoard);

          if (foundMatches.length > 0) {
            for(let index of foundMatches){
              let iconElement = document.getElementById(tempBoard[index].id);
              triggerGlow(iconElement);
            }
            return;
          }
        }
      }
    }
    return;
  };

  const checkMatch = (item1, item2, tempIconList ) => {
    const indexes = [];
    const size = num;
    const centerRow = size - 1;
    const centerColumnSlot = Math.floor(size/2);
    const centerColumn = [centerColumnSlot - 2, centerColumnSlot - 1, centerColumnSlot, centerColumnSlot + 1, centerColumnSlot + 2];
    const centerIndexes = centerColumn.map(col => (centerRow * size) + col);
    const items = [item1, item2, item1];
  
    for (let i = 0; i < items.length - 1; i++) {
      const index = items[i].grid;
      const x = index % size;
      const y = Math.floor(index / size);
      const current = tempIconList[index];
      let notCenter;

      // Skip nulls and empty types
      if (!current.type) continue;
 
      // Only check if we have at least 2 tiles remaining to the Left
      if (x >= 2) {
        const left1 = tempIconList[index - 1];
        const left2 = tempIconList[index - 2];

        notCenter = !centerIndexes.includes(index) && !centerIndexes.includes(index - 1) && !centerIndexes.includes(index - 2);

        if (current.type === left1.type && current.type === left2.type && notCenter) {
          indexes.push(items[i+1].grid);
          indexes.push(index - 1);
          indexes.push(index - 2);

          return indexes;
        }  
      }

      // Only check if we have at least 2 tiles remaining above
      if (y >= 2) {
        const up1 = tempIconList[index - size];
        const up2 = tempIconList[index - (size * 2)];

        notCenter = !centerIndexes.includes(index) && !centerIndexes.includes(index - size) && !centerIndexes.includes(index - (size * 2));

        if (current.type === up1.type && current.type === up2.type && notCenter) {
          indexes.push(items[i+1].grid);
          indexes.push(index - size);
          indexes.push(index - (size * 2));

          return indexes;
        }
      }

      // Only check if we have at least 1 tiles remaining left and right
      if (x > 0 && x < size - 1) {
        const horizontal1 = tempIconList[index - 1];
        const horizontal2 = tempIconList[index + 1];

        notCenter = !centerIndexes.includes(index) && !centerIndexes.includes(index - 1) && !centerIndexes.includes(index + 1);

        if (current.type === horizontal1.type && current.type === horizontal2.type && notCenter) {
          indexes.push(items[i+1].grid);
          indexes.push(index - 1);
          indexes.push(index + 1);
        }
      }

      // Only check if we have at least 1 tiles remaining up and down
      if (y > 0 && y < size - 1) {
        const vertical1 = tempIconList[index - size];
        const vertical2 = tempIconList[index + size];

        notCenter = !centerIndexes.includes(index) && !centerIndexes.includes(index - size) && !centerIndexes.includes(index + size);

        if (current.type === vertical1.type && current.type === vertical2.type && notCenter) {
          indexes.push(items[i+1].grid);
          indexes.push(index - size);
          indexes.push(index + size);
        }
      }

      // Only check if we have at least 2 tiles remaining left and up
      if (x >= 2 && y >= 2) {
        const diagonalLU1 = tempIconList[index - (size + 1)];
        const diagonalLU2 = tempIconList[index - ((size + 1) * 2)];

        notCenter = !centerIndexes.includes(index) && !centerIndexes.includes(index - (size + 1)) && !centerIndexes.includes(index - ((size + 1) * 2));

        if (current.type === diagonalLU1.type && current.type === diagonalLU2.type && notCenter) {
          indexes.push(items[i+1].grid);
          indexes.push(index - (size + 1));
          indexes.push(index - ((size + 1) * 2));
          
          return indexes;
        }
      }

      // Only check if we have at least 2 tiles remaining right and up
      if (x <= size - 3 && y >= 2) {
        const diagonalRU1 = tempIconList[index - (size - 1)];
        const diagonalRU2 = tempIconList[index - ((size - 1) * 2)];

        notCenter = !centerIndexes.includes(index) && !centerIndexes.includes(index - (size - 1)) && !centerIndexes.includes(index - ((size - 1) * 2));

        if (current.type === diagonalRU1.type && current.type === diagonalRU2.type && notCenter) {
          indexes.push(items[i+1].grid);
          indexes.push(index - (size - 1));
          indexes.push(index - ((size - 1) * 2));

          return indexes;
        }
      }

      // Only check if we have at least 1 tiles remaining up left and down right
      if ((x > 0 && x < size - 1) && (y > 0 && y < size - 1)) {
        const diagonalUD1 = tempIconList[index - (size + 1)];
        const diagonalUD2 = tempIconList[index + (size + 1)];

        notCenter = !centerIndexes.includes(index) && !centerIndexes.includes(index - (size + 1)) && !centerIndexes.includes(index + (size + 1));

        if (current.type === diagonalUD1.type && current.type === diagonalUD2.type && notCenter) {
          indexes.push(items[i+1].grid);
          indexes.push(index - (size + 1));
          indexes.push(index + (size + 1));
        }
      }

      // Only check if we have at least 1 tiles remaining down left and up right
      if ((x > 0 && x < size - 1) && (y > 0 && y < size - 1)) {
        const diagonalDU1 = tempIconList[index - (size - 1)];
        const diagonalDU2 = tempIconList[index + (size - 1)];

        notCenter = !centerIndexes.includes(index) && !centerIndexes.includes(index - (size - 1)) && !centerIndexes.includes(index + (size - 1));

        if (current.type === diagonalDU1.type && current.type === diagonalDU2.type && notCenter) {
          indexes.push(items[i+1].grid);
          indexes.push(index - (size - 1));
          indexes.push(index + (size - 1));
        }
      }
    }

    return indexes;
  }

  function triggerFlash(buttonElement) {
    buttonElement.classList.add('is-flashing');
    
    setTimeout(() => {
      buttonElement.classList.remove('is-flashing');
    }, 500);
  }

  function triggerGlow(buttonElement) {
    buttonElement.classList.add('is-glowing');
  }

  function updatePoints(newPoints) {
    const pointsElement = document.querySelector('.points-box .value');
    setPoints(prev => prev + newPoints);

    if(newPoints >= 0){
      pointsElement.classList.remove('animate-bump');
      void pointsElement.offsetWidth;
      pointsElement.classList.add('animate-bump');
    } else {
      pointsElement.classList.remove('animate-spend');
      void pointsElement.offsetWidth;
      pointsElement.classList.add('animate-spend');
    }
  }

  return (
    <div className="game-wrapper">
      <div className="side-controls">
        <button className={`drop-time-potion-btn ${points < 500 || placeTimePotion ? "btn-disabled" : ''}`} onClick={useDropTimePotion} disabled={points < 500 || placeTimePotion || gameOver || isCountingDown || isReshuffling || isLooping || placeTimePotion}>
          <span><img src="/icons/Time_Potion_Icon.png" alt="Drop Time Potion" /></span> Drop Time Potion: (500pts)
        </button>
        <button className={`time-potion-btn ${points < 1000 ? "btn-disabled" : ''}`} onClick={() => useTimePotion(false, true)} disabled={points < 1000 || gameOver || isCountingDown || isReshuffling || isLooping}>
          <span><img src="/icons/Time_Potion_Icon.png" alt="Time Potion" /></span> Time Potion: (1000pts)
        </button>
        <button className={`arrow-btn ${isArrowActive ? 'arrow-btn-active' : ''} ${points < 500 ? "btn-disabled" : ''}`} onClick={useArrow} disabled={points < 500 || gameOver || isCountingDown || isReshuffling || isLooping}>
          <span><img src="/icons/Arrow_Icon.png" alt="Arrow" /></span> Arrow: (500pts)
        </button>
        <button className={`diagonal-btn ${isDiagonalActive ? 'arrow-btn-active' : ''} ${points < 500 ? "btn-disabled" : ''}`} onClick={useDiagonal} disabled={points < 500 || gameOver || isCountingDown || isReshuffling || isLooping}>
          <span><img src="/icons/Diagonal_Icon.png" alt="Diagonal" /></span> Diagonal: (500pts)
        </button>
        <button className={`reshuffle-btn ${points < 500 ? "btn-disabled" : ''}`} onClick={useReshuffle} disabled={points < 500 || gameOver || isCountingDown || isReshuffling || isLooping}>
          <span><img src="/icons/Reshuffle_Icon.png" alt="Reshuffle" /></span> Reshuffle: (500pts)
        </button>
        <button className={`hint-btn ${points < 50 ? "btn-disabled" : ''}`} onClick={useHint} disabled={points < 50 || gameOver || isCountingDown || isReshuffling || isLooping}>
          <span><img src="/icons/Hint_Icon.png" alt="Hint" /></span> Hint: (50pts)
        </button>
      </div>

      <div className="main-game-area">
        <div className="ui-header">
          <div className="stats-container">
            <div className={`timer-box ${timeLeft < 10 ? 'critical' : ''}`}>
              <span className="label">TIME</span>
              <span className="value">{timeLeft}s</span>
            </div>

            <div className="spacer"></div>

            <div className="points-box">
              <span className="label">POINTS</span>
              <span className="value">{('000000000'+points).slice(-9)}</span>
            </div>
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
                    isslot={(icon.isSlot ?? false).toString()}
                    draggable={canPlay && !isCenterSquare}
                    onDragStart={!isCountingDown ? dragstartHandler : undefined}
                    onDragEnd={!isCountingDown ? dragEndHandler : undefined}
                    onDrop={!isCountingDown ? dropHandler : undefined}
                    onDragOver={!isCountingDown ? dragoverHandler : undefined}
                    className={`
                      ${!isCenterSquare ? 'icon' : 'winIcon'} 
                      ${icon.isSlot ? 'isSlot' : ''} 
                      ${icon.isFalling ? 'iconFalling' : ''} 
                      ${icon.isNewSlot ? 'iconPopForward' : ''}
                      ${isCenterSquare && !icon.isSlotFilled ? 'isEmpty' : ''}
                      ${!canPlay ? 'is-locked' : ''}
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
                <div className="reshuffle-text">{`${isUserShuffle ? '' : 'No moves left\n'}Reshuffling...`}</div>
              </div>
            )}

            {isTimePotionUsed && (
              <div className="time-add-overlay">
                <div className="time-add-frame">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="time-add-reel" draggable="false">
                      <div 
                        className={`time-add-strip ${isLooping ? 'time-add-is-spinning' : 'time-add-landed'}`}
                        style={{ 
                          animationDelay: `${i * 80}ms`, 
                          transform: !isLooping ? `translateY(${timerOffsets[i]}px)` : 'none',
                        }}
                      >
                        <div className="time-add-wrapper" draggable="false">
                          <div>{timeDisplay[i] ?? 0}</div>
                        </div>
                        {[...timerRoll, ...timerRoll].map((number, idx) => (
                          <div key={idx} className="time-add-wrapper" draggable="false">
                            <div>{number}</div>
                          </div>
                        ))}
                        <div className="time-add-wrapper" draggable="false">
                          <div>{timeDisplay[i] ?? 0}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
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
    </div>
  );
}