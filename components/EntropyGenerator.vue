// <template>
  //   <div>
    //     <b-field label="Entropy">
      //       <b-field>
        //         <p class="control">
          //           <button class="button is-outlined is-info " @click="clearEntropy">
            //             Clear
            //
          </button>
          //           <button class="button is-outlined is-info " @click="generateRandomEntropy">
            //             Generate Random
            //
          </button>
          //           <button :class="isGeneratingEntropy ? 'button is-danger is-active' : 'button is-info is-outlined'" @click="generateEntropy">
            //             {{ isGeneratingEntropy ? 'Stop Generating' : 'Generate with clicks' }}
            //
          </button>
          //           <b-button type="is-text" @click="toggleShowEntropyInput">
            //             Show Input
            //
          </b-button>
          //           <b-progress v-if="isGeneratingEntropy" type="is-danger" :value="entropyGenerationProgress" />
          //
        </p>
        //
      </b-field>
      //
    </b-field>
    //     </b-field>
    //     <b-field grouped>
      //       <div class="field spacer">
        //         <b-taglist v-if="entropyHash" attached>
          //           <b-tag type="is-dark">
            //             Entropy Input Hash
            //
          </b-tag>
          //           <b-tag :type="isGeneratingEntropy ? 'is-danger' : 'is-warning'">
            //             {{ entropyHash }}
            //
          </b-tag>
          //
        </b-taglist>
        //
      </div>
      //
    </b-field>
    //     <b-field>
      //       <b-field v-if="showEntropyInput">
        //         <b-field label="Entropy">
          //           <b-input v-model="entropy" class="entropy-display" type="textarea" expanded />
          //
        </b-field>
        //
      </b-field>
      //
    </b-field>
    //
  </div>
  //
</template>

<script>

// async function digestMessage (message) {
//   const msgUint8 = new TextEncoder().encode(message) // encode as (utf-8) Uint8Array
//   const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8) // hash the message
//   const hashArray = Array.from(new Uint8Array(hashBuffer)) // convert buffer to byte array
//   const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('') // convert bytes to hex string
//   return hashHex
// }

// export default {
//   name: 'EntropyGenerator',
//   components: {
//   },
//   data () {
//     return {
//       isGeneratingEntropy: false,
//       entropy: null,
//       entropyHash: '',
//       entropyGenerationProgress: 0,
//       entropyLength: 100,
//       lastX: 0,
//       lastY: 0,
//       lastEntropyTick: null,
//       showEntropyInput: false,
//       recoveredSecret: null
//     }
//   },
//   methods: {

//     toggleShowEntropyInput () {
//       this.showEntropyInput = !this.showEntropyInput
//     },
//     clearEntropy () {
//       this.entropy = null
//       this.lastEntropyTick = null
//       this.entropyHash = null
//       this.entropyGenerationProgress = 0
//     },
//     async generateRandomEntropy () {
//       this.isGeneratingEntropy = true
//       const array = new Uint8Array(64)
//       const randomUint8array = window.crypto.getRandomValues(array)
//       this.entropy = new TextDecoder('utf-8').decode(randomUint8array)
//       this.entropyHash = await digestMessage(this.entropy)
//       window.setTimeout(() => {
//         this.isGeneratingEntropy = false
//       }, 200)
//     },
//     generateEntropy (event) {
//       this.isGeneratingEntropy = !this.isGeneratingEntropy
//       if (this.isGeneratingEntropy) {
//         this.entropyGenerationProgress = 0
//         window.addEventListener('click', this.addEntropy)
//       } else {
//         window.removeEventListener('click', this.addEntropy)
//       }
//     },
//     async addEntropy (event) {
//       if (this.entropy && this.entropy.length >= 500) {
//         this.isGeneratingEntropy = false
//         this.lastEntropyTick = null
//         this.entropyGenerationProgress = 100
//         window.removeEventListener('click', this.addEntropy)
//       }

//       const ts = new Date().getTime()
//       if (!this.lastEntropyTick) {
//         this.lastEntropyTick = ts
//       }
//       if (ts - this.lastEntropyTick > 100) {
//         const x = event.clientX
//         const y = event.clientY
//         if (x !== this.lastX && y !== this.lastY) {
//           this.lastX = x
//           this.lastY = y
//           const z = (Math.random(x) * Math.random(y) * 100).toString()
//           const zArray = new Uint8Array(z)
//           const randomUint8array = window.crypto.getRandomValues(zArray)
//           this.entropy += new TextDecoder('utf-8').decode(randomUint8array)
//           this.entropyHash = await digestMessage(this.entropy)
//           this.lastEntropyTick = ts
//           this.entropyGenerationProgress = Math.round(this.entropy.length / 500 * 100)
//         }
//       }
//     }
//   }
// }

// </script>
