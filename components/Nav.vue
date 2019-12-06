
<template>
  <b-navbar class="container">
    <template slot="brand">
      <b-navbar-item href="/">
        <img
          src="/logo.png"
          alt="SEEDHODLER"
        >
        Alpha
      </b-navbar-item>
    </template>
    <template slot="start" />

    <template slot="end">
      <a href="https://github.com/seedhodler/seedhodler" target="_blank" class="navbar-item">
        GitHub (Source)
      </a>
      <b-navbar-item :to="{ name: 'index' }" tag="router-link">
        Generate or Restore
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
