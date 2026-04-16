'use client';
import { useRef } from 'react';

function Icon() {
  const dragItem = useRef(null);

  const initialIcons = [
    { id: 'img1', src: './icons/Fire_Icon.png' },
    { id: 'img2', src: './icons/Water_Icon.png' },
    { id: 'img3', src: './icons/Earth_Icon.png' },
    { id: 'img4', src: './icons/Air_Icon.png' },
    { id: 'img5', src: './icons/Heart_Icon.png' },
    { id: 'img6', src: './icons/Diamond_Icon.png' },
    { id: 'img7', src: './icons/Spade_Icon.png' },
    { id: 'img8', src: './icons/Clover_Icon.png' },
    { id: 'img9', src: './icons/7_Icon.png' },
  ];

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

    if (draggedId === targetId) return;

    if (isAdjacent(draggedId, targetId)) {
      const element1 = document.getElementById(draggedId);
      const element2 = document.getElementById(targetId);
      
      const tempSrc = element1.src;
      element1.src = element2.src;
      element2.src = tempSrc;
    }
    
    if (dragItem.current) dragItem.current.style.opacity = '1';
  };

  const isAdjacent = (id1, id2) => {
    return true; 
  };

  const imgStyle = {
    cursor: 'grab',
    userSelect: 'none',
    WebkitUserDrag: 'element',
    transition: 'opacity 0.2s'
  };

  const containerStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 114px)',
    gap: '20px',
    padding: '20px',
    userSelect: 'none'
  };

  return (
    <div style={containerStyle}>
      {initialIcons.map((icon) => (
        <img
          key={icon.id}
          id={icon.id}
          src={icon.src}
          draggable="true"
          onDragStart={dragstartHandler}
          onDragEnd={dragEndHandler}
          onDrop={dropHandler}
          onDragOver={dragoverHandler}
          style={imgStyle}
          width="114"
          height="114"
        />
      ))}
    </div>
  );
}

export default Icon;