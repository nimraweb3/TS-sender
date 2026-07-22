import { formatUnits } from "viem"

export function formatTokenAmount(
    weiAmount: bigint,
    decimals: number
): string {
    const formatted = Number(formatUnits(weiAmount, decimals))

    return formatted.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })
}