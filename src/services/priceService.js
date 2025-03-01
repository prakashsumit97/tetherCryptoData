const { fetchCryptoPrices } = require('./coingeckoService');

/**
 * Fetches prices for a list of cryptocurrencies, averages them from the top 3 exchanges,
 * and formats the data for storage.
 * @param {string[]} cryptoIds - List of cryptocurrency IDs (e.g., ['bitcoin', 'ethereum'])
 * @returns {Promise<Object[]>} - Processed price data
 */
async function processCryptoPrices(cryptoIds) {
    const timestamp = Date.now();
    const processedPrices = [];

    for (const cryptoId of cryptoIds) {
        // 🔹 Fetch prices from the top 3 exchanges
        const { avgPrice, exchanges } = await fetchCryptoPrices(cryptoId);

        if (!avgPrice) {
            console.warn(`⚠️ Skipping ${cryptoId}: No price data found.`);
            continue;
        }

        // 🔹 Create structured data for storage
        const priceData = {
            id: cryptoId,
            price: avgPrice,
            exchanges,
            timestamp
        };

        processedPrices.push(priceData);
    }

    return processedPrices;
}

module.exports = { processCryptoPrices };
