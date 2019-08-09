<template>
  <div>
    <Nav />
    <section class="main-content columns">
      <div class="container">
        <nuxt />
      </div>
    </section>
  </div>
</template>

<script>
import Nav from '~/components/Nav'
export default {
  components: {
    Nav
  }
}

</script>
