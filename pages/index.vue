<template>
  <section class="section">
    <h1 class="page-heading">
      Generate
    </h1>
    <h2 class="page-subtitle spacer">
      Easily generate and split your Mnemonic Seed into Shamir Shares
    </h2>
    <div class="is-mobile">
      <generator />
    </div>
  </section>
</template>

<script>
import Generator from '~/components/Generator'
export default {
  name: 'Generate',

  components: {
    Generator
  }
}
</script>
