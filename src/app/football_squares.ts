export type FootballSquares = {
    "address": "GPTwcAkHNkPNYJA6enZxAuqZLbW9UZaakefwUpyfPyMZ",
    "metadata": {
      "name": "footballSquares",
      "version": "0.1.0",
      "spec": "0.1.0"
    },
    "instructions": [
      {
        "name": "createBoard",
        "discriminator": [
          81,
          129,
          130,
          38,
          99,
          204,
          224,
          177
        ],
        "accounts": [
          {
            "name": "board",
            "writable": true,
            "signer": true
          },
          {
            "name": "user",
            "writable": true,
            "signer": true
          },
          {
            "name": "systemProgram"
          }
        ],
        "args": [
          {
            "name": "entryFee",
            "type": "u64"
          },
          {
            "name": "payoutStructure",
            "type": "bytes"
          },
          {
            "name": "acceptedToken",
            "type": "pubkey"
          },
          {
            "name": "gameDetails",
            "type": "string"
          }
        ]
      },
      {
        "name": "buySquare",
        "discriminator": [
          124,
          46,
          120,
          143,
          43,
          191,
          71,
          126
        ],
        "accounts": [
          {
            "name": "board",
            "writable": true
          },
          {
            "name": "user",
            "writable": true,
            "signer": true
          }
        ],
        "args": [
          {
            "name": "row",
            "type": "u8"
          },
          {
            "name": "col",
            "type": "u8"
          }
        ]
      }
    ],
    "accounts": [
      {
        "name": "board",
        "discriminator": [
          79,
          48,
          160,
          63,
          153,
          132,
          240,
          56
        ]
      }
    ],
    "errors": [
      {
        "code": 6000,
        "name": "boardNotActive",
        "msg": "The board is not active."
      },
      {
        "code": 6001,
        "name": "invalidSquare",
        "msg": "Invalid square coordinates."
      },
      {
        "code": 6002,
        "name": "squareAlreadyTaken",
        "msg": "Square already taken."
      }
    ],
    "types": [
      {
        "name": "board",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "creator",
              "type": "pubkey"
            },
            {
              "name": "entryFee",
              "type": "u64"
            },
            {
              "name": "payoutStructure",
              "type": "bytes"
            },
            {
              "name": "acceptedToken",
              "type": "pubkey"
            },
            {
              "name": "gameDetails",
              "type": "string"
            },
            {
              "name": "squares",
              "type": {
                "vec": {
                  "option": "pubkey"
                }
              }
            },
            {
              "name": "isActive",
              "type": "bool"
            }
          ]
        }
      }
    ]
  };