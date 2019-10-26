<template>
  <div>
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
    <div class="column">
      <b-field
        horizontal
        :type="validDerivationPath ? 'is-success' : 'is-warning'"
        :message="validDerivationPath ? 'valid path' : 'invalid path'"
        label="Path"
      >
        <b-input v-model="derivationPath" />
      </b-field>
      <b-field label="Private Key (WIF)">
        <b-input :value="derivedPath && derivedPath.toWIF()" expanded />
      </b-field>
      <b-field label="Derived Private Key">
        <b-input :value="derivedPath && derivedPath.toBase58()" expanded />
      </b-field>
    </div>
  </div>
</template>
<script>
import * as bip32 from 'bip32'

export default {
  name: 'NodeInfo',
  components: {
  },
  props: ['seed'],
  data () {
    return {
      derivationPath: 'm/0\'/0/0'
    }
  },
  computed: {
    bip32node () {
      return bip32.fromSeed(this.seed)
    },
    derivedPath () {
      if (this.validDerivationPath(this.derivationPath)) {
        return this.bip32node.derivePath(this.derivationPath)
      }

      return null
    }
  },
  methods: {
    validDerivationPath () {
      let valid = true
      try {
        this.bip32node.derivePath(this.derivationPath)
      } catch (e) {
        valid = false
      }
      return valid
    }
  }
}
</script>
