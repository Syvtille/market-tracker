import pkg from 'yahoo-finance2'

// Robustly handle the import to get the Class constructor
const YahooFinance = pkg.default || pkg
const client = new YahooFinance()

/**
 * @typedef {Object} StockData
 * @property {string} symbol
 * @property {string} name
 * @property {number} price
 * @property {number} change
 * @property {number} changePercent
 * @property {number} previousClose
 * @property {number} open
 * @property {number} dayHigh
 * @property {number} dayLow
 * @property {number} volume
 * @property {number} [marketCap]
 * @property {HistoryPoint[]} history
 */

/**
 * @typedef {Object} HistoryPoint
 * @property {Date} date
 * @property {number} close
 * @property {number} open
 * @property {number} high
 * @property {number} low
 */

export class StockService {
    constructor(diClient) {
        this.client = diClient || client
    }

    /**
     * Fetch stock data for a given symbol
     * @param {string} symbol
     * @returns {Promise<StockData>}
     * @throws {Error} consistently formatted error
     */
    async fetchStockData(symbol) {
        if (!symbol) {
            throw new Error('Stock symbol is required')
        }

        try {
            // Parallelize requests for better performance
            const [quote, history] = await Promise.all([
                this.runQuote(symbol),
                this.runChart(symbol)
            ])

            if (!quote) {
                throw new Error(`Stock not found: ${symbol}`)
            }

            return this._formatStockData(quote, history)
        } catch (error) {
            // Enhance error message for UI
            console.error(`StockService Error [${symbol}]:`, error.message)
            if (error.message.includes('Not Found') || error.message.includes('404')) {
                throw new Error(`Symbol '${symbol}' not found.`)
            }
            throw error
        }
    }

    async runQuote(symbol) {
        return await this.client.quote(symbol)
    }

    async runChart(symbol) {
        // 30 days history
        const period1 = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        return await this.client.chart(symbol, {
            period1,
            interval: '1d'
        })
    }

    /**
     * Mapper: API Response -> Domain Model (DTO)
     * This ensures the UI always receives a consistent shape, regardless of API changes.
     * @private
     */
    _formatStockData(quote, history) {
        return {
            symbol: quote.symbol,
            name: quote.longName || quote.shortName || quote.symbol,
            price: quote.regularMarketPrice || 0,
            change: quote.regularMarketChange || 0,
            changePercent: quote.regularMarketChangePercent || 0,
            previousClose: quote.regularMarketPreviousClose || 0,
            open: quote.regularMarketOpen || 0,
            dayHigh: quote.regularMarketDayHigh || 0,
            dayLow: quote.regularMarketDayLow || 0,
            volume: quote.regularMarketVolume || 0,
            marketCap: quote.marketCap,
            history: this._formatHistory(history)
        }
    }

    /**
     * @private
     */
    _formatHistory(history) {
        if (!history || !history.quotes) {
            return []
        }

        return history.quotes
            .filter(q => q.close !== null && q.close !== undefined)
            .map(q => ({
                date: q.date,
                close: q.close,
                open: q.open,
                high: q.high,
                low: q.low
            }))
    }
}

const service = new StockService()
export default service
