
<template>
  <b-navbar class="container">
    <template slot="brand">
      <b-navbar-item href="/">
        <img
          src="~/assets/logo.svg"
          alt="SEEDHODLER"
        >
      </b-navbar-item>
    </template>
    <template slot="start" />

    <template slot="end">
      <b-navbar-item tag="router-link" :to="{ name: 'index' }">
        Generate
      </b-navbar-item>
      <b-navbar-item tag="router-link" :to="{ name: 'restore' }">
        Restore
      </b-navbar-item>
    </template>
  </b-navbar>
</template>

<style>
.navbar {
  background-color: transparent;
  height: 90px;
}
</style>
