import * as slip39 from 'slip39/src/slip39'

export const getFormattedShares = (masterSecret, passphrase, threshold, groups) => {
  const slipNode = slip39.fromArray(masterSecret, {
    passphrase,
    threshold,
    groups
  })

  const shares = groups.map((group, i) => {
    return {
      index: i,
      threshold: group[0],
      shares: group[1],
      groupName: shareGroupName(slipNode.fromPath('r/' + i + '/0').mnemonics),
      mnemonicShares: slipNode.fromPath('r/' + i).mnemonics
    }
  })

  return shares
}

export const shareGroupName = (shareMnemonic) => {
  return shareMnemonic.toString().split(' ').slice(0, 3).join(' ')
}

export const recoverSecret = (shares, passphrase) => {
  return slip39.recoverSecret(shares.map(part => part.trim()), passphrase)
}

export const validateShareMnemonic = (share) => {
  return slip39.validateMnemonic(share)
}
