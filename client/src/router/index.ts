import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import Error from '../views/Error.vue';
import Login from '../views/Login.vue';
import Radicals from '../views/Radicals.vue';
import Grammar from '../views/Grammar.vue';
import { auth } from '@/services/auth.service';

Vue.use(VueRouter);

const authGuard = (to: any, from: any, next: any) => {
    if (auth.isAuthenticated()) {
        next();
    } else {
        next({ name: 'Login' });
    }
};

const handleAuth = async (to: any, from: any, next: any) => {
    const currUrl = window.location.href;
    await auth.handleAuthCallback(currUrl);
    const redirect = auth.isAuthenticated() ? 'Radicals' : 'Error';
    next({ name: redirect });
}

const routes: Array<RouteConfig> = [
    {
        path: '/',
        redirect: '/radicals',
    },
    {
        path: '/radicals',
        name: 'Radicals',
        component: Radicals,
        beforeEnter: authGuard,
    },
    {
        path: '/grammar',
        name: 'Grammar',
        component: Grammar,
    },
    {
        path: '/login',
        name: 'Login',
        component: Login,
    },
    {
        path: '/login/oauth2',
        beforeEnter: handleAuth,
    },
    // Auth for local development
    {
        path: '/id_token=*',
        beforeEnter: handleAuth,
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
