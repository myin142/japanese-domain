import { shallowMount } from '@vue/test-utils';
import RadicalList from '@/views/radicals/RadicalList.vue';
import flushPromises from 'flush-promises';
import { mockFetch } from '../../../helper/fetch-mock';

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

    describe('Resolving Radical Map', () => {

        it('resolve radical class', async () => {
            mockFetch([
                { radical: '并', tags: [] },
            ]);

            const wrapper = shallowMount(RadicalList);
            await flushPromises();

            expect(wrapper.find('span').classes()).toEqual(expect.arrayContaining(['radical-15']));
            expect(wrapper.text()).toBe('');
        });

        it('resolve radical map', async () => {
            mockFetch([
                { radical: '个', tags: [] },
            ]);

            const wrapper = shallowMount(RadicalList);
            await flushPromises();

            expect(wrapper.text()).toEqual('𠆢');
        });

        it('resolve normal radical', async () => {
            mockFetch([
                { radical: '言', tags: [] },
            ]);

            const wrapper = shallowMount(RadicalList);
            await flushPromises();

            expect(wrapper.text()).toEqual('言');
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

        it('is searching if search not empty', async () => {
            const wrapper = shallowMount(RadicalList);
            await flushPromises();
            await wrapper.find('input').setValue('search');

            expect(wrapper.find('.searching').exists()).toBeTruthy();
        })

    });

});
