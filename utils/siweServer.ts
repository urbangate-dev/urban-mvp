import { configureServerSideSIWE } from 'connectkit-next-siwe';
import { config } from '@/components/Web3Provider';
import { baseSepolia } from 'wagmi/chains'
import { http } from '@wagmi/core'

export const siweServer = configureServerSideSIWE({
  config: {
    chains: config.chains,
    transports: {
      // RPC URL for each chain
      [baseSepolia.id]: http(
        process.env.NEXT_PUBLIC_ALCHEMYHTTP,
      ),
    },
  },
  session: {
    cookieName: 'connectkit-next-siwe',
    password: process.env.SESSION_SECRET,
    cookieOptions: {
      secure: process.env.NODE_ENV === 'production',
    },
  },
});