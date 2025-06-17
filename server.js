// server.js - Express backend to send 100 ALUMI tokens to connected wallets
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { ethers } = require('ethers');

const app = express();
const port = 3001;
app.use(cors());
app.use(express.json());

// === CONFIGURATION ===
const provider = new ethers.JsonRpcProvider("https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID"); // Replace with your Infura or Alchemy URL
const privateKey = process.env.PRIVATE_KEY; // Store your wallet's private key in .env
const wallet = new ethers.Wallet(privateKey, provider);

// === CONTRACT INFO ===
const contractAddress = "0x7153ccCB1555870EA68b7122AEbCA1eCc52FC28A"; // Your ALUMICOIN contract on Sepolia
const abi = [
  "function transfer(address to, uint256 amount) public returns (bool)"
];
const token = new ethers.Contract(contractAddress, abi, wallet);

// === ROUTE ===
app.post('/send-alumicoin', async (req, res) => {
  const { to } = req.body;
  try {
    const amount = ethers.parseUnits("100", 18); // 100 ALUMI tokens
    const tx = await token.transfer(to, amount);
    await tx.wait();
    res.json({ success: true, hash: tx.hash });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
