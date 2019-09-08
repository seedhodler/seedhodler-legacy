<template>
  <div class="card">
    <div class="card-content">
      <div class="content">
        <div v-if="isOnline" class="column is-full">
          <b-notification
            type="is-danger"
            aria-close-label="Close notification"
            role="alert"
          >
            You are currently <em>online</em>
            <span v-if="isOnline">
              . This tool should only be used when you're offline
            </span>
          </b-notification>
        </div>
        <div class="column has-text-centered">
          <h4>Generate a new mnemonic or enter your own</h4>
          <b-tabs position="is-centered" class="block">
            <b-tab-item label="Generate New">
              <div class="has-text-left">
                <b-field grouped>
                  <b-field label="Language">
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

                  <b-field label="Words">
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
                </b-field>
                <b-field grouped>
                  <p class="control spacer">
                    <b-button type="is-primary is-medium is-outlined" @click="generateMnemonic">
                      Generate Mnemonic
                    </b-button>
                  </p>
                </b-field>
              </div>
            </b-tab-item>
            <b-tab-item label="Use Existing" />
          </b-tabs>
          <div class="column has-text-left">
            <b-tabs class="block" type="is-boxed">
              <b-tab-item label="Mnemonic">
                <b-field>
                  <b-field
                    :type="mnemonic ? validMnemonic ? 'is-success': 'is-danger' : ''"
                    :message="mnemonic ? validMnemonic ? 'valid': 'invalid' : ''"
                  >
                    <b-input v-model="mnemonic" type="textarea" expanded />
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
          </div>
          <div v-if="mnemonic" class="column has-text-left">
            <b-field>
              <b-button type="is-primary is-medium is-outlined" @click="slip39">
                Split
              </b-button>
            </b-field>
          </div>
          <div v-for="share in allShares" :key="share" class="column has-text-left">
            <b-message class="column is-full spacer">
              {{ share }}
            </b-message>
          </div>
          <div v-if="recoveredSecret" class="column has-text-left">
            <b-message
              title="Recovered Mnemonic"
              :type="recoveredSecret === mnemonic ? 'is-success': 'is-danger'"
            >
              {{ recoveredSecret }}
            </b-message>
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

export default {
  name: 'Generator',
  components: {
  },
  data () {
    return {
      isOnline: true,
      language: 'english',
      words: 24,
      mnemonic: null,
      seed: null,
      bip32node: null,
      recoveredSecret: null,
      allShares: null,
      derivationPath: 'm/0\'/0/0',
      derivedPath: null
    }
  },
  computed: {
    validMnemonic () {
      return bip39.validateMnemonic(this.mnemonic)
    },
    validDerivationPath () {
      let valid = true
      try {
        this.bip32node.derivePath(this.derivationPath)
      } catch (e) {
        valid = false
      }
      return valid
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
    slip39 () {
      const threshold = 2
      let baseMnemonic = this.mnemonic.toString()
      let paddedSecret = baseMnemonic.encodeHex()
      let byteSize = new Blob([paddedSecret]).size
      console.log(new Blob([paddedSecret]))
      while (byteSize % 2 !== 0) {
        baseMnemonic = baseMnemonic + ' '
        paddedSecret = baseMnemonic.encodeHex()
        byteSize = new Blob([paddedSecret]).size
        console.log(byteSize)
        console.log('padding empty space')
      }

      const masterSecret = paddedSecret
      byteSize = new Blob([paddedSecret]).size
      console.log('master' + byteSize)
      const passphrase = ''

      const groups = [
        // Alice group shares. 1 is enough to reconstruct a group share,
        // therefore she needs at least two group shares to reconstruct the master secret.
        [1, 1],
        [1, 1],
        // 3 of 5 Friends' shares are required to reconstruct this group share
        [3, 5],
        // 2 of 6 Family's shares are required to reconstruct this group share
        [2, 6]
      ]

      const slip = slip39.fromArray(masterSecret, {
        passphrase,
        threshold,
        groups
      })

      const aliceShare = slip.fromPath('r/0').mnemonics

      const familyShares = slip.fromPath('r/3/1').mnemonics
        .concat(slip.fromPath('r/3/3').mnemonics)

      this.allShares = aliceShare.concat(familyShares)

      const recoveredSecret = slip39.recoverSecret(this.allShares, passphrase)
      console.log(recoveredSecret)
      this.recoveredSecret = recoveredSecret.decodeHex().trim()
    },
    checkOnlineStatus () {
      this.isOnline = navigator.onLine
    },
    generateMnemonic () {
      bip39.setDefaultWordlist(this.language)
      const strength = Math.floor(parseInt(this.words) * 10.66666666666) + 1
      const mnemonic = bip39.generateMnemonic(strength)
      const seed = bip39.mnemonicToSeedSync(mnemonic)
      const node = bip32.fromSeed(seed)
      const derivedPath = node.derivePath(this.derivationPath)
      this.mnemonic = mnemonic
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
