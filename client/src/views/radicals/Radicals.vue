<template>
    <div>
        <radical-list
            :selectedRadicals="selectedRadicals"
            :nextRadicals="nextRadicals"
            @select-radical="selectRadical"
            @reset="resetRadicals()"
        />

        <hr />

        <kanji-list :kanjis="selectedKanjis"></kanji-list>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import * as _ from 'lodash';
import RadicalList, { SelectRadicalEvent } from './RadicalList.vue';
import KanjiList from './KanjiList.vue';
import { kanjiRadicalService } from '../../services/kanji-radical.service';

export default Vue.extend({
    components: {
        RadicalList,
        KanjiList,
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
        resetRadicals(): void {
            this.selectedRadicals = [];
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
});
</script>
