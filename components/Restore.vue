<template>
  <div>
    <b-field label="Recovered Phrase" :type="recoveredSecretType">
      <b-input v-model="recoveredSecret" type="textarea" expanded readonly />
    </b-field>
    <b-field v-if="showAddNewShare" label="Add share" :type="validNewMnemonic ? 'is-success' : 'is-danger'">
      <b-input
        ref="addinput"
        v-model="newShare"
        type="textarea"
        @enter="addShare"
        expanded
      />
    </b-field>
    <b-field v-if="showAddNewShare">
      <b-button :disabled="!validNewMnemonic" type="is-success" @click="addShare">
        Add
      </b-button>
    </b-field>
    <div v-if="shares.length">
      <table class="spacer-top-lg table is-striped is-fullwidth is-bordered">
        <thead>
          <tr>
            <th>#</th>
            <th>share</th>
            <th>actions</th>
          </tr>
        </thead>
        <tbody v-for="(share, index) in shares" :key="index">
          <tr>
            <td>{{ index }}</td>
            <td>{{ simplifyMnemonic(share) }}</td>
            <td>
              <a @click="removeShare(index)">
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
</template>

<script>

import { entropyToMnemonic } from '~/helpers/bip39utils'
import { recoverSecret, validateShareMnemonic, shareGroupName } from '~/helpers/slip39utils'

export default {
  name: 'Restore',
  components: {
  },
  data () {
    return {
      shares: [],
      newShare: '',
      passphrase: '',
      showAddNewShare: true,
      recoveredSecret: 'Add shares to recover secret',
      recoveredSecretType: 'is-info'
    }
  },
  computed: {
    validNewMnemonic () {
      return validateShareMnemonic(this.newShare.trim())
    }
  },
  methods: {
    focusAddShareInput () {
      this.$refs.addinput.focus()
    },
    addShare () {
      const trimmedshare = this.newShare.trim()
      const isValid = validateShareMnemonic(trimmedshare)
      if (!this.shares.includes(trimmedshare) && isValid) {
        this.shares.push(this.newShare.trim())
        this.restore()
      }
      this.newShare = ''
      this.error = ''
      this.focusAddShareInput()
    },
    removeShare (index) {
      this.shares.splice(index, 1)
      this.restore()
    },
    simplifyMnemonic (mnemonic) {
      const words = mnemonic.split(' ')
      const start = words.slice(0, 8)
      const mask = ['...', '...', '...', '...', '...']
      const end = words.slice(-8)
      return start.concat(mask).concat(end).join(' ')
    },
    restore () {
      try {
        this.recoveredSecret = ''
        const sanitizedShares = this.shares.map(share => share.trim())
        const recoveredEntropy = recoverSecret(sanitizedShares, this.passphrase)
        this.recoveredSecret = entropyToMnemonic(recoveredEntropy.decodeHex())
        this.recoveredSecretType = 'is-success'
        this.showAddNewShare = false
      } catch (e) {
        if (e.message.startsWith('Wrong number of mnemonics')) {
          this.recoveredSecret = `Please continue adding shares from the group starting with "${shareGroupName(this.shares[0])}" to restore the recovery phrase`
          this.recoveredSecretType = 'is-info'
          this.showAddNewShare = true
        } else {
          this.recoveredSecret = e
          this.recoveredSecretType = 'is-danger'
          this.showAddNewShare = true
        }
      }
    }
  }
}
</script>
