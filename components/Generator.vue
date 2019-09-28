<template>
  <div>
    <b-message size="is-small" type="is-danger" has-icon>
      You are currently <em>online</em>. This tool should only be used when you're offline
    </b-message>

    <div class="card">
      <div class="card-content">
        <b-tabs position="is-left" expanded>
          <b-tab-item class="spacer-top-md" icon="pencil" label="Generate">
            <h6 class="subtitle">
              1. Phrase
            </h6>
            <b-field grouped>
              <b-field label-position="on-border" label="Language">
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

              <b-field label-position="on-border" label="Words">
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
                <b-field />
                <b-field>
                  <b-button type="is-primary" outlined @click="generateMnemonic">
                    Generate
                  </b-button>
                </b-field>
              </b-field>
            </b-field>

            <b-tabs size="is-small" class="spacer-top-md" expanded>
              <b-tab-item>
                <template slot="header">
                  <b-icon icon="circle-edit-outline" />
                  <span> Phrase <b-tag rounded> BIP 39 </b-tag> </span>
                </template>
                <b-field
                  :type="mnemonic ? validMnemonic ? 'is-success': 'is-danger' : ''"
                  :message="(mnemonic ? validMnemonic ? 'valid ' + '(' + displayedMnemonic.length + ')': 'invalid ' + '(' + displayedMnemonic.length + ')' : '') "
                >
                  <b-input v-model="displayedMnemonic" type="textarea" expanded />
                </b-field>
                <b-field position="is-right">
                  <b-switch
                    v-model="shortenMnemonic"
                    :rounded="false"
                    :outlined="false"
                    size="is-small"
                    type="is-primary"
                  >
                    Shorten
                  </b-switch>
                </b-field>
              </b-tab-item>
              <b-tab-item>
                <template slot="header">
                  <b-icon icon="call-split" />
                  <span> Derivation <b-tag rounded> BIP 32 </b-tag> </span>
                </template>
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
            <template v-if="mnemonic">
              <h6 class="subtitle">
                2. Configure
              </h6>
              <b-field position="is-right">
                <b-button size="is-small" type="is-text" @click="addGroup">
                  Add Group
                </b-button>
              </b-field>
              <b-field v-for="(threshold, index) in thresholds" :key="index" grouped>
                <b-field label-position="on-border" :label="`G${index}: Threshold`">
                  <b-numberinput
                    v-model="thresholds[index]"
                    type="is-info"
                    controls-position="compact"
                    size="is-small"
                    min="1"
                    :max="shareGroups[index]"
                  />
                </b-field>
                <b-field label-position="on-border" label="Total Shares">
                  <b-numberinput
                    v-model="shareGroups[index]"
                    controls-position="compact"
                    size="is-small"
                    type="is-info"
                    :min="thresholds[index]"
                    :max="6"
                  />
                </b-field>
              </b-field>
              <b-field>
                <b-button type="is-primary is-outlined" @click="slip39">
                  Split
                </b-button>
              </b-field>
            </template>
            <template v-if="allShares">
              <h6 class="subtitle spacer-top-lg">
                3. Share Groups
              </h6>
              <b-tabs class="spacer-top=lg">
                <b-tab-item v-for="share in allShares" :key="share" v-model="activeTab">
                  <template slot="header">
                    <b-icon :icon="`numeric-${share.index}-box-multiple-outline`" />
                    <span><b-tag rounded> {{ share.threshold }}/{{ share.shares }} </b-tag> </span>
                  </template>
                  <b-message v-for="shareMnemonic in share.mnemonicShares" :key="shareMnemonic" class="column is-full spacer">
                    {{ shareMnemonic }}
                  </b-message>
                </b-tab-item>
              </b-tabs>
            </template>
            <div v-if="recoveredSecret" class="column has-text-left">
              <b-message
                title="Recovered Seed Phrase"
                :type="recoveredSecret === mnemonic || recoveredSecret === displayedMnemonic ? 'is-success': 'is-danger'"
              >
                {{ recoveredSecret }}
              </b-message>
            </div>
            </b-field>
            </b-field>
          </b-tab-item>
          <b-tab-item icon="backup-restore" label="Restore">
            <b-message title="Under construction" size="is-small" type="is-warning" has-icon aria-close-label="Close">
              Restoring from shares is still under construction
            </b-message>
          </b-tab-item>
        </b-tabs>
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
      shortenMnemonic: false,
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
      thresholds: [3],
      shareGroups: [5]
    }
  },
  computed: {
    validMnemonic () {
      if (this.mnemonic && this.shortMnemonic) {
        if (this.shortenMnemonic) {
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
        return this.shortenMnemonic ? this.shortMnemonic : this.mnemonic
      },
      set (val) {
        if (this.shortenMnemonic) {
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
    addGroup () {
      if (this.thresholds.length < 6) {
        this.thresholds.push(3)
        this.shareGroups.push(5)
      }
    },
    slip39 () {
      const threshold = this.threshold
      const groups = this.thresholds.map((t, i) => [t, this.shareGroups[i]])

      console.log(groups)
      console.log(threshold)

      const passphrase = this.passphrase

      let baseMnemonic = this.shortenMnemonic ? this.shortMnemonic.toString() : this.mnemonic.toString()
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

 .spacer-top-lg {
   margin-top: 40px;
 }

  .spacer-top-md {
   margin-top: 20px;
 }

</style>
