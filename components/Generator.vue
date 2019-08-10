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
                  <b-field label="Custom Enthropy Input">
                    <b-field>
                      <b-input v-model="enthropy" placeholder="move your mouse to add random enthropy" name="subject" :maxlength="enthropyLength" expanded />

                      <b-select v-model="enthropyLength">
                        <option title="100" value="100">
                          100
                        </option>
                        <option title="80" value="80">
                          80
                        </option>
                      </b-select>
                      <p class="control">
                        <button :class="isGeneratingEnthropy ? 'button is-primary is-active' : 'button is-info'" @click="generateEnthropy">
                          Generate Enthropy
                        </button>
                      </p>
                    </b-field>
                  </b-field>
                  <b-field label="Mouse Coordinates">
                    <button class="button is-info">
                      {{ lastX }}:{{ lastY }}
                    </button>
                  </b-field>
                </b-field>
                <b-field grouped>
                  <div class="field spacer">
                    <b-taglist attached>
                      <b-tag size="is-medium" :type="isGeneratingEnthropy ? 'is-primary' : 'is-info'">
                        {{ enthropy }}
                      </b-tag>
                      <b-tag size="is-medium" type="is-dark">
                        {{ enthropy.length }}/{{ enthropyLength }}
                      </b-tag>
                    </b-taglist>
                  </div>
                </b-field>
                <b-field grouped>
                  <p class="control spacer">
                    <b-button type="is-primary is-medium is-outlined" @click="generateMnemonic">
                      Generate Mnemonic
                    </b-button>
                  </p>
                </b-field>
                <b-field>
                  <b-field :label="&quot;Mnemonic (&quot; + language + &quot;)&quot;">
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
      enthropy: (Math.random() * 100).toString(),
      enthropyLength: 100,
      lastX: 0,
      lastY: 0,
      lastEnthropyTick: null
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
    checkOnlineStatus () {
      this.isOnline = navigator.onLine
    },
    generateMnemonic () {
      this.mnemonic = 'this should be some kind of generated mnemonic somewhere in the future of with ' + this.words + ' words'
    },
    generateEnthropy (event) {
      window.clearInterval(this.intervalEvent)
      this.isGeneratingEnthropy = !this.isGeneratingEnthropy
      if (this.isGeneratingEnthropy) {
        this.enthropy = ''
        this.lastEnthropyTick = null
        window.addEventListener('mousemove', this.addEnthropy)
      } else {
        window.removeEventListener('mousemove', this.addEnthropy)
        window.clearInterval(this.intervalEvent)
      }
    },
    addEnthropy (event) {
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
          // TODO: Fix wonderfull off by some error :D
          const z = (Math.random(x) * Math.random(y) * 100).toString()
          if (this.enthropy.length <= this.enthropyLength) {
            this.enthropy += Math.round(z / Math.random(100))
            this.lastEnthropyTick = ts
          } else {
            window.removeEventListener('mousemove', this.addEnthropy)
            this.isGeneratingEnthropy = false
            this.lastEnthropyTick = null
          }
        }
      }
    }
  }
}

</script>
