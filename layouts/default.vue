<template>
  <div>
    <Nav />
    <section class="main-content columns">
      <div class="container">
        <nuxt />
      </div>
    </section>
    <footer class="footer columns">
      <div class="container">
        <div class="column">
          <p><em>* This project is a work in progress (WIP) and should not be used by anyone for any reason</em></p>
        </div>
      </div>
    </footer>
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
