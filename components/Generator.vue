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
                      <option title="English" value="12">
                        12
                      </option>
                      <option title="French" value="15">
                        15
                      </option>
                      <option title="French" value="18">
                        18
                      </option>
                      <option title="French" value="21">
                        21
                      </option>
                      <option title="French" value="24">
                        24
                      </option>
                    </b-select>
                  </b-field>
                  <b-field label="Enthropy">
                    <b-field>
                      <p class="control">
                        <button class="button is-outlined is-info " @click="generateRandomEnthropy">
                          Random
                        </button>
                        <button :class="isGeneratingEnthropy ? 'button is-primary is-outlined is-active' : 'button is-info is-outlined'" @click="generateEnthropy">
                          {{ isGeneratingEnthropy ? 'Stop' : 'Generate' }}
                        </button>
                        <button class="button is-outlined is-info " @click="toggleShowEnthropyInput">
                          Show
                        </button>
                        <button class="button is-outlined is-info " @click="clearEnthropy">
                          Clear
                        </button>
                      </p>
                    </b-field>
                  </b-field>
                </b-field>
                <b-field grouped>
                  <div class="field spacer">
                    <b-taglist v-if="enthropyHash" attached>
                      <b-tag size="is-small" type="is-dark">
                        Enthropy Input Hash
                      </b-tag>
                      <b-tag size="is-small" :type="isGeneratingEnthropy ? 'is-primary' : 'is-info'">
                        {{ enthropyHash }}
                      </b-tag>
                    </b-taglist>
                  </div>
                </b-field>
                <b-field>
                  <b-field v-if="showEnthropyInput">
                    <b-field label="Enthropy">
                      <b-input v-model="enthropy" class="enthropy-display" type="textarea" expanded readonly />
                    </b-field>
                  </b-field>
                </b-field>
                <b-field v-if="enthropyHash" grouped>
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
                    <b-input v-model="derivationPath" expanded />
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
              class="column is-full spacer"
              :type="recoveredSecret.decodeHex() === mnemonic ? 'is-success': 'is-danger'"
            >
              {{ recoveredSecret.decodeHex() }}
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

async function digestMessage (message) {
  const msgUint8 = new TextEncoder().encode(message) // encode as (utf-8) Uint8Array
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8) // hash the message
  const hashArray = Array.from(new Uint8Array(hashBuffer)) // convert buffer to byte array
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('') // convert bytes to hex string
  return hashHex
}

export default {
  name: 'Generator',
  components: {
  },
  data () {
    return {
      isOnline: true,
      isGeneratingEnthropy: false,
      language: 'english',
      words: 15,
      mnemonic: null,
      seed: null,
      bip32node: null,
      enthropy: null,
      enthropyHash: '',
      enthropyLength: 100,
      lastX: 0,
      lastY: 0,
      lastEnthropyTick: null,
      showEnthropyInput: false,
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
      window.addEventListener('online', this.checkOnlineStatus)
      window.addEventListener('offline', this.checkOnlineStatus)
    }

    this.generateRandomEnthropy()
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
      const seed = bip39.mnemonicToSeedSync(this.mnemonic)
      const masterSecret = seed.toString('hex').encodeHex()
      // let ba = new TextDecoder("utf-8").decode(this.mnemonic);
      // if (masterSecret.length % 2 !== 0) {
      //   masterSecret = masterSecret
      // }

      const passphrase = 'TREZOR'

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

      // and any two of family's shares.
      const familyShares = slip.fromPath('r/3/1').mnemonics
        .concat(slip.fromPath('r/3/3').mnemonics)

      this.allShares = aliceShare.concat(familyShares)

      // console.log('Shares used for restoring the master secret:')
      // allShares.forEach(s => console.log(s))

      this.recoveredSecret = slip39.recoverSecret(this.allShares, passphrase)
      // console.log('Master secret: ' + masterSecret.decodeHex())
      // console.log('Recovered one: ' + recoveredSecret.decodeHex())
    },
    toggleShowEnthropyInput () {
      this.showEnthropyInput = !this.showEnthropyInput
    },
    checkOnlineStatus () {
      this.isOnline = navigator.onLine
    },
    generateMnemonic () {
      if (this.enthropyHash) {
        bip39.setDefaultWordlist(this.language)
        const mnemonic = bip39.entropyToMnemonic(this.enthropyHash)
        const seed = bip39.mnemonicToSeedSync(mnemonic)
        const node = bip32.fromSeed(seed)
        const derivedPath = node.derivePath(this.derivationPath)
        this.mnemonic = mnemonic
        this.seed = seed.toString('hex')
        this.bip32node = node
        this.derivedPath = derivedPath
      }
    },
    updateDerivationPath () {
      this.derivedPath = this.bip32node.derivePath(this.derivationPath)
    },
    clearEnthropy () {
      this.enthropy = null
      this.lastEnthropyTick = null
      this.enthropyHash = null
    },
    async generateRandomEnthropy () {
      const array = new Uint8Array(64)
      const randomUint8array = window.crypto.getRandomValues(array)
      this.enthropy = new TextDecoder('utf-8').decode(randomUint8array)
      this.enthropyHash = await digestMessage(this.enthropy)
    },
    generateEnthropy (event) {
      this.isGeneratingEnthropy = !this.isGeneratingEnthropy
      if (this.isGeneratingEnthropy) {
        window.addEventListener('mousemove', this.addEnthropy)
      } else {
        window.removeEventListener('mousemove', this.addEnthropy)
      }
    },
    async addEnthropy (event) {
      if (this.enthropy && this.enthropy.length >= 500) {
        this.entropy = null
        this.isGeneratingEnthropy = false
        this.lastEnthropyTick = null
        window.removeEventListener('mousemove', this.addEnthropy)
      }

      const ts = new Date().getTime()
      if (!this.lastEnthropyTick) {
        this.lastEnthropyTick = ts
      }
      if (ts - this.lastEnthropyTick > 100) {
        const x = event.clientX
        const y = event.clientY
        if (x !== this.lastX && y !== this.lastY) {
          this.lastX = x
          this.lastY = y
          const z = (Math.random(x) * Math.random(y) * 100).toString()
          const zArray = new Uint8Array(z)
          const randomUint8array = window.crypto.getRandomValues(zArray)
          this.enthropy += new TextDecoder('utf-8').decode(randomUint8array)
          this.enthropyHash = await digestMessage(this.enthropy)
          this.lastEnthropyTick = ts
        }
      }
    }
  }
}

</script>

<style>
 .enthropy-display {
   font-size: 0.5em;
 }
</style>
