import { describe, it, expect, vi, beforeEach } from 'vitest'
import { StockService } from '../main/services/StockService'

// Mock Data
const MOCK_QUOTE = {
    symbol: 'AAPL',
    longName: 'Apple Inc.',
    regularMarketPrice: 150.00,
    regularMarketChange: 2.50,
    regularMarketChangePercent: 1.69,
    regularMarketPreviousClose: 147.50,
    regularMarketOpen: 148.00,
    regularMarketDayHigh: 151.00,
    regularMarketDayLow: 147.00,
    regularMarketVolume: 50000000,
    marketCap: 2500000000000
}

const MOCK_HISTORY = {
    quotes: [
        { date: new Date('2023-01-01'), close: 140, open: 139, high: 141, low: 138 },
        { date: new Date('2023-01-02'), close: 142, open: 140, high: 143, low: 139 },
        { date: new Date('2023-01-03'), close: null } // Invalid point to test filtering
    ]
}

describe('StockService', () => {
    let service
    let mockClient

    beforeEach(() => {
        // Mock the YahooFinance client dependency
        mockClient = {
            quote: vi.fn(),
            chart: vi.fn()
        }
        service = new StockService(mockClient)
    })

    it('should fetch and format stock data correctly', async () => {
        mockClient.quote.mockResolvedValue(MOCK_QUOTE)
        mockClient.chart.mockResolvedValue(MOCK_HISTORY)

        const result = await service.fetchStockData('AAPL')

        // Verify DTO shape
        expect(result.symbol).toBe('AAPL')
        expect(result.name).toBe('Apple Inc.')
        expect(result.price).toBe(150.00)
        expect(result.history).toHaveLength(2) // Should filter out the null close
        expect(result.history[0].close).toBe(140)
    })

    it('should throw an error if symbol is missing', async () => {
        await expect(service.fetchStockData('')).rejects.toThrow('symbol is required')
    })

    it('should throw a friendly error if stock is not found', async () => {
        mockClient.quote.mockResolvedValue(null) // Simulate not found
        mockClient.chart.mockResolvedValue({})

        await expect(service.fetchStockData('INVALID')).rejects.toThrow('Stock not found')
    })

    it('should handle API errors gracefully', async () => {
        mockClient.quote.mockRejectedValue(new Error('Network Error'))

        await expect(service.fetchStockData('AAPL')).rejects.toThrow('Network Error')
    })

    it('should handle missing history gracefully', async () => {
        mockClient.quote.mockResolvedValue(MOCK_QUOTE)
        mockClient.chart.mockResolvedValue(null)

        const result = await service.fetchStockData('AAPL')
        expect(result.history).toEqual([])
    })
})
