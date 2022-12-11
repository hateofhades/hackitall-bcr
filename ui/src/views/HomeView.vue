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
      <v-col :cols="windowWidth < 700 ? '12' : '8'">
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
              Alege ziua si ora
            </v-stepper-step>

            <v-divider></v-divider>

            <v-stepper-step :complete="e1 > 4" step="4">
              Completeaza datele personale
            </v-stepper-step>

            <v-divider></v-divider>

            <v-stepper-step step="5"> Sumarul programarii </v-stepper-step>
          </v-stepper-header>

          <v-stepper-items>
            <v-stepper-content step="1">
              <v-card elevation="0">
                <v-list-item-group
                  v-model="settings"
                  multiple
                  active-class=""
                  dense
                >
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

                        <div class="text-center" v-if="active">
                          <v-dialog v-model="dialog" width="500">
                            <template v-slot:activator="{ on, attrs }">
                              <v-btn
                                color="primary"
                                dark
                                v-bind="attrs"
                                v-on="on"
                              >
                                Info
                              </v-btn>
                            </template>

                            <v-card>
                              <v-card-title class="text-h5 ma-4 pt-4">
                                Informatii suplimentare
                              </v-card-title>

                              <v-card-text>
                                {{ optiune.info }}
                              </v-card-text>

                              <v-divider></v-divider>

                              <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn
                                  color="primary"
                                  text
                                  @click="dialog = false"
                                >
                                  OK
                                </v-btn>
                              </v-card-actions>
                            </v-card>
                          </v-dialog>
                        </div>
                      </template>
                    </v-list-item>
                  </v-list>
                </v-list-item-group>
              </v-card>
              <v-btn
                color="primary"
                @click="e1 = 2"
                :disabled="settings.length == 0"
              >
                Continuati
              </v-btn>
            </v-stepper-content>
            <v-stepper-content step="2">
              <LocationSearch
                :step="e1"
                :settings="settings"
                @nextStep="nextStep"
              />
            </v-stepper-content>

            <v-stepper-content step="3">
              <v-card elevation="0">
                <v-row justify="center">
                  <v-col cols="12" sm="6" md="4">
                    <v-dialog
                      ref="dialog"
                      v-model="modal"
                      :return-value.sync="date"
                      persistent
                      width="290px"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          v-model="date"
                          label="Alege o data"
                          prepend-icon="mdi-calendar"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        :first-day-of-week="1"
                        v-model="date"
                        scrollable
                        :allowed-dates="allowDates"
                      >
                        <v-spacer></v-spacer>
                        <v-btn text color="primary" @click="modal = false">
                          Cancel
                        </v-btn>
                        <v-btn text color="primary" @click="
  $refs.dialog.save(date);
usedDate = true;
                        ">
                          OK
                        </v-btn>
                      </v-date-picker>
                    </v-dialog>

                    <v-list-item-group
                      v-model="oraSelect"
                      multiple
                      active-class=""
                      dense
                    >
                      <v-list
                        rounded
                        class="ma-0"
                        style="
                          max-width: 100%;
                          white-space: normal;
                          word-wrap: break-word;
                        "
                        v-if="usedDate"
                      >
                        <v-list-item
                          v-for="ora in ore"
                          v-bind:key="ora.name"
                          :value="ora"
                        >
                          <template v-slot:default="{ active }">
                            <v-list-item-content>
                              <v-list-item-title
                                style="word-wrap: break-word"
                                >{{ ora.name }}</v-list-item-title
                              >
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
                  </v-col>
                </v-row>
              </v-card>

              <v-btn
                color="primary"
                @click="e1 = 4"
                :disabled="oraSelect == null || oraSelect.length == 0"
              >
                Continuati
              </v-btn>
            </v-stepper-content>

            <v-stepper-content step="4">
              <v-card elevation="0" class="mt-4">
                <v-row justify="center">
                  <v-col cols="10">
                    <v-row justify="center">
                      <p style="font-size: 20px; font-weight: bold">
                        George vrea sa te cunoasca mai bine.
                        <img
                          class="mr-0"
                          :src="require('../../public/img/store-go.png')"
                          height="40"
                        />
                      </p>
                    </v-row>
                    <p style="font-size: 17px">
                      Introdu urmatoarele date despre tine:
                    </p>
                    <div>
                      <v-text-field label="Nume" :rules="rules" hide-details="auto" v-model="nume"></v-text-field>
                      <v-text-field label="Prenume" :rules="rules" hide-details="auto" v-model="prenume"></v-text-field>
                      <v-text-field label="Numar personal de identificare" :rules="cnpRules" hide-details="auto"
                        v-model="cnp"></v-text-field>
                      <v-text-field label="Email" :rules="emailRules" hide-details="auto"
                        v-model="email"></v-text-field>
                    </div>

                    <v-radio-group v-model="ex7" column>
                      <v-radio
                        label="Am o carte de identitate emisa in Romania"
                        color="indigo"
                        value="indigo"
                      ></v-radio>
                      <v-radio
                        label="Nu am o carte de identitate emisa in Romani"
                        color="indigo darken-3"
                        value="indigo darken-3"
                      ></v-radio>
                    </v-radio-group>

                    <v-checkbox
                      v-model="isCheck"
                      input-value="false"
                      label="Sunt de acord cu politica de prelucrare a datelor cu caracter personal."
                    ></v-checkbox>

                    <v-btn depressed href="/termsandc" target="_blank">
                      Termeni si conditii
                    </v-btn>
                  </v-col>
                </v-row>
              </v-card>

              <v-btn
                color="primary"
                @click="e1 = 5"
                class="mt-4"
                :disabled="!isValidNext"
              >
                Continuati
              </v-btn>
            </v-stepper-content>
            <v-stepper-content step="5">
              <AppointmentSummary v-if="e1 == 5" :nume="nume" :prenume="prenume" :settings="settings"
              :branch="selectedBranch" :date="date" :time="oraSelect" :email="email" :cnp="cnp" />
              <v-btn color="primary" @click="doProgramming"> Programeaza-te</v-btn>
            </v-stepper-content>
          </v-stepper-items>
        </v-stepper>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import LocationSearch from "../components/LocationSearch.vue";
import AppointmentSummary from "../components/AppointmentSummary.vue";

export default {
  name: "HomeView",
  components: {
    LocationSearch,
    AppointmentSummary,
  },
  data: () => ({
    title: "Programare vizita sucursala",
    e1: 1,
    dialog: false,
    snackbar: false,
    cnp: "",
    nume: "",
    prenume: "",
    email: "",
    ex7: "indigo",
    usedDate: false,
    isCheck: false,
    isWeekendOpen: false,
    isSundayOpen: false,
    optiuni: [
      {
        name: "Depunere sau retragere bani",
        info: "Atentie! Pentru retragerile de numerar de peste 3,000 de euro, te invitam sa ne contactezi telefonic la *2227 (apeluri nationale) sau +4021 407 4200 (apeluri internationale). De asemenea, daca doresti sa retragi ORICE suma in alta valuta diferita de lei, euro sau dolari americani, te rugam sa ne contactezi.",
      },
      {
        name: "Plata rata credit",
        info: "Plata ratelor pentru toate tipurile de credit",
      },
      {
        name: "Operatiune fara numerar",
        info: "Cont curent, card de debit, tranzactii, George si servicii digitale, administrare cont si card.",
      },
      {
        name: "Deschidere cont curent",
        info: "Deschidere cont curent",
      },
      {
        name: "Deschidere cont minori",
        info: "Deschidere cont persoane sub 18 ani."
      },
      {
        name: "Deschidere cont refugiati",
        info: "Deschidere cont refugiati",
      },
      {
        name: "Suport utilizare aplicatie George",
        info: "Activare George (etoken), servicii",
      },
      {
        name: "Diagnostic financiar gratuit",
        info: "Diagnostic financiar gratuit",
      },
      {
        name: "Credit de nevoi personale",
        info: "Inclusiv card credit si descoperit de cont."
      },
      {
        name: "Credit ipotecar",
        info: "Casa Mea, Noua Casa",
      },
      {
        name: "Economisire",
        info: "Depozit, cont de economii.",
      },
    ],
    ore: [
      {
        name: "13:00",
      },
      {
        name: "13:30",
      },
    ],
    oraSelect: null,
    settings: [],
    windowWidth: window.innerWidth,
    date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .substr(0, 10),
    menu: false,
    modal: false,
    menu2: false,
    isValidNext: false,
    rules: [
      (value) => !!value || "Required.",
      (value) => (value && value.length >= 3) || "Min 3 characters",
    ],
    cnpRules: [
      (value) => !!value || "Required.",
      (value) => validCNP(value) || "CNP invalid",
    ],
    emailRules: [
      (value) =>
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
        "Email invalid",
    ],
  }),
  methods: {
    goBack() {
      this.e1--;
      console.log(this.settings);
    },
    onResize() {
      this.windowWidth = window.innerWidth;
    },
    nextStep() {
      this.e1++;
    },
    mouseEnter(month) {
      this.$set(this.done, 1, true);
      this.mouseMonth = month;
    },
    mouseLeave() {
      this.mouseMonth = null;
    },
    allowDates(val) {
      const day = new Date(val).toLocaleDateString("en-US", {
        weekday: "long",
      });
      if ((day == "Saturday" || day == "Sunday") && this.isWeekendOpen == false)
        return false;
      if (day == "Sunday" && this.isSundayOpen == false) return false;

      return true;
    },
    isValidCheck() {
      this.isValidNext = true;
      if (this.nume.length < 3) this.isValidNext = false;
      if (this.prenume.length < 3) this.isValidNext = false;
      if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(this.email))
        this.isValidNext = false;
      if (!validCNP(this.cnp)) this.isValidNext = false;
      if (!this.isCheck) this.isValidNext = false;
    },
    async doProgramming() {
      const data = {
        firstname: this.prenume,
        lastname: this.nume,
        email: this.email,
        starttime: this.date + "-" + this.oraSelect[0].name,
        location: this.selectedBranch.address,
        latitude: this.selectedBranch.location.latitude,
        longitude: this.selectedBranch.location.longitude,
      };

      await fetch("http://localhost:5001/appointmentsAdd", {method: "POST", body: JSON.stringify(data)});

      console.log(data);
    }
  },
  watch: {
    settings(newSettings) {
      if (newSettings.length > 1) {
        this.settings = [];
        this.settings.push(newSettings[1]);
      }
    },
    e1() {
      this.selectedBranch = JSON.parse(localStorage.getItem("chosenBranch"));

      if (this.selectedBranch) {
        this.isWeekendOpen =
          this.selectedBranch.appointmentsSchedule.isWeekendOpen;
        this.isSundayOpen =
          this.selectedBranch.appointmentsSchedule.isSundayOpen;

        this.ore = [];

        const mFStart =
          this.selectedBranch.appointmentsSchedule.scheduleMonFriStart;
        let mFEnd = this.selectedBranch.appointmentsSchedule.scheduleMonFriEnd;

        if (mFStart.hour == mFEnd.hour) {
          mFEnd.hour = 17;
        }

        if (mFStart.minute == 0) {
          this.ore.push({
            name: mFStart.hour + ":00",
          });
        }

        this.ore.push({
          name: mFStart.hour + ":30",
        });

        for (let i = mFStart.hour + 1; i < mFEnd.hour; i++) {
          this.ore.push({
            name: i + ":00",
          });
          this.ore.push({
            name: i + ":30",
          });
        }

        this.ore.push({
          name: mFEnd.hour + ":00",
        });

        if (mFEnd.minute == 30) {
          this.ore.push({
            name: mFEnd.hour + ":30",
          });
        }
      }
    },
    oraSelect(newOra) {
      if (newOra.length > 1) {
        this.oraSelect = [];
        this.oraSelect.push(newOra[1]);
      }
    },
    cnp() {
      this.isValidCheck();
    },
    nume() {
      this.isValidCheck();
    },
    prenume() {
      this.isValidCheck();
    },
    email() {
      this.isValidCheck();
    },
    isCheck() {
      this.isValidCheck();
    },
    ex7() {
      this.isValidCheck();
    },
  },
  mounted() {
    if (this.$route.query.step) {
      console.log(this.$route.query.step);

      this.e1 = this.$route.query.step;
      this.settings = JSON.parse(localStorage.getItem("settings"));
    }

    this.$nextTick(() => {
      window.addEventListener("resize", this.onResize);
    });
  },
};

function validCNP(p_cnp) {
  var i = 0,
    hashResult = 0,
    cnp = [],
    hashTable = [2, 7, 9, 1, 4, 6, 3, 5, 8, 2, 7, 9];
  if (p_cnp.length !== 13) {
    return false;
  }
  for (i = 0; i < 13; i++) {
    cnp[i] = parseInt(p_cnp.charAt(i), 10);
    if (isNaN(cnp[i])) {
      return false;
    }
    if (i < 12) {
      hashResult = hashResult + cnp[i] * hashTable[i];
    }
  }
  hashResult = hashResult % 11;
  if (hashResult == 10) {
    hashResult = 1;
  }
  return cnp[12] == hashResult;
}
</script>
