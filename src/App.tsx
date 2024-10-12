import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Sparkles } from "lucide-react";
import GachaCard from "./components/GachaCard";
import ConnectWallet from "./components/ConnectWallet";
import { Character } from "./types";
import { characters } from "./data/characters";

function App() {
  const [account, setAccount] = useState<string | null>(null);
  const [provider, setProvider] =
    useState<ethers.providers.Web3Provider | null>(null);
  const [pulledCharacter, setPulledCharacter] = useState<Character | null>(
    null
  );
  const [collection, setCollection] = useState<Character[]>([]); // Collection state
  const [showCollection, setShowCollection] = useState<boolean>(false); // State to toggle collection visibility
  const [dinoCoins, setDinoCoins] = useState<number>(20); // Dino Coins state

  useEffect(() => {
    if (window.ethereum) {
      const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(web3Provider);
    }
  }, []);

  const connectWallet = async () => {
    if (provider) {
      try {
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);
      } catch (error) {
        console.error("Failed to connect wallet:", error);
      }
    }
  };

  const pullGacha = async () => {
    if (!account || !provider) return;

    const signer = provider.getSigner();
    try {
      // Charge 0.1 ETH per summon
      const tx = await signer.sendTransaction({
        to: ethers.constants.AddressZero, // Replace with the correct address
        value: ethers.utils.parseEther("0.1"), // 0.1 ETH cost
      });
      await tx.wait();

      // Simulate random character pull
      const randomIndex = Math.floor(Math.random() * characters.length);
      const newCharacter = characters[randomIndex];

      // Check if character is already in collection
      if (!collection.some((char) => char.id === newCharacter.id)) {
        setPulledCharacter(newCharacter);
        setCollection((prev) => [...prev, newCharacter]); // Add character to collection
      } else {
        setDinoCoins((prev) => prev + 5); // Add compensation Dino Coins
        alert(
          "You've already collected this character! You've received 5 Dino Coins as compensation."
        );
      }
    } catch (error) {
      console.error("Failed to pull gacha:", error);
    }
  };

  const toggleCollection = () => {
    setShowCollection(!showCollection); // Toggle collection menu
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-indigo-600 p-6">
      {/* Header */}
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-white text-2xl font-bold">Genshin</h1>
        <div className="flex items-center space-x-4">
          <div className="bg-white text-black font-bold px-4 py-2 rounded">
            Dino Coins: {dinoCoins} {/* Show Dino Coins */}
          </div>
          <button
            onClick={connectWallet}
            className="bg-black text-white px-4 py-2 rounded"
          >
            {account
              ? `${account.slice(0, 6)}...${account.slice(-4)}`
              : "Connect Wallet"}
          </button>
          <button
            onClick={toggleCollection}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            {showCollection ? "Hide Collection" : "Show Collection"}
          </button>
        </div>
      </header>

      {/* Banner */}
      <div className="flex justify-center mb-1">
        <img
          src="./images/banner.png"
          alt="Summon Banner"
          className="rounded-lg"
        />
      </div>

      {/* Summon Buttons */}
      <div className="flex justify-center space-x-6">
        <button
          onClick={pullGacha}
          className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-4 px-8 rounded-lg flex items-center space-x-2"
        >
          <Sparkles className="w-6 h-6" />
          <span>1x Summon (0.1 ETH)</span>
        </button>
        <button className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-4 px-8 rounded-lg">
          10x Summon (1.0 ETH)
        </button>
      </div>

      {/* Pulled Character */}
      {pulledCharacter && (
        <div className="mt-12 flex justify-center">
          <GachaCard character={pulledCharacter} />
        </div>
      )}

      {/* Collection Menu */}
      {showCollection && (
        <div className="mt-12">
          <h2 className="text-white text-xl font-bold mb-4">Your Collection</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {" "}
            {/* Add gaps between cards */}
            {collection.length === 0 ? (
              <p className="text-white">No characters collected yet.</p>
            ) : (
              collection.map((character) => (
                <GachaCard key={character.id} character={character} />
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
