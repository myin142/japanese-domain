import { shallowMount, Wrapper } from '@vue/test-utils';
import KanjiList from '@/views/radicals/KanjiList.vue';
import { japaneseService } from '@/services/japanese.service';
import flushPromises from 'flush-promises';

const searchInput = (wrapper: Wrapper<any>) => wrapper.find('input');
const tokenizeBtn = (wrapper: Wrapper<any>) => wrapper.find('.tokenize');
const firstKanji = (wrapper: Wrapper<any>) => wrapper.find('span');
const allTokens = (wrapper: Wrapper<any>) => wrapper.findAll('.token');

describe('KanjiList', () => {

    it('list kanjis', () => {
        const wrapper = shallowMount(KanjiList, {
            propsData: { kanjis: ['我', '承'] }
        });

        expect(wrapper.text()).toContain('我承');
    });

    it('append kanji to search on click', async () => {
        const wrapper = shallowMount(KanjiList, {
            propsData: { kanjis: ['我'] },
            data: () => ({ search: 'A' }),
        });

        await firstKanji(wrapper).trigger('click');
        const input = searchInput(wrapper).element as HTMLInputElement;
        expect(input.value).toEqual('A我');
    });

    it('tokenize search input on click', async () => {
        japaneseService.analyze = jest.fn().mockReturnValue([]);

        const wrapper = shallowMount(KanjiList);
        await searchInput(wrapper).setValue('日本語');
        await tokenizeBtn(wrapper).trigger('click');

        expect(japaneseService.analyze).toHaveBeenCalledWith('日本語');
    });

    it('show tokenized result', async () => {
        japaneseService.analyze = jest.fn()
            .mockReturnValue(Promise.resolve([
                { surface: '日本語' },
                { surface: 'を' },
                { surface: '勉強' },
            ]));

        const wrapper = shallowMount(KanjiList);
        await tokenizeBtn(wrapper).trigger('click');
        await wrapper.vm.$nextTick();

        const text = wrapper.text();
        expect(text).toContain('日本語');
        expect(text).toContain('を');
        expect(text).toContain('勉強');
        expect(allTokens(wrapper).length).toEqual(3);
    });

});