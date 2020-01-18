<template>
  <div ref="entropyInputElement">
    <b-field label="Entropy Generation">
      <b-field>
        <p class="control">
          <b-button size="is-small" type="is-info" outlined @click="generateRandomEntropy">
            Generate Random
          </b-button>
          <b-button :type="isGeneratingFromMouseMovements ? 'is-primary' : 'is-info'" size="is-small" outlined @click="generateEntropyWithMouseMovement">
            {{ isGeneratingFromMouseMovements ? 'Stop Generating' : 'Generate with Movement' }}
          </b-button>
          <b-button :type="isGeneratingFromUserInput ? 'is-primary' : 'is-info'" size="is-small" outlined @click="generateEntropyFromUserInput">
            {{ isGeneratingFromUserInput ? 'Stop Generating' : 'Generate from input' }}
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
      <b-field label-position="on-border" label="Manual Entropy Value Types">
        <b-select v-model="manualInputType">
          <option title="binary (base2)" value="binary">
            binary (base2)
          </option>
          <option title="base6" value="base6">
            base6
          </option>
          <option title="dice" value="dice">
            dice
          </option>
          <option title="base10" value="base10">
            base10
          </option>
          <option title="hex (base16)" value="hex">
            hex (base16)
          </option>
        </b-select>
      </b-field>
      <b-field class="spacer-lg">
        <b-input v-model="manualUserInput" type="textarea" />
      </b-field>
      <b-field label="Sanitized Input">
        <b-input v-model="sanitizedInput" type="text" readonly disabled />
      </b-field>
      <b-field label="Raw Binary">
        <b-input v-model="inputAsBinary" type="text" readonly disabled />
      </b-field>
    </div>
    <b-field v-if="showEntropyArray">
      <b-taglist attached>
        <b-tag type="is-dark">
          Entropy from HMAC
        </b-tag>
        <b-tag type="is-danger">
          {{ entropy }}
        </b-tag>
      </b-taglist>
    </b-field>
    <b-field v-for="(collectedPoints, index) in collectedEntropyPoints" :key="index">
      <b-taglist attached>
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
import { uint8ArrayCoordinateRandomize, wordsToUint8Array, uint8ArrayToHash, mouseMovementEntropy, mouseMovementToHmacEntropy } from '~/helpers/entropyUtils'

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
      pointArrayThreshold: 8,
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
    sanitizedInput () {
      console.log(MANUAL_INPUT_TYPES[this.manualInputType].regex)
      const matches = this.manualUserInput.match(MANUAL_INPUT_TYPES[this.manualInputType].regex)
      console.log(JSON.stringify(matches))
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
        return this.sanitizedInput
      } else {
        let binaryRep = (parseInt(this.sanitizedInput, MANUAL_INPUT_TYPES[this.manualInputType].base).toString(2)).padStart(4, '0')
        if (binaryRep.length % 2 !== 0) {
          binaryRep = binaryRep.padStart(binaryRep.length + 1, '0')
        }
        return binaryRep
      }
    }
  },
  watch: {
    words () {
      this.generateRandomEntropy()
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
    },
    generateEntropyWithMouseMovement (event) {
      this.isGeneratingFromMouseMovements = !this.isGeneratingFromMouseMovements
      const initArray = wordsToUint8Array(Number(this.words))
      const entropyArray = this.entropy || window.crypto.getRandomValues(initArray)
      this.pointsGenerated = 0
      this.$emit('updateEntropy', entropyArray)
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
    generateEntropyFromUserInput (event) {
      this.isGeneratingFromUserInput = !this.isGeneratingFromUserInput
      const initArray = wordsToUint8Array(Number(this.words))
      const entropyArray = this.entropy || window.crypto.getRandomValues(initArray)
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

      const ts = new Date().getTime()

      if (!this.lastEntropyTick) {
        this.lastEntropyTick = ts
      }

      if (ts - this.lastEntropyTick > this.entropyLastTickDelay) {
        const x = event.clientX
        const y = event.clientY
        if (x !== this.lastX && y !== this.lastY) {
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
            const initArray = wordsToUint8Array(Number(this.words))
            let entropyArray = window.crypto.getRandomValues(initArray)

            // Loop over all the collected point arrays, generate hmac sig and use that as entropyArray for the next loop
            for (let k = 0; k < this.collectedEntropyPoints.length; k++) {
              entropyArray = await mouseMovementToHmacEntropy(this.collectedEntropyPoints[k], entropyArray)
            }

            loadingComponent.close()
            this.collectedEntropyPoints = []
            this.$emit('updateEntropy', entropyArray)
          }
        }
      }
    }
  }
}

</script>

<style>
</style>
