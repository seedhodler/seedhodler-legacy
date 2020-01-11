<template>
  <div ref="entropyInputElement">
    <b-field label="Entropy Generation">
      <b-field>
        <p class="control">
          <b-button size="is-small" type="is-info" outlined @click="generateRandomEntropy">
            Generate Random
          </b-button>
          <b-button :type="isGeneratingEntropy ? 'is-primary' : 'is-info'" size="is-small" outlined @click="generateEntropy">
            {{ isGeneratingEntropy ? 'Stop Generating' : 'Generate Manually' }}
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
    <b-field>
      <b-progress
        v-if="isGeneratingEntropy"
        :show-value="true"
        :max="pointsPerCollection * pointArrayThreshold"
        :value="pointsGenerated"
        size="is-small"
        type="is-primary"
      >
        {{ pointsGenerated }} / {{ pointsPerCollection * pointArrayThreshold }}
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
    stopGeneratingEntropy () {
      this.isGeneratingEntropy = false
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

          if (this.collectedEntropyPoints.length >= this.pointArrayThreshold && this.isGeneratingEntropy) {
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
