export interface Configuration {
    pokemontcgApiKey: string
    pageSize: {
        width: number
        height: number

    }
    cardSize: {
        width: number
        height: number
    }
    layout: {
        margin: number
        cardGap: number
    }
    cards: [number, string, string][]
}
