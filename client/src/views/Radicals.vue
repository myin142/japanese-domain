<style scoped>
.flex-items {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
}

.flex-items > span {
    margin: 0.25em;
    padding: 0.25em;
    width: 1.5em;
    height: 1.5em;
}

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

.radical-15 {
    background-image: url(../assets/radical-15.png);
}
.radical-50 {
    background-image: url(../assets/radical-50.png);
}
.radical-76 {
    background-image: url(../assets/radical-76.png);
}
.radical-239 {
    background-image: url(../assets/radical-239.png);
}
</style>

<template>
    <div>
        <input v-model="debounceTagSearch" />
        <div class="radicals flex-items" :class="{ searching: isSearching }">
            <span
                v-for="item in radicals"
                :key="item.radical"
                :class="classesForRadical(item.radical)"
                @click="selectRadical(item.radical)"
                >{{ resolveRadical(item.radical) }}</span
            >
        </div>
        <hr />
        <div class="kanjis flex-items">
            <span v-for="kanji in selectedRadicalKanjis" :key="kanji">{{ kanji }}</span>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import * as _ from 'lodash';
import * as AWS from 'aws-sdk';
import { http } from '../services/http.service';
import { kanjiRadicalService, KanjiRadical } from '../services/kanji-radical.service';

const radicalMap = {
    // wrong interpreted radicals
    化: '亻',
    个: '𠆢',
    并: 'radical-15',
    刈: '刂',
    乞: '𠂉',
    込: '⻌',
    尚: 'radical-50',
    忙: '忄',
    扎: '扌',
    汁: '氵',
    犯: '犭',
    艾: '艹',
    邦: 'radical-76',
    阡: '阝',
    老: '耂',
    杰: '灬',
    礼: '礻',
    疔: '疒',
    禹: '禸',
    初: '衤',
    買: '罒',
    滴: 'radical-239',

    // Other form used more often
    竹: '⺮',
};

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
    data: () => ({
        radicals: [],
        radicalMap: {},
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
            console.log(kanjiRadical);

            this.radicalMap = {
                ...this.radicalMap,
                [radical]: kanjiRadical.kanjis,
            };
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
    },
});

interface RadicalsComponentData {
    radicals: RadicalItem[];
    radicalMap: { [r: string]: string[] };
    selectedRadicals: string[];
    tagSearch: string;
}
</script>
