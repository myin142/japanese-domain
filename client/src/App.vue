<template>
    <div id="app">
        <div class="container mb-3">
            <ul class="nav justify-content-center">
                <li class="nav-item">
                    <router-link class="nav-link" to="/radicals">Radicals</router-link>
                </li>
                <li class="nav-item">
                    <router-link class="nav-link" to="/grammar">Grammar</router-link>
                </li>
            </ul>
        </div>
        <div class="container">
            <router-view />
        </div>
    </div>
</template>

<style>
.nav a {
    font-weight: bold;
    color: #2c3e50;
}

.nav a.router-link-exact-active {
    color: #42b983;
}
</style>
