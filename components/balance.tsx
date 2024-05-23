import React, { useEffect, useState } from "react";
import { useReadContract, useAccount } from 'wagmi';
import { abi } from '../abi/erc20'

interface BalanceProps {
    title: string;
}

export const Balance: React.FC<BalanceProps> = () => {
    const { address } = useAccount();
    const [balance, setBalance] = useState<string | null>(null);

    const { data, error, isRefetching, refetch, isLoading, isSuccess } = useReadContract({
        abi: abi,
        address: '0x1bD42dd90F5256fb0E62CCdAfDa27c25Dc190c28',
        functionName: "balanceOf",
        args: [address],
    });

    useEffect(() => {
        if (isSuccess && data) {
            setBalance(data.toString());
        }
    }, [isSuccess, data]);

    useEffect(() => {
        if (error) {
            console.error("An error occurred:", error.message);
        }
    }, [error]);

    const handleRefetch = () => {
        refetch();
    };

    return (
        <>
            <button disabled={isRefetching} onClick={handleRefetch} style={{ marginLeft: 4 }}>
                {isRefetching && "Loading..."}
                {isLoading && <p>Loading balance...</p>}
                {error && <p style={{ color: 'red' }}>Error: {error.message}</p>}
                {balance !== null && !isLoading && !error && (
                    <p>Balance: {balance}</p>
                )}
            </button>

        </>
    );
};
