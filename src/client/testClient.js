'use strict';

import RPC from '@hyperswarm/rpc';
import DHT from 'hyperdht';
import * as dotenv from "dotenv";
// Load environment variables
dotenv.config({ path: ".env" });



const main = async () => {
    // Setup DHT to connect with RPC server
    const dht = new DHT({ bootstrap: [{ host: '127.0.0.1', port: 30001 }] });
    await dht.ready();

    // Replace with your RPC server's public key (printed in server logs)
    const serverPubKey = Buffer.from(process.env.PUBLIC_KEY, 'hex');
    const rpc = new RPC({ dht });

    try {
        console.log("\n🔄 Sending Ping Request to RPC Server...");
        const payload = JSON.stringify({ nonce: 126 });
        const respRaw = await rpc.request(serverPubKey, 'ping', Buffer.from(payload, 'utf-8'));
        const resp = JSON.parse(respRaw.toString('utf-8'));

        console.log("✅ Ping Response:", resp);

    } catch (error) {
        console.error("❌ Error during RPC test:", error.message);
    }

    await rpc.destroy();
    await dht.destroy();
};

main().catch(console.error);