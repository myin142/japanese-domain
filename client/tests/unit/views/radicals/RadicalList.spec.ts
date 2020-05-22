import { shallowMount } from '@vue/test-utils';
import RadicalList from '@/views/radicals/RadicalList.vue';
import flushPromises from 'flush-promises';
import * as fetchMock from 'jest-fetch-mock';

describe('RadicalList', () => {

    beforeEach(() => {
        fetchMock.enableFetchMocks();
    });

    afterEach(() => {
        fetchMock.disableFetchMocks();
    })

    it('list radicals', async () => {
        fetchMock.default.mockResponse(async req => JSON.stringify([
            { radical: '手', tags: [] },
            { radical: '言', tags: [] },
        ]));

        const wrapper = shallowMount(RadicalList);
        await flushPromises();

        const text = wrapper.text();
        expect(text).toContain('手');
        expect(text).toContain('言');
    });

    it('list radicals sorted by strokes', async () => {
        fetchMock.default.mockResponse(async req => JSON.stringify([
            { radical: '言', stroke: 7, tags: [] },
            { radical: '手', stroke: 4, tags: [] },
        ]));

        const wrapper = shallowMount(RadicalList);
        await flushPromises();

        const text = wrapper.text();
        expect(text).toContain('手言');
    });

    it('add radical tags as title', async () => {
        fetchMock.default.mockResponse(async req => JSON.stringify([
            { radical: '言', tags: ['say', 'word'] },
        ]));

        const wrapper = shallowMount(RadicalList);
        await flushPromises();

        expect(wrapper.find('span').attributes()).toHaveProperty('title', 'say, word');
    });

    it('add selected class on click', async () => {
        fetchMock.default.mockResponse(async req => JSON.stringify([
            { radical: '言', tags: [] },
        ]));

        const wrapper = shallowMount(RadicalList);
        await flushPromises();

        const radical = wrapper.find('span');
        await radical.trigger('click');

        expect(radical.attributes()).toHaveProperty('class', 'selected');
    });

});
