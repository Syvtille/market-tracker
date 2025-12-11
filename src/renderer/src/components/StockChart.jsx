import React from 'react'

function StockChart({ data }) {
    if (!data.history || data.history.length === 0) {
        return <div className="chart-container">No historical data available</div>
    }

    const prices = data.history.map(d => d.close)
    const maxPrice = Math.max(...prices)
    const minPrice = Math.min(...prices)
    const priceRange = maxPrice - minPrice

    const getY = (price) => {
        const normalized = (price - minPrice) / priceRange
        return 100 - (normalized * 100)
    }

    const points = data.history.map((point, index) => {
        const x = (index / (data.history.length - 1)) * 100
        const y = getY(point.close)
        return `${x},${y}`
    }).join(' ')

    const firstPrice = data.history[0].close
    const lastPrice = data.history[data.history.length - 1].close
    const chartColor = lastPrice >= firstPrice ? '#22c55e' : '#ef4444'

    return (
        <div className="chart-container">
            <h3>30-Day Price History</h3>
            <div className="chart-stats">
                <div>
                    <span className="chart-label">High:</span>
                    <span className="chart-value">${maxPrice.toFixed(2)}</span>
                </div>
                <div>
                    <span className="chart-label">Low:</span>
                    <span className="chart-value">${minPrice.toFixed(2)}</span>
                </div>
            </div>
            <svg className="chart-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
                <polyline
                    fill="none"
                    stroke={chartColor}
                    strokeWidth="0.5"
                    points={points}
                />
            </svg>
            <div className="chart-dates">
                <span>{new Date(data.history[0].date).toLocaleDateString()}</span>
                <span>{new Date(data.history[data.history.length - 1].date).toLocaleDateString()}</span>
            </div>
        </div>
    )
}

export default StockChart
