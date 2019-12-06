
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
- Easy phrase generation
- Easy share generation and restoration
- Group based share generation with variable thresholds from SLIP39
- Multi-language seed / phrase generation
- BIP32 info
- BIP39 seed shortening


## Online Site (GH-PAGES) 

- [seedhodler online](https://seedhodler.github.io/seedhodler/)

## Build Setup

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

# Dependencies

Primary dependencies (see package.json for entire list)

- [slip39](https://github.com/satoshilabs/slips/blob/master/slip-0039.md): SatoshiLabs
- [bip39](https://github.com/bitcoinjs/bip39): Bitcoinjs

# References

- [bip32jp](https://bip32jp.github.io/english/): bip32JP
- [shamir39](https://iancoleman.io/shamir39/): iancoleman.io
- [https://bip39tool.ioncore.xyz/](https://bip39tool.ioncore.xyz/): iancoleman.io
