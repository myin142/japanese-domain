import { shallowMount } from '@vue/test-utils';
import Radicals from '@/views/radicals/Radicals.vue';
import RadicalList from '@/views/radicals/RadicalList.vue';
import KanjiList from '@/views/radicals/KanjiList.vue';
import { kanjiRadicalService } from '@/services/kanji-radical.service';
import flushPromises from 'flush-promises';

describe('Radical', () => {

    describe('Select Radical', () => {

        beforeEach(() => {
            kanjiRadicalService.getKanjisForRadical = jest.fn()
                .mockImplementation(() => Promise.resolve({
                    kanjis: [],
                }));
        });

        it('add radical to selected radicals', async () => {
            const wrapper = shallowMount(Radicals);
            const list = wrapper.find(RadicalList);
            list.vm.$emit('select-radical', { radical: '手', selected: true });

            await flushPromises();

            expect(wrapper.vm.$data).toEqual(expect.objectContaining({
                selectedRadicals: ['手'],
            }));
        })

        it('remove radical from selected radicals', async () => {
            const wrapper = shallowMount(Radicals);
            wrapper.setData({ selectedRadicals: ['手'], radicalMapCache: {} });

            const list = wrapper.find(RadicalList);
            list.vm.$emit('select-radical', { radical: '手', selected: false });

            await flushPromises();

            expect(wrapper.vm.$data).toEqual(expect.objectContaining({
                selectedRadicals: [],
            }));
        })

        it('show kanjis for radical', async () => {
            kanjiRadicalService.getKanjisForRadical = jest.fn()
                .mockImplementationOnce(() => Promise.resolve({
                    radical: '手',
                    kanjis: [
                        { radical: '手', kanji: '我', otherRadicals: [] },
                        { radical: '手', kanji: '承', otherRadicals: [] },
                    ],
                }));

            const wrapper = shallowMount(Radicals);
            const list = wrapper.find(RadicalList);
            list.vm.$emit('select-radical', { radical: '手', selected: true });

            await flushPromises();

            const kanjiList = wrapper.find(KanjiList);
            expect(kanjiList.props()).toEqual({ kanjis: ['我', '承'] });
        });

        it('show kanjis in multiple selected radicals', async () => {
            kanjiRadicalService.getKanjisForRadical = jest.fn()
                .mockImplementationOnce(() => Promise.resolve({
                    radical: '手',
                    kanjis: [
                        { radical: '手', kanji: '我', otherRadicals: [] },
                        { radical: '手', kanji: '挈', otherRadicals: [] },
                    ],
                }))
                .mockImplementationOnce(() => Promise.resolve({
                    radical: '刀',
                    kanjis: [
                        { radical: '刀', kanji: '刃', otherRadicals: [] },
                        { radical: '刀', kanji: '挈', otherRadicals: [] },
                    ],
                }));

            const wrapper = shallowMount(Radicals);
            const list = wrapper.find(RadicalList);

            list.vm.$emit('select-radical', { radical: '手', selected: true });
            list.vm.$emit('select-radical', { radical: '刀', selected: true });

            await flushPromises();

            const kanjiList = wrapper.find(KanjiList);
            const kanjiProp = kanjiList.props().kanjis;
            expect(kanjiProp).toContain('挈');
            expect(kanjiProp).not.toContain('刃');
            expect(kanjiProp).not.toContain('我');
        });

        it('show kanjis after unselecting radical', async () => {
            kanjiRadicalService.getKanjisForRadical = jest.fn()
                .mockImplementationOnce(() => Promise.resolve({
                    radical: '手',
                    kanjis: [{ radical: '手', kanji: '我', otherRadicals: [] }],
                }))
                .mockImplementationOnce(() => Promise.resolve({
                    radical: '刀',
                    kanjis: [{ radical: '刀', kanji: '刃', otherRadicals: [] }],
                }));

            const wrapper = shallowMount(Radicals);
            const list = wrapper.find(RadicalList);

            list.vm.$emit('select-radical', { radical: '手', selected: true });
            list.vm.$emit('select-radical', { radical: '刀', selected: true });

            await flushPromises();

            list.vm.$emit('select-radical', { radical: '刀', selected: false });

            await flushPromises();

            const kanjiList = wrapper.find(KanjiList);
            const kanjiProp = kanjiList.props().kanjis;
            expect(kanjiProp).toContain('我');
            expect(kanjiProp).not.toContain('刃');
        });

        describe('Radical Prediction', () => {

            it('for single radical', async () => {
                kanjiRadicalService.getKanjisForRadical = jest.fn()
                    .mockImplementationOnce(() => Promise.resolve({
                        radical: '匕',
                        kanjis: [
                            { otherRadicals: ['ノ', '乙'] },
                            { otherRadicals: ['二', '止'] },
                        ],
                    }));

                const wrapper = shallowMount(Radicals);
                const list = wrapper.find(RadicalList);

                list.vm.$emit('select-radical', { radical: '匕', selected: true });

                await flushPromises();

                expect(list.props()).toEqual(expect.objectContaining({
                    nextRadicals: ['ノ', '乙', '二', '止'],
                }));
            });

            it('for multiple radicals', async () => {
                kanjiRadicalService.getKanjisForRadical = jest.fn()
                    .mockImplementationOnce(() => Promise.resolve({
                        radical: '匕',
                        kanjis: [
                            { otherRadicals: ['ノ', '乙'] },
                            { otherRadicals: ['ノ', '十'] },
                        ],
                    }))
                    .mockImplementationOnce(() => Promise.resolve({
                        radical: '乙',
                        kanjis: [
                            { otherRadicals: ['ノ', '匕', '爿'] },
                        ],
                    }));

                const wrapper = shallowMount(Radicals);
                const list = wrapper.find(RadicalList);

                list.vm.$emit('select-radical', { radical: '匕', selected: true });
                list.vm.$emit('select-radical', { radical: '乙', selected: true });
                await flushPromises();

                expect(list.props()).toEqual(expect.objectContaining({
                    nextRadicals: ['ノ', '爿'],
                }));
            });

        });

    });

    describe('Reset Radicals', () => {

        it('reset selected radials on reset event', async () => {
            const wrapper = shallowMount(Radicals, {
                data: () => ({ selectedRadicals: [''] }),
            });
            const list = wrapper.find(RadicalList);
            await list.vm.$emit('reset');

            expect(list.props()).toEqual(expect.objectContaining({ selectedRadicals: [] }))
        });

    });

});