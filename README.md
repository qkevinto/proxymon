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
        }
    }
    ```
1. Create a `decklist` file using the standard TCGO/L export deck list format, for example:
    ```
    Pokémon: 10
    2 Altaria EVS 106
    1 Pyukumuku FST 77
    2 Serperior VSTAR SIT 8
    1 Kricketune V BST 6
    4 Swablu EVS 132
    1 Kricketune ASR 10
    1 Manaphy BRS 41
    1 Kricketot ASR 9
    2 Serperior V SIT 7
    2 Altaria SIT 143

    Trainer: 13
    4 Ultra Ball SVI 196
    1 Raihan EVS 152
    2 Switch SVI 194
    4 Professor's Research SVI 190
    3 Jacq SVI 175
    4 Level Ball BST 129
    1 Avery CRE 130
    1 Worker SIT 167
    2 Leafy Camo Poncho SIT 160
    2 Gardenia's Vigor ASR 143
    1 Roxanne ASR 150
    4 Nest Ball SVI 181
    2 Boss's Orders BRS 132

    Energy: 2
    8 Basic {G} Energy SVE 1
    4 Double Turbo Energy BRS 151

    Total Cards: 60
    ```
1. Run `npm run build`
1. Run `npm run generate`
