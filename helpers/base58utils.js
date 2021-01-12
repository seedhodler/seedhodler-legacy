import * as bitcoin from 'bitcoinjs-lib'
import * as bs58check from 'bs58check'

const encodeHash = (prefix, hash) => {
  const buffer = Buffer.alloc(20 + prefix.length)
  for (let i = 0; i < prefix.length; i++) {
    buffer.writeUInt8(prefix[i], i)
  }
  hash.copy(buffer, prefix.length)
  return bs58check.encode(buffer)
}

export const encodePrivKey = (privkey, prefix) => {
  const buffer = Buffer.alloc(2 + privkey.length)
  buffer.writeUInt8(prefix, 0)
  privkey.copy(buffer, 1)
  buffer.writeUInt8(0x01, 1 + privkey.length) // compressed publicKey
  return bs58check.encode(buffer)
}

export const p2pkh = (pubkey, prefix) => {
  const hash = bitcoin.crypto.hash160(pubkey)
  return encodeHash(prefix, hash)
}

export const p2sh = (pubkey, prefix) => {
  const pubkeyHash = bitcoin.crypto.hash160(pubkey)
  const script = Buffer.alloc(22);
  script.writeUInt8(0x00, 0)
  script.writeUInt8(0x14, 1)
  pubkeyHash.copy(script, 2)
  const scriptHash = bitcoin.crypto.hash160(script)
  return encodeHash(prefix, scriptHash)
}

export const p2wpkh = (pubkey, prefix) => {
  const network = {bech32: prefix}
  const {address} = bitcoin.payments.p2wpkh({pubkey: pubkey, network: network})
  return address
}
