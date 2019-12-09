export const wordsToUint8Array = (words) => {
  switch (Number(words)) {
    case 12:
      return new Uint8Array(16)
    case 18:
      return new Uint8Array(24)
    case 24:
      return new Uint8Array(32)
  }

  throw new Error(`Invalid word count length specified. Got ${words} but expected 12, 18 or 24`)
}

export const mouseMovementEntropy = (x, y) => {
  // baseKey generation based on http://phrack.org/issues/59/15.html
  const leastSignificantX = parseInt((x).toString(2).slice(-4) + (y).toString(2).slice(-4), 2)
  const leastSignificantTime = parseInt(window.performance.now().toString(2).slice(-8), 2)
  const res = leastSignificantX ^ leastSignificantTime
  return res
}

export const getKeyMaterial = async (mouseMovemenntEntropy) => {
  // Generate keyMaterial using PBKDF2 from low entropy input source. Used to derive a proper key later
  // https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/importKey
  // https://github.com/mdn/dom-examples/blob/master/web-crypto/derive-key/pbkdf2.js

  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(mouseMovemenntEntropy),
    { name: 'PBKDF2' },
    false,
    ['deriveBits', 'deriveKey']
  )

  return keyMaterial
}

const PBKDF2 = {
  name: 'PBKDF2',
  iterations: 100000,
  hash: 'SHA-256'
}

const HMAC = { name: 'HMAC', hash: 'SHA-256' }

export const deriveKey = async (keyMaterial, salt) => {
  // Derive PDKDF2 key from keyMaterial
  // https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/deriveKey

  const derivedKey = await window.crypto.subtle.deriveKey(
    { ...PBKDF2, salt },
    keyMaterial,
    HMAC,
    true,
    ['sign', 'verify']
  )

  return derivedKey
}

export const mouseMovementToHmacEntropy = async (mouseMovementEntropy, previousHmacEntropy) => {
  if (mouseMovementEntropy.length < 16) {
    // not enough mouse entropy
    console.log(mouseMovementEntropy)
    return previousHmacEntropy
  }

  const len = previousHmacEntropy.length
  const message = new Uint8Array(previousHmacEntropy)
  const salt = window.crypto.getRandomValues(new Uint8Array(16))
  const keyMaterial = await getKeyMaterial(mouseMovementEntropy)
  const key = await deriveKey(keyMaterial, salt)
  const signature = await window.crypto.subtle.sign(
    'HMAC',
    key,
    message
  )

  return new Uint8Array(signature, 0, len)
}

export const getRandomInt = (max) => {
  return Math.floor(secureMathRandom() * Math.floor(max))
}

export const secureMathRandom = () => {
  // Divide a random UInt32 by the maximum value (2^32 -1) to get a result between 0 and 1
  return window.crypto.getRandomValues(new Uint32Array(1))[0] / 4294967295
}

export const byteArrayToHexString = (byteArray) => {
  return Array.prototype.map.call(byteArray, (byte) => {
    return ('0' + (byte & 0xFF).toString(16)).slice(-2)
  }).join('')
}

export const hexStringToByteArray = (hexString) => {
  const result = []
  for (let i = 0; i < hexString.length; i += 2) {
    result.push(parseInt(hexString.substr(i, 2), 16))
  }
  return result
}

// export const uint8ArrayToHash = async (message) => {
//   const hashBuffer = await window.crypto.subtle.digest('SHA-256', message) // hash the message
//   const hashArray = Array.from(new Uint8Array(hashBuffer)) // convert buffer to byte array
//   return hashArray.map(b => b.toString(16).padStart(2, '0')).join('') // convert bytes to hex string
// }
