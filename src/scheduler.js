const { fetchTopCryptos, fetchCryptoPrices } = require('./services/coingeckoService');
const { processCryptoPrices } = require('./services/priceService');
const { saveLatestPrice, saveHistoricalPrice } = require('./storage/hyperbeeStorage');

async function updatePrices() {
    try {
        // Fetch the top 5 cryptos dynamically
        const cryptoIds = await fetchTopCryptos();
        const processedPrices = await processCryptoPrices(cryptoIds);

        for (const priceData of processedPrices) {
            await saveLatestPrice(priceData.id, priceData);
            await saveHistoricalPrice(priceData.id, priceData.timestamp, priceData);
        }

        console.log("✅ Prices updated at", new Date().toLocaleString());
    } catch (error) {
        console.error("❌ Error updating prices:", error);
    }
}

// Run every 30 seconds
setInterval(updatePrices, 30000);

module.exports = { updatePrices };
