import React, { useState } from "react";

interface PlayerSelectorAccordionProps {
  selectedPlayer: string;
  availablePlayers: string[];
  onSelect: (player: string) => void;
}

const PlayerSelectorAccordion: React.FC<PlayerSelectorAccordionProps> = ({
  selectedPlayer,
  availablePlayers,
  onSelect,
}) => {

  return (
    <div className="accordion">
        <div className="accordion-content-row"> 
          Players:
          {availablePlayers.map((player) => (
            <label key={player} className="radio-label">
              <input
                type="radio"
                value={player}
                checked={selectedPlayer === player}
                onChange={() => onSelect(player)}
              />
              {player.toUpperCase()}
            </label>
          ))}
        </div>
    </div>
  );
};

export default PlayerSelectorAccordion;