<template>
  <div>
    <v-app-bar elevation="4" color="#ACD1E8">
      <v-icon class="mr-4">fa-backward</v-icon>
      <v-app-title>{{title}}</v-app-title>
    </v-app-bar>
    <MapComp />
  </div>
</template>

<script>
  import MapComp from "../components/Map.vue";

  export default {
    name: 'HomeView',
    components: {
      MapComp
    },
    data: () => ({
      title: 'Programare vizita sucursala',
    }),
  }
</script>
