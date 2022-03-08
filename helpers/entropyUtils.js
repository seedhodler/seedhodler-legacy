import pbkdf2 from 'pbkdf2'

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
  const perm = (x ^ y) & 0x10
  const leastSignificantX = ((perm ? x : y) & 0x0F) | (((perm ? y : x) & 0x0F) << 4)
  const time = window.performance.now()
  let leastSignificantTime = (time & 0xFF) | ((time >> 8) & 0xFF)
  // use full precision (65 MHz) of timer (might not be available)
  for (let i = 8; i <= 16; i += 8) {
    leastSignificantTime ^= (1 << i) * time & 0xFF
  }
  return leastSignificantX ^ leastSignificantTime
}

export const mouseMovementToHmacEntropy = (mouseMovementEntropy, previousHmacEntropy) => {
  if (mouseMovementEntropy.length < 16) {
    // not enough mouse entropy
    console.log(mouseMovementEntropy)
    return previousHmacEntropy
  }

  // support up to 256 bits of entropy
  return Promise.resolve().then(() => new Promise((resolve, reject) => {
    const len = previousHmacEntropy.length
    const key = new Uint8Array(previousHmacEntropy)
    const salt = new Uint8Array(mouseMovementEntropy)

    const callback = (err, derivedKey) => {
      if (err) {
        return reject(err)
      } else {
        return resolve(derivedKey)
      }
    }
    pbkdf2.pbkdf2(key, salt, 100000, len, 'sha256', callback)
  }))
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

export const binaryStrToEntropyArray = (binaryStr) => {
  const entropyArray = []
  for (let i = 0; i < binaryStr.length / 8; i++) {
    const byteAsBits = binaryStr.substring(i * 8, i * 8 + 8)
    const entropyByte = parseInt(byteAsBits, 2)
    entropyArray.push(entropyByte)
  }
  return entropyArray
}
