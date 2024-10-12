import React from "react";
import { Character } from "../types";

interface GachaCardProps {
  character: Character;
}

const GachaCard: React.FC<GachaCardProps> = ({ character }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden w-68 ">
      <img
        src={`./images/${character.image}`} // Dynamically set the image source
        alt={character.name}
        className="w-full h-96 object-cover" // Adjust height and ensure cover fit
      />
      <div className="p-4">
        <h3 className="text-xl font-bold mb-2">{character.name}</h3>
        <p className="text-gray-600 mb-2">Rarity: {character.rarity} ★</p>
        <p className="text-gray-600">{character.element} Vision</p>
      </div>
    </div>
  );
};

export default GachaCard;
