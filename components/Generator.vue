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
                       <b-input v-model="enthropy" placeholder='move your mouse to add random enthropy' name="subject" expanded></b-input>
                       <p class="control">
                <button @click="generateEnthropy" :class="isGeneratingEnthropy ? 'button is-black is-active' : 'button is-info'">Click to Gene</button>
            </p>
                </b-field>
                  </b-field>

                </b-field>
                <b-field grouped>
                   <p class="control">
                    <b-button type="is-primary is-large is-outlined">
                      Generate
                    </b-button>
                  </p>
                </b-field>
              </div>
            </b-tab-item>
            <b-tab-item label="Use Existing">
              <div class="has-text-left">
                <b-field label="Mnemonic">
                  <b-input v-model="mnemonic" maxlength="200" type="textarea" />
                </b-field>
              </div>
            </b-tab-item>
          </b-tabs>
        </div>
        <div class="column">
          {{ words }}
          {{ language }}
          {{ mnemonic }}
          {{ enthropy }}
        </div>
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
      mnemonic: 'foo bar too',
      enthropy: ''
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
    generateEnthropy (event) {
      this.isGeneratingEnthropy = !this.isGeneratingEnthropy
      this.enthropy = event.clientX
    }
  }
}

</script>
