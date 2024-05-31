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
      address: '0xEEA1072eC78fA23BE2A9F9058d68CF969F97A23E',
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