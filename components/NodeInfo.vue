<template>
  <div>
    <div v-if="bip32node" class="column">
      <b-field label="use SLIP39">
        <b-input :value="slip39" />
      </b-field>
      <b-field label="Seed">
        <b-input :value="seed.toString('hex')" type="textarea" expanded />
      </b-field>
      <b-field label="Master Extended Private Key (BIP32 Root)">
        <b-input :value="bip32node.toBase58()" expanded />
      </b-field>

      <!--
      <b-field label="Network: WIF">
        <b-input :value="bip32node.network.wif" />
      </b-field>
      <b-field label="Network: Public">
        <b-input :value="bip32node.network.bip32.public" />
      </b-field>
      <b-field label="Network: Private">
        <b-input :value="bip32node.network.bip32.private" />
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
      -->

    </div>
    <div class="column">
      <b-field grouped>
        <b-field label-position="on-border" label="Coin">
          <b-select v-model="coin">
            <option title="BTC" value="btcMain">
              BTC
            </option>
            <option title="BTC Testnet" value="btcTest">
              BTC Testnet
            </option>
          </b-select>
        </b-field>

        <b-field label-position="on-border" label="Derivation Standard">
          <b-select v-model="derivationStandard">
            <option title="BIP44" value="bip44">
              BIP44 (P2PKH address)
            </option>
            <option title="BIP49" value="bip49">
              BIP49 (P2SH segwit address)
            </option>
            <option title="BIP84" value="bip84">
              BIP84 (P2WPKH Bech address)
            </option>
            <option title="Custom path" value="custom">
              Custom BIP32 path
            </option>
          </b-select>
        </b-field>

        <b-field v-if="derivationStandard != 'custom'" label-position="on-border" label="Account">
          <b-numberinput
            v-model="account"
            type="is-info"
            controls-position="compact"
            min="0"
          />
        </b-field>

        <b-field v-if="derivationStandard != 'custom'" label-position="on-border" label="Address type">
          <b-radio v-model="internal" :native-value="false">
            external
          </b-radio>
          <b-radio v-model="internal" :native-value="true">
            internal
          </b-radio>
        </b-field>
      </b-field>
      <b-field
        v-if="derivationStandard == 'custom'"
        :type="validDerivationPath ? 'is-success' : 'is-warning'"
        :message="validDerivationPath ? 'valid path' : 'invalid path'"
        horizontal
        label="Path"
      >
        <b-input v-model="derivationPath" />
      </b-field>

      <template v-if="derivationStandard != 'custom'">
        <b-field label="Account Extended Private Key">
          <b-input :value="accountNode.toBase58()" expanded disabled />
        </b-field>
        <b-field label="Account Extended Public Key">
          <b-input :value="accountNode.neutered().toBase58()" expanded disabled />
        </b-field>
        <b-field label="BIP32 Derivation Path">
          <b-input :value="derivedPath" expanded disabled />
        </b-field>
      </template>

      <b-field label="Derived BIP32 Extended Private Key">
        <b-input :value="derivedNode && derivedNode.toBase58()" expanded disabled />
      </b-field>
      <b-field label="Derived BIP32 Extended Public Key">
        <b-input :value="derivedNode && derivedNode.neutered().toBase58()" expanded disabled />
      </b-field>

          <div class="table-container">
            <table class="table is-fullwidth is-striped is-bordered">
              <thead>
                <th>BIP32 Path</th>
                <th>Address</th>
                <th>Public Key</th>
                <th>Private Key</th>
              </thead>
              <tbody>
                <tr
                  v-for="index in Array(20).keys()"
                  :key="index"
                >
                  <td>
                    <b-input
                      :id="'addressPath-' + index"
                      :value="addressPath(index)"
                      disabled
                      expanded
                    />
                  </td>
                  <td>
                    <b-input
                      :id="'address-' + index"
                      :value="address(index)"
                      type="textarea"
                      readonly
                      expanded
                    />
                  </td>
                  <td>
                    <b-input
                      :id="'addressPubKey-' + index"
                      :value="addressPubKey(index).toString('hex')"
                      type="textarea"
                      readonly
                      expanded
                    />
                  </td>
                  <td>
                    <b-input
                      :id="'addressPrivKey-' + index"
                      :value="addressPrivKey(index)"
                      type="textarea"
                      readonly
                      expanded
                    />
                  </td>

                </tr>
              </tbody>
            </table>
          </div>
    </div>
  </div>
</template>
<script>
import * as bip32 from 'bip32'
import { encodePrivKey, p2pkh, p2sh, p2wpkh } from '~/helpers/base58utils'

export default {
  name: 'NodeInfo',
  components: {
  },
  props: {
    seed: Uint8Array,
    slip39: Boolean
  },
  data () {
    return {
      account: 0,
      coin: 'btcMain',
      derivationPath: 'm/49\'/0\'/0\'/0',
      derivationStandard: 'bip49',
      info: {
        bip44_purpose: '44\'',
        bip49_purpose: '49\'',
        bip84_purpose: '84\'',
        btcMain: {
          coin: '0\'',
          wifPrefix: 0x80,
          bip44: {
            addressPrefix: new Uint8Array([0x00]),
            networkPrivate: 0x0488ade4,
            networkPublic: 0x0488b21e
          },
          bip49: {
            addressPrefix: new Uint8Array([0x05]),
            networkPrivate: 0x049d7878,
            networkPublic: 0x049d7cb2
          },
          bip84: {
            addressPrefix: 'bc',
            networkPrivate: 0x04b2430c,
            networkPublic: 0x04b24746
          }
        },
        btcTest: {
          coin: '1\'',
          wifPrefix: 0xef,
          bip44: {
            addressPrefix: new Uint8Array([0x6f]),
            networkPrivate: 0x04358394,
            networkPublic: 0x043587cf
          },
          bip49: {
            addressPrefix: new Uint8Array([0xc4]),
            networkPrivate: 0x044a4e28,
            networkPublic: 0x044a5262
          },
          bip84: {
            addressPrefix: 'tb',
            networkPrivate: 0x045f18bc,
            networkPublic: 0x045f1cf6
          }
        }
      },
      internal: false
    }
  },
  computed: {
    bip32node () {
      return bip32.fromSeed(this.seed, this.network)
    },
    bip32neutered () {
      // returns the public key node (neutered / can't sign)
      return this.bip32node.neutered()
    },
    accountPath() {
      const info = this.info[this.coin]
      const purpose = this.info[this.derivationStandard + '_purpose']
      return ('m/' + purpose + '/' + info.coin + '/' + this.account + '\'')
    },
    accountNode() {
      return this.bip32node.derivePath(this.accountPath)
    },
    derivedPath() {
     if (this.derivationStandard != 'custom') {
        return (this.accountPath + (this.internal ? '/1' : '/0'))
      }
      else if (this.validDerivationPath) {
        return this.derivationPath
      }

      return null
    },
    derivedNode () {
      const path = this.derivedPath
      if (path != null)
        return this.bip32node.derivePath(path)

      return null
    },
    network () {
      if (this.derivationStandard != 'custom') {
        const info = this.info[this.coin]
        const params = info[this.derivationStandard]
        return {
          wif: info.wifPrefix,
          bip32: {
            public: params.networkPublic,
            private: params.networkPrivate
          }
        }
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
    addressNode (index) {
      return this.derivedNode.derivePath(index.toString())
    },
    addressPath (index) {
      return this.derivedPath + '/' + index
    },
    addressPubKey (index) {
      return this.addressNode(index).publicKey
    },
    addressPrivKey (index) {
      const wifPrefix = this.info[this.coin].wifPrefix
      return encodePrivKey(this.addressNode(index).privateKey, wifPrefix)
    },
    address (index) {
      const pubKey = this.addressNode(index).publicKey
      if (this.derivationStandard === 'bip49') {
        return p2sh(pubKey, this.info[this.coin].bip49.addressPrefix)
      }
      else if (this.derivationStandard === 'bip84') {
        return p2wpkh(pubKey, this.info[this.coin].bip84.addressPrefix)
      }
      return p2pkh(pubKey, this.info[this.coin].bip44.addressPrefix)
    }
  }
}
</script>
