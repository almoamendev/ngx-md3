import { DOCUMENT } from '@angular/common';
import { inject, Injectable, OnDestroy, signal } from '@angular/core';

/**
 * Reads the *current* computed value of a design token off the live document.
 *
 * The docs deliberately don't hard-code token values: hand-copied tables drift
 * the moment a token file changes. Reading them back from the page instead
 * means the tables always show what the library actually ships, and they
 * update for free when the value depends on runtime state.
 *
 * Values are read from `<body>`, not `<html>`, because the color scheme
 * classes (`md-scheme-light` / `md-scheme-dark`) are applied to the body.
 * Tokens declared only on `:root` are inherited down to it, so reading from
 * the body is correct for every token family.
 */
@Injectable({
    providedIn: 'root',
})
export class TokenValuesService implements OnDestroy {
    private readonly document = inject(DOCUMENT);

    /**
     * Bumped whenever something that can change a token value happens: the
     * scheme class changing (colors) or the viewport crossing a breakpoint
     * (grid). Read it inside a computed to make that computed re-evaluate.
     */
    public readonly revision = signal<number>(0);

    private readonly observer?: MutationObserver;
    private readonly onResize = () => this.refresh();

    constructor() {
        const body = this.document.body;

        if (typeof MutationObserver !== 'undefined' && body) {
            this.observer = new MutationObserver(() => this.refresh());
            this.observer.observe(body, {
                attributes: true,
                attributeFilter: ['class'],
            });
        }

        this.document.defaultView?.addEventListener('resize', this.onResize, { passive: true });
    }

    ngOnDestroy(): void {
        this.observer?.disconnect();
        this.document.defaultView?.removeEventListener('resize', this.onResize);
    }

    /**
     * Current computed value of a custom property, e.g. "92, 77, 212".
     * Returns an empty string if the token isn't defined — which, in these
     * docs, means the catalog has a name the token files no longer declare.
     */
    public read(name: string): string {
        const body = this.document.body;
        if (!body) {
            return '';
        }

        const view = this.document.defaultView;
        if (!view) {
            return '';
        }

        let value = view.getComputedStyle(body).getPropertyValue(name).trim().replaceAll('\n    ', ' ');
        
        if(name.startsWith('--md-shadow')) {
            value = value.replaceAll(', rgb', ',\nrgb');
            console.log(value);
        }

        return value;
    }

    public refresh(): void {
        this.revision.update((value) => value + 1);
    }
}
