<template>
  <section class="section">
    <h1 class="page-heading">
      Generate or Restore
    </h1>
    <h3 class="page-subtitle spacer">
      Easily split or restore your seed recovery phrase
    </h3>
    <OnlineCheck />

    <div class="card">
      <div class="card-content">
        <b-tabs position="is-left" expanded>
          <b-tab-item class="spacer-top-md" icon="pencil" label="Generate">
            <Generator />
          </b-tab-item>
          <b-tab-item icon="backup-restore" label="Restore">
            <Restore />
          </b-tab-item>
        </b-tabs>
      </div>
    </div>
    <div class="is-mobile" />
  </section>
</template>

<script>
import Generator from '~/components/Generator'
import OnlineCheck from '~/components/OnlineCheck'
import Restore from '~/components/Restore'
export default {
  name: 'Generate',

  components: {
    Generator,
    OnlineCheck,
    Restore
  }
}
</script>
