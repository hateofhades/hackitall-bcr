<template>
    <v-container class="mt-4 mb-0">
        <v-row justify="center">
            <b>Sumarul programarii</b>
        </v-row>
        <v-row justify="center">
            {{ prenume }}, confirma daca datele de mai jos sunt corecte.
        </v-row>
        <v-row justify="center" class="mt-8">
            <b>Scopul intalnirii</b>
        </v-row>
        <v-row justify="center">
            {{ settings[0].name }}
        </v-row>
        <v-row justify="center" class="mt-8">
            <b>Coordonate unitate</b>
        </v-row>
        <v-row justify="center">
            <b>{{ branch.name }}</b>
        </v-row>
        <v-row justify="center">
            Adresa: {{ branch.address }}
        </v-row>
        <v-row justify="center" class="mt-8">
            <b>Data si ora</b>
        </v-row>
        <v-row justify="center">
            {{ date }} - {{ time[0].name }}
        </v-row>
        <v-row justify="center" class="mt-8">
            <b>Detalii personale</b>
        </v-row>
        <v-row justify="center">
            Numele complet: {{ nume }} {{ prenume }}
            </v-row>
            <v-row justify="center">
            Email: {{ email }}
        </v-row>
        <v-row justify="center">
            CNP: {{cnp}}
        </v-row>
    </v-container>
</template>

<script>
export default {
    name: "AppointmentSummary",
    props: ['nume', 'prenume', 'settings', 'branch', 'date', 'time', 'email', 'cnp'],
    methods: {
        updateToken(payload) {
            this.googleToken = payload.response_token;
        }
    }
}
</script>