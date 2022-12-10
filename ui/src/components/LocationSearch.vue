<template>
    <v-container fill-height fluid class="pa-0 ma-4">
        <v-row justify="center" style="max-width:99%">
            <p>Cauta unitatea BCR unde doriti sa programati vizita dupa adresa, oras/sector sau nume unitate.
                Permite accesul locatiei pentru a vedea unitatile BCR din apropriere.
            </p>
            <v-col cols="12" sm="12" md="12" lg="12" xl="12">
                <v-btn color="#1967D2" style="color:white" @click="goToMap"><v-icon class="mr-2">mdi-map</v-icon> Cauta
                    pe harta</v-btn>
                <v-text-field v-model="search" append-icon="mdi-magnify" label="Cauta unitatea BCR" single-line
                    hide-details></v-text-field>
                <v-card v-for="branch in displayBranches" v-bind:key="branch.name" class="mt-4">
                    <v-card-title class="text-center" style="background-color:#1967D2; color:white">
                        <v-icon class="mr-2">mdi-map-marker</v-icon>
                        {{ branch.name }}
                        <v-spacer></v-spacer>
                        {{ displayDistance(branch.location.latitude, branch.location.longitude) }}
                    </v-card-title>
                    <v-card-text>
                        <p class="ma-0 mt-4">{{ branch.address }}</p>
                        <p class="ma-0" style="color:green">L-V: {{ branch.schedule.mf }}</p>
                        <v-btn class="mt-4" color="#1967D2" style="color:white"
                            @click="chooseBranch(branch)">Alege</v-btn>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
export default {
    name: 'LocationSearch',
    data: () => ({
        branches: [],
        userLocation: {},
        search: "",
        displayBranches: []
    }),
    props: ['step', 'settings'],
    methods: {
        async getBranches() {
            const branchesRequest = await fetch('http://localhost:5001/branches');
            this.branches = await branchesRequest.json();
        },
        getUserLocation() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(this.showPosition);
            } else {
                console.log("Geolocation is not supported by this browser.");
            }
        },
        showPosition(position) {
            this.userLocation.lat = position.coords.latitude;
            this.userLocation.lng = position.coords.longitude;

            this.branches.sort((a, b) => {
                const aDistance = this.getDistanceFromLatLonInKm(this.userLocation.lat, this.userLocation.lng, a.location.latitude, a.location.longitude);
                const bDistance = this.getDistanceFromLatLonInKm(this.userLocation.lat, this.userLocation.lng, b.location.latitude, b.location.longitude);
                return aDistance > bDistance;
            });

            this.displayBranches = this.branches.slice(0, 3);
        },
        getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
            var R = 6371; // Radius of the earth in km
            var dLat = this.deg2rad(lat2 - lat1);  // deg2rad below
            var dLon = this.deg2rad(lon2 - lon1);
            var a =
                Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2)
                ;
            var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            var d = R * c; // Distance in km
            return d;
        },
        deg2rad(deg) {
            return deg * (Math.PI / 180)
        },
        displayDistance(lat1, lon1) {
            if (!this.userLocation.lat)
                return "";

            const distance = this.getDistanceFromLatLonInKm(lat1, lon1, this.userLocation.lat, this.userLocation.lng);

            if (distance < 1) {
                return (distance * 1000).toFixed(0) + " m";
            } else {
                return distance.toFixed(2) + " km";
            }
        },
        goToMap() {
            localStorage.setItem('settings', JSON.stringify(this.settings));

            this.$router.push({ name: 'map' });
        },
        chooseBranch(branchSelected) {
            localStorage.setItem('chosenBranch', JSON.stringify(branchSelected));
            this.$emit('nextStep');
        }
    },
    mounted() {
        this.getBranches();
        this.$forceUpdate();
    },
    watch: {
        step() {
            if (this.step == 2)
                this.getUserLocation();
        },
        search(newSearch) {
            if (newSearch == "")
                return this.getUserLocation();

            this.displayBranches = this.branches.filter(branch => {
                return branch.name.toLowerCase().includes(this.search.toLowerCase()) ||
                    branch.address.toLowerCase().includes(this.search.toLowerCase()) ||
                    branch.city.toLowerCase().includes(this.search.toLowerCase());
            });
        }
    }
};
</script>