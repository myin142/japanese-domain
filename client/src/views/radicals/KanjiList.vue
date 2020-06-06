<style scoped>
.kanjis span {
    cursor: pointer;
}
.token {
    padding: 0.5em;
}
</style>

<template>
    <div>
        <div class="kanjis flex-items">
            <span v-for="kanji in kanjis" :key="kanji" @click="addKanji(kanji)">{{ kanji }}</span>
        </div>
        <div class="row justify-content-center mb-3">
            <div class="col-10">
                <input class="w-100" v-model="search" />
            </div>
            <div class="col-2">
                <button type="button" class="tokenize btn btn-light" @click="tokenize()">
                    Tokenize
                </button>
            </div>
        </div>
        <div class="row">
            <div class="col-12">
                <span class="token" v-for="token in tokens" :key="token.surface">
                    {{ token.surface }}
                </span>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { japaneseService } from '@/services/japanese.service';

export default Vue.extend({
    props: {
        kanjis: { type: Array, default: () => [] },
    },
    data: () => ({
        search: '',
        tokens: [],
    }),
    methods: {
        addKanji(kanji: string): void {
            this.search += kanji;
        },
        async tokenize() {
            this.tokens = await japaneseService.analyze(this.search);
        },
    },
});
</script>