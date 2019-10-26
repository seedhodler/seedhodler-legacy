<template>
  <!-- <b-message size="is-small" type="is-warning" has-icon>
    Restoring from shares is still under construction
  </b-message> -->
  <div>
    <b-field label="Recovered Phrase" :type="recoveredSecretType">
      <b-input v-model="recoveredSecret" type="textarea" expanded readonly />
    </b-field>
    <b-field v-if="showAddNewShare" label="Add Part" :type="validNewMnemonic ? 'is-success' : 'is-danger'">
      <b-input v-model="newPart" type="textarea" expanded @enter="addPart" />
    </b-field>
    <b-field v-if="showAddNewShare">
      <b-button :disabled="!validNewMnemonic" type="is-success" @click="addPart">
        Add
      </b-button>
    </b-field>
    <div v-if="parts.length">
      <div class="box spacer-top-lg">
        <table class="table">
          <thead>
            <tr>
              <th>#</th>
              <th>part</th>
              <th>actions</th>
            </tr>
          </thead>
          <tbody v-for="(part, index) in parts" :key="index">
            <tr>
              <td>{{ index }}</td>
              <td>{{ simplifyMnemonic(part) }}</td>
              <td>
                <a @click="removePart(index)">
                  <b-icon
                    icon="delete"
                    size="is-small"
                  /></a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import * as bip39 from 'bip39'
import * as slip39 from 'slip39/src/slip39'
import * as slipHelper from 'slip39/src/slip39_helper'
import * as bip32 from 'bip32'

export default {
  name: 'Restore',
  components: {
  },
  data () {
    return {
      parts: [],
      newPart: '',
      passphrase: '',
      showAddNewShare: true,
      recoveredSecret: 'Add parts to recover secret',
      recoveredSecretType: 'is-warning'
    }
  },
  computed: {
    validNewMnemonic () {
      return this.validateMnemonic(this.newPart.trim())
    }
  },
  methods: {
    addPart () {
      const trimmedPart = this.newPart.trim()
      const isValid = this.validateMnemonic(trimmedPart)
      if (!this.parts.includes(trimmedPart) && isValid) {
        this.parts.push(this.newPart.trim())
        this.restore()
      }
      this.newPart = ''
      this.error = ''
    },
    validateMnemonic (mnemonic) {
      return slip39.validateMnemonic(mnemonic)
    },
    removePart (index) {
      this.parts.splice(index, 1)
      this.restore()
    },
    simplifyMnemonic (mnemonic) {
      const words = mnemonic.split(' ')
      const start = words.slice(0, 8)
      const mask = ['...', '...', '...', '...', '...', '...']
      const end = words.slice(-8)

      return start.concat(mask).concat(end).join(' ')
    },
    restore () {
      try {
        this.recoveredSecret = ''
        const recoveredEntropy = slip39.recoverSecret(this.parts.map(part => part.trim()), this.passphrase)
        this.recoveredSecret = bip39.entropyToMnemonic(recoveredEntropy.decodeHex())
        this.recoveredSecretType = 'is-success'
        this.showAddNewShare = false
      } catch (e) {
        this.recoveredSecret = e
        this.recoveredSecretType = 'is-danger'
        this.showAddNewShare = true
      }
    }
  }
}
</script>
