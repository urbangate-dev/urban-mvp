import { configureServerSideSIWE } from 'connectkit-next-siwe';
import { config } from '@/components/Web3Provider';
import { baseSepolia } from 'wagmi/chains'
import { http } from '@wagmi/core'

// This configuration sets up the server-side functionality for Sign-In With Ethereum (SIWE) using 
// the `connectkit-next-siwe` package. It allows server-side authentication for Ethereum users in the application.
  
export const siweServer = configureServerSideSIWE({
  config: {
    chains: config.chains,
    transports: {
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