import { Card } from './models/card'
import { generate } from './generate'
import { decklistParser } from './decklist-parser'
import fs from 'fs'
import pokemontcgsdk from 'pokemontcgsdk'

console.log('Proxymon: Pokémon TCG Proxy Deck Generator\n')

async function main() {
    try {
        const rawDecklist = await fs.promises.readFile('./decklist', 'utf8')
        const decklist = await decklistParser(rawDecklist)
        const cards: Card[] = decklist.cards
            .map(card => [card.amount, card.ptcgoio.id, card.name])
        const rawConfiguration = await fs.promises.readFile('./config.json', 'utf8')
        const configuration = JSON.parse(rawConfiguration)
        pokemontcgsdk.configure({ apiKey: configuration.pokemontcgApiKey })
        await generate(configuration, cards)
    } catch (err) {
        console.error(err)
    }
}

main()
