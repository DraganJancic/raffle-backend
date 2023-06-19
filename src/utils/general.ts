import * as nearAPI from "near-api-js";
import { BigNumber } from 'bignumber.js';

const { utils } = nearAPI;

/**
 * Converts a string value of YoctoNEAR to a string value of NEAR 
 */
export const convertYoctoToNear = (yoctoNEAR: string): string => utils.format.formatNearAmount(yoctoNEAR);


/**
 * Converts a number value of YoctoNEAR to a number value of NEAR 
 */
export const getPriceInNearFromYoctoNumber = (yoctoNEAR: number): number => {
  const NEAR_FACTOR = new BigNumber("1e24");
  return new BigNumber(yoctoNEAR).dividedBy(NEAR_FACTOR).toNumber();
}

/**
 * Validate essential environment vars
 */
export const validateEnvVars = () => {
  if (!process.env.MONGO_URI) {
    console.error('MONGO_URI is not defined in environment variables. Exiting the app...');
    process.exit(1);
  }
}