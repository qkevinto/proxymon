import fetch from 'node-fetch'
import ProgressBar from 'progress'
import { Card } from './models/card'
import { SetCodes } from './models/set-codes'
import { CardDto, PokemonTCGAPIRepository } from './repository/pokemonTCGAPI'

const cardCache: { [id: string]: CardDto } = {}
const imageCache: { [url: string]: Buffer } = {}

export function mm(value: number): number {
    return value * 2.834645669
}

async function getCardWithCache(pokemonTCGAPIRepository: PokemonTCGAPIRepository, id: string): Promise<CardDto> {
    const cached = cardCache[id]
    if (!!cached) {
        return Promise.resolve(cached)
    } else {
        const card = await pokemonTCGAPIRepository.card(id)
        if (!card) {
            throw Error(`Error not loading ${id}`)
        }
        cardCache[id] = card
        return card
    }
}

async function getImageWithCache(imageUrl: string): Promise<Buffer> {
    const cached = imageCache[imageUrl]
    if (!!cached) {
        return Promise.resolve(cached)
    } else {
        const image = await fetch(imageUrl)
        if (!image) {
            throw Error(`Error loading ${imageUrl}`)
        }
        const bufferArray = await image.arrayBuffer()
        const buffer = Buffer.from(bufferArray)
        imageCache[imageUrl] = buffer
        return buffer
    }
}

async function getCardImage(pokemonTCGAPIRepository: PokemonTCGAPIRepository, id: string, onError?: (id: string) => void): Promise<Buffer | undefined> {
    try {
        const card = await getCardWithCache(pokemonTCGAPIRepository, id)
        const imageUrl = card?.images?.large
        return getImageWithCache(imageUrl)
    } catch(error) {
        if (!!onError) {
            onError(id)
        }
        return Promise.resolve(undefined);
    }
}

export async function getDeckImages(pokemonTCGAPIRepository: PokemonTCGAPIRepository, cards: string[]): Promise<Buffer[]> {
    const bar = new ProgressBar('Downloading images [:bar] :current/:total :etas', {
        total: cards.length,
        width: 20,
    })

    const resolvedImages: Buffer[] = []

    for (const card of cards) {
        const image = await getCardImage(pokemonTCGAPIRepository, card, id => {
            bar.interrupt(`Error loading ${id}`)
        })
        bar.tick()
        if (!!image) {
            resolvedImages.push(image)
        }
    }

    return resolvedImages
}

export function createDeck(cards: Card[]): string[] {
    const flattenedCards = cards.map(({ amount, id }) => Array(amount).fill(id))
    return flattenedCards.flatMap(cards => cards)
}

export async function getSetCodes(pokemonTCGAPIRepository: PokemonTCGAPIRepository): Promise<SetCodes> {
    const sets = await pokemonTCGAPIRepository.sets()
    const setCodes = sets.reduce((prev, curr) => {
        let ptcgoCode = curr.ptcgoCode

        // Temporarily patch in missing ptcgoCode from the API data
        if (curr.id === 'sv1') {
            ptcgoCode = 'SVI'
        }

        prev[ptcgoCode] = curr.id

        return prev
    }, <SetCodes>{})

    return setCodes
}

export function logDeckContents(cards: Card[]): void {
    const totalCards = cards.reduce((prev, curr) => prev + curr.amount, 0)
    console.log(`Generating proxy deck with ${totalCards} cards:`)
    cards.forEach(({ amount, id, name }) => {
        console.log(`${amount}x ${name} (${id})`)
    })
    console.log()
}
