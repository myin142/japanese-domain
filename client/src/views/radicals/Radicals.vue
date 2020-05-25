<template>
    <div>
        <radical-list
            :selectedRadicals="selectedRadicals"
            :nextRadicals="nextRadicals"
            @select-radical="selectRadical"
        />

        <hr />

        <div class="flex-items">
            <span v-for="kanji in selectedKanjis" :key="kanji">{{ kanji }}</span>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import * as _ from 'lodash';
import RadicalList, { SelectRadicalEvent } from './RadicalList.vue';
import { kanjiRadicalService } from '../../services/kanji-radical.service';

export default Vue.extend({
    components: {
        RadicalList,
    },
    data: () => ({
        selectedRadicals: [],
        radicalMapCache: {},
        radicalPredictionMap: {},
    }),
    methods: {
        async selectRadical({ radical, selected }: SelectRadicalEvent) {
            if (this.radicalMapCache[radical] == null) {
                const kanjis = await kanjiRadicalService.getKanjisForRadical(radical);
                this.radicalMapCache[radical] = kanjis.kanjis.map(x => x.kanji);
                this.radicalPredictionMap[radical] = kanjis.kanjis.map(x => x.otherRadicals);
            }

            if (selected) {
                this.selectedRadicals = [...this.selectedRadicals, radical];
            } else {
                this.selectedRadicals = this.selectedRadicals.filter(r => r !== radical);
            }
        },
        selectedRadicalsWithout(radical: string): string[] {
            return this.selectedRadicals.filter(r => r !== radical);
        },
    },
    computed: {
        selectedKanjis(): string[] {
            return this.selectedRadicals
                .map(r => this.radicalMapCache[r])
                .filter(x => x != null)
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
        nextRadicals(): string[] {
            const uniqueNextRadicals = _.uniq(
                _.flattenDeep(
                    this.selectedRadicals.map(r => {
                        const otherSelected = this.selectedRadicalsWithout(r);
                        return _.filter(this.radicalPredictionMap[r], otherRads =>
                            otherSelected.every(x => otherRads.includes(x))
                        );
                    })
                )
            );

            return uniqueNextRadicals.filter(r => !this.selectedRadicals.includes(r)) as string[];
        },
    },
    /*
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
</script>
