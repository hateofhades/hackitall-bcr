<template>
  <v-app-bar elevation="4" color="#ACD1E8">
    <v-icon class="mr-4">fa-backward</v-icon>
    <v-app-title>{{title}}</v-app-title>
  </v-app-bar>
</template>

<script>
  export default {
    name: 'HomeView',
    data: () => ({
      title: 'Programare vizita sucursala',
    }),
  }
</script>
