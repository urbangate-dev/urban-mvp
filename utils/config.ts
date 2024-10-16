import { http, createConfig } from '@wagmi/core'
import { baseSepolia } from 'wagmi/chains'
//config used for reading onchain data
export const config = createConfig({
    chains: [baseSepolia],
    transports: {
      // RPC URL for each chain
      [baseSepolia.id]: http(
        process.env.NEXT_PUBLIC_ALCHEMYHTTP,
      ),
    },
  });

