import * as bip39 from 'bip39'
import * as createHash from 'create-hash'

export const shortenMnemonic = (mnemonic) => {
  return mnemonic.split(' ').map(v => v.substr(0, 4)).join(' ')
}

export const shortWordToOriginal = (language, shortWord) => {
  let mappedWord = '[invalid-short-word]'
  for (const word of bip39.wordlists[language]) {
    if (word.startsWith(shortWord)) {
      mappedWord = word
      break
    }
  }
  return mappedWord
}

export const shortMnemonicToOriginal = (language, shortMnemonic) => {
  return shortMnemonic.split(' ').map(shortWord => shortWordToOriginal(language, shortWord)).join(' ')
}

export const generateMnemonic = (language, wordCount) => {
  bip39.setDefaultWordlist(language)
  const strength = Math.ceil(parseInt(wordCount) * 32 / 3)
  return bip39.generateMnemonic(strength)
}

export const generateMnemonicFromEntropy = (language, entropy) => {
  bip39.setDefaultWordlist(language)
  return bip39.entropyToMnemonic(entropy)
}

export const validateMnemonic = (mnemonic) => {
  return bip39.validateMnemonic(mnemonic)
}

export const mnemonicToSeed = (mnemonic) => {
  return bip39.mnemonicToSeedSync(mnemonic)
}

export const mnemonicToEntropy = (mnemonic) => {
  return bip39.mnemonicToEntropy(mnemonic)
}

export const entropyToMnemonic = (entropy) => {
  return bip39.entropyToMnemonic(entropy)
}

export const lpad = (str, padString, length) => {
  while (str.length < length) { str = padString + str }
  return str
}

export const deriveChecksumBits = (entropyBuffer) => {
  const ENT = entropyBuffer.length * 8
  const CS = ENT / 32
  const hash = createHash('sha256')
    .update(entropyBuffer)
    .digest()
  return bytesToBinary(Array.from(hash)).slice(0, CS)
}

export const bytesToBinary = (bytes) => {
  return bytes.map(x => lpad(x.toString(2), '0', 8)).join('')
}

export const indexToWord = (index, language = 'english') => {
  return bip39.wordlists[language][index]
}
