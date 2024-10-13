import React, { useState, useEffect } from "react";
import Web3 from "web3";
import { Sparkles } from "lucide-react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import GachaCard from "./components/GachaCard";
import Collection from "./components/Collection";
import { Character } from "./types";
import { characters } from "./data/characters";
import dinoCoinLogo from "../images/dinoCoinLogo.png";

function App() {
  const [account, setAccount] = useState<string | null>(null);
  const [web3, setWeb3] = useState<any>(null);
  const [pulledCharacter, setPulledCharacter] = useState<Character | null>(
    null
  );
  const [collection, setCollection] = useState<Character[]>([]);
  const [dinoCoins, setDinoCoins] = useState<number>(20);
  const [showCollection, setShowCollection] = useState<boolean>(false); // State to toggle collection display

  useEffect(() => {
    async function loadWeb3() {
      const Web3 = (await import("web3")).default;
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        setWeb3(web3Instance);
      }
    }
    loadWeb3();
  }, []);

  const connectWallet = async () => {
    if (web3) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setAccount(accounts[0]);
      } catch (error) {
        console.error("Failed to connect wallet:", error);
      }
    }
  };

  const pullGacha = async () => {
    if (!account || !web3) return;

    try {
      const transaction = {
        from: account,
        to: "0x0000000000000000000000000000000000000000", // Replace with correct address
        value: web3.utils.toWei("0.1", "ether"), // 0.1 ETH cost
      };

      await web3.eth.sendTransaction(transaction);

      const randomIndex = Math.floor(Math.random() * characters.length);
      const newCharacter = characters[randomIndex];

      if (!collection.some((char) => char.id === newCharacter.id)) {
        setPulledCharacter(newCharacter);
        setCollection((prev) => [...prev, newCharacter]);
      } else {
        setDinoCoins((prev) => prev + 5);
        alert(
          "You've already collected this character! You've received 5 Dino Coins."
        );
      }
    } catch (error) {
      console.error("Failed to pull gacha:", error);
    }
  };

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-blue-500 to-indigo-600 p-6">
        {/* Header */}
        <header className="flex justify-between items-center mb-6">
          <img
            src={dinoCoinLogo}
            alt="Dino Coin Logo"
            className="w-16 h-16 rounded-full"
          />
          <h1 className="text-white text-2xl font-bold"></h1>
          <div className="flex items-center space-x-4">
            <div className="bg-white text-black font-bold px-4 py-2 rounded">
              Dino Coins: {dinoCoins}
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
              onClick={() => setShowCollection((prev) => !prev)} // Toggle collection visibility
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              {showCollection ? "Unshow Collection" : "Show Collection"}{" "}
              {/* Dynamic button text */}
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
        <div className="flex justify-center space-x-6 mb-6">
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

        {/* Show Collection */}
        {showCollection && (
          <div className="mt-6">
            <Collection collection={collection} />
          </div>
        )}

        {/* Routes */}
        <Routes>
          <Route
            path="/collection"
            element={<Collection collection={collection} />}
          />
          <Route
            path="/"
            element={
              <div className="text-white">Welcome to the Gacha Game!</div>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
