import React from 'react'

function StockCard({ data }) {
    const isPositive = data.change >= 0
    const changeColor = isPositive ? '#22c55e' : '#ef4444'

    const formatNumber = (num) => {
        if (!num) return 'N/A'
        return num.toLocaleString('en-US', { maximumFractionDigits: 2 })
    }

    const formatLargeNumber = (num) => {
        if (!num) return 'N/A'
        if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`
        if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`
        if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`
        return `$${formatNumber(num)}`
    }

    return (
        <div className="stock-card">
            <div className="stock-header">
                <div>
                    <h2 className="stock-symbol">{data.symbol}</h2>
                    <p className="stock-name">{data.name}</p>
                </div>
                <div className="stock-price-section">
                    <div className="stock-price">${formatNumber(data.price)}</div>
                    <div className="stock-change" style={{ color: changeColor }}>
                        {isPositive ? '▲' : '▼'} {formatNumber(Math.abs(data.change))}
                        ({isPositive ? '+' : ''}{data.changePercent?.toFixed(2)}%)
                    </div>
                </div>
            </div>

            <div className="stock-stats">
                <div className="stat-item">
                    <span className="stat-label">Open</span>
                    <span className="stat-value">${formatNumber(data.open)}</span>
                </div>
                <div className="stat-item">
                    <span className="stat-label">Previous Close</span>
                    <span className="stat-value">${formatNumber(data.previousClose)}</span>
                </div>
                <div className="stat-item">
                    <span className="stat-label">Day High</span>
                    <span className="stat-value">${formatNumber(data.dayHigh)}</span>
                </div>
                <div className="stat-item">
                    <span className="stat-label">Day Low</span>
                    <span className="stat-value">${formatNumber(data.dayLow)}</span>
                </div>
                <div className="stat-item">
                    <span className="stat-label">Volume</span>
                    <span className="stat-value">{formatNumber(data.volume)}</span>
                </div>
                {data.marketCap && (
                    <div className="stat-item">
                        <span className="stat-label">Market Cap</span>
                        <span className="stat-value">{formatLargeNumber(data.marketCap)}</span>
                    </div>
                )}
            </div>
        </div>
    )
}

export default StockCard
