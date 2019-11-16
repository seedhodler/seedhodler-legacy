<template>
  <div>
    <b-field label="Entropy">
      <b-field>
        <p class="control">
          <button class="button is-outlined is-info " @click="clearEntropy">
            Clear
          </button>
          <button class="button is-outlined is-info " @click="generateRandomEntropy">
            Generate Random
          </button>
          <button :class="isGeneratingEntropy ? 'button is-danger is-active' : 'button is-info is-outlined'" @click="generateEntropy">
            {{ isGeneratingEntropy ? 'Stop Generating' : 'Generate with clicks' }}
          </button>
          <b-button type="is-text" @click="toggleShowEntropyInput">
            Show Input
          </b-button>
          <b-progress v-if="isGeneratingEntropy" type="is-danger" :show-value="true" :max="requiredPoints" :value="pointsGenerated">
              {{ pointsGenerated }} / {{ requiredPoints }}
          </b-progress>
        </p>
      </b-field>
    </b-field>
    </b-field>
    <b-field grouped>
      <div class="field spacer">
        <b-taglist v-if="entropyHash" attached>
          <b-tag type="is-dark">
            Entropy Input Hash
          </b-tag>
          <b-tag :type="isGeneratingEntropy ? 'is-danger' : 'is-warning'">
            {{ entropyHash }}
          </b-tag>
        </b-taglist>
      </div>
    </b-field>
    <b-field>
      <!-- <b-field v-if="showEntropyInput">
        <b-field label="Entropy">
          <b-input v-model="entropy" class="entropy-display" type="textarea" expanded />
        </b-field>
      </b-field> -->
    </b-field>
  </div>
</template>

<script>
import { Uint8ArrayCoordinateRandomize, wordsToUint8Array, digestMessage } from '~/helpers/entropyUtils'

export default {
  name: 'EntropyInput',
  components: {
  },
  data () {
    return {
      isGeneratingEntropy: false,
      entropy: null,
      entropyHash: '',
      entropyGenerationProgress: 0,
      requiredPoints: 500,
      lastX: 0,
      lastY: 0,
      lastEntropyTick: null,
      showEntropyInput: false,
      pointsGenerated: 0
    }
  },
  computed: {
  },
  methods: {
    toggleShowEntropyInput () {
      this.showEntropyInput = !this.showEntropyInput
    },
    clearEntropy () {
      this.entropy = null
      this.lastEntropyTick = null
      this.entropyHash = null
      this.entropyGenerationProgress = 0
    },
    async generateRandomEntropy () {
      this.isGeneratingEntropy = true
      const initArray = wordsToUint8Array(12)
      const entropyArray = window.crypto.getRandomValues(initArray)
      this.entropy = entropyArray
      this.entropyHash = await digestMessage(new TextDecoder('utf-8').decode(this.entropy))
      window.setTimeout(() => {
        this.isGeneratingEntropy = false
      }, 200)
    },
    async generateEntropy (event) {
      this.isGeneratingEntropy = !this.isGeneratingEntropy
      const initArray = wordsToUint8Array(12)
      const entropyArray = this.entropy || window.crypto.getRandomValues(initArray)
      this.pointsGenerated = 0
      this.entropy = entropyArray
      console.log(this.entropy)
      this.entropyHash = await digestMessage(new TextDecoder('utf-8').decode(this.entropy))
      if (this.isGeneratingEntropy) {
        this.entropyGenerationProgress = 0
        window.addEventListener('mousemove', this.addEntropy)
      } else {
        window.removeEventListener('mousemove', this.addEntropy)
      }
    },
    async addEntropy (event) {
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
          this.entropy = Uint8ArrayCoordinateRandomize(this.entropy, x, y)
          console.log(this.entropy)
          this.entropyHash = await digestMessage(new TextDecoder('utf-8').decode(this.entropy))
          console.log(this.entropyHash)
          this.lastEntropyTick = ts
          this.entropyGenerationProgress = Math.round(this.entropy.length / 500 * 100)
          this.pointsGenerated += 1
        }
      }
    }
  }
}

</script>

<style>
</style>
