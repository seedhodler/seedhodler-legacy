<template>
  <div class="card">
    <div class="card-content">
      <div class="content has-text-centered">
        <b-notification
          :type="isOnline ? 'is-warning' : 'is-success'"
          aria-close-label="Close notification"
          role="alert"
        >
          You are currently <em>{{ isOnline ? 'online' : 'offline' }}</em>
          <span v-if="isOnline">
            . This tool should only be used when you're offline
          </span>
        </b-notification>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Generator',
  components: {
  },
  data () {
    return {
      isOnline: true
    }
  },
  created () {
    if (process.browser) {
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
