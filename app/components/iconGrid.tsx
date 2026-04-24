'use client';
import { useState, useEffect, useRef } from 'react';
import '../../styles/iconGrid.css';

declare module 'react' {
  interface HTMLAttributes<T> {
    grid?: number;
    type?: string | null;
    isslot?: string;
  }
}

interface Icon {
  id: string;
  grid: number;
  src: string;
  type: string | null;
  isSlot: boolean;
  isFalling: boolean;
  isNewSlot: boolean;
}

interface IconGridProps {
  num: number;
}

/* 
  Takes provided icons and returns them in grid formation
*/
function IconGrid({num}: IconGridProps){
  const MIN_TIME = 60;
  const MAX_TIME = 120;
  const getRandomTime = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };
  const [iconList, setIconList] = useState<Icon[]>([]);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [hasMounted, setHasMounted] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(() => getRandomTime(MIN_TIME, MAX_TIME));
  const dragItem = useRef<HTMLImageElement | null>(null);
  
  useEffect(() => {
    setHasMounted(true);

    function genIconList(slotList: Icon[]){
      const NUM_OF_SLOTS = 3;
      const tempIconList = [] as Icon[];
      let hasMatch = true;
      let icon = {} as Icon;

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

  useEffect(() => {
    const isAnimating = iconList.some(icon => icon.isFalling);
    if (isAnimating || iconList.length === 0 || gameOver) return;

    const matchedIndexes = checkMatches(iconList);

    if (matchedIndexes.length > 0) {
      const timer = setTimeout(() => {
        setIconList(currentBoard => {
          const freshMatches = checkMatches(currentBoard) as number[];
          if (freshMatches.length === 0) return currentBoard;
          
          return processMatch(freshMatches, currentBoard);
        });
      }, 300);

      return () => clearTimeout(timer);
    } else {
      if (checkWin(iconList)) {
        setGameOver(true);
      } else if (!hasPossibleMoves(iconList)){
        alert("No more moves! Reshuffling..."); // Replace with a pretty modal later
        setIconList(currentBoard => reshuffleBoard(currentBoard));
      }
    }
  }, [iconList, hasMounted, gameOver]);

  useEffect(() => {
    // Stop the timer if game is over or paused
    if (gameOver || timeLeft <= 0) return;

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

    // Cleanup: this clears the timer if the component re-renders or unmounts
    return () => clearInterval(timer);
  }, [timeLeft, gameOver]);

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

  function genRandIcon(index: number, excludeType: string = "", genSlotIcon: boolean = false): Icon {
    const ICON_CHANCE = 100;
    let icon: Icon = {
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

  function checkInitialMatches (currentIndex: number, type: string | null, boardToCheck: Icon[]){
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

  const dragstartHandler = (ev: React.DragEvent<HTMLImageElement>) => {
    if (gameOver) return;

    dragItem.current = ev.currentTarget;
    ev.currentTarget.classList.add('dragging');
    ev.dataTransfer.setData("text", ev.currentTarget.id);
    ev.dataTransfer.effectAllowed = "move";
  };

  const dragEndHandler = (ev: React.DragEvent<HTMLImageElement>) => {
    ev.currentTarget.classList.remove('dragging');
    dragItem.current = null;
  };

  const dragoverHandler = (ev: React.DragEvent<HTMLImageElement>) => {
    ev.preventDefault();
  };

  const dropHandler = (ev: React.DragEvent<HTMLImageElement>) => {
    if(gameOver) return;
    ev.preventDefault();

    const draggedId = ev.dataTransfer.getData("text");
    const targetId = ev.currentTarget.id;

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

  const isAdjacent = (grid1: number, grid2: number) => {
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

  const isValidMove = (tempIconList: Icon[], item1: Icon, item2: Icon) => {
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

            if(itemList[i].type == tempIconList[check1].type && itemList[(i)].type == tempIconList[check2].type && !itemList[i].isSlot){
              matchType.push(MATCH_TYPE[j]); 
              indexes.push(itemList[i].grid, check1, check2);
            }
          }
        }
      }
    } 
    return indexes;
  }

  const processMatch = (indexes: number[], tempBoard: Icon[]) => {
    const gridNumber = num;
    const BASIC_MATCH = 3;
    const centerRow = Math.floor(num / 2);
    const centerColumn = [centerRow - 1, centerRow, centerRow + 1];
    let tempIconList = [...tempBoard];
    let newIndexes: number[] = [];

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
    }

    if(checkWin(tempIconList)){
      setGameOver(true);
    }

    return tempIconList;
  };

  // Checks the whole board after a move is completed for cascading matches
  function checkMatches(tempIconList: Icon[]){
    const indexes = new Set();
    const size = num;

    for (let i = 0; i < tempIconList.length; i++) {
      const x = i % size;
      const y = Math.floor(i / size);
      const current = tempIconList[i];

      // Skip nulls or empty types
      if (!current.type || current.isSlot) continue;

      // --- CHECK HORIZONTAL (Right) ---
      // Only check if we have at least 2 tiles remaining to the right
      if (x <= size - 3) {
        const right1 = tempIconList[i + 1];
        const right2 = tempIconList[i + 2];
        
        if (current.type === right1.type && current.type === right2.type) {
          indexes.add(i);
          indexes.add(i + 1);
          indexes.add(i + 2);
        }
      }

      // --- CHECK VERTICAL (Down) ---
      // Only check if we have at least 2 tiles remaining below
      if (y <= size - 3) {
        const down1 = tempIconList[i + size];
        const down2 = tempIconList[i + (size * 2)];

        if (current.type === down1.type && current.type === down2.type) {
          indexes.add(i);
          indexes.add(i + size);
          indexes.add(i + (size * 2));
        }
      }
    }

    return Array.from(indexes);
  }

  const hasPossibleMoves = (tempBoard: Icon[]) => {
    const size = num;
    const centerRow= Math.floor(size / 2);
    const centerStartIndex = centerRow * size + (centerRow - 1);
    const centerColumnIndexes = [centerStartIndex, centerStartIndex + 1, centerStartIndex + 2];

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

        if (checkMatches(virtualBoard).length > 0) {
          return true;
        }
      }
    }
    return false;
  };

  const reshuffleBoard = (currentBoard: Icon[]) => {
    let movableIcons = currentBoard.filter(icon => !icon.isSlot);

    let isBoardValid = false;
    let reshuffledFullBoard: Icon[] = [];

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

  const checkWin = (tempBoard: Icon[]) => {
    const centerSquare = Math.floor((num * num) / 2);
    if(tempBoard[centerSquare - 1].type == tempBoard[centerSquare].type && tempBoard[centerSquare].type == tempBoard[centerSquare + 1].type){
      return true;
    }
    return false;
  }

  return (
    <div className="game-wrapper">
      <div className="ui-header">
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

export default IconGrid;