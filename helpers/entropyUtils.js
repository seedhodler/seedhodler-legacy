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

export const coordinateToRandomUInt8 = (x, y) => {
  const xMax = Math.floor(x) % 255
  const yMax = Math.floor(y) % 255
  const xRand = getRandomInt(xMax)
  const yRand = getRandomInt(yMax)
  const randUnit8 = Math.floor((xRand + yRand) / 2)
  return randUnit8
}

export const uint8ArrayCoordinateRandomize = (array, x, y) => {
  const copy = new Uint8Array(array)
  const randomIndex = getRandomInt(array.length)
  const randomUint8 = coordinateToRandomUInt8(x, y)
  copy[randomIndex] = randomUint8
  return copy
}

export const getRandomInt = (max) => {
  return Math.floor(secureMathRandom() * Math.floor(max))
}

export const secureMathRandom = () => {
  // Divide a random UInt32 by the maximum value (2^32 -1) to get a result between 0 and 1
  return window.crypto.getRandomValues(new Uint32Array(1))[0] / 4294967295
}

// export const uint8ArrayToHash = async (message) => {
//   const hashBuffer = await window.crypto.subtle.digest('SHA-256', message) // hash the message
//   const hashArray = Array.from(new Uint8Array(hashBuffer)) // convert buffer to byte array
//   return hashArray.map(b => b.toString(16).padStart(2, '0')).join('') // convert bytes to hex string
// }
