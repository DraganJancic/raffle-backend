import mongoose, { Document, Schema } from 'mongoose';

interface Participation {
  raffle_id: string;
  total_tickets: number;
  total_tickets_value: number;
  winner: boolean;
}

interface AccountDocument extends Document {
  account_id: string;
  raffles_created: string[];
  raffles_canceled: string[];
  participated_in: Participation[];
}

const ParticipationSchema = new Schema({
  raffle_id: { type: String, default: "" },
  total_tickets: { type: Number, default: 0 },
  total_tickets_value: { type: Number, default: 0 },
  winner: { type: Boolean, default: false },
}, { _id: false }); // Avoid creation of an id for subdocuments

const AccountSchema: Schema = new Schema({
  account_id: {
    type: String,
    required: true,
    unique: true
  },
  raffles_created: {
    type: [String],
    default: []
  },
  raffles_canceled: {
    type: [String],
    default: []
  },
  participated_in: {
    type: [ParticipationSchema],
    default: []
  }
}, { timestamps: true });

const AccountModel = mongoose.model<AccountDocument>('Account', AccountSchema);

export { AccountDocument, AccountModel };
