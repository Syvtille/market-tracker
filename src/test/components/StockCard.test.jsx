import React from 'react'
import { render, screen } from '@testing-library/react'
import StockCard from '../renderer/src/components/StockCard'

const MOCK_DATA = {
    symbol: 'TSLA',
    name: 'Tesla Inc',
    price: 900.50,
    change: -12.30,
    changePercent: -1.25,
    open: 910.00,
    previousClose: 912.80,
    dayHigh: 915.00,
    dayLow: 890.00,
    volume: 10000000,
    marketCap: 900000000000
}

describe('StockCard Component', () => {
    it('renders stock information correctly', () => {
        render(<StockCard data={MOCK_DATA} />)

        expect(screen.getByText('TSLA')).toBeInTheDocument()
        expect(screen.getByText('Tesla Inc')).toBeInTheDocument()
        expect(screen.getByText('$900.50')).toBeInTheDocument()
    })

    it('renders change with correct color (negative)', () => {
        render(<StockCard data={MOCK_DATA} />)

        const changeElement = screen.getByText(/▼ 12.30/)
        expect(changeElement).toBeInTheDocument()
    })

    it('handles N/A values gracefully', () => {
        const emptyData = { ...MOCK_DATA, price: undefined }
        render(<StockCard data={emptyData} />)

        expect(screen.getByText('N/A')).toBeInTheDocument()
    })
})
