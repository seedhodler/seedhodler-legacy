<template>
  <div ref="entropyInputElement">
    <b-field label="Entropy Generation">
      <b-field>
        <p class="control">
          <b-button size="is-small" type="is-info" outlined @click="generateRandomEntropy">
            Random
          </b-button>
          <b-button :type="isGeneratingFromUserInput ? 'is-primary' : 'is-info'" size="is-small" outlined @click="toggleGenerateFromUserInput">
            {{ isGeneratingFromUserInput ? 'Cancel' : 'Manual' }}
          </b-button>
          <b-button :type="isGeneratingFromMouseMovements ? 'is-primary' : 'is-info'" size="is-small" outlined @click="generateEntropyWithMouseMovement">
            {{ isGeneratingFromMouseMovements ? 'Stop' : 'Mouse' }}
          </b-button>
          <b-button size="is-small" type="is-info" outlined @click="clearEntropy">
            Reset
          </b-button>
          <b-button
            v-if="entropy"
            size="is-small"
            icon-left="chevron-down"
            icon-right="alert-octagon"
            type="is-danger"
            outlined
            @click="toggleShowEntropyArray"
          >
            Show entropy
          </b-button>
        </p>
      </b-field>
    </b-field>
    <b-field v-if="isGeneratingFromMouseMovements">
      <b-progress
        :show-value="true"
        :max="pointsPerCollection * pointArrayThreshold"
        :value="pointsGenerated"
        size="is-small"
        type="is-primary"
      >
        {{ pointsGenerated }} / {{ pointsPerCollection * pointArrayThreshold }}
      </b-progress>
    </b-field>
    <div v-if="isGeneratingFromUserInput" class="spacer">
      <b-field class="spacer-top-lg">
        <b-message size="is-small" type="is-warning" has-icon>
          Using manual entropy is extremely dangerous when used incorrectly. Only use this option if you know what you are doing.
        </b-message>
      </b-field>
      <b-field class="spacer-top-lg" label-position="on-border" label="Manual Entropy Value Types">
        <b-select v-model="manualInputType">
          <option title="binary (base2)" value="binary">
            binary (base2)
          </option>
          <option title="base6" value="base6" disabled>
            base6 (disabled)
          </option>
          <option title="dice" value="dice" disabled>
            dice  (disabled)
          </option>
          <option title="base10" value="base10" disabled>
            base10  (disabled)
          </option>
          <option title="hex (base16)" value="hex" disabled>
            hex (base16)  (disabled)
          </option>
        </b-select>
      </b-field>
      <b-field class="spacer-lg" label="Entropy">
        <b-input v-model="manualUserInput" type="textarea" />
      </b-field>
      <b-field label="Sanitized Input">
        <div class="tile is-ancestor">
          <div class="tile is-4 is-vertical is-parent">
            <div class="tile is-child box">
              <p class="title">
                Info
              </p>
              <p><strong>Input:</strong> {{ manualInputType }}</p>
              <p><strong>Bits:</strong> {{ inputAsBinary.length }} / {{ minBitsOfEntropy }}</p>
              <p><strong>Words:</strong> {{ Math.floor((inputAsBinary.length + binaryChecksum.length) / 11) }}</p>
              <p><strong>Checksum:</strong> {{ binaryChecksum || 'N/A' }}</p>
            </div>
          </div>
          <div class="tile is-parent">
            <div class="tile is-child box">
              <p class="title">
                BIP39
              </p>
              <p><strong>Binary:</strong></p>
              <p>{{ formattedInputAsBinary }}</p>
              <br>
              <p><strong>Word Indexes:</strong></p>
              <p>{{ wordIndexes }}</p>
              <br/>
              <p><strong>Words:</strong></p>
              <p>{{ wordIndexesValues }}</p>
            </div>
          </div>
        </div>
      </b-field>

      <b-field>
        <b-button
          type="is-warning"
          :disabled="!validManualInput"
          @click="generateEntropyFromUserInput"
        >
          Use Raw Entropy
        </b-button>
      </b-field>
    </div>
    <b-field v-if="showEntropyArray">
      <b-taglist attached>
        <b-tag type="is-dark">
          Entropy Seed
        </b-tag>
        <b-tag type="is-danger">
          {{ entropyAsHexString }}
        </b-tag>
      </b-taglist>
    </b-field>
    <b-field v-for="(collectedPoints, index) in collectedEntropyPoints.concat(currentEntropyPoints.length ? [currentEntropyPoints] : [])" :key="index">
      <b-taglist v-if="showEntropyArray" attached>
        <b-tag type="is-dark">
          {{ index }}
        </b-tag>
        <b-tag type="is-danger">
          {{ collectedPoints }}
        </b-tag>
      </b-taglist>
    </b-field>
  </div>
</template>

<script>
import { wordsToUint8Array, mouseMovementEntropy, mouseMovementToHmacEntropy, binaryStrToEntropyArray } from '~/helpers/entropyUtils'
import { deriveChecksumBits, indexToWord } from '~/helpers/bip39utils'

let timerId = null

const debounceFunction = (func, delay) => {
  // Cancels the setTimeout method execution
  clearTimeout(timerId)

  // Executes the func after delay time.
  timerId = setTimeout(func, delay)
}

const MANUAL_INPUT_TYPES = {
  binary: {
    regex: /(0|1)/g,
    base: 2
  },
  dice: {
    regex: /(1|2|3|4|5|6)/g
  },
  base6: {
    regex: /(0|1|2|3|4|5)/g,
    base: 6
  },
  base10: {
    regex: /(0|1|2|3|4|5|6|7|8|9)/g,
    base: 10
  },
  hex: {
    regex: /[0-9a-f]+/i,
    base: 16
  }

}

export default {
  name: 'EntropyInput',
  components: {
  },
  props: {
    words: String,
    entropy: Uint8Array
  },
  data () {
    return {
      isGeneratingFromMouseMovements: false,
      isGeneratingFromUserInput: false,
      entropyGenerationProgress: 0,
      manualUserInput: '',
      manualInputType: 'binary',
      pointsPerCollection: 16,
      pointArrayThreshold: Number(this.words) / 3, // assume entropy of 2 bits per point
      entropyLastTickDelay: 100,
      lastX: 0,
      lastY: 0,
      lastEntropyTick: null,
      showEntropyArray: false,
      pointsGenerated: 0,
      collectedEntropyPoints: [],
      currentEntropyPoints: []
    }
  },
  computed: {
    minBitsOfEntropy () {
      return Math.ceil(Number(this.words) * 32 / 3)
    },
    validManualInput () {
      return this.inputAsBinary.length && this.inputAsBinary.length >= this.minBitsOfEntropy
    },
    sanitizedInput () {
      const matches = this.manualUserInput.match(MANUAL_INPUT_TYPES[this.manualInputType].regex)
      if (matches) {
        return matches.join('').toUpperCase()
      } else {
        return ''
      }
    },
    inputAsBinary () {
      if (!this.sanitizedInput.length > 0) {
        return ''
      }

      if (this.manualInputType === 'binary') {
        const start = this.sanitizedInput.length - this.minBitsOfEntropy
        const binaryStr = this.sanitizedInput.substring(start)
        return binaryStr
      } else {
        let binaryRep = (parseInt(this.sanitizedInput, MANUAL_INPUT_TYPES[this.manualInputType].base).toString(2)).padStart(4, '0')
        if (binaryRep.length % 2 !== 0) {
          binaryRep = binaryRep.padStart(binaryRep.length + 1, '0')
        }
        return binaryRep
      }
    },
    entropyAsHexString() {
      return this.entropy === null ? '' : '0x' + Buffer.from(this.entropy.buffer).toString('hex')
    },
    formattedInputAsBinary () {
      const bytes = []
      const binAndCheckSum = this.inputAsBinary + this.binaryChecksum
      for (let k = 0; k <= binAndCheckSum.length - 11; k += 11) {
        bytes.push(binAndCheckSum.substring(k, k + 11))
      }
      return bytes.join(' ')
    },
    binaryChecksum () {
      return deriveChecksumBits(binaryStrToEntropyArray(this.inputAsBinary))
    },
    wordIndexes () {
      return this.formattedInputAsBinary.split(' ').map(byte => parseInt(byte, 2))
    },
    wordIndexesValues () {
      return this.wordIndexes.map(index => indexToWord(index))
    }
  },
  watch: {
    words () {
      const oldEntropy = this.entropy
      const newEntropy = this.generateRandomEntropy()
      this.pointArrayThreshold = Number(this.words) / 3
      if (oldEntropy && oldEntropy.length > 0) {
        Buffer.from(oldEntropy.buffer).copy(
          Buffer.from(newEntropy.buffer),
          0,
          0,
          Math.min(oldEntropy.length, newEntropy.length)
        )
        this.$emit('updateEntropy', newEntropy)
      }
    }
  },
  methods: {
    toggleShowEntropyArray () {
      this.showEntropyArray = !this.showEntropyArray
    },
    clearEntropy () {
      this.$emit('clearEntropy')
      this.lastEntropyTick = null
      this.entropyGenerationProgress = 0
      this.pointsGenerated = 0
      this.collectedEntropyPoints = []
      this.currentEntropyPoints = []
      this.manualUserInput = ''
    },
    generateRandomEntropy () {
      const initArray = wordsToUint8Array(Number(this.words))
      const entropyArray = window.crypto.getRandomValues(initArray)
      this.$emit('updateEntropy', entropyArray)
      return entropyArray
    },
    generateEntropyWithMouseMovement (event) {
      this.isGeneratingFromMouseMovements = !this.isGeneratingFromMouseMovements
      const entropy = this.entropy ?? this.generateRandomEntropy()
      this.pointsGenerated = 0
      if (this.isGeneratingFromMouseMovements) {
        this.entropyGenerationProgress = 0
        window.addEventListener('mousemove', this.addEntropy)
      } else {
        window.removeEventListener('mousemove', this.addEntropy)
      }
    },
    validateManualInput (event) {
      console.log('Im validating something')
      return true
    },
    toggleGenerateFromUserInput () {
      this.isGeneratingFromUserInput = !this.isGeneratingFromUserInput
    },
    generateEntropyFromUserInput (event) {
      const initArray = wordsToUint8Array(Number(this.words))
      const entropyArray = binaryStrToEntropyArray(this.inputAsBinary)
      this.$emit('updateEntropy', entropyArray)
      // this.pointsGenerated = 0
      // this.$emit('updateEntropy', entropyArray)
      // if (this.isGeneratingFromMouseMovements) {
      //   this.entropyGenerationProgress = 0
      //   window.addEventListener('mousemove', this.addEntropy)
      // } else {
      //   window.removeEventListener('mousemove', this.addEntropy)
      // }
    },
    stopGeneratingEntropy () {
      this.isGeneratingFromMouseMovements = false
      this.lastEntropyTick = null
      window.removeEventListener('mousemove', this.addEntropy)
    },
    async addEntropy (event) {
      if (this.pointsGenerated >= this.requiredPoints) {
        this.stopGeneratingEntropy()
      }

      const entropy = this.entropy ?? this.generateRandomEntropy()
      const ts = new Date().getTime()

      if (!this.lastEntropyTick) {
        this.lastEntropyTick = ts
      }

      if (ts - this.lastEntropyTick > this.entropyLastTickDelay) {
        const x = event.clientX
        const y = event.clientY
        if (x !== this.lastX || y !== this.lastY) {
          this.lastX = x
          this.lastY = y
          if (this.currentEntropyPoints.length >= this.pointsPerCollection) {
            this.collectedEntropyPoints.push(this.currentEntropyPoints)
            this.currentEntropyPoints = []
          } else {
            this.currentEntropyPoints.push(mouseMovementEntropy(x, y))
            this.pointsGenerated += 1
            this.lastEntropyTick = ts
          }

          if (this.collectedEntropyPoints.length >= this.pointArrayThreshold && this.isGeneratingFromMouseMovements) {
            const loadingComponent = this.$buefy.loading.open({
              container: this.$refs.entropyInputElement.$el
            })
            this.stopGeneratingEntropy()

            const newEntropy = await mouseMovementToHmacEntropy(this.collectedEntropyPoints.flat(), entropy)

            loadingComponent.close()
            this.collectedEntropyPoints = []
            this.$emit('updateEntropy', newEntropy)
          }
        }
      }
    }
  }
}

</script>

<style>
</style>
