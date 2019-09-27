<template>
  <div>
    <b-message type="is-danger" has-icon>
      You are currently <em>online</em>. This tool should only be used when you're offline
    </b-message>

    <div class="card">
      <div class="card-content">
        <div class="content">
          <div v-if="isOnline" class="column is-full" />
          <div class="column">
            <b-tabs size="is-medium" position="is-left" class="block">
              <b-tab-item icon="pencil" label="Generate">
                <div class="column has-text-left">
                  <b-field horizontal label="Language">
                    <b-select v-model="language">
                      <option title="English" value="english">
                        English
                      </option>
                      <option title="French" value="french">
                        Français
                      </option>
                      <option title="Spanish" value="spanish">
                        Spanish
                      </option>
                      <option title="Italian" value="italian">
                        Italian
                      </option>
                      <option title="Japanese" value="japanese">
                        Japanese
                      </option>
                      <option title="Korean" value="korean">
                        Korean
                      </option>
                      <option title="Chinese Simplified" value="chinese_simplified">
                        Chinese (Simplified)
                      </option>
                      <option title="Chinese Traditional" value="chinese_traditional">
                        Chinese (Traditional)
                      </option>
                    </b-select>
                  </b-field>

                  <b-field horizontal label="Words">
                    <b-select v-model="words">
                      <option title="24" value="24">
                        24
                      </option>
                      <option title="21" value="21">
                        21
                      </option>
                      <option title="18" value="18">
                        18
                      </option>
                      <option title="15" value="15">
                        15
                      </option>

                      <option title="12" value="12">
                        12
                      </option>
                    </b-select>
                  </b-field>

                  <b-field horizontal label="Threshold">
                    <b-numberinput v-model="threshold" controls-position="compact" :controls-rounded="true" min="1" :max="groupTags.length" />
                  </b-field>

                  <b-field horizontal label="Share Groups (threshold/shares)">
                    <b-taginput
                      v-model="groupTags"
                      icon="label"
                      :allow-duplicates="true"
                      placeholder="Add group e.g 4/5"
                      :before-adding="validateShareGroup"
                    />
                  </b-field>

                  <b-field horizontal label="Use short form">
                    <b-switch
                      v-model="useShortMnemonic"
                    />
                  </b-field>

                  <b-field horizontal>
                    <b-button type="is-primary is-medium" @click="generateMnemonic">
                      Generate
                    </b-button>
                  </b-field>

                  <b-tabs>
                    <b-tab-item icon="seed" label="Seed Phrase (BIP 39)">
                      <b-field>
                        <b-field
                          :type="mnemonic ? validMnemonic ? 'is-success': 'is-danger' : ''"
                          :message="(mnemonic ? validMnemonic ? 'valid ' + '(' + displayedMnemonic.length + ')': 'invalid ' + '(' + displayedMnemonic.length + ')' : '') "
                        >
                          <b-input v-model="displayedMnemonic" type="textarea" expanded />
                        </b-field>
                      </b-field>
                    </b-tab-item>
                    <b-tab-item label="Derivation (BIP 32)">
                      <div v-if="bip32node" class="column">
                        <b-field label="Key Info: (Node Public Key)">
                          <b-input :value="bip32node.publicKey.toString('hex')" expanded />
                        </b-field>
                        <b-field label="Key Info: Depth">
                          <b-input :value="bip32node.depth" expanded />
                        </b-field>
                        <b-field label="Key Info: Index">
                          <b-input :value="bip32node.index" expanded />
                        </b-field>
                        <b-field label="Key Info: Identifier">
                          <b-input :value="bip32node.identifier.toString('hex')" expanded />
                        </b-field>
                        <b-field v-if="bip32node.parentFingerprint" label="Key Info: Parent Fingerprint">
                          <b-input :value="bip32node.parentFingerprint.toString('hex')" expanded />
                        </b-field>
                        <b-field label="Key Info: Parent Fingerprint">
                          <b-input :value="bip32node.fingerprint.toString('hex')" expanded />
                        </b-field>
                        <b-field label="Key Info: (Node Private Key)">
                          <b-input :value="bip32node.privateKey.toString('hex')" expanded />
                        </b-field>
                      </div>
                      <div v-if="derivedPath" class="column">
                        <b-field
                          horizontal
                          :type="validDerivationPath ? 'is-success' : 'is-warning'"
                          :message="validDerivationPath ? 'valid path' : 'invalid path'"
                          label="Path"
                        >
                          <b-input v-model="derivationPath" />
                          <p class="control">
                            <b-button :disabled="!validDerivationPath" type="is-success" @click="updateDerivationPath">
                              derive
                            </b-button>
                          </p>
                        </b-field>
                        <b-field label="Private Key (WIF)">
                          <b-input :value="derivedPath.toWIF()" expanded />
                        </b-field>
                        <b-field label="Derived Private Key">
                          <b-input :value="derivedPath.toBase58()" expanded />
                        </b-field>
                      </div>
                    </b-tab-item>
                  </b-tabs>
                  <div v-if="mnemonic" class="column has-text-left">
                    <b-field>
                      <b-button type="is-primary is-medium is-outlined" @click="slip39">
                        Split
                      </b-button>
                    </b-field>
                  </div>
                  <b-tabs type="is-boxed">
                    <b-tab-item v-for="share in allShares" :key="share" v-model="activeTab" :label="'Group ' + share.index + ' (' + share.threshold + '/' + share.shares + ')'">
                      <b-message v-for="shareMnemonic in share.mnemonicShares" :key="shareMnemonic" class="column is-full spacer">
                        {{ shareMnemonic }}
                      </b-message>
                    </b-tab-item>
                  </b-tabs>
                  <div v-if="recoveredSecret" class="column has-text-left">
                    <b-message
                      title="Recovered Seed Phrase"
                      :type="recoveredSecret === mnemonic || recoveredSecret === displayedMnemonic ? 'is-success': 'is-danger'"
                    >
                      {{ recoveredSecret }}
                    </b-message>
                  </div>
                </div>
              </b-tab-item>
              <b-tab-item icon="backup-restore" label="Restore">
                <p>Under Construction</p>
              </b-tab-item>
            </b-tabs>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as bip39 from 'bip39'
import * as slip39 from 'slip39/src/slip39'
import * as bip32 from 'bip32'

const lpad = (str, padString, length) => {
  while (str.length < length) { str = padString + str }
  return str
}

const shortenMnemonic = (mnemonic) => {
  return mnemonic.split(' ').map(v => v.substr(0, 4)).join(' ')
}

const shortWordToOriginal = (language, shortWord) => {
  let mappedWord = '[invalid-short-word]'
  for (const word of bip39.wordlists[language]) {
    if (word.startsWith(shortWord)) {
      mappedWord = word
      break
    }
  }
  return mappedWord
}

const shortMnemonicToOriginal = (language, shortMnemonic) => {
  return shortMnemonic.split(' ').map(shortWord => shortWordToOriginal(language, shortWord)).join(' ')
}

export default {
  name: 'Generator',
  components: {
  },
  data () {
    return {
      isOnline: true,
      useShortMnemonic: false,
      language: 'english',
      words: 24,
      mnemonic: null,
      shortMnemonic: null,
      seed: null,
      bip32node: null,
      recoveredSecret: null,
      allShares: null,
      derivationPath: 'm/0\'/0/0',
      derivedPath: null,
      passphrase: '',
      threshold: 1,
      groupTags: [
        '2/3'
      ]
    }
  },
  computed: {
    validMnemonic () {
      if (this.mnemonic && this.shortMnemonic) {
        if (this.useShortMnemonic) {
          const reconstructed = shortMnemonicToOriginal(this.language, this.shortMnemonic)
          return bip39.validateMnemonic(reconstructed)
        } else {
          return bip39.validateMnemonic(this.mnemonic)
        }
      }
      return false
    },
    validDerivationPath () {
      let valid = true
      try {
        this.bip32node.derivePath(this.derivationPath)
      } catch (e) {
        valid = false
      }
      return valid
    },
    displayedMnemonic: {
      get () {
        return this.useShortMnemonic ? this.shortMnemonic : this.mnemonic
      },
      set (val) {
        if (this.useShortMnemonic) {
          this.shortMnemonic = val
          this.mnemonic = shortMnemonicToOriginal(this.language, val)
        } else {
          this.mnemonic = val
          this.shortMnemonic = shortenMnemonic(val)
        }
      }
    }
  },
  created () {
    if (process.browser) {
      this.checkOnlineStatus()
      window.addEventListener('online', this.checkOnlineStatus)
      window.addEventListener('offline', this.checkOnlineStatus)
    }
  },
  destroyed () {
    if (process.browser) {
      window.addEventListener('online', this.checkOnlineStatus)
      window.addEventListener('offline', this.checkOnlineStatus)
    }
  },
  methods: {
    validateShareGroup (tag) {
      const parts = tag.split('/')
      const threshold = parts[0]
      const shares = parts[1]
      const isAlNumbers = parts.every(n => Number.isInteger(++n))
      const thresholdLowerThanShares = threshold <= shares
      const thresholdValid = threshold > 0 && threshold < 7
      const sharesValid = shares >= threshold && shares < 7
      return parts && parts.length === 2 && isAlNumbers && thresholdLowerThanShares && thresholdValid && sharesValid
    },
    slip39 () {
      const threshold = this.threshold
      const groups = this.groupTags.map(tag => tag.split('/').map(n => parseInt(n)))

      console.log(groups)
      console.log(threshold)

      const passphrase = this.passphrase

      let baseMnemonic = this.useShortMnemonic ? this.shortMnemonic.toString() : this.mnemonic.toString()
      let paddedSecret = baseMnemonic.encodeHex()
      if (baseMnemonic.length % 2 !== 0) {
        const evenLength = 2 * Math.round(baseMnemonic.length / 2)
        baseMnemonic = lpad(baseMnemonic, ' ', evenLength)
        paddedSecret = baseMnemonic.encodeHex()
      }

      const masterSecret = paddedSecret

      const slip = slip39.fromArray(masterSecret, {
        passphrase,
        threshold,
        groups
      })

      const shares = groups.map((group, i) => {
        return {
          index: i,
          threshold: group[0],
          shares: group[1],
          mnemonicShares: slip.fromPath('r/' + i).mnemonics
        }
      })

      console.log(shares)
      // const aliceShare = slip.fromPath('r/0').mnemonics

      // const familyShares = slip.fromPath('r/3/1').mnemonics
      //   .concat(slip.fromPath('r/3/3').mnemonics)

      this.allShares = shares

      // const recoveryParts = [shares[0], shares[1], shares[2]]

      // const recoveredSecret = slip39.recoverSecret(recoveryParts, passphrase)
      // this.recoveredSecret = recoveredSecret.decodeHex().trim()
    },
    checkOnlineStatus () {
      this.isOnline = navigator.onLine
    },
    generateMnemonic () {
      bip39.setDefaultWordlist(this.language)
      const strength = Math.floor(parseInt(this.words) * 10.66666666666) + 1
      const mnemonic = bip39.generateMnemonic(strength)
      const shortMnemonic = shortenMnemonic(mnemonic)
      const seed = bip39.mnemonicToSeedSync(mnemonic)
      const node = bip32.fromSeed(seed)
      const derivedPath = node.derivePath(this.derivationPath)
      this.mnemonic = mnemonic
      this.shortMnemonic = shortMnemonic
      this.seed = seed.toString('hex')
      this.bip32node = node
      this.derivedPath = derivedPath
    },
    updateDerivationPath () {
      this.derivedPath = this.bip32node.derivePath(this.derivationPath)
    }
  }
}

</script>

<style>
 .entropy-display {
   font-size: 0.5em;
 }

 .progress {
   margin-top: 10px;
   height: 4px;
 }
</style>
