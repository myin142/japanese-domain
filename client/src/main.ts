import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import './assets/css/global.css';

import * as AWS from 'aws-sdk';

AWS.config.region = 'eu-central-1';
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: 'eu-central-1:8a5af73f-4932-492c-b9ff-573e50aa3f79',
});

Vue.config.productionTip = false;

new Vue({
    router,
    render: h => h(App),
}).$mount("#app");
