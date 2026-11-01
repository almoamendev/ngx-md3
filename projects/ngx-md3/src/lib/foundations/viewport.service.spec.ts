import { TestBed } from '@angular/core/testing';

import { ViewportService } from './viewport.service';

/** ResizeObserver reports between layout and paint, so two frames are always enough. */
const nextFrames = () => new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));

describe('ViewportService', () => {
    let service: ViewportService;
    const root = document.documentElement;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ViewportService);
    });

    afterEach(() => {
        root.style.fontSize = '';
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should resolve the breakpoints against the root font-size', async () => {
        // The window size of the test browser is unknown, so pick font sizes that put the same
        // width on either side of the 37.5rem breakpoint.
        const width = root.clientWidth;

        root.style.fontSize = `${width / 30}px`; // 30rem wide
        await nextFrames();
        expect(service.widthClass()).toBe('compact');

        root.style.fontSize = `${width / 45}px`; // 45rem wide
        await nextFrames();
        expect(service.widthClass()).toBe('medium');

        root.style.fontSize = `${width / 120}px`; // 120rem wide
        await nextFrames();
        expect(service.widthClass()).toBe('extra-large');
    });

    it('should scale the height class with the root font-size too', async () => {
        const height = window.innerHeight;

        root.style.fontSize = `${height / 20}px`; // 20rem tall
        await nextFrames();
        expect(service.heightClass()).toBe('compact');

        root.style.fontSize = `${height / 60}px`; // 60rem tall
        await nextFrames();
        expect(service.heightClass()).toBe('expanded');
    });
});
