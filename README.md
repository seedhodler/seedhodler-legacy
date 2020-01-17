
# Seedhodler: SLIP39 Secret Sharing

<center>
<p align="center">

![Website](https://img.shields.io/website?down_color=red&down_message=offline&up_color=green&up_message=online&url=https%3A%2F%2Fseedhodler.io)
![](https://github.com/seedhodler/seedhodler/workflows/es-lint/badge.svg) 
![](https://github.com/seedhodler/seedhodler/workflows/deploy/badge.svg) 

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) ![](https://api.dependabot.com/badges/status?host=github&repo=seedhodler/seedhodler) [![GitHub issues](https://img.shields.io/github/issues/seedhodler/seedhodler.svg)](https://GitHub.com/seedhodler/seedhodler/issues/) [![GitHub issues-closed](https://img.shields.io/github/issues-closed/seedhodler/seedhodler.svg)](https://GitHub.com/seedhodler/seedhodler/issues?q=is%3Aissue+is%3Aclosed)
![GitHub pull requests](https://img.shields.io/github/issues-pr/seedhodler/seedhodler)

</p>
</center>

## Disclaimer

[![Work to Progress](https://img.shields.io/badge/Work_in_progress-YES-RED.svg)](https://shields.io/) [![Safe to use](https://img.shields.io/badge/Safe_to_use-TEST_ONLY-RED.svg)](https://shields.io/) 

> _This project is a work in progress (WIP) and should not be used by anyone, under any circumstances for any reason whatsoever until the WIP status has been resolved_

> &#34;SLIP39 Shamir Secret Sharing built for BIP39 Mnemonics&#34;,

> ONLY USE THIS TOOL OFFLINE

## About

This tool aims to be an easy to use tool for securing your crypto (seeds / recovery phrases / mnemonics) via Shamir Secret Sharing, implementing [slip39](https://github.com/satoshilabs/slips/blob/master/slip-0039.md) from Trezor creators, Satoshi Labs. 

The tool supports:
- Easy recovery phrase generation
- Easy share generation and restoration
- Group based share generation with variable thresholds from SLIP39
- Multi-language recovery phrase generation
- BIP32 info
- BIP39 seed shortening
- [Cryptosteel Capsules](https://cryptosteel.com/product/cryptosteel-capsule/?v=3a52f3c22ed6)


## Online Site (GH-PAGES) 

- [seedhodler online](https://seedhodler.github.io/seedhodler/)

## Build Static Site Setup

```bash
# install dependencies
$ yarn install

# serve with hot reload at localhost:3000
$ yarn dev

# build for production and launch server
$ yarn build
$ yarn start

# generate static project
$ yarn generate
```

# Running standalone with Docker

Prerequisites:
 - docker

Using docker:
- build docker image: `$ docker build -t seedhodler:local-build . `
- run container: `$ docker run -it -p 4000:4000 seedhodler:local-build`

Using docker-compose:
- build image: `$ docker-compose build seedhodler`
- run container: `$ docker-compose up`

# Dependencies

Primary dependencies (see package.json for entire list)

- [slip39](https://github.com/satoshilabs/slips/blob/master/slip-0039.md): SatoshiLabs
- [bip39](https://github.com/bitcoinjs/bip39): Bitcoinjs
- [bip32](https://github.com/bitcoinjs/bip32): Bitcoinjs
- [nuxtjs](https://nuxtjs.org/): Nuxtjs
- [buefy](https://buefy.org/documentation/loading): Buefy

# References

- [bip32jp](https://bip32jp.github.io/english/): bip32JP
- [shamir39](https://iancoleman.io/shamir39/): iancoleman.io
- [bip39](https://iancoleman.io/bip39/): iancoleman.io
- [https://bip39tool.ioncore.xyz/](https://bip39tool.ioncore.xyz/): iancoleman.io

# Thanks

This project is heavily inspired by the many fantastic open source initiatives from the crypto community. Some honorable mentions include the work done by Satoshi labs, Bitcoinjs and Ian Coleman.