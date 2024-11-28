<template>
  <v-app>
    <v-container>
      <header>
        <v-toolbar flat>
          <v-toolbar-title>Spotify API</v-toolbar-title>
          <v-spacer />
          <v-btn  to="/">Home</v-btn>
          <v-btn  to="/callback">Callback</v-btn>
        </v-toolbar>
      </header>

      <!-- Renderiza as rotas -->
      <router-view />
    </v-container>
  </v-app>
</template>

<script lang="ts" setup>
</script>
