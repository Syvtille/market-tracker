import React, { useState, useEffect } from 'react'
import StockCard from './components/StockCard'
import StockChart from './components/StockChart'

function App() {
  const [stockData, setStockData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [symbol, setSymbol] = useState('^GSPC') // SP500 symbol

  const fetchStock = async (stockSymbol) => {
    setLoading(true)
    setError(null)
    try {
      // Use the exposed API from preload
      const data = await window.api.fetchStock(stockSymbol)
      setStockData(data)
    } catch (err) {
      setError('Failed to fetch stock data: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStock(symbol)
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (symbol.trim()) {
      fetchStock(symbol.trim())
    }
  }

  return (
    <div className="app">
      <header className="header">
        <h1>📈 Market Tracker</h1>
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value.toUpperCase())}
            placeholder="Enter symbol (e.g., ^GSPC, AAPL)"
            className="search-input"
          />
          <button type="submit" className="search-button" disabled={loading}>
            {loading ? 'Loading...' : 'Search'}
          </button>
        </form>
      </header>

      <main className="main">
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {loading && !stockData && (
          <div className="loading">
            <div className="spinner"></div>
            <p>Loading market data...</p>
          </div>
        )}

        {stockData && !loading && (
          <>
            <StockCard data={stockData} />
            <StockChart data={stockData} />
          </>
        )}
      </main>

      <footer className="footer">
        <p>Data provided by Yahoo Finance API</p>
      </footer>
    </div>
  )
}

export default App
