import Joi from 'joi';

export const createRaffleSchema = Joi.object({
  raffle_id: Joi.string().required(),
  account_id: Joi.string().required(),
  contract_id: Joi.string().required(),
  token_id: Joi.string().required(),
  supply: Joi.number().required(),
  ticket_price: Joi.number().required(),
  end_date: Joi.date().required()
});

export const buyTicketsSchema = Joi.object({
  raffle_id: Joi.string().required(),
  account_id: Joi.string().required(),
  tickets: Joi.number().required(),
});

export const cancelRaffleSchema = Joi.object({
  raffle_id: Joi.string().required(),
  account_id: Joi.string().required(),
});

export const getCurrentRafflesSchema = Joi.object({
  sort: Joi.string()
    .valid('recent', 'expiring', 'sellingOut', 'priceLH', 'priceHL', 'floorLH', 'Floor: High to low')
    .required(),
  filters: Joi.object({
    collection: Joi.string().allow(null),
    floor: Joi.object({
      min: Joi.number().allow(null),
      max: Joi.number().allow(null)
    }),
    end_date: Joi.string().isoDate().allow(null)
  }),
  page: Joi.number().integer().min(1).optional()
}).required();


export const getPastRafflesSchema = Joi.object({
  sort: Joi.string()
    .valid('recent', 'soldOut', 'priceLH', 'priceHL', 'floorLH', 'floorHL')
    .required(),
  filters: Joi.object({
    collection: Joi.string().allow(null),
    floor: Joi.object({
      min: Joi.number().allow(null),
      max: Joi.number().allow(null)
    }),
    end_date: Joi.string().isoDate().allow(null) // Here we only validate if it's a correct date format.
  }),
  page: Joi.number().integer().min(1).optional() // Add page property here
}).required();