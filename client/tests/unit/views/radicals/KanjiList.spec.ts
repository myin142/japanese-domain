import { shallowMount } from '@vue/test-utils';
import KanjiList from '@/views/radicals/KanjiList.vue';

describe('KanjiList', () => {

    it('list kanjis', () => {
        const wrapper = shallowMount(KanjiList, {
            propsData: { kanjis: ['我', '承'] }
        });

        expect(wrapper.text()).toEqual('我承');
    });

    it('append kanji to search on click', async () => {
        const wrapper = shallowMount(KanjiList, {
            propsData: { kanjis: ['我'] },
            data: () => ({ search: 'A' }),
        });

        await wrapper.find('span').trigger('click');
        const input = wrapper.find('input').element as HTMLInputElement;
        expect(input.value).toEqual('A我');
    });

});