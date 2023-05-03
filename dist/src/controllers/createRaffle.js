"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRaffle = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const createRaffle = (req, res) => {
    const raffleData = req.body;
    if (!raffleData.nft_id || !raffleData.ticket_cost) {
        return res.status(400).json({ message: 'Invalid raffle data' });
    }
    try {
        const rafflesFilePath = path_1.default.join(__dirname, '..', 'dummy-data', 'raffle.json');
        const raffles = JSON.parse(fs_1.default.readFileSync(rafflesFilePath, 'utf8'));
        // Check if a raffle with the given nft_id already exists
        if (raffles.some((raffle) => raffle.nft_id === raffleData.nft_id)) {
            return res.status(400).json({ message: 'A raffle with this NFT ID already exists' });
        }
        // Generate the raffle_id
        const maxRaffleId = Math.max(...raffles.map((raffle) => raffle.raffle_id), 0);
        const newRaffle = Object.assign({ raffle_id: maxRaffleId + 1 }, raffleData);
        // Add the new raffle
        raffles.push(newRaffle);
        fs_1.default.writeFileSync(rafflesFilePath, JSON.stringify(raffles, null, 2));
        res.status(201).json({ message: 'Raffle added successfully', raffle: newRaffle });
    }
    catch (error) {
        res.status(500).json({ message: 'Error adding raffle: ' + error.message });
    }
};
exports.createRaffle = createRaffle;
//# sourceMappingURL=createRaffle.js.map