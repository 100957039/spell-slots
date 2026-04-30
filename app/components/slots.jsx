'use client';
import { useState, useRef } from "react";
import IconGrid from "./iconGrid";
import '../../styles/slots.css';

export default function Slot({num, returnToMenu}) {
  const [stage, setStage] = useState('idle');  
  const slotRoll = [
    {
      src: "/icons/Heart_Icon.png",
      type: "heart"
    },
    {
      src: "/icons/Diamond_Icon.png",
      type: "diamond"
    },
    {
      src: "/icons/Spade_Icon.png",
      type: "spade"
    },
    {
      src: "/icons/Clover_Icon.png",
      type: "clover"
    },
    {
      src: "/icons/7_Icon.png",
      type: "7"
    }
  ];

  const [spinnerIcons, setSpinnerIcons] = useState([slotRoll[0], slotRoll[0], slotRoll[0], slotRoll[0], slotRoll[0]]);
  const [slotResults, setSlotResults] = useState([...spinnerIcons]);
  const [isLooping, setIsLooping] = useState(false);

  const handleSpin = () => {
    // Generates the result icons to be used in the game
    const results = [genSlot(), genSlot(), genSlot(), genSlot(), genSlot()];
    
    if(results[0].type === results[1].type && results[1].type === results[2].type && results[2].type === results[3].type && results[3].type === results[4].type){
      results[4] = genSlot(results[0].type || "");
    }
    setSlotResults(results);
    setStage('spinning');
    setIsLooping(true);

    setTimeout(() => {
      setIsLooping(false);

      setTimeout(() => {
        setSpinnerIcons(results);
        setTimeout(() => setStage('playing'), 1200);
      }, 1400); 
  }, 1000); 
};

  function genSlot(excludeType = "") {
    const ICON_CHANCE = 100;
    let icon = {
      id: "",
      grid: -1,
      src: "",
      type: "",
      isSlot: false,
      isFalling: false,
      isNewSlot: false,
      isSlotFilled: false
    }
    
    // Slot symbol
    const slotType = Math.floor(Math.random() * ICON_CHANCE);

    if(slotType < 20){
      // Heart
      icon = {
        id: ``,
        grid: -1,
        src: "/icons/Heart_Icon.png",
        type: "heart",
        isSlot: true,
        isFalling: false,
        isNewSlot: false,
      isSlotFilled: false
      }
    
    } else if(slotType < 40){
      // Diamond
      icon = {
        id: ``,
        grid: -1,
        src: "/icons/Diamond_Icon.png",
        type: "diamond",
        isSlot: true,
        isFalling: false,
        isNewSlot: false,
      isSlotFilled: false
      }

    } else if(slotType < 60){
      // Spade
      icon = {
        id: ``,
        grid: -1,
        src: "/icons/Spade_Icon.png",
        type: "spade",
        isSlot: true,
        isFalling: false,
        isNewSlot: false,
      isSlotFilled: false
      }

    } else if(slotType < 80){
      // Clover
      icon = {
        id: ``,
        grid: -1,
        src: "/icons/Clover_Icon.png",
        type: "clover",
        isSlot: true,
        isFalling: false,
        isNewSlot: false,
      isSlotFilled: false
      }

    } else {
      // 7
      icon = {
        id: ``,
        grid: -1,
        src: "/icons/7_Icon.png",
        type: "7",
        isSlot: true,
        isFalling: false,
        isNewSlot: false,
      isSlotFilled: false
      }
    }

    if(icon.type == excludeType){
      icon = genSlot(excludeType);
    }

    return icon;
  }

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center">
      
      {(stage === 'idle' || stage === 'spinning' || stage === 'landed') && (
        <div className="flex flex-col items-center gap-8">
          <div className="ready-text-container">
            <h1 className="ready-text">READY TO SPIN?</h1>
          </div>

          <div className="flex flex-row items-center gap-8 bg-[#0a0a0a] p-6 rounded-3xl border-4 border-[#222] shadow-2xl">
            <div className="slot-reel-frame">
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className="reel" draggable="false">
                <div 
                  className={`reel-strip 
                    ${isLooping ? 'is-spinning' : ''} 
                    ${stage === 'spinning' && !isLooping ? 'is-landing' : ''}
                    `
                  }
                  style={{ 
                    animationDelay: `${i * 80}ms`, 
                    transitionDelay: `${i * 150}ms` 
                  }}
                >
                  <div className="icon-wrapper" draggable="false">
                    <img src={slotResults[i]?.src} className="slot-display-icon" alt="result" draggable="false"/>
                  </div>
                  {[...slotRoll, ...slotRoll, ...slotRoll, ...slotRoll, ...slotRoll].map((icon, idx) => (
                    <div key={idx} className="icon-wrapper" draggable="false">
                      <img src={icon.src} className="slot-display-icon" alt="filler" draggable="false"/>
                    </div>
                  ))}
                  <div className="icon-wrapper" draggable="false">
                    <img src={spinnerIcons[i]?.src} className="slot-display-icon" alt="start" draggable="false" />
                  </div>
                </div>
              </div>
            ))}
          </div>

            <div className="flex items-center justify-center">
              <button 
                className={`spin-button ${stage !== 'idle' ? 'button-disabled' : ''}`} 
                onClick={stage === 'idle' ? handleSpin : undefined}
                disabled={stage !== 'idle'}
              >
                SPIN
              </button>
            </div>
          </div>
        </div>
      )}
      {stage === 'playing' && (
        <IconGrid num={num} returnToMenu={returnToMenu} slots={slotResults} />
      )}
    </div>
  );
}