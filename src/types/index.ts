export type Entity = {
    id: number
    name: string
}

export type ExtractedEntities = {
    city?: Entity
    brand?: Entity
    dishType?: Entity
    diet?: Entity
}

export type ModelName = 'city' | 'brand' | 'dishType' | 'diet'
