import axios from "axios";
import NodeCache from "node-cache";
import * as dotenv from "dotenv";
dotenv.config();

const cache = new NodeCache({ stdTTL: 3600 }); // Cache for 1 hour

export const convertUsdToKes = async (usdAmount: number): Promise<number> => {
    const cacheKey = "usd_to_kes_rate";
    let exchangeRate = cache.get<number>(cacheKey);
  
    if (!exchangeRate) {
      try {
        const response = await axios.get(`https://api.exchangerate-api.com/v4/latest/USD?apiKey=${process.env.EXCHANGE_RATE_API_KEY}`);
        console.log("Fetched exchange rate:", response.data.rates.KES);
        exchangeRate = response.data.rates.KES;
        cache.set(cacheKey, exchangeRate);
      } catch (error) {
        console.error("Error fetching exchange rate:", error);
        exchangeRate = 130; // Fallback rate ($1 = KES 130)
      }
    }

    const kesAmount = usdAmount * (exchangeRate ?? 130);
    console.log(`Converting ${usdAmount} USD to KES: ${kesAmount} KES`);
  
    return Number(kesAmount.toFixed(2));
  };