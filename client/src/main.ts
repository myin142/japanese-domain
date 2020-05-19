import Vue from "vue";
import App from "./App.vue";
import router from "./router";

import * as AWS from 'aws-sdk';

AWS.config.region = 'eu-central-1';
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: 'eu-central-1:8a5af73f-4932-492c-b9ff-573e50aa3f79',
});

Vue.config.productionTip = false;

new Vue({
    router,
    render: h => h(App),
    created() {
        if (sessionStorage.redirect) {
            const redirect = sessionStorage.redirect
            delete sessionStorage.redirect
            this.$router.push(redirect)
        }
    }
}).$mount("#app");
