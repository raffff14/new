// src/components/Collection.tsx
import React from "react";
import { Character } from "../types"; // Adjust the import based on your project structure
import GachaCard from "./GachaCard"; // Import GachaCard from components

interface CollectionProps {
  collection: Character[];
}

const Collection: React.FC<CollectionProps> = ({ collection }) => {
  return (
    <div className="mt-12">
      <h2 className="text-white text-xl font-bold mb-4">Your Collection</h2>
      <div className="flex flex-wrap justify-center gap-4">
        {collection.length === 0 ? (
          <p className="text-white">No characters collected yet.</p>
        ) : (
          collection.map((character) => (
            <GachaCard key={character.id} character={character} />
          ))
        )}
      </div>
    </div>
  );
};

export default Collection;
