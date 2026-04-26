'use client';
import { useState, useEffect } from "react";
import IconGrid from "./iconGrid";
import '../../styles/slots.css';

export default function Slot({num, returnToMenu}) {
  const [stage, setStage] = useState('idle');
  const [slotResults, setSlotResults] = useState([]);
  const [spinnerIcons, setSpinnerIcons] = useState([]);
  
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

  useEffect(() => {
    if (stage === 'idle') {
      const initialIcons = [genSlot(), genSlot(), genSlot()];
      if (initialIcons[0].type === initialIcons[1].type && initialIcons[1].type === initialIcons[2].type) {
        initialIcons[2] = genSlot(initialIcons[0].type || "");
      }
      setSlotResults(initialIcons);
    }
  }, []);

  const handleSpin = () => {
    const results = [genSlot(), genSlot(), genSlot()];
    if(results[0].type === results[1].type && results[1].type === results[2].type){
      results[2] = genSlot(results[0].type || "");
    }
    
    setSlotResults(results);
    setStage('spinning');

    setTimeout(() => {
      setStage('landed');
      setTimeout(() => setStage('playing'), 1200);
    }, 2000);
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
      isNewSlot: false
    }
    
    // Slot symbol
    const slotType = Math.floor(Math.random() * ICON_CHANCE);

    if(slotType < 25){
      // Heart
      icon = {
        id: ``,
        grid: -1,
        src: "/icons/Heart_Icon.png",
        type: "heart",
        isSlot: true,
        isFalling: false,
        isNewSlot: false
      }
    
    } else if(slotType < 50){
      // Diamond
      icon = {
        id: ``,
        grid: -1,
        src: "/icons/Diamond_Icon.png",
        type: "diamond",
        isSlot: true,
        isFalling: false,
        isNewSlot: false
      }

    } else if(slotType < 75){
      // Spade
      icon = {
        id: ``,
        grid: -1,
        src: "/icons/Spade_Icon.png",
        type: "spade",
        isSlot: true,
        isFalling: false,
        isNewSlot: false
      }

    } else if(slotType < 95){
      // Clover
      icon = {
        id: ``,
        grid: -1,
        src: "/icons/Clover_Icon.png",
        type: "clover",
        isSlot: true,
        isFalling: false,
        isNewSlot: false
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
        isNewSlot: false
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
            <div className="ready-subtext">INSERT MANA TO START</div>
          </div>

          <div className="flex flex-row items-center gap-8 bg-[#0a0a0a] p-6 rounded-3xl border-4 border-[#222] shadow-2xl">
            <div className="slot-reel-frame">
              {[0, 1, 2].map((i) => (
                <div key={i} className="reel">
                  {stage === 'spinning' ? (
                    <div className="blur-strip">
                      <div className="blur-icon" />
                      <div className="blur-icon" />
                      <div className="blur-icon" />
                    </div>
                  ) : (
                    <div className="is-landed">
                      <img src={slotResults[i]?.src} className="slot-display-icon" />
                    </div>
                  )}
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
        <IconGrid num={num} returnToMenu={returnToMenu} centerSlots={slotResults} />
      )}
    </div>
  );
}