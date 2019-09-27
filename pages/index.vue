<template>
  <section class="section">
    <h1 class="page-heading">
      Generate or Restore
    </h1>
    <h3 class="page-subtitle spacer">
      Easily split or restore your seed recovery phrase
    </h3>
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
