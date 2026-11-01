import { applyScale, readScale } from './scale';

describe('scale', () => {
    it('should set the scale and leave an undefined one to inheritance', () => {
        const element = document.createElement('div');

        applyScale(element, undefined);
        expect(element.style.getPropertyValue('--md3-scale')).toBe('');

        applyScale(element, 0.875);
        expect(element.style.getPropertyValue('--md3-scale')).toBe('0.875');
    });

    it('should read the inherited scale, or undefined when nothing sets one', () => {
        const parent = document.createElement('div');
        const child = document.createElement('span');
        parent.appendChild(child);
        document.body.appendChild(parent);

        expect(readScale(child)).toBeUndefined();

        parent.style.setProperty('--md3-scale', '1.25');
        expect(readScale(child)).toBe(1.25);

        parent.remove();
    });
});
