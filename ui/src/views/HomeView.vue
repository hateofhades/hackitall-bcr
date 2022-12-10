<template>
  <v-app-bar class="flex-grow-0" color="#AAE1FA" rounded >
    <v-btn icon
    class="mx-2"
    fab
    dark
    small
    color="primary">
      <v-icon class="mr-4">fa-backward</v-icon>
    </v-btn>
    <v-spacer></v-spacer>
    <v-toolbar-title class="font-weight-bold" >{{title}}</v-toolbar-title>
    <img class="mr-3" :src="require('../../public/img/logo-BCR-high-resolution-1980x1080-1140x560.jpg')" height="40"/>
    <v-spacer></v-spacer>
  </v-app-bar>
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
