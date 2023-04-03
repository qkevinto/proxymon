import PDFDocument from 'pdfkit'
import { getDeckImages, logDeckContents, mm } from './utils.js'
import fs from 'fs'
import { Configuration } from './models/configuration.js'
import path from 'path'
import { Card } from './models/card.js'
import { PokemonTCGAPIRepository } from './repository/pokemonTCGAPI.js'

export async function generate(pokemonTCGAPIRepository: PokemonTCGAPIRepository, configuration: Configuration, cards: Card[]) {
    logDeckContents(cards);

    const images = await getDeckImages(pokemonTCGAPIRepository, cards)
    const margin = mm(configuration.layout.margin)
    const gap = mm(configuration.layout.cardGap)

    const pageSize = {
        width: mm(configuration.pageSize.width),
        height: mm(configuration.pageSize.height)
    }
    const cardSize = {
        width: mm(configuration.cardSize.width),
        height: mm(configuration.cardSize.height)
    }

    const maxX = pageSize.width - margin
    const maxY = pageSize.height - margin

    let currentX = 0
    let currentY = 0

    const pdfFileName = 'proxymon.pdf'
    const outputDir = './output'
    const outputPath = path.join(outputDir, pdfFileName)

    currentX += margin
    currentY += margin

    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true })
    }

    console.log(`Writing PDF to '${outputPath}'...`)
    const doc = new PDFDocument({ autoFirstPage: false })
    doc.addPage({
        size: [pageSize.width, pageSize.height]
    })
    images.forEach(image => {
        if (currentX + cardSize.width > maxX) {
            currentX = margin
            currentY += cardSize.height + gap
        }

        if (currentY + cardSize.height > maxY) {
            doc.addPage({
                size: [pageSize.width, pageSize.height]
            })
            currentY = margin
        }

        doc.image(image, currentX, currentY, { width: cardSize.width })
        currentX += cardSize.width + gap
    })
    doc.pipe(fs.createWriteStream(outputPath))
    doc.end()
}
