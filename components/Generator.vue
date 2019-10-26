<template>
  <div>
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
          <option title="18" value="18">
            18
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
        <NodeInfo :seed="seed" />
      </b-tab-item>
    </b-tabs>
    <template v-if="mnemonic">
      <h6 class="subtitle">
        2. Configure
      </h6>
      <b-field grouped>
        <table class="table is-narrow">
          <thead>
            <th>#</th>
            <th>Threshold</th>
            <th>Shares</th>
            <th />
          </thead>
          <tbody>
            <tr v-for="(threshold, index) in thresholds" :key="index">
              <td>{{ index }}</td>
              <td>
                <b-numberinput
                  v-model="thresholds[index]"
                  type="is-info"
                  controls-position="compact"
                  size="is-small"
                  min="1"
                  :max="shareGroups[index]"
                />
              </td>
              <td>
                <b-numberinput
                  v-model="shareGroups[index]"
                  controls-position="compact"
                  size="is-small"
                  type="is-info"
                  :min="thresholds[index]"
                  :max="6"
                />
              </td>
              <td>
                <b-button icon-left="plus" type="is-text" @click="addGroup" />
                <b-button icon-left="delete" type="is-text" @click="removeGroup(index)" />
              </td>
            </tr>
          </tbody>
        </table>
      </b-field>
      <b-field class="spacer-top-lg">
        <b-button size="is-medium" type="is-primary is-outlined" @click="slip39">
          Split
        </b-button>
      </b-field>
    </template>
    <template v-if="allShares">
      <h6 class="subtitle spacer-top-lg">
        3. Share Groups
      </h6>
      <b-tabs class="spacer-top=lg">
        <b-tab-item v-for="(share, groupIndex) in allShares" :key="share" v-model="activeTab">
          <template slot="header">
            <b-icon :icon="`numeric-${share.index}-box-multiple-outline`" />
            <span><b-tag rounded> {{ share.threshold }}/{{ share.shares }} </b-tag> </span>
          </template>
          <div class="table-container">
            <table class="table is-fullwidth is-striped is-bordered">
              <thead>
                <th>Group {{ groupIndex }}</th>
                <th>Share</th>
                <th />
              </thead>
              <tbody>
                <tr
                  v-for="(shareMnemonic, shareIndex) in share.mnemonicShares"
                  :key="shareMnemonic"
                >
                  <td>
                    <b-taglist attached>
                      <b-tag type="is-info">
                        Share {{ shareIndex }}
                      </b-tag>
                      <b-tag type="is-dark">
                        {{ wordCount(shareMnemonic) }}
                      </b-tag>
                    </b-taglist>
                  </td>
                  <td>
                    <b-input
                      :id="'sharetext-' + groupIndex + '-' + shareIndex"
                      type="textarea"
                      :value="shareMnemonic"
                      readonly
                      expanded
                    />
                  </td>

                  <td><b-button icon-left="content-copy" type="is-text" area-label="copy-share" @click="copyToClipboard('sharetext-' + groupIndex + '-' + shareIndex)" /></td>
                </tr>
              </tbody>
            </table>
          </div>
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
  </div>
</template>

<script>
import * as bip39 from 'bip39'
import * as slip39 from 'slip39/src/slip39'

import NodeInfo from '~/components/NodeInfo'

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
    NodeInfo
  },
  data () {
    return {
      shortenMnemonic: false,
      language: 'english',
      words: 12,
      mnemonic: null,
      shortMnemonic: null,
      recoveredSecret: null,
      allShares: null,
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
    },
    seed () {
      return bip39.mnemonicToSeedSync(this.mnemonic)
    }
  },
  methods: {
    addGroup () {
      if (this.thresholds.length < 6) {
        this.thresholds.push(3)
        this.shareGroups.push(5)
      }
    },
    removeGroup (index) {
      if (this.thresholds.length > 1) {
        this.thresholds.splice(index, 1)
        this.shareGroups.splice(index, 1)
      }
    },
    slip39 () {
      const threshold = this.threshold
      const groups = this.thresholds.map((t, i) => [t, this.shareGroups[i]])
      const passphrase = this.passphrase
      const masterSecret = bip39.mnemonicToEntropy(this.mnemonic).encodeHex()

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

      this.allShares = shares
    },
    generateMnemonic () {
      bip39.setDefaultWordlist(this.language)

      // Words to bits
      const strength = Math.floor(parseInt(this.words) * 10.66666666666) + 1
      this.mnemonic = bip39.generateMnemonic(strength)
      this.shortMnemonic = shortenMnemonic(this.mnemonic)
    },
    wordCount (str) {
      return str.split(' ').length
    },
    copyToClipboard (elementId) {
      const copyText = document.getElementById(elementId)
      copyText.select()
      copyText.setSelectionRange(0, 99999)
      document.execCommand('copy')
      const [ sharetext, group, share ] = elementId.split('-')
      this.$buefy.snackbar.open(`Copied share ${share} from group ${group}`)
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

  .is-copy-button {
    background-color: transparent;
    color: inherit;
    border: none;
  }

  .is-copy-button:hover {
    background-color: transparent;
    color: rgb(20, 150, 237);
    border: none;
  }

  .share-textarea {
    background: transparent;
    border: none;
  }
</style>
