import { Card } from './models/card'
import { generate } from './generate'
import { decklistParser } from './decklist-parser'
import fs from 'fs'
import { pokemonTCGAPIRepositoryFactory } from './repository/pokemonTCGAPI'
import { Configuration } from './models/configuration'
import { getDeckImages, logDeckContents } from './utils'

console.log('Proxymon: Pokémon TCG Proxy Deck Generator\n')

async function main() {
    try {
        const rawConfiguration = await fs.promises.readFile('./config.json', 'utf8')
        const configuration: Configuration = JSON.parse(rawConfiguration)
        const pokemonTCGAPIRepository = pokemonTCGAPIRepositoryFactory(configuration.pokemontcgApiKey)

        const rawDecklist = await fs.promises.readFile('./decklist', 'utf8')
        const decklist = await decklistParser(pokemonTCGAPIRepository, rawDecklist)
        const cards: Card[] = decklist.cards
            .map(card => ({ amount: card.amount, id: card.ptcgoio.id, name: card.name }))
        const images = await getDeckImages(pokemonTCGAPIRepository, cards)

        logDeckContents(cards)

        await generate(configuration, images)
    } catch (err) {
        console.error(err)
    }
}

main()
