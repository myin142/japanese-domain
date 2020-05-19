<style scoped>
table,
table td,
table th {
    border: 1px solid black;
    border-collapse: collapse;
    padding: 0.5em;
}
table tr {
    text-align: left;
}
</style>


<template>
  <div>
    <table>
      <tr>
        <th></th>
        <th>Ru-Verb</th>
        <th>U-Verb</th>
      </tr>
      <tr v-for="item in conjugations" :key="item.name">
        <td>
          <a :href="item.link" target="blank">{{item.name}}</a>
        </td>
        <td>{{item.columns[0]}}</td>
        <td>{{item.columns[1]}}</td>
      </tr>
    </table>

    <hr />

    <table>
      <tr v-for="item in others" :key="item.text">
        <td :title="item.explain">
          <a :href="item.link" target="blank">{{item.text}}</a>
        </td>
        <td
          v-for="example in item.examples"
          :key="example.text"
          :title="example.explain"
        >{{example.text}}</td>
      </tr>
    </table>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
    data: () => ({
        conjugations: [
            {
                name: 'Potential',
                link: 'http://www.guidetojapanese.org/learn/grammar/potential#The_Potential_Form',
                columns: ['-られる', '~え る'],
            },
            {
                name: 'Passive',
                link: 'http://www.guidetojapanese.org/learn/grammar/causepass#Passive_Verbs',
                columns: ['-られる', '~あ れる'],
            },
            {
                name: 'Causative',
                link: 'http://www.guidetojapanese.org/learn/grammar/causepass#Causative_Verbs',
                columns: ['-させる', '~あ せる'],
            },
            {
                name: 'Honorific 1',
                link:
                    'http://www.guidetojapanese.org/learn/grammar/honorific#Honorific_and_Humble_Conjugations',
                columns: ['お + Stem + になる'],
            },
            {
                name: 'Honorific 2',
                link:
                    'http://www.guidetojapanese.org/learn/grammar/honorific#Honorific_and_Humble_Conjugations',
                columns: ['お + Stem + です'],
            },
            {
                name: 'Humble',
                link:
                    'http://www.guidetojapanese.org/learn/grammar/honorific#Honorific_and_Humble_Conjugations',
                columns: ['お + Stem + する'],
            },
        ],
        others: [
            {
                text: '程(ほど)',
                explain: 'Extent of something',
                link:
                    'http://www.guidetojapanese.org/learn/grammar/amount#Using_to_express_the_extent_of_something',
                examples: [{ text: '見れば見るほど', explain: 'The more you see the more' }],
            },
            {
                text: 'ばかり・ばっかり・ばっか',
                explain: 'So much of something -> nothing else',
                link:
                    'http://www.guidetojapanese.org/learn/grammar/amount#Expressing_the_opposite_of_with',
                examples: [{ text: '漫画ばかり読んでいる', explain: 'reading nothing but manga' }],
            },
            {
                text: 'ばかり・ばっか',
                explain: 'Just finished doing something (only past tense)',
                link:
                    'http://www.guidetojapanese.org/learn/grammar/timeactions#Expressing_what_just_happened_with',
                examples: [{ text: '食べたばかり', explain: 'just ate something' }],
            },
            {
                text: 'ばかり',
                explain: 'Act as if one might do something',
                link:
                    'http://www.guidetojapanese.org/learn/grammar/signs#Using_to_act_as_if_one_might_do_something',
                examples: [
                    { text: '言わんばかり', explain: 'As if to say (non-past, non-negative)' },
                    { text: '言わないばかり', explain: 'As if not to say' },
                ],
            },
            {
                text: '~ている',
                explain: 'Enduring State',
                link:
                    'http://www.guidetojapanese.org/learn/grammar/teform#Using_for_enduring_states',
                examples: [{ text: '食べている', explain: 'eating' }],
            },
            {
                text: '~てある',
                explain: 'Resultant State, state of completion, nuance: preparation for sth else',
                link:
                    'http://www.guidetojapanese.org/learn/grammar/teform#Using_for_resultant_states',
                examples: [
                    { text: '準備は、もうしてある', explain: 'preparations are already done' },
                ],
            },
            {
                text: '~ておく',
                explain: 'Preparation for the future',
                link:
                    'http://www.guidetojapanese.org/learn/grammar/teform#Using_the_form_as_preparation_for_the_future',
                examples: [
                    {
                        text: '晩ご飯を作っておく',
                        explain: 'Make dinner (in advance for the future)',
                    },
                ],
            },
            {
                text: 'はず',
                explain: 'Expectation',
                link:
                    'http://www.guidetojapanese.org/learn/grammar/should#Using_to_describe_an_expectation',
                examples: [
                    {
                        text: 'おいしいはず',
                        explain: 'expect to be tasty',
                    },
                ],
            },
            {
                text: 'べき',
                explain: 'Should be done',
                link:
                    'http://www.guidetojapanese.org/learn/grammar/should#Using_to_describe_actions_one_should_do',
                examples: [
                    {
                        text: '話すべき',
                        explain: 'should talk',
                    },
                    {
                        text: 'すべき',
                        explain: 'should do (generic "to do")',
                    },
                ],
            },
            {
                text: 'べく',
                explain: 'Attempted to be done',
                link:
                    'http://www.guidetojapanese.org/learn/grammar/should#Using_to_describe_what_one_tries_to_do',
                examples: [
                    {
                        text: '話すべく',
                        explain: 'in order to / in an effort to talk',
                    },
                    {
                        text: 'すべく',
                        explain: 'in order to / in an effort to do (generic "to do")',
                    },
                ],
            },
            {
                text: 'べからず',
                explain: 'must not be done (opposite of べき)',
                link:
                    'http://www.guidetojapanese.org/learn/grammar/should#Using_to_describe_things_one_must_not_do',
                examples: [
                    {
                        text: '話すべからず',
                        explain: 'must not talk',
                    },
                    {
                        text: 'すべからず',
                        explain: 'must not do',
                    },
                ],
            },
        ],
    }),
});
</script>
