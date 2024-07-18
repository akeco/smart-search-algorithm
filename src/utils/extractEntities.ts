import { stopwords } from '../constants/stopwords'
import { fetchEntities } from '../services/entityService'
import { ExtractedEntities } from '../types'

// Helper function to generate all combinations of entities
const generateCombinations = (
    terms: string[],
    entitiesByTerm: { [term: string]: ExtractedEntities[] }
): ExtractedEntities[] => {
    const results: ExtractedEntities[] = []

    // Recursive function to combine entities
    const combine = (index: number, current: ExtractedEntities[]) => {
        if (index >= terms.length) {
            results.push(...current)
            return
        }

        const term = terms[index]
        const entities = entitiesByTerm[term]

        if (!entities || entities.length === 0) {
            combine(index + 1, current)
            return
        }

        const newCombinations: ExtractedEntities[] = []

        // Process each term's entities
        for (const entity of entities) {
            const entityType = Object.keys(entity)[0]

            // Combine with existing combinations
            for (const existing of current) {
                if (!(existing as any)[entityType]) {
                    newCombinations.push({ ...existing, ...entity })
                } else {
                    newCombinations.push(existing)
                }
            }

            // Start new combinations if none exist
            if (current.length === 0) {
                newCombinations.push({ ...entity })
            }
        }

        combine(index + 1, newCombinations)
    }

    combine(0, [{}])
    return results
}

export const extractEntities = async (
    searchTerm: string
): Promise<ExtractedEntities[]> => {
    if (!searchTerm) return []

    // Split search term into individual terms and filter out stopwords
    const terms = searchTerm
        .split(' ')
        .filter((term) => !stopwords.includes(term.toLowerCase()))

    // Map to store entities for each term
    const entitiesByTerm: { [term: string]: ExtractedEntities[] } = {}

    // Fetch entities for each term and organize them
    for (const term of terms) {
        const [cities, brands, dishTypes, diets] = await Promise.all([
            fetchEntities('city', term),
            fetchEntities('brand', term),
            fetchEntities('dishType', term),
            fetchEntities('diet', term),
        ])

        entitiesByTerm[term] = [
            ...cities.map((city) => ({ city })),
            ...brands.map((brand) => ({ brand })),
            ...dishTypes.map((dishType) => ({ dishType })),
            ...diets.map((diet) => ({ diet })),
        ]
    }

    console.log('entitiesByTerm', entitiesByTerm)

    // Generate all combinations of entities
    const results = generateCombinations(terms, entitiesByTerm)

    // Remove duplicates
    const uniqueResults = results.filter(
        (value, index, self) =>
            index ===
            self.findIndex((t) => JSON.stringify(t) === JSON.stringify(value))
    )

    return uniqueResults
}
