const RPC = require('@hyperswarm/rpc');
const { getLatestPrice, getHistoricalPrices } = require('../storage/hyperbeeStorage');

async function startRpcServer(dht) {
    const rpc = new RPC({ dht });
    const rpcServer = rpc.createServer();
    await rpcServer.listen();
    console.log('🚀 RPC Server started on public key:', rpcServer.publicKey.toString('hex'));
    process.env.PUBLIC_KEY = rpcServer.publicKey.toString('hex');


    // bind handlers to rpc server
    rpcServer.respond('ping', async (reqRaw) => {
        // reqRaw is Buffer, we need to parse it
        const req = JSON.parse(reqRaw.toString('utf-8'))

        const resp = { nonce: req.nonce + 1 }

        // we also need to return buffer response
        const respRaw = Buffer.from(JSON.stringify(resp), 'utf-8')
        return respRaw
    })

    rpcServer.respond('getLatestPrices', async (reqRaw) => {
        const requestedPairs = JSON.parse(reqRaw.toString('utf-8'));
        const results = {};

        for (const pair of requestedPairs) {
            const latest = await getLatestPrice(pair);
            if (latest) results[pair] = latest;
        }

        return Buffer.from(JSON.stringify(results), 'utf-8');
    });

    rpcServer.respond('getHistoricalPrices', async (reqRaw) => {
        const { pairs, from, to } = JSON.parse(reqRaw.toString('utf-8'));
        const results = {};

        for (const pair of pairs) {
            results[pair] = await getHistoricalPrices(pair, from, to);
        }

        return Buffer.from(JSON.stringify(results), 'utf-8');
    });

    return rpcServer;
}

module.exports = { startRpcServer };
