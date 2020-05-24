import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import Error from '../views/Error.vue';
import Radicals from '../views/radicals/Radicals.vue';
import Grammar from '../views/Grammar.vue';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
    {
        path: '/',
        redirect: '/radicals',
    },
    {
        path: '/radicals',
        name: 'Radicals',
        component: Radicals,
    },
    {
        path: '/grammar',
        name: 'Grammar',
        component: Grammar,
    },
    {
        path: '**',
        name: 'Error',
        component: Error,
    },
];

const router = new VueRouter({
    mode: "history",
    routes,
});

export default router;
