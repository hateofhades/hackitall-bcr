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
        <p class="ma-10 font-weight-bold">Nota privind prelucrarea datelor personale:</p>
        <p>BANCA COMERCIALA ROMANA S.A.(„Operatorul”)prelucreaza datele
            dumneavoastra cu caracter personal in contextul realizarii programarilor   pentru   discutii   in   sucursalele   
            Operatorului   in   legatura   cu produsele/serviciile   Operatorului. Datele personale mentionate mai sus
            (nume,prenume, CNP, numar de telefon, adresa de email, detalii privind subiectul discutiei,  interactiunea  cu  BCR)  
            sunt prelucrate  de  catre  BCR  pentru stabilirea  si gestionarea programarii solicitate, avand ca temei de prelucra 
            reexecutarea contractului/discutiile pre-contractuale   legate   de produsele/serviciile Operatorului.Datele sunt 
            stocate si prelucrate in Romania si Austria si sunt conform dispozitiilor legale din Romania, inclusiv cele legate de 
            arhivare. In legatura cu prelucrarea datelor dumneavoastra personale aveti  urmatoarele  drepturi  conform  legislatiei 
             privind protectia  datelor:  dreptul  de  acces,  dreptul de rectificare a datelor, dreptul de stergere, dreptul de 
             restrictionarea prelucrarii,dreptul de portabilitate, dreptul de opozitie, dreptul de retragerea consimtamantului
             (dacaeste aplicabil),dreptul de a formula plangere catre BCR, catre Autoritatea Nationala de Supravegherea 
             Prelucrarii Datelor cu CaracterPersonal sau catre instantele  competente.  Pentru  mai  multe  detalii 
             privind prelucrarea datelor personale de catre BCR, precum si modalitatea de contactare a BCR in legatura cu 
             prelucrarea datelor personale, va rugam sa accesati Politica de confidentialitate: <a href="https://www.bcr.ro/ro/persoane-fizice/informatii-utile/politica-privind-confidentialitatea">Politica de confidentialitate</a>
</p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "TermsAndConditions",
};
</script>
