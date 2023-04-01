import fetch from 'node-fetch'
import ProgressBar from 'progress'
import { PokemonTCGSDK } from 'pokemontcgsdk'
import { Card } from './models/card'
import fs from 'fs'
import { TCGSet } from './models/tcg-set';
import { SetCodes } from './models/set-codes';

export function mm(value: number): number {
    return value * 2.834645669
}

async function imageAsBuffer(imageUrl: string): Promise<Buffer> {
    const image = await fetch(imageUrl)
    const imageBuffer = await image.arrayBuffer()
    return Buffer.from(imageBuffer)
}

async function getCardImage(id: string, pokemontcgsdk: PokemonTCGSDK): Promise<Buffer> {
    const card = await pokemontcgsdk.card.find(id)
    const imageUrl = card.images.large
    return await imageAsBuffer(imageUrl)
}

export async function getDeckImages(cards: string[], pokemontcgsdk: PokemonTCGSDK): Promise<Buffer[]> {
    const images = cards.map(card => getCardImage(card, pokemontcgsdk))
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
    const data = await fs.promises.readFile('./data/sets.json', 'utf8')
    const sets: TCGSet[] = JSON.parse(data);
    const filteredSets = sets.filter(set => !set.id.includes('tg'))
    const decklist = filteredSets.reduce((prev, curr) => {
        prev[curr.ptcgoCode] = curr.id

        return prev
    }, <SetCodes>{})

    return decklist
}
