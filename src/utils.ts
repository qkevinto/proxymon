import fetch from 'node-fetch'
import ProgressBar from 'progress'
import { Card } from './models/card'
import { SetCodes } from './models/set-codes'
import { PokemonTCGAPIRepository } from './repository/pokemonTCGAPI'

export function mm(value: number): number {
    return value * 2.834645669
}

async function getCardImage(pokemonTCGAPIRepository: PokemonTCGAPIRepository, id: string, onError?: (id: string) => void): Promise<Buffer | undefined> {
    try {
        const card = await pokemonTCGAPIRepository.card(id)
        const imageUrl = card?.images?.large
        const image = await fetch(imageUrl)
        const imageBuffer = await image.arrayBuffer()
        return Buffer.from(imageBuffer)
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
    const images = cards.map(card => getCardImage(pokemonTCGAPIRepository, card, id => {
        bar.interrupt(`Error loading ${id}`)
    }))
    images.forEach(image => image.then(() => bar.tick()))
    const resolvedImages = await Promise.all(images)
    return resolvedImages.filter(image => !!image) as Buffer[]
}

export function createDeck(cards: Card[]): string[] {
    const flattenedCards = cards.map(({ amount, id }) => Array(amount).fill(id))
    return flattenedCards.flatMap(cards => cards)
}

export async function getSetCodes(pokemonTCGAPIRepository: PokemonTCGAPIRepository): Promise<SetCodes> {
    const sets = await pokemonTCGAPIRepository.sets()
    const filteredSets = sets.filter(set => !set.id.includes('tg'))
    const decklist = filteredSets.reduce((prev, curr) => {
        let ptcgoCode = curr.ptcgoCode

        // Temporarily patch in missing ptcgoCode from the API data
        if (curr.id === 'sv1') {
            ptcgoCode = 'SVI'
        }

        prev[ptcgoCode] = curr.id

        return prev
    }, <SetCodes>{})

    return decklist
}

export function logDeckContents(cards: Card[]): void {
    const totalCards = cards.reduce((prev, curr) => prev + curr.amount, 0)
    console.log(`Generating proxy deck with ${totalCards} cards:`)
    cards.forEach(({ amount, id, name }) => {
        console.log(`${amount}x ${name} (${id})`)
    })
    console.log()
}
