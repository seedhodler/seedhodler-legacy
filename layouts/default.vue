<template>
  <div>
    <Nav />
    <section class="main-content columns">
      <div class="container">
        <nuxt />
      </div>
    </section>
    <Footer />
  </div>
</template>

<script>
import Nav from '~/components/Nav'
import Footer from '~/components/Footer'
export default {
  components: {
    Nav,
    Footer
  }
}

</script>
