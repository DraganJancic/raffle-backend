
export interface CreateRaffleRequest {
  raffle_id: string;
  account_id: string;
  contract_id: string;
  token_id: string;
  supply: number;
  end_date: string;
  ticket_price: number;
}


export interface BuyTicketsRequest {
  account_id: string;
  raffle_id: string;
  tickets: number;
}


export interface CancelRaffleRequest {
  account_id: string;
  raffle_id: string;
}