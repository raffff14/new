// src/components/GachaCard.tsx
import React from "react";
import { motion } from "framer-motion";
import { Character } from "../types";
import { Star, Zap } from "lucide-react";
import { elementIcons } from "./elementIcons";

interface GachaCardProps {
  character: Character;
}

const GachaCard: React.FC<GachaCardProps> = ({ character }) => {
  return (
    <motion.div
      className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-xl overflow-hidden w-72 transform transition-all duration-300 hover:scale-105"
      initial={{ scale: 0, opacity: 0 }} // Initial state
      animate={{ scale: 1, opacity: 1 }} // Animation to apply
      transition={{ duration: 0.3 }} // Duration of animation
    >
      <div className="relative">
        <img
          src={`./images/${character.image}`}
          alt={character.name}
          className="w-full h-96 object-cover"
        />
        <div className="absolute top-0 left-0 bg-black bg-opacity-50 text-white px-3 py-1 rounded-br-lg">
          {Array.from({ length: character.rarity }).map((_, index) => (
            <Star
              key={index}
              className="inline-block w-4 h-4 text-yellow-400"
            />
          ))}
        </div>
      </div>
      <div className="p-4 bg-white bg-opacity-90">
        <div className="bg-blue-100 rounded-lg p-3 mb-2">
          <h3 className="text-2xl font-bold text-blue-800 mb-1">
            {character.name}
          </h3>
          <div className="flex items-center justify-between">
            <p className="text-blue-600 flex items-center text-sm">
              <img
                src={`./${elementIcons[character.element]}`}
                alt={`${character.element} Icon`}
                className="w-4 h-4 mr-1"
              />
              {character.element} Vision
            </p>
            <button className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm hover:bg-blue-700 transition-colors duration-200">
              Details
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default GachaCard;
