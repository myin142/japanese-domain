<style scoped>
.radical-15 {
    background-image: url(../../assets/radical-15.png);
}
.radical-50 {
    background-image: url(../../assets/radical-50.png);
}
.radical-76 {
    background-image: url(../../assets/radical-76.png);
}
.radical-239 {
    background-image: url(../../assets/radical-239.png);
}

.radicals .selected {
    border: 1px solid grey;
    background-color: lightgrey;
}

.radicals .hightlight {
    color: red;
}

.radicals .next-radical {
    opacity: 1;
}
.radicals.filtering :not(.next-radical):not(.selected) {
    opacity: 0.3;
}

.radicals > span {
    background-position: 50% 50%;
    background-repeat: no-repeat;
    background-size: 24px;
    cursor: pointer;
    border-radius: 50%;
}
</style>

<template>
    <div>
        <div class="row justify-content-center mb-3">
            <div class="col-9 col-md-4 col-lg-3">
                <input class="w-100" v-model="tagSearch" />
            </div>
            <div class="col-3 col-md-1">
                <button type="button" class="btn btn-light" @click="resetValues()">
                    <i class="fas fa-redo">Reset</i>
                </button>
            </div>
        </div>
        <div class="radicals flex-items" :class="{ filtering: isFiltering }">
            <span
                v-for="item in radicals"
                :key="item.radical"
                :title="item.tags.join(', ')"
                :class="classesForRadical(item.radical)"
                @click="emitSelectRadical(item.radical)"
                >{{ resolveRadical(item.radical) }}</span
            >
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';

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

export default Vue.extend({
    props: {
        selectedRadicals: { type: Array, default: () => [] },
        nextRadicals: { type: Array, default: () => [] },
    },
    data: () => ({
        radicals: [],
        tagSearch: '',
    }),
    async created() {
        const response = await fetch('/radicals.json');
        const radicals: Radical[] = await response.json();
        this.radicals = radicals.sort((r1, r2) => r1.stroke - r2.stroke);
    },
    methods: {
        isSelectedRadical(radical: string): boolean {
            return this.selectedRadicals.indexOf(radical) !== -1;
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
            if (this.tagSearchResult.includes(radical)) classes.push('highlight');
            if (this.nextRadicals.includes(radical)) classes.push('next-radical');

            return classes.join(' ');
        },
        resolveRadical(radical: string): string {
            const foundRadical = radicalMap[radical];
            if (foundRadical == null) return radical;
            if (foundRadical.length < 3) return foundRadical;

            return '';
        },
        emitSelectRadical(radical: string): void {
            if (
                !this.isSelectedRadical(radical) &&
                this.nextRadicals != null &&
                this.nextRadicals.length > 0 &&
                !this.nextRadicals.includes(radical)
            ) {
                return;
            }

            this.$emit('select-radical', {
                radical,
                selected: !this.isSelectedRadical(radical),
            });
        },
        resetValues(): void {
            this.tagSearch = '';
            this.$emit('reset');
        },
    },
    computed: {
        isFiltering(): boolean {
            return this.tagSearch.trim() !== '' || this.selectedRadicals.length > 0;
        },
        tagSearchResult(): string[] {
            return this.radicals
                .filter(r => r.tags.some(t => t.includes(this.tagSearch)))
                .map(r => r.radical);
        },
    },
});

interface Radical {
    radical: string;
    stroke: number;
    tags: string[];
}

export interface SelectRadicalEvent {
    radical: string;
    selected: boolean;
}
</script>