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
    <div class="radicals flex-items">
        <span
            v-for="item in radicals"
            :key="item.radical"
            :title="item.tags.join(', ')"
            :class="classesForRadical(item.radical)"
            @click="emitSelectRadical(item.radical)"
            >{{ item.radical }}</span
        >
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
    },
    data: () => ({
        radicals: [],
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
        classesForRadical(radical: string): string {
            const classes = [];

            if (this.isSelectedRadical(radical)) classes.push('selected');

            return classes.join(' ');
        },
        emitSelectRadical(radical: string): void {
            this.$emit('select-radical', {
                radical,
                selected: !this.isSelectedRadical(radical),
            });
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