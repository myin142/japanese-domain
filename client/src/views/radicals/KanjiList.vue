<style scoped>
.kanjis span {
    cursor: pointer;
}
</style>

<template>
    <div>
        <div class="kanjis flex-items">
            <span v-for="kanji in kanjis" :key="kanji" @click="addKanji(kanji)">{{ kanji }}</span>
        </div>
        <div class="row justify-content-center">
            <div class="col-12">
                <input class="w-100" v-model="search" />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
    props: {
        kanjis: { type: Array, default: () => [] },
    },
    data: () => ({
        search: '',
    }),
    methods: {
        addKanji(kanji: string): void {
            this.search += kanji;
        },
    },
});
</script>