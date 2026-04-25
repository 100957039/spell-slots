'use client';
import { useState } from 'react';
import Slot from "./slots";
import '../../styles/menu.css';
import '../../styles/globals.css';

export default function Menu() {
  const [gameState, setGameState] = useState('menu');

  const startGame = () => setGameState('playing');
  const showMenu = () => setGameState('menu');

  return (
    <main className="h-screen w-screen overflow-hidden text-white">
      
      {gameState === 'menu' && (
        <div className="menu-wrapper">
          <div className="game-title">
            <span className="title-word spell">Spell</span>
            <span className="title-word slots">Slots</span>
          </div>

          <div className="menu-options">
            <button className="menu-btn" onClick={startGame}>
              Play Game
            </button>
            
            <button className="menu-btn" onClick={() => alert('Feature coming soon!')}>
              Leaderboard
            </button>
          </div>
        </div>
      )}

      {/* 3. RENDER GAME SCREEN */}
      {gameState === 'playing' && (
        <Slot num={9} returnToMenu={showMenu} />
      )}
    </main>
  );
}