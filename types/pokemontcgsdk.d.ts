declare module 'pokemontcgsdk' {
    export interface PokemonTCGSDK {
        configure(configuration: { apiKey: string }): void
        card: {
            find: (id: string) => Promise<Card>
        }
        set: {
            all: (options?: { q?: string }) => Promise<Set[]>
        }
    }

    export interface Card {
        images: {
            large: string
        }
    }

    export interface Set {
        id: string
        name: string
        series: string
        printedTotal: number
        total: number
        legalities: {
            unlimited: string
        }
        ptcgoCode: string
        releaseDate: string
        updatedAt: string
        images: {
            symbol: string
            logo:   string
        }
    }

    const pokemonTCGSDK: PokemonTCGSDK

    export default pokemonTCGSDK
}
