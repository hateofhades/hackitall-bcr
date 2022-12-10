<template>
    <v-container fill-height fluid class="pa-0">
        <GmapMap class="ma-0 pa-0" fill-height :center="{ lat: branches[0].location.latitude, lng: branches[0].location.longitude }"
            :zoom="zoom" map-type-id="terrain" style="width: 100%; height:100%" ref="mapRef" :options="options">
            <GmapMarker :position="userLocation" :clickable="false" :draggable="false"
                icon="/img/markers/rsz_user.png" />
            <GmapMarker v-for="branch in branches" v-bind:key="branch.name"
                :position="{ lat: branch.location.latitude, lng: branch.location.longitude }" :clickable="true"
                :draggable="false" icon="img/markers/rsz_bcr.png" @click="selectedBranch = branch; selected = true"/>
        </GmapMap>
        <v-btn color="#1967D2" class="mt-8 ml-4" style="position:absolute; top:0; color:white"><v-icon
                class="mr-2">mdi-arrow-left</v-icon>Inapoi la cautare</v-btn>
        <v-btn @click="moveMapToMe" color="#1967D2" v-if="!selected" class="mb-8 mr-4" fab
            style="position:absolute; bottom:0; right:0; color:white"><v-icon>mdi-crosshairs-gps</v-icon></v-btn>
        <v-chip color="#22416C" v-if="!selected" class="mb-8"
            style="position:absolute; bottom:0; color:white; left: 50%; -webkit-transform: translateX(-50%); transform: translateX(-50%); margin: auto">Alege
            o unitate</v-chip>
        <v-card v-if="selected" style="position:absolute; bottom:0; left:0; right:0; margin:auto">
            <v-card-title class="text-center" style="background-color:#1967D2; color:white">
                <v-icon class="mr-2">mdi-map-marker</v-icon>
                {{ selectedBranch.name }}
                <v-spacer></v-spacer>
                {{ displayDistance(selectedBranch.location.latitude, selectedBranch.location.longitude) }}
            </v-card-title>
            <v-card-text>
                <p class="ma-0 mt-4">{{ selectedBranch.address }}</p>
                <p class="ma-0" style="color:green">L-V: {{ selectedBranch.schedule.mf }}</p>
                <v-btn class="mt-4" color="#1967D2" style="color:white">Alege</v-btn>
                <v-btn class="mt-4 ml-4" color="red" style="color:white" @click="selected=false">Anuleaza</v-btn>
            </v-card-text>
        </v-card>
    </v-container>
</template>
<script>
export default {
    name: 'MapComp',
    data: () => ({
        userLocation: {
            lat: 0,
            lng: 0,
        },
        zoom: 17,
        options: {
            disableDefaultUI: true
        },
        branches: [
            {
                name: "BCR Iuliu Maniu",
                address: "Bulevardul Iuliu Maniu nr.190 - 192 bloc C1 parter, Bucuresti, Sector 6",
                city: "Bucuresti",
                telephone: [
                    "0373525806",
                ],
                location: {
                    latitude: 44.43395,
                    longitude: 26.009065,
                    address: {
                        street: "Bulevardul Iuliu Maniu nr.190 - 192 bloc C1 parter",
                        city: "Bucuresti",
                        county: "Sector 6",
                    }
                },
                schedule: {
                    mf: "09:00 - 13:00 si 13:30 - 17:00",
                    sat: "indisponibil",
                    sun: "indisponibil"
                }
            }
        ],
        selected: false,
        selectedBranch: {}
    }),
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

            moveMapToMe();
        },
        deg2rad(deg) {
            return deg * (Math.PI / 180)
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
        displayDistance(lat1, lon1) {
            const distance = this.getDistanceFromLatLonInKm(lat1, lon1, this.userLocation.lat, this.userLocation.lng);

            if(distance < 1) {
                return (distance * 1000).toFixed(0) + " m";
            } else {
                return distance.toFixed(2) + " km";
            }
        },
        moveMapToMe() {
            this.$refs.mapRef.$mapPromise.then((map) => {
                map.panTo(this.userLocation);
            }); 
        }
    },
    mounted() {
        this.getUserLocation();
        this.getBranches();

        this.$forceUpdate();
    }
};
</script>