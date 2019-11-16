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
          <b-field>
            <b-button
              type="is-text"
              icon-left="chevron-down"
              aria-controls="advancedEntropyGeneration"
              @click="showEntropyInput = !showEntropyInput"
            >
              Advanced
            </b-button>
          </b-field>
        </b-field>
      </b-field>
    </b-field>
    <b-field>
      <b-collapse :open="showEntropyInput" aria-id="advancedEntropyGeneration">
        <div>
          <EntropyInput :words="words" :entropy="entropy" @updateEntropy="updateEntropy" @clearEntropy="clearEntropy" />
        </div>
      </b-collapse>
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
              <td>{{ index + 1 }}</td>
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
              <td v-if="shareGroups.length > 1">
                <b-button icon-left="delete" type="is-text" @click="removeGroup(index)" />
              </td>
            </tr>
          </tbody>
        </table>
      </b-field>
      <b-field>
        <b-button icon-left="plus" type="is-text" @click="addGroup">
          Add Share Group
        </b-button>
      </b-field>
      <b-field class="spacer-top-lg">
        <b-button size="is-medium" type="is-primary is-outlined" @click="generateShares">
          Split
        </b-button>
      </b-field>
    </template>
    <template v-if="allShares">
      <h6 class="subtitle spacer-top-lg">
        3. Share Groups
      </h6>
      <b-tabs class="spacer-top=lg">
        <b-tab-item v-for="(share, groupIndex) in allShares" :key="groupIndex">
          <template slot="header">
            <span><b-tag rounded>{{ groupIndex + 1 }}. {{ share.groupName }} [{{ share.threshold }}/{{ share.shares }}] </b-tag> </span>
          </template>
          <div class="table-container">
            <table class="table is-fullwidth is-striped is-bordered">
              <thead>
                <th>Group {{ groupIndex + 1 }}</th>
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
                        Share {{ shareIndex + 1 }}
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

import NodeInfo from '~/components/NodeInfo'
import EntropyInput from '~/components/EntropyInput'
import { shortenMnemonic, shortMnemonicToOriginal, generateMnemonic, generateMnemonicFromEntropy, validateMnemonic, mnemonicToSeed, mnemonicToEntropy } from '~/helpers/bip39utils'
import { getFormattedShares, shareGroupName } from '~/helpers/slip39utils'
import { copyInputToClipboard } from '~/helpers/browserUtils'

export default {
  name: 'Generator',
  components: {
    NodeInfo,
    EntropyInput
  },
  data () {
    return {
      shortenMnemonic: false,
      language: 'english',
      words: "12",
      mnemonic: null,
      shortMnemonic: null,
      recoveredSecret: null,
      allShares: null,
      passphrase: '',
      masterThreshold: 1,
      thresholds: [3],
      shareGroups: [5],
      showEntropyInput: false,
      entropy: null
    }
  },
  computed: {
    validMnemonic () {
      if (this.mnemonic && this.shortMnemonic) {
        if (this.shortenMnemonic) {
          const reconstructed = shortMnemonicToOriginal(this.language, this.shortMnemonic)
          return validateMnemonic(reconstructed)
        } else {
          return validateMnemonic(this.mnemonic)
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
      return mnemonicToSeed(this.mnemonic)
    }
  },
  methods: {
    updateEntropy (value) {
      this.entropy = value
      if (this.entropy) {
        this.generateMnemonic()
      }
    },
    clearEntropy () {
      this.entropy = null
      this.clearMnemonic()
    },
    clearMnemonic () {
      if (this.mnemonic) {
        this.mnemonic = null
      }

      if (this.shortMnemonic) {
        this.shortMnemonic = null
      }
    },
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
    generateShares () {
      const groups = this.thresholds.map((t, i) => [t, this.shareGroups[i]])
      const passphrase = this.passphrase
      const masterSecret = mnemonicToEntropy(this.mnemonic).encodeHex()
      this.allShares = getFormattedShares(masterSecret, passphrase, this.masterThreshold, groups)
    },
    generateMnemonic () {
      if (this.entropy) {
        // User generated entropy manually
        this.mnemonic = generateMnemonicFromEntropy(this.language, this.entropy)
      } else {
        this.mnemonic = generateMnemonic(this.language, Number(this.words))
      }
      this.shortMnemonic = shortenMnemonic(this.mnemonic)
    },
    wordCount (str) {
      return str.split(' ').length
    },
    copyToClipboard (elementId) {
      copyInputToClipboard(elementId)
      const [ sharetext, group, share ] = elementId.split('-')
      this.$buefy.snackbar.open(`Copied share ${share} from group ${group}`)
    }
  }
}

</script>

<style>
</style>
