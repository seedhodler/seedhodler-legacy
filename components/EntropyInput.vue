<template>
  <div>
    <b-field label="Entropy Generation">
      <b-field>
        <p class="control">
          <b-button @click="generateRandomEntropy" size="is-small" type="is-info" outlined>
            Generate Random
          </b-button>
          <b-button :type="isGeneratingEntropy ? 'is-primary' : 'is-info'" @click="generateEntropy" size="is-small" outlined>
            {{ isGeneratingEntropy ? 'Stop Generating' : 'Generate Manually' }}
          </b-button>
          <b-button @click="clearEntropy" size="is-small" type="is-info" outlined>
            Reset
          </b-button>
          <b-button
            v-if="entropy"
            @click="toggleShowEntropyArray"
            size="is-small"
            icon-left="chevron-down"
            icon-right="alert-octagon"
            type="is-danger"
            outlined
          >
            Show entropy
          </b-button>
        </p>
      </b-field>
    </b-field>
    <b-field>
      <b-progress
        v-if="isGeneratingEntropy"
        :show-value="true"
        :max="requiredPoints"
        :value="pointsGenerated"
        size="is-small"
        type="is-primary"
      >
        {{ pointsGenerated }} / {{ requiredPoints }}
      </b-progress>
    </b-field>
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
    <b-field v-if="showEntropyArray">
      <b-taglist attached>
        <b-tag type="is-dark">
          Mouse Movement Entropy
        </b-tag>
        <b-tag type="is-danger">
          {{ gatheredMouseEntropy }}
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
      isGeneratingEntropy: false,
      entropyGenerationProgress: 0,
      requiredPoints: 256,
      lastX: 0,
      lastY: 0,
      lastEntropyTick: null,
      showEntropyArray: false,
      pointsGenerated: 0,
      gatheredMouseEntropy: []
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
    },
    generateRandomEntropy () {
      const initArray = wordsToUint8Array(Number(this.words))
      const entropyArray = window.crypto.getRandomValues(initArray)
      this.$emit('updateEntropy', entropyArray)
    },
    generateEntropy (event) {
      this.isGeneratingEntropy = !this.isGeneratingEntropy
      const initArray = wordsToUint8Array(Number(this.words))
      const entropyArray = this.entropy || window.crypto.getRandomValues(initArray)
      this.pointsGenerated = 0
      this.$emit('updateEntropy', entropyArray)
      if (this.isGeneratingEntropy) {
        this.entropyGenerationProgress = 0
        window.addEventListener('mousemove', this.addEntropy)
      } else {
        window.removeEventListener('mousemove', this.addEntropy)
      }
    },
    addEntropy (event) {
      if (this.pointsGenerated >= this.requiredPoints) {
        this.isGeneratingEntropy = false
        this.lastEntropyTick = null
        window.removeEventListener('mousemove', this.addEntropy)
      }

      const ts = new Date().getTime()

      if (!this.lastEntropyTick) {
        this.lastEntropyTick = ts
      }

      if (ts - this.lastEntropyTick > 50) {
        const x = event.clientX
        const y = event.clientY
        if (x !== this.lastX && y !== this.lastY) {
          this.lastX = x
          this.lastY = y
          if (this.gatheredMouseEntropy.length >= 16) {
            debounceFunction(async () => {
              const entropyArray = await mouseMovementToHmacEntropy(this.gatheredMouseEntropy, this.entropy)
              this.gatheredMouseEntropy = []
              this.$emit('updateEntropy', entropyArray)
            }, 100)
          } else {
            this.gatheredMouseEntropy.push(mouseMovementEntropy(x, y))
            this.pointsGenerated += 1
            this.lastEntropyTick = ts
          }
        }
      }
    }
  }
}

</script>

<style>
</style>
