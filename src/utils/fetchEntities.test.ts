import { extractEntities } from './extractEntities'
import { fetchEntities } from '../services/entityService'

jest.mock('../services/entityService', () => ({
    fetchEntities: jest.fn().mockResolvedValue([]),
}))

describe('extractEntities', () => {
    afterEach(() => {
        jest.clearAllMocks()
    })

    it('should return empty array for empty search term', async () => {
        const result = await extractEntities('')
        expect(result).toEqual([])
        expect(fetchEntities).not.toHaveBeenCalled()
    })

    it('should extract entities for a valid search term', async () => {
        ;(fetchEntities as jest.Mock).mockResolvedValueOnce([
            { id: 1, name: 'London' },
        ])
        ;(fetchEntities as jest.Mock).mockResolvedValueOnce([
            { id: 4, name: "McDonald's" },
        ])
        ;(fetchEntities as jest.Mock).mockResolvedValueOnce([
            { id: 72, name: 'Sushi' },
        ])
        ;(fetchEntities as jest.Mock).mockResolvedValueOnce([
            { id: 1, name: 'Vegan' },
        ])

        const result = await extractEntities('vegan sushi in London')

        expect(result).toEqual([
            { city: { id: 1, name: 'London' } },
            { brand: { id: 4, name: "McDonald's" } },
            { dishType: { id: 72, name: 'Sushi' } },
            { diet: { id: 1, name: 'Vegan' } },
        ])
        expect(fetchEntities).toHaveBeenCalledTimes(12)
    })

    it('should filter out stopwords from search term', async () => {
        ;(fetchEntities as jest.Mock).mockResolvedValue([])

        const result = await extractEntities('vegan sushi in London')
        expect(fetchEntities).toHaveBeenCalledWith('diet', 'vegan')
        expect(fetchEntities).toHaveBeenCalledWith('dishType', 'sushi')
        expect(fetchEntities).toHaveBeenCalledWith('city', 'London')
        expect(fetchEntities).not.toHaveBeenCalledWith('city', 'in')
        expect(fetchEntities).not.toHaveBeenCalledWith('dishType', 'in')
    })
})
