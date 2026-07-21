"use client"

import { useAccount, useChainId, useReadContracts } from "wagmi"
import { CgSpinner } from "react-icons/cg"
import { erc20Abi } from "@/constants"
import { formatTokenAmount } from "@/utils"

interface TokenInfoPanelProps {
    tokenAddress: string
}

export default function TokenInfoPanel({ tokenAddress }: TokenInfoPanelProps) {
    const account = useAccount()
    const chainId = useChainId()

    const { data: tokenData, isLoading, error } = useReadContracts({
        contracts: [
            {
                abi: erc20Abi,
                address: tokenAddress as `0x${string}`,
                functionName: "decimals",
            },
            {
                abi: erc20Abi,
                address: tokenAddress as `0x${string}`,
                functionName: "name",
            },
            {
                abi: erc20Abi,
                address: tokenAddress as `0x${string}`,
                functionName: "balanceOf",
                args: [account.address],
            },
            {
                abi: erc20Abi,
                address: tokenAddress as `0x${string}`,
                functionName: "symbol",
            },
        ],
        query: {
            enabled: tokenAddress.length === 42 && tokenAddress.startsWith("0x"),
        },
    })

    const chainNames: Record<number, string> = {
        1: "Ethereum Mainnet",
        10: "Optimism",
        324: "zkSync Era",
        8453: "Base",
        42161: "Arbitrum One",
        31337: "Anvil (Local)",
        11155111: "Sepolia",
    }

    if (!tokenAddress) return null

    const decimals = tokenData?.[0]?.result as number | undefined
    const name = tokenData?.[1]?.result as string | undefined
    const userBalance = tokenData?.[2]?.result as bigint | undefined

    return (
        <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-3">
                Token Information
            </h3>
            {isLoading ? (
                <div className="flex items-center gap-2 text-zinc-500 py-2">
                    <CgSpinner className="animate-spin" size={18} />
                    <span className="text-sm">Loading token data...</span>
                </div>
            ) : error ? (
                <div className="text-sm text-red-500 py-2">
                    Could not fetch token data. Verify the token address is correct.
                </div>
            ) : name ? (
                <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm">
                    <div className="text-zinc-500">Name</div>
                    <div className="text-zinc-900 font-medium">{name}</div>
                    <div className="text-zinc-500">Symbol</div>
                    <div className="text-zinc-900 font-medium">
                        {(tokenData?.[3]?.result as string) || "—"}
                    </div>
                    <div className="text-zinc-500">Decimals</div>
                    <div className="text-zinc-900 font-medium">{decimals ?? "—"}</div>
                    <div className="text-zinc-500">Token Address</div>
                    <div className="text-zinc-900 font-mono text-xs truncate">{tokenAddress}</div>
                    <div className="text-zinc-500">Your Balance</div>
                    <div className="text-zinc-900 font-medium">
                        {userBalance !== undefined && decimals !== undefined
                            ? formatTokenAmount(userBalance, decimals)
                            : "—"}
                    </div>
                    <div className="text-zinc-500">Network</div>
                    <div className="text-zinc-900 font-medium">{chainNames[chainId] || `Chain ID: ${chainId}`}</div>
                </div>
            ) : (
                <div className="text-sm text-zinc-400 py-2">
                    Enter a token address to see information.
                </div>
            )}
        </div>
    )
}

