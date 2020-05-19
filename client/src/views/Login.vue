<template>
    <button v-on:click="login()">Login</button>
</template>

<script lang="ts">
import Vue from 'vue';
import { auth } from '../services/auth.service';

export default Vue.extend({
    methods: {
        async login() {
            auth.login();
        },
    },
});
</script>
