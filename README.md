# Proxymon

## Description

Tool to generate a Pokémon TCG proxy deck as a printable PDF

## Installation

```
npm install
```

## Usage

1. Create a `config.json` file in the root of the project, **without the comments as comments are not allowed in `json` files**:

    ```
    {
        // Your API key from https://dev.pokemontcg.io
        "pokemontcgApiKey": "xxxx",
        // Size for the pages of the PDF in millimeters, this is A3
        "pageSize": {
            "width": 297,
            "height": 420
        },
        // Size for the cards in millimeters, this is the actual size
        "cardSize": {
            "width": 63,
            "height": 88
        },
        "layout": {
            // Margin around the page in millimeters
            "margin": 10,
            // Gap between each card in millimeters
            "cardGap": 0.5
        },
        // List of cards formatted as:
        // [count, id, name]
        // - `count`: count of the same card
        // - `id`: id for the card, this can be found by using
        //   https://pokemontcg.guru, search for the card, go to the card's page
        //   and the `id` will at the end of the URL:
        //   https://pokemontcg.guru/card/ice-rider-calyrex-vmax-sword-and-shield/swsh6-46
        // - `name`: only used for display purposes
        "cards": [
            [3, "swsh6-46", "Ice Rider Calyrex VMAX"],
            [3, "swsh6-45", "Ice Rider Calyrex V"],
            [2, "swsh6-43", "Inteleon"],
            [2, "swsh1-58", "Inteleon"],
            [4, "swsh1-56", "Drizzile"],
            [4, "swsh6-41", "Sobble"],
            [2, "swsh1-156", "Air Balloon"],
            [3, "swsh45-58", "Boss's Orders [Lysandre]"],
            [3, "swsh2-156", "Capacious Bucket"],
            [3, "swsh1-163", "Evolution Incense"],
            [4, "swsh5-129", "Level Ball"],
            [2, "swsh1-169", "Marnie"],
            [4, "swsh6-146", "Melony"],
            [4, "swsh6-148", "Path to the Peak"],
            [2, "swsh45-60", "Professor's Research [Professor Juniper]"],
            [4, "swsh1-179", "Quick Ball"],
            [2, "swsh1-183", "Switch"],
            [9, "swsh6-231", "Water Energy"]
        ]
    }
    ```
1. Run `npm build`
1. Run `npm run`
