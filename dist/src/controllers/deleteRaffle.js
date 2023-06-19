"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteRaffle = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const deleteRaffle = (req, res) => {
    const raffleId = parseInt(req.params.id, 10);
    // Read existing raffle data
    const raffles = JSON.parse(fs_1.default.readFileSync(path_1.default.resolve(__dirname, '..', '..', 'dummy-data', 'raffle.json'), 'utf8'));
    // Find the raffle by its ID
    const raffleIndex = raffles.findIndex((raffle) => raffle.raffle_id === raffleId);
    if (raffleIndex === -1) {
        return res.status(404).json({ message: 'Raffle not found' });
    }
    // Remove the raffle from the array
    raffles.splice(raffleIndex, 1);
    // Save updated raffle data back to raffle.json
    fs_1.default.writeFileSync(path_1.default.resolve(__dirname, '..', '..', 'dummy-data', 'raffle.json'), JSON.stringify(raffles, null, 2));
    res.status(200).json({ message: 'Raffle deleted successfully' });
};
exports.deleteRaffle = deleteRaffle;
//# sourceMappingURL=deleteRaffle.js.map