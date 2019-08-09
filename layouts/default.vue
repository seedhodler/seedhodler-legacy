<template>
  <div>
    <Menu>
      <MenuItem>
        Foo
      </MenuItem>
    </Menu>

    <section class="main-content columns">
      <aside class="column is-2 section">
        <p class="menu-label is-hidden-touch">
          General
        </p>
        <ul class="menu-list">
          <li
            v-for="(item, key) of items"
            :key="key"
          >
            <nuxt-link
              :to="item.to"
              exact-active-class="is-active"
            >
              <b-icon :icon="item.icon" /> {{ item.title }}
            </nuxt-link>
          </li>
        </ul>
      </aside>

      <div class="container column is-10">
        <nuxt />
      </div>
    </section>
  </div>
</template>

<script>
import { Menu, MenuItem } from 'buefy'
export default {
  components:
  {
    Menu,
    MenuItem
  },
  data () {
    return {
      items: [
        {
          title: 'Generate',
          icon: 'home',
          to: { name: 'index' }
        }
      ]
    }
  }
}
</script>
