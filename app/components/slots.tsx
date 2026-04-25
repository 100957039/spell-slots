'use client';
import { useState, useEffect } from "react";
import IconGrid from "./iconGrid";
import '../../styles/slots.css';

interface Icon {
  id: string;
  grid: number;
  src: string;
  type: string | null;
  isSlot: boolean;
  isFalling: boolean;
  isNewSlot: boolean;
}

interface SlotsProps {
  num: number;
  returnToMenu: () => void;
}

export default function Slot({num, returnToMenu}: SlotsProps) {
  const [stage, setStage] = useState<'idle' | 'spinning' | 'landed' | 'playing'>('idle');
  const [countdown, setCountdown] = useState<number>(3);
  const [slotResults, setSlotResults] = useState<Icon[]>([]);

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

  function genSlot(excludeType: string = ""): Icon {
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
      
      {/* IDLE STAGE: The Big Button */}
      {stage === 'idle' && (
        <div className="flex flex-col items-center gap-12">
          <div className="ready-text-container">
            <h1 className="ready-text">READY TO SPIN?</h1>
            <div className="ready-subtext">INSERT MANA TO SPIN</div>
          </div>
          <button className="spin-button" onClick={handleSpin}>
            SPIN
          </button>
        </div>
      )}

      {/* SPINNING & LANDED STAGE */}
      {(stage === 'spinning' || stage === 'landed') && (
        <div className="slot-machine-container">
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
                  /* The actual result icon */
                  <div className="is-landed">
                    <img src={slotResults[i]?.src} className="slot-display-icon" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {stage === 'playing' && (
        <IconGrid num={num} returnToMenu={returnToMenu} centerSlots={slotResults} />
      )}
    </div>
  );
}