declare module 'pokemontcgsdk' {
    export interface PokemonTCGSDK {
        configure(configuration: { apiKey: string }): void
        card: {
            find: (id: string) => Promise<Card>
        }
    }

    const pokemonTCGSDK: PokemonTCGSDK

    export default pokemonTCGSDK
}

declare interface Card {
    images: {
        large: string
    }
}

