<template>
  <div>
    <div v-if="bip32node" class="column">
      <b-field label="Master Extended Private Key (BIP32 Root)">
        <b-input :value="bip32node.toBase58()" expanded />
      </b-field>
      <b-field label="Master Extended Public Key (xpub)">
        <b-input :value="bip32neutered.toBase58()" expanded />
      </b-field>
      <b-field label="Seed">
        <b-input :value="seed.toString('hex')" type="textarea" expanded />
      </b-field>
      <b-field label="Network: WIF">
        <b-input :value="bip32node.network.wif" />
      </b-field>
      <b-field label="Network: Public">
        <b-input :value="bip32node.network.bip32.public" />
      </b-field>
      <b-field label="Network: Private">
        <b-input :value="bip32node.network.bip32.private" />
      </b-field>
      <b-field label="Master Extended Key (xpriv)">
        <b-input :value="bip32node.toBase58()" expanded />
      </b-field>
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
      <b-field label="Derived BIP32 Extended Private Key">
        <b-input :value="derivedPath && derivedPath.toBase58()" expanded />
      </b-field>
      <b-field label="Derived BIP32 Extended Public Key">
        <b-input :value="derivedPath && derivedPath.neutered().toBase58()" expanded />
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
  props: {
    seed: Uint8Array
  },
  data () {
    return {
      derivationPath: 'm/0\'/0/0'
    }
  },
  computed: {
    bip32node () {
      return bip32.fromSeed(this.seed)
    },
    bip32neutered () {
      // returns the public key node (neutered / can't sign)
      return this.bip32node.neutered()
    },
    derivedPath () {
      if (this.validDerivationPath) {
        return this.bip32node.derivePath(this.derivationPath)
      }

      return null
    },
    validDerivationPath () {
      try {
        this.bip32node.derivePath(this.derivationPath)
        return true
      } catch (e) {
        return false
      }
    }
  },
  methods: {
  }
}
</script>
