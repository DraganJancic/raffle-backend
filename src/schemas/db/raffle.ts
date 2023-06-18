import mongoose from "mongoose";
const { Schema, model, Types } = mongoose;

export const raffleSchema = new Schema({
  raffle_id: {
    type: String,
    required: true
  },
  raffler: {
    type: String,
    required: true
  },
  total_tickets: {
    type: Number,
    required: true
  },
  ticket_price: {
    type: Number,
    required: true
  },
  tickets_sold: {
    type: Number,
    default: 0,
    required: true
  },
  start_date: {
    type: Date,
    required: true
  },
  end_date: {
    type: Date,
    required: true
  },
  nft_collection: {
    type: Types.ObjectId,
    ref: 'NftCollection',
    required: true
  },
  nft_id: {
    type: String,
    required: true
  },
  nft_title: {
    type: String,
    required: true
  },
  image_url: {
    type: String,
    required: true
  },
  participants: {
    type: [String],
    default: []
  },
  raffle_ended: {
    type: Boolean,
    default: false
  },
  winner: {
    type: String,
    default: null
  },
  canceled: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

export default model('Raffle', raffleSchema);








// import mongoose from "mongoose";


// export const raffleSchema = new mongoose.Schema({
//   raffle_id: {
//     type: String, // format nft_contract_id, DELIMETER, token_id, DELIMETER, owner_id, example: nft-tst.testnet_2:5_ludikonj.testnet
//     required: true
//   },
//   raffler: {
//     type: String, // jancicd.near
//     required: true
//   },
//   total_tickets: {
//     type: Number,
//     required: true
//   },
//   ticket_price: {
//     type: Number,
//     required: true
//   },
//   tickets_sold: {
//     type: Number,
//     default: 0,
//     required: true
//   },
//   start_date: {
//     type: Date,
//     required: true
//   },
//   end_date: {
//     type: Date,
//     required: true
//   },
//   nft_collection: {
//     type: String,
//     required: true
//   },
//   nft_id: {
//     type: String,
//     required: true
//   },
//   nft_title: {
//     type: String,
//     required: true
//   },
//   image_url: {
//     type: String,
//     required: true
//   },
//   floor_price: {
//     type: Number,
//     required: true
//   },
//   participants: {
//     type: [String], // Array of strings
//     default: [] // Set the default value to an empty array
//   },
//   raffle_ended: {
//     type: Boolean,
//     default: false
//   },
//   winner: {
//     type: String,
//     default: null
//   },
//   canceled: {
//     type: Boolean,
//     default: false
//   }
// }, { timestamps: true })


// export default mongoose.model('Raffle', raffleSchema)