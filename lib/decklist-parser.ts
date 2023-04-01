// Copyright 2019 Juha-Matti Santala
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

import { ParsedCard } from './models/parsed-card'
import { ParsedDecklist } from './models/parsed-decklist'
import { getSetCodes } from './utils'

const SET_PATTERN = /(?:\* )?(\d+) (.*) ([A-Z]{2,3}|[A-Z]{2}-[A-Z]{2}|[A-Z0-9]{3})? (\d+|XY\d+|BW\d+)/
const BASIC_ENERGY_PATTERN = /(?:\* )?(\d+) Basic ({D}|{F}|{R}|{G}|{L}|{M}|{P}|{W}) Energy.*/

const BASIC_ENERGY_TYPES = [
    '{D}',
    '{F}',
    '{R}',
    '{G}',
    '{L}',
    '{M}',
    '{P}',
    '{W}',
]

const BASIC_ENERGY_IDS: { [key: string]: string } = {
    '{D}': 'sm1-170',
    '{F}': 'sm1-169',
    '{R}': 'sm1-165',
    '{G}': 'sm1-164',
    '{L}': 'sm1-167',
    '{M}': 'sm1-171',
    '{P}': 'sm1-168',
    '{W}': 'sm1-166',
}

const isBasicEnergy = (row: string): boolean => {
    return (
        BASIC_ENERGY_TYPES.map(energy => row.includes(`${energy} Energy`)).filter(
            c => c
        ).length > 0
    )
}

const parseRow = (row: string): string[] | null => {
    let result = null
    if (isBasicEnergy(row)) {
        result = row.match(BASIC_ENERGY_PATTERN)
    } else {
        result = row.match(SET_PATTERN)
    }
    return result && result.slice(1)
}

export const decklistParser = async (decklist: string): Promise<ParsedDecklist> => {
    const setcodes = await getSetCodes()

    const cards: ParsedCard[] = decklist
        .split('\n')
        .map(row => {
            const card = parseRow(row)
            if (card) {
                const [amount, name, set, code] = card
                let promoSet = null
                let isEnergy = false

                if (set && set.startsWith('PR')) {
                    promoSet = set.split('-')[1]
                }

                if (BASIC_ENERGY_TYPES.indexOf(name) >= 0) {
                    isEnergy = true
                }

                return {
                    amount: parseInt(amount),
                    name: isEnergy ? `${name} Energy` : name,
                    set,
                    code,
                    ptcgoio: {
                        id: promoSet
                            ? `${setcodes[set]}-${promoSet}${code}`
                            : isEnergy
                                ? `${BASIC_ENERGY_IDS[name]}`
                                : `${setcodes[set]}-${code}`,
                    },
                }
            }
        })
        .filter(c => c) as ParsedCard[]

    return { cards }
}
