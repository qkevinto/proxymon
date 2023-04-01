import PDFDocument from 'pdfkit'
import { createDeck, getDeckImages, mm } from './utils.js'
import fs from 'fs'
import pokemontcgsdk from 'pokemontcgsdk'
import { Configuration } from './configuration.js'
import path from 'path'

export async function generate(configuration: Configuration) {
    pokemontcgsdk.configure({ apiKey: configuration.pokemontcgApiKey })
    const deck = createDeck(configuration.cards)

    console.log(`Generating proxy deck with ${deck.length} cards:`)
    configuration.cards.forEach(([count, id, name]) => {
        console.log(`${count}x ${name} (${id})`)
    })
    console.log()

    const images = await getDeckImages(deck, pokemontcgsdk)
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
