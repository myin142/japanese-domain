<style scoped>
.radicals .selected {
    border: 1px solid grey;
    background-color: lightgrey;
}

.radicals .highlight {
    opacity: 1;
}
.radicals.searching :not(.highlight) {
    opacity: 0.5;
}

.radicals > span {
    background-position: 50% 50%;
    background-repeat: no-repeat;
    background-size: 24px;
    cursor: pointer;
    color: black;
    border-radius: 50%;
}
</style>

<template>
    <div>
        <RadicalList />
        <!--         <input v-model="debounceTagSearch" />
        <div class="radicals flex-items" :class="{ searching: isSearching }">
            <span
                v-for="item in radicals"
                :key="item.radical"
                :class="classesForRadical(item.radical)"
                @click="selectRadical(item.radical)"
                :title="item.tags.join(', ')"
                >{{ resolveRadical(item.radical) }}</span
            >
        </div>
        <hr />
        <div class="kanjis flex-items">
            <span v-for="kanji in selectedRadicalKanjis" :key="kanji">{{ kanji }}</span>
        </div> -->
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import * as _ from 'lodash';
import { http } from '../services/http.service';
import { kanjiRadicalService, KanjiRadical } from '../services/kanji-radical.service';
import RadicalList from './radicals/RadicalList.vue';

export interface RadicalItem {
    radical: string;
    stroke: number;
    tags: string[];
}

export interface RadicalList {
    radical: string;
    radicals: RadicalItem[];
}

export interface Radical {
    radical: string;
    kanjis: string[];
}

export default Vue.extend<RadicalsComponentData, any, any, any>({
    components: {
        RadicalList,
    },
    /*     data: () => ({
        radicals: [],
        radicalMap: {},
        radicalPredictionMap: {},
        selectedRadicals: [],
        tagSearch: '',
    }),
    async created() {
        const radicals: RadicalItem[] = await http.get('/radicals.json');
        this.radicals = radicals.sort((r1, r2) => r1.stroke - r2.stroke);
    },
    methods: {
        async searchRadical(radical: string): Promise<KanjiRadical> {
            return await kanjiRadicalService.getKanjisForRadical(radical);
        },
        async loadRadicalKanjis(radical: string): Promise<void> {
            const kanjiRadical: KanjiRadical = await this.searchRadical(radical);

            this.radicalMap = {
                ...this.radicalMap,
                [radical]: kanjiRadical.kanjis,
            };

            const allRadicals = [radical, ...this.selectedRadicals];
            let existingRadicalStr = Object.keys(this.radicalPredictionMap)
                .filter(radicalStr => radicalStr.length === allRadicals.length)
                .find(radicalStr => allRadicals.every(r => radicalStr.includes(r)));

            if (existingRadicalStr == null) {
                existingRadicalStr = allRadicals.join();
            }

            this.radicalPredictionMap[existingRadicalStr] = [];

            if (this.nextRadicals.length === 0) {
                this.nextRadicals = kanjiRadical.otherRadicals;
            } else {
                this.nextRadicals = _.intersection(this.nextRadicals, kanjiRadical.otherRadicals);
            }
        },
        async selectRadical(radical: string): Promise<void> {
            const selected = this.selectedRadicals as string[];
            if (this.isSelectedRadical(radical)) {
                this.selectedRadicals = selected.filter(r => r !== radical);
            } else {
                this.selectedRadicals = [...selected, radical];
            }

            if (this.radicalMap[radical] == null) {
                await this.loadRadicalKanjis(radical);
            }
        },
        isSelectedRadical(radical: string): boolean {
            return this.selectedRadicals.indexOf(radical) !== -1;
        },
        isTagSearchRadical(radical: string): boolean {
            return this.tagSearchRadicals.includes(radical);
        },
        resolveRadical(radical: string): string {
            const foundRadical = radicalMap[radical];
            if (foundRadical == null) return radical;
            if (foundRadical.length < 3) return foundRadical;

            return '';
        },
        resolveRadicalClass(radical: string): string {
            const source = radicalMap[radical];
            if (source != null && source.length > 2) {
                return source;
            }

            return '';
        },
        classesForRadical(radical: string): string {
            const classes = [this.resolveRadicalClass(radical)];
            if (this.isSelectedRadical(radical)) classes.push('selected');
            if (this.isTagSearchRadical(radical)) classes.push('highlight');

            return classes.join(' ');
        },
    },
    computed: {
        isSearching(): boolean {
            return this.tagSearch.trim() !== '';
        },
        debounceTagSearch: {
            get() {
                return this.tagSearch;
            },
            set: _.debounce(function(value) {
                this.tagSearch = value;
            }, 200),
        },
        tagSearchRadicals() {
            if (!this.isSearching) {
                return [];
            }

            const radicals: RadicalItem[] = this.radicals;
            return radicals
                .filter(r => r.tags.some(t => t.includes(this.tagSearch)))
                .map(r => r.radical);
        },
        selectedRadicalKanjis(): string[] {
            return Object.keys(this.radicalMap)
                .filter(r => this.selectedRadicals.indexOf(r) !== -1)
                .map(r => this.radicalMap[r] as string[])
                .reduce((arr1, arr2) => {
                    if (arr2.length === 0) {
                        return arr1;
                    }

                    if (arr1.length === 0) {
                        return arr2;
                    }

                    return arr1.filter(r => arr2.includes(r));
                }, []);
        },
    }, */
});

interface RadicalsComponentData {
    radicals: RadicalItem[];
    radicalMap: { [r: string]: string[] };
    radicalPredictionMap: { [r: string]: string[] };
    selectedRadicals: string[];
    tagSearch: string;
}
</script>
