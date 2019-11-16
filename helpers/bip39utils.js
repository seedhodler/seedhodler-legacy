import * as bip39 from 'bip39'

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
  const strength = Math.floor(parseInt(wordCount) * 10.66666666666) + 1
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
