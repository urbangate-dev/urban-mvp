import React, { useState } from 'react';
import { useWriteContract, useAccount } from 'wagmi'
import { abi } from '../abi/loan'

export function KYC() {
  const { data: hash, writeContract } = useWriteContract()
  const {address} = useAccount()
  const [userAddress, setUserAddress] = useState("")
  const [kycStatus, setkycStatus] = useState(true);

  async function submit() { 
    writeContract({ 
      abi,
      address: '0x163aD5b66D50F228ca4Ec7B60DB6A3828aCb6128',
      functionName: 'setKYCStatus',
      args: [userAddress, kycStatus],
 })
  } 
  return (
    <>
    <button 
      onClick={submit}
    >
      set KYC
    </button>
    <input
      type="string"
      placeholder="address"
      value={userAddress}
      onChange={(e) => setUserAddress(e.target.value)}
      />
      <input
      type="checkbox"
      checked={kycStatus}
      onChange={(e) => setkycStatus(e.target.checked)}
      />
      {hash && <div>Transaction Hash: {hash}</div>}

    </>
  )
}