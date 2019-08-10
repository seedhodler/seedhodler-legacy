<template>
  <div class="card">
    <div class="card-content">
      <div class="content">
        <div class="column is-full">
          <b-notification
            :type="isOnline ? 'is-warning' : 'is-success'"
            aria-close-label="Close notification"
            role="alert"
          >
            You are currently <em>{{ isOnline ? 'online' : 'offline' }}</em>
            <span v-if="isOnline">
              . This tool should only be used when you're offline
            </span>
          </b-notification>
        </div>
        <div class="column has-text-centered">
          Generate a random mnemonic, or enter your own below
          <b-tabs position="is-centered" class="block">
            <b-tab-item label="Generate New">
              <div class="has-text-left">
                <b-field grouped>
                  <b-field label="Language">
                    <b-select v-model="language">
                      <option title="English" value="en">
                        English
                      </option>
                      <option title="French" value="fr">
                        Français
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
                      </p>
                    </b-field>
                  </b-field>
                </b-field>
                <b-field grouped>
                  <div class="field spacer">
                    <b-taglist v-if="enthropyHash" attached>
                      <b-tag size="is-medium" type="is-dark">
                        Enthropy Input Hash
                      </b-tag>
                      <b-tag size="is-medium" :type="isGeneratingEnthropy ? 'is-primary' : 'is-info'">
                        {{ enthropyHash }}
                      </b-tag>
                    </b-taglist>
                  </div>
                </b-field>
                <b-field>
                  <b-field v-if='showEnthropyInput'>
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
                <b-field v-if="mnemonic">
                  <b-field label="Mnemonic">
                    <b-input v-model="mnemonic" maxlength="2000" type="textarea" expanded />
                  </b-field>
                </b-field>
              </div>
            </b-tab-item>
            <b-tab-item label="Use Existing">
              <div class="has-text-left">
                <b-field label="Mnemonic">
                  <b-input v-model="mnemonic" maxlength="2000" type="textarea" expanded />
                </b-field>
              </div>
            </b-tab-item>
          </b-tabs>
        </div>
        <div class="column" />
      </div>
    </div>
  </div>
  </div>
</template>

<script>
import * as bip39 from 'bip39'

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
      language: 'en',
      words: 15,
      mnemonic: '',
      enthropy: '',
      enthropyHash: '',
      enthropyLength: 100,
      lastX: 0,
      lastY: 0,
      lastEnthropyTick: null,
      showEnthropyInput: false
    }
  },
  created () {
    if (process.browser) {
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
    toggleShowEnthropyInput () {
      this.showEnthropyInput = !this.showEnthropyInput
    },
    checkOnlineStatus () {
      this.isOnline = navigator.onLine
    },
    generateMnemonic () {
      this.mnemonic = bip39.entropyToMnemonic('a1f5d722e4e2d1a9b3c4a1d3a9a1a1a1')
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
