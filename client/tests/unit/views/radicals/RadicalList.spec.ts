import { shallowMount, Wrapper } from '@vue/test-utils';
import RadicalList from '@/views/radicals/RadicalList.vue';
import flushPromises from 'flush-promises';
import { mockFetch } from '../../../helper/fetch-mock';

const awaitFn = async (fn: Function) => { fn(); return flushPromises(); }
const search = async (wrapper: Wrapper<any>, text: string) => awaitFn(() => wrapper.find('input').setValue(text));

describe('RadicalList', () => {

    beforeEach(() => {
        mockFetch([]);
    });

    it('list radicals', async () => {
        mockFetch([
            { radical: '手', tags: [] },
            { radical: '言', tags: [] },
        ]);

        const wrapper = shallowMount(RadicalList);
        await flushPromises();

        const text = wrapper.text();
        expect(text).toContain('手');
        expect(text).toContain('言');
    });

    it('list radicals sorted by strokes', async () => {
        mockFetch([
            { radical: '言', stroke: 7, tags: [] },
            { radical: '手', stroke: 4, tags: [] },
        ]);

        const wrapper = shallowMount(RadicalList);
        await flushPromises();

        const text = wrapper.text();
        expect(text).toContain('手言');
    });

    it('add radical tags as title', async () => {
        mockFetch([
            { radical: '言', tags: ['say', 'word'] },
        ]);

        const wrapper = shallowMount(RadicalList);
        await flushPromises();

        expect(wrapper.find('span').attributes()).toHaveProperty('title', 'say, word');
    });

    it('emit selected radical', async () => {
        mockFetch([
            { radical: '言', tags: [] },
        ]);

        const wrapper = shallowMount(RadicalList);
        await flushPromises();

        const radical = wrapper.find('span');
        await radical.trigger('click');

        expect(wrapper.emitted('select-radical')).toEqual(expect.arrayContaining([
            [{ radical: '言', selected: true }],
        ]));
    });

    it('emit selected false if already selected radical', async () => {
        mockFetch([
            { radical: '言', tags: [] },
        ]);

        const wrapper = shallowMount(RadicalList, {
            propsData: { selectedRadicals: ['言'] }
        });
        await flushPromises();

        const radical = wrapper.find('span');
        await radical.trigger('click');

        expect(wrapper.emitted('select-radical')).toEqual(expect.arrayContaining([
            [{ radical: '言', selected: false }],
        ]));
    });

    it('add selected class', async () => {
        mockFetch([
            { radical: '言', tags: [] },
        ]);

        const wrapper = shallowMount(RadicalList, {
            propsData: { selectedRadicals: ['言'] },
        });
        await flushPromises();

        expect(wrapper.find('span').classes()).toContain('selected');
    })

    it('is filtering if search not empty', async () => {
        const wrapper = shallowMount(RadicalList);
        await flushPromises();
        await wrapper.find('input').setValue('search');

        expect(wrapper.find('.filtering').exists()).toBeTruthy();
    })

    it('is filtering if selected radicals not empty', async () => {
        const wrapper = shallowMount(RadicalList, {
            propsData: { selectedRadicals: [''] },
        });
        await flushPromises();

        expect(wrapper.find('.filtering').exists()).toBeTruthy();
    })

    describe('Reset Button', () => {

        it('reset tag search', async () => {
            const wrapper = shallowMount(RadicalList, {
                data: () => ({ tagSearch: 'Search' }),
            });

            await flushPromises();
            await wrapper.find('button').trigger('click');

            const input = wrapper.find('input').element as HTMLInputElement;
            expect(input.value).toEqual('');
        });

        it('emit reset event', async () => {
            const wrapper = shallowMount(RadicalList);
            await flushPromises();
            await wrapper.find('button').trigger('click');

            expect(wrapper.emitted('reset')).toBeTruthy();
        });

    });

    describe('Resolving Radical Map', () => {

        it('resolve radical class', async () => {
            mockFetch([
                { radical: '并', tags: [] },
            ]);

            const wrapper = shallowMount(RadicalList);
            await flushPromises();

            expect(wrapper.find('span').classes()).toEqual(expect.arrayContaining(['radical-15']));
            expect(wrapper.text()).not.toContain('并');
        });

        it('resolve radical map', async () => {
            mockFetch([
                { radical: '个', tags: [] },
            ]);

            const wrapper = shallowMount(RadicalList);
            await flushPromises();

            expect(wrapper.text()).toContain('𠆢');
        });

        it('resolve normal radical', async () => {
            mockFetch([
                { radical: '言', tags: [] },
            ]);

            const wrapper = shallowMount(RadicalList);
            await flushPromises();

            expect(wrapper.text()).toContain('言');
        });

    })

    describe('Tag Search', () => {

        it('highlight radicals containing tag search', async () => {
            mockFetch([
                { radical: '手', tags: ['hand'] },
                { radical: '言', tags: ['say'] },
            ])

            const wrapper = shallowMount(RadicalList);
            await flushPromises();

            const input = wrapper.find('input');
            input.setValue('say');

            await flushPromises();

            const result = wrapper.find('.highlight');
            expect(result.text()).toEqual('言');
        });

        it('not highlight if empty search and empty tags', async () => {
            mockFetch([
                { radical: '手', tags: [''] },
            ])

            const wrapper = shallowMount(RadicalList);
            await flushPromises();

            const result = wrapper.find('.highlight');
            expect(result.exists()).toBeFalsy();
        });

        it('not highlight if empty search and not empty tags', async () => {
            mockFetch([
                { radical: '手', tags: ['hand'] },
            ])

            const wrapper = shallowMount(RadicalList);
            await flushPromises();

            const result = wrapper.find('.highlight');
            expect(result.exists()).toBeFalsy();
        });

        it('not highlight if search is not next radical', async () => {
            mockFetch([
                { radical: '手', tags: ['hand'] },
                { radical: '言', tags: ['say'] },
            ]);

            const wrapper = shallowMount(RadicalList, {
                propsData: { nextRadicals: ['言'] },
            });
            await flushPromises();

            const input = wrapper.find('input');
            input.setValue('hand');

            await flushPromises();

            const next = wrapper.find('.highlight');
            expect(next.exists()).toBeFalsy();
        });

    });

    describe('Next Radicals', () => {

        it('add next radical class', async () => {
            mockFetch([
                { radical: '手', tags: [] },
                { radical: '言', tags: [] },
            ]);

            const wrapper = shallowMount(RadicalList, {
                propsData: { nextRadicals: ['言'] },
            });
            await flushPromises();

            const next = wrapper.find('.next-radical');
            expect(next.text()).toEqual('言');
        });

        it('prevent select emit if not next radical', async () => {
            mockFetch([{ radical: '手', tags: [] }]);

            const wrapper = shallowMount(RadicalList, {
                propsData: { nextRadicals: ['言'] },
            });
            await flushPromises();

            await wrapper.find('span').trigger('click');

            expect(wrapper.emitted()).toEqual({});
        });

        it('allow select emit if selected radical', async () => {
            mockFetch([{ radical: '手', tags: [] }]);

            const wrapper = shallowMount(RadicalList, {
                propsData: { nextRadicals: ['言'], selectedRadicals: ['手'] },
            });
            await flushPromises();

            await wrapper.find('span').trigger('click');

            expect(wrapper.emitted('select-radical')).toEqual(expect.arrayContaining([
                [{ radical: '手', selected: false }],
            ]));
        });

    });

    describe('Select Via Keyboard', () => {

        it('radical is focusable', async () => {
            mockFetch([
                { radical: '言', tags: [] },
            ]);

            const wrapper = shallowMount(RadicalList)
            await flushPromises();

            const radical = wrapper.find('span');
            const index = parseInt(radical.attributes().tabindex);
            expect(index).toBeGreaterThan(-1);
        });

        it('radical not focusable if not next radical', async () => {
            mockFetch([
                { radical: '言', tags: [] },
            ]);

            const wrapper = shallowMount(RadicalList, {
                propsData: { nextRadicals: ['手'] },
            });
            await flushPromises();

            const radical = wrapper.find('span');
            const index = parseInt(radical.attributes().tabindex);
            expect(index).toEqual(-1)
        });

        it('radical is focusable if next radical', async () => {
            mockFetch([
                { radical: '言', tags: [] },
            ]);

            const wrapper = shallowMount(RadicalList, {
                propsData: { nextRadicals: ['言'] },
            });
            await flushPromises();

            const radical = wrapper.find('span');
            const index = parseInt(radical.attributes().tabindex);
            expect(index).toBeGreaterThan(-1)
        });

        it('radical not focusable if searching and not search result', async () => {
            mockFetch([
                { radical: '言', tags: [] },
            ]);

            const wrapper = shallowMount(RadicalList);
            await flushPromises();
            await search(wrapper, 'text')

            const radical = wrapper.find('span');
            const index = parseInt(radical.attributes().tabindex);
            expect(index).toEqual(-1)
        });

        it('radical is focusable if searching and is search result', async () => {
            mockFetch([
                { radical: '言', tags: ['hand'] },
            ]);

            const wrapper = shallowMount(RadicalList);
            await flushPromises();
            await search(wrapper, 'hand')

            const radical = wrapper.find('span');
            const index = parseInt(radical.attributes().tabindex);
            expect(index).toBeGreaterThan(-1)
        });

        it('selected radical is focusable', async () => {
            mockFetch([
                { radical: '言', tags: [] },
            ]);

            const wrapper = shallowMount(RadicalList, {
                propsData: {
                    nextRadicals: ['手'],
                    selectedRadicals: ['言'],
                },
            });
            await flushPromises();

            const radical = wrapper.find('span');
            const index = parseInt(radical.attributes().tabindex);
            expect(index).toBeGreaterThan(-1)
        });

        it('emit selected radical on space key', async () => {
            mockFetch([
                { radical: '言', tags: [] },
            ]);

            const wrapper = shallowMount(RadicalList);
            await flushPromises();

            await wrapper.find('span').trigger('keydown', { keyCode: 32 });

            expect(wrapper.emitted('select-radical')).toEqual(expect.arrayContaining([
                [{ radical: '言', selected: true }],
            ]));
        });

        it('focus on search input on escape key', async () => {
            mockFetch([
                { radical: '言', tags: [] },
            ]);

            const wrapper = shallowMount(RadicalList, { attachToDocument: true });
            await flushPromises();

            await wrapper.find('span').trigger('keyup', { keyCode: 27 });

            expect(wrapper.vm.$refs.input).toEqual(document.activeElement);
        });

    });

});
