import { scrollTopForOption } from './select-scroll';

describe('scrollTopForOption', () => {
    const viewportHeight = 200;
    const optionHeight = 48;

    it('leaves a fully visible option where it is', () => {
        expect(scrollTopForOption({ optionTop: 60, optionHeight, scrollTop: 0, viewportHeight })).toBe(0);
    });

    it('scrolls up to an option above the viewport', () => {
        expect(scrollTopForOption({ optionTop: 96, optionHeight, scrollTop: 150, viewportHeight })).toBe(96);
    });

    it('scrolls down just enough to show an option below the viewport', () => {
        expect(scrollTopForOption({ optionTop: 240, optionHeight, scrollTop: 0, viewportHeight })).toBe(88);
    });

    it('aligns an option that ends exactly at the viewport edge without moving', () => {
        expect(scrollTopForOption({ optionTop: 152, optionHeight, scrollTop: 0, viewportHeight })).toBe(0);
    });

    it('shows the top of an option taller than the viewport', () => {
        expect(scrollTopForOption({ optionTop: 300, optionHeight: 500, scrollTop: 400, viewportHeight })).toBe(300);
    });
});
