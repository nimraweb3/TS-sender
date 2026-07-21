"use client"

import { useAccount, useChainId, useReadContracts } from "wagmi"
import { CgSpinner } from "react-icons/cg"
import { erc20Abi } from "@/constants"
import { formatTokenAmount } from "@/utils"

interface TokenDetailsBoxProps {
    tokenAddress: string
}

const ETHERSCAN_PREFIXES: Record<number, string> = {
    1: "https://etherscan.io/token/",
    10: "https://optimistic.etherscan.io/token/",
    42161: "https://arbiscan.io/token/",
    8453: "https://basescan.org/token/",
    11155111: "https://sepolia.etherscan.io/token/",
    31337: "",
}

export default function TokenDetailsBox({ tokenAddress }: TokenDetailsBoxProps) {
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
            {
                abi: erc20Abi,
                address: tokenAddress as `0x${string}`,
                functionName: "totalSupply",
            },
        ],
        query: {
            enabled: tokenAddress.length === 42 && tokenAddress.startsWith("0x"),
        },
    })

    if (!tokenAddress) return null

    const decimals = tokenData?.[0]?.result as number | undefined
    const name = tokenData?.[1]?.result as string | undefined
    const userBalance = tokenData?.[2]?.result as bigint | undefined
    const symbol = tokenData?.[3]?.result as string | undefined
    const totalSupply = tokenData?.[4]?.result as bigint | undefined

    const explorerPrefix = ETHERSCAN_PREFIXES[chainId] || ""

    return (
        <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-3">
                Token Details
            </h3>
            {isLoading ? (
                <div className="flex items-center gap-2 text-zinc-500 py-2">
                    <CgSpinner className="animate-spin" size={18} />
                    <span className="text-sm">Loading token details...</span>
                </div>
            ) : error ? (
                <div className="text-sm text-red-500 py-2">
                    Failed to load token details. The address may be invalid.
                </div>
            ) : name ? (
                <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center">
                        <span className="text-zinc-500">Contract Address</span>
                        <span className="text-zinc-900 font-mono text-xs truncate ml-4 max-w-[250px]">
                            {tokenAddress}
                        </span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-zinc-500">Name</span>
                        <span className="text-zinc-900 font-medium">{name}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-zinc-500">Symbol</span>
                        <span className="text-zinc-900 font-medium">{symbol || "—"}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-zinc-500">Decimals</span>
                        <span className="text-zinc-900 font-medium">{decimals ?? "—"}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-zinc-500">Total Supply</span>
                        <span className="text-zinc-900 font-medium">
                            {totalSupply !== undefined && decimals !== undefined
                                ? formatTokenAmount(totalSupply, decimals)
                                : "—"}
                        </span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-zinc-500">Your Balance</span>
                        <span className="text-zinc-900 font-medium">
                            {userBalance !== undefined && decimals !== undefined
                                ? formatTokenAmount(userBalance, decimals)
                                : "—"}
                        </span>
                    </div>
                    {explorerPrefix && (
                        <div className="pt-2 border-t border-zinc-100">
                            <a
                                href={`${explorerPrefix}${tokenAddress}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 hover:text-blue-600 text-xs font-medium"
                            >
                                View on Explorer ↗
                            </a>
                        </div>
                    )}
                </div>
            ) : (
                <div className="text-sm text-zinc-400 py-2">
                    Enter a token address above to see details.
                </div>
            )}
        </div>
    )
}

