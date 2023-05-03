interface RaffleParticipants {
  wallet_id: string;
  profile_url: string; // url ili path
  twitter_url: string;
  tickets_bought: number;
}

interface RaffleTransactions {
  txn_hash: string;
  buyer_id: string;
  date: string;
  tickets_bought: number;
}

export interface Raffle {
  raffle_id: number;
  nft_collection: string;
  nft_id: string;
  nft_title: string;
  image_url: string;
  floor_price: string;
  total_tickets: number;
  total_tickets_volume: number;
  total_ticket_sold: number;
  ticket_cost: number;
  start_date: string;
  end_date: string;
  raffler: string; // ko je kreirao?
  participants: RaffleParticipants[];
  transactions: RaffleTransactions[]
}

