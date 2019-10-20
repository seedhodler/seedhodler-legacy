<template>
  <b-message v-if="isOnline" size="is-small" type="is-danger" has-icon>
    You are currently <em>online</em>. This tool should only be used when you're offline
  </b-message>
</template>

<script>
export default {
  name: 'OnlineCheck',
  components: {
  },
  data () {
    return {
      isOnline: true
    }
  },
  computed: {
  },
  created () {
    if (process.browser) {
      this.checkOnlineStatus()
      window.addEventListener('online', this.checkOnlineStatus)
      window.addEventListener('offline', this.checkOnlineStatus)
    }
  },
  destroyed () {
    if (process.browser) {
      window.addEventListener('online', this.checkOnlineStatus)
      window.addEventListener('offline', this.checkOnlineStatus)
    }
  },
  methods: {
    checkOnlineStatus () {
      this.isOnline = navigator.onLine
    }
  }
}
</script>
