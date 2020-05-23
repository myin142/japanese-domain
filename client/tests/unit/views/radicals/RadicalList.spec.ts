import { shallowMount } from '@vue/test-utils';
import RadicalList from '@/views/radicals/RadicalList.vue';
import flushPromises from 'flush-promises';
import { mockFetch } from '../../../helper/fetch-mock';

describe('RadicalList', () => {

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

        const wrapper = shallowMount(RadicalList);
        await flushPromises();

        wrapper.setProps({ selectedRadicals: ['言'] })
        const radical = wrapper.find('span');
        await radical.trigger('click');

        expect(wrapper.emitted('select-radical')).toEqual(expect.arrayContaining([
            [{ radical: '言', selected: false }],
        ]));
    });

});
