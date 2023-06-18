export interface Participation {
  raffle_id: string;
  total_tickets: number;
  total_tickets_value: number;
  winner: boolean;
}

export interface Account {
  account_id: string;
  raffles_created: string[];
  raffles_canceled: string[];
  participated_in: Participation[];
}