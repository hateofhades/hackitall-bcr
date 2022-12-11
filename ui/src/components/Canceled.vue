<template>
  <v-container class="pa-0 ma-0" fluid>
    <v-app-bar color="#AAE1FA" rounded>
      <v-spacer></v-spacer>
      <v-toolbar-title class="font-weight-bold">{{ title }}</v-toolbar-title>
      <img
        class="mr-3"
        :src="
          require('../../public/img/logo-BCR-high-resolution-1980x1080-1140x560.jpg')
        "
        height="40"
      />
      <v-spacer></v-spacer>
    </v-app-bar>

    <v-row justify="center">
      <v-col cols="10">
        <p class="ma-10 font-weight-bold">Programarea dumneavoastra a fost anulata cu succes.</p>
	<p class="ma-10">Multumim, echipa BCR</p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "CanceledAppointment",
};
</script>

