<template>
  <v-container class="pa-0 ma-0" fluid>
    <v-app-bar color="#AAE1FA" rounded>
      <v-btn
        :disabled="e1 == 1"
        @click="goBack"
        icon
        fab
        dark
        small
        color="primary"
      >
        <v-icon class="mx-2" dark left>mdi-arrow-left</v-icon>
      </v-btn>
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
        <v-stepper v-model="e1" class="mt-4" elevation="4">
          <v-stepper-header>
            <v-stepper-step :complete="e1 > 1" step="1">
              Alege scop vizita
            </v-stepper-step>

            <v-divider></v-divider>

            <v-stepper-step :complete="e1 > 2" step="2">
              Alege locatia
            </v-stepper-step>

            <v-divider></v-divider>

            <v-stepper-step :complete="e1 > 3" step="3">
              Alege ziua si data
            </v-stepper-step>

            <v-divider></v-divider>

            <v-stepper-step :complete="e1 > 4" step="4">
              Completeaza datele personale
            </v-stepper-step>

            <v-divider></v-divider>

            <v-stepper-step step="5">
              Sumarul programarii
            </v-stepper-step>
          </v-stepper-header>

          <v-stepper-items>
            <v-stepper-content step="1">
              <v-card elevation="0">
                <v-list-item-group v-model="settings" multiple active-class="" dense>
                  <v-list
                    rounded
                    class="ma-0"
                    style="
                      max-width: 100%;
                      white-space: normal;
                      word-wrap: break-word;
                    "
                  >
                    <v-list-item
                      v-for="optiune in optiuni"
                      v-bind:key="optiune.name"
                      :value="optiune"
                    >
                      <template v-slot:default="{ active }">
                        <v-list-item-content>
                          <v-list-item-title style="word-wrap: break-word">{{
                            optiune.name
                          }}</v-list-item-title>
                        </v-list-item-content>
                        <v-list-item-action>
                          <v-checkbox
                            :hidden="true"
                            :input-value="active"
                            off-icon=" "
                            on-icon="mdi-check-decagram"
                            color="green"
                          ></v-checkbox>
                        </v-list-item-action>
                      </template>
                    </v-list-item>
                  </v-list>
                </v-list-item-group>
              </v-card>

              <v-btn color="primary" @click="e1 = 2"> Continuati </v-btn>
            </v-stepper-content>

            <v-stepper-content step="2">
              <v-card class="mb-12" height="200px" elevation="0"></v-card>

              <v-btn color="primary" @click="e1 = 3"> Continuati </v-btn>
            </v-stepper-content>

            <v-stepper-content step="3">
              <v-card class="mb-12" height="200px" elevation="0"></v-card>

              <v-btn color="primary" @click="e1 = 4"> Continuati </v-btn>
            </v-stepper-content>

            <v-stepper-content step="4">
              <v-card class="mb-12" height="200px" elevation="0"></v-card>

              <v-btn color="primary" @click="e1 = 5"> Continuati </v-btn>
            </v-stepper-content>

            <v-stepper-content step="5">
              <v-card class="mb-12" height="200px" elevation="0"></v-card>

              <v-btn color="primary" @click="e1 = 1"> Finalizati </v-btn>
            </v-stepper-content>
          </v-stepper-items>
        </v-stepper>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "HomeView",
  data: () => ({
    title: "Programare vizita sucursala",
    e1: 1,
    optiuni: [
      {
        name: "Depunere sau retragere bani",
      },
      {
        name: "Plata rata credit",
      },
      {
        name: "Operatiune fara numerar",
      },
      {
        name: "Deschidere cont curent",
      },
      {
        name: "Deschidere cont minori",
      },
      {
        name: "Deschidere cont refugiati",
      },
      {
        name: "Suport utilizare aplicatie George",
      },
      {
        name: "Diagnostic financiar gratuit",
      },
      {
        name: "Credit de nevoi personale",
      },
      {
        name: "Credit ipotecar",
      },
      {
        name: "Economisire",
      },
    ],
    settings: {},
  }),
  methods: {
    goBack() {
      this.e1--;
      console.log(this.settings);
    },
  },
  watch: {
    settings(newSettings) {
      if (newSettings.length > 1) {
        this.settings = [];
        this.settings.push(newSettings[1]);
      }
    },
  },
};
</script>
