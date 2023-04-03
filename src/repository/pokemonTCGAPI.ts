import fetch from "node-fetch";
import { HeadersInit } from "node-fetch";

export interface SetDto {
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

export interface CardDto {
    images: {
        large: string
    }
}

export interface PokemonTCGAPIRepository {
    sets: () => Promise<SetDto[]>
    card: (id: string) => Promise<CardDto>
}

export function pokemonTCGAPIRepositoryFactory(apiKey: string): PokemonTCGAPIRepository {
    const headers: HeadersInit = {
        'X-Api-Key': apiKey
    }

    return {
        sets: (): Promise<SetDto[]> => fetch(
                'https://api.pokemontcg.io/v2/sets',
                { headers }
            )
            .then(response => response.json())
            .then(({ data }) => data),
        card: (id: string): Promise<CardDto> => fetch(
                `https://api.pokemontcg.io/v2/cards/${id}`,
                { headers }
            )
            .then(response => response.json())
            .then(({ data }) => data),
    }
}
