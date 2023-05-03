"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRaffles = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const getRaffles = (req, res) => {
    const raffles = JSON.parse(fs_1.default.readFileSync(path_1.default.resolve(__dirname, '..', 'dummy-data', 'raffle.json'), 'utf8'));
    res.json(raffles);
};
exports.getRaffles = getRaffles;
//# sourceMappingURL=getRaffles.js.map