import mongoose from 'mongoose';
const { Schema, model } = mongoose;

export const nftCollectionSchema = new Schema({
  collection_id: {
    type: String,
    required: true
  },
  collection_name: {
    type: String,
    required: true
  },
  latest_floor_price: {
    type: Number,
    required: true
  }
}, { timestamps: true });

export default model('NftCollection', nftCollectionSchema);