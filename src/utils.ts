import fetch from 'node-fetch'
import ProgressBar from 'progress'
import pokemontcgsdk from 'pokemontcgsdk'
import { Card } from './models/card'
import { SetCodes } from './models/set-codes'

export function mm(value: number): number {
    return value * 2.834645669
}

async function imageAsBuffer(imageUrl: string): Promise<Buffer> {
    const image = await fetch(imageUrl)
    const imageBuffer = await image.arrayBuffer()
    return Buffer.from(imageBuffer)
}

async function getCardImage(id: string): Promise<Buffer> {
    const card = await pokemontcgsdk.card.find(id)
    const imageUrl = card.images.large
    return await imageAsBuffer(imageUrl)
}

export async function getDeckImages(cards: string[]): Promise<Buffer[]> {
    const images = cards.map(card => getCardImage(card))
    const bar = new ProgressBar('Downloading images [:bar] :current/:total :etas', {
        total: images.length,
        width: 20,
    })
    images.forEach(image => image.then(() => bar.tick()))
    return await Promise.all(images)
}

export function createDeck(groupedCards: Card[]): string[] {
    const allCards = groupedCards.map(([count, id]) => Array(count).fill(id))
    return allCards.flatMap(cards => cards)
}

export async function getSetCodes(): Promise<SetCodes> {
    const sets = await pokemontcgsdk.set.all()
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
