import React, { useState, useEffect } from "react";
import Web3 from "web3";
import { Sparkles, Coins } from "lucide-react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import GachaCard from "./components/GachaCard";
import Collection from "./components/Collection";
import { Character } from "./types";
import { characters } from "./data/characters";
import dinoCoinLogo from "../images/dinoCoinLogo.png";
import "./App.css";

function App() {
  const [account, setAccount] = useState<string | null>(null);
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [pulledCharacter, setPulledCharacter] = useState<Character | null>(
    null
  );
  const [collection, setCollection] = useState<Character[]>([]);
  const [dinoCoins, setDinoCoins] = useState(20);
  const [showCollection, setShowCollection] = useState(false);

  useEffect(() => {
    async function loadWeb3() {
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
        value: web3.utils.toWei("0.1", "ether"),
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
      <div className="min-h-screen bg-gradient-to-br from-purple-900 to-indigo-900 p-6">
        <header className="flex justify-between items-center mb-6 bg-black bg-opacity-50 p-4 rounded-lg">
          <img
            src={dinoCoinLogo}
            alt="Dino Coin Logo"
            className="w-16 h-16 rounded-full border-2 border-yellow-400"
          />
          <h1 className="text-yellow-400 text-3xl font-extrabold tracking-wider">
            DinoNFT Gacha
          </h1>
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-bold px-4 py-2 rounded-full flex items-center">
              <Coins className="w-5 h-5 mr-2" />
              <span>{dinoCoins}</span>
            </div>
            <button
              onClick={connectWallet}
              className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-2 rounded-full hover:from-pink-600 hover:to-purple-700 transition duration-300"
            >
              {account
                ? `${account.slice(0, 6)}...${account.slice(-4)}`
                : "Connect Wallet"}
            </button>
            <button
              onClick={() => setShowCollection((prev) => !prev)}
              className="bg-gradient-to-r from-green-400 to-blue-500 text-white px-4 py-2 rounded-full hover:from-green-500 hover:to-blue-600 transition duration-300"
            >
              {showCollection ? "Hide Collection" : "Show Collection"}
            </button>
          </div>
        </header>

        <div className="flex justify-center mb-8">
          <img
            src="./images/banner.png"
            alt="Summon Banner"
            className="rounded-lg shadow-2xl transform hover:scale-105 transition duration-300"
          />
        </div>

        <div className="flex justify-center space-x-6 mb-10">
          <button
            onClick={pullGacha}
            className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold py-4 px-8 rounded-lg flex items-center space-x-2 hover:from-purple-600 hover:to-indigo-700 transition duration-300 transform hover:scale-105"
          >
            <Sparkles className="w-6 h-6" />
            <span>1x Summon (0.1 ETH)</span>
          </button>
          <button className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold py-4 px-8 rounded-lg hover:from-yellow-500 hover:to-orange-600 transition duration-300 transform hover:scale-105">
            10x Summon (1.0 ETH)
          </button>
        </div>

        {pulledCharacter && (
          <div className="mt-12 flex justify-center">
            <GachaCard character={pulledCharacter} />
          </div>
        )}

        {showCollection && (
          <div className="mt-10 bg-black bg-opacity-50 p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-4 text-center text-yellow-400">
              Your NFT Collection
            </h2>
            <Collection collection={collection} />
          </div>
        )}

        <Routes>
          <Route
            path="/collection"
            element={<Collection collection={collection} />}
          />
          <Route
            path="/"
            element={
              <div className="text-white text-center mt-10">
                Welcome to the DinoNFT Gacha Game!
              </div>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
