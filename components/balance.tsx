import React, { useEffect, useState } from "react";
import { useReadContract, useAccount } from "wagmi";
import { abi } from "../abi/erc20";
import { formatCurrency } from "../utils/functions";

//Balance component that displays the amount of usdc tokens (6 decimals)
export function Balance() {
  const { address } = useAccount();
  const [balance, setBalance] = useState<string | null>(null);

  const { data, error, isRefetching, refetch, isLoading, isSuccess } =
    useReadContract({
      abi: abi,
      address: process.env.NEXT_PUBLIC_ERC20_ADDRESS as unknown as `0x${string}`,
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
      <button
        disabled={isRefetching}
        onClick={handleRefetch}
        style={{ marginLeft: 4 }}
      >
        {isRefetching && "Loading..."}
        {isLoading && <p>Loading balance...</p>}
        {balance !== null && !isLoading && !error && (
          <p>Balance: {formatCurrency(parseFloat(balance)/1000000)}</p>
        )}
      </button>
    </>
  );
}
