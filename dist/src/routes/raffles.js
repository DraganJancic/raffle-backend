"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const getRaffles_1 = require("../controllers/getRaffles");
const createRaffle_1 = require("../controllers/createRaffle");
const deleteRaffle_1 = require("../controllers/deleteRaffle");
const router = express_1.default.Router();
// Route for fetching raffle list data
router.get('/', getRaffles_1.getRaffles);
// Add route for adding raffles
router.post('/create-raffle', createRaffle_1.createRaffle);
//Delete raffle by id
router.delete('/raffles/:id', deleteRaffle_1.deleteRaffle);
exports.default = router;
//# sourceMappingURL=raffles.js.map