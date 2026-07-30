import { Component, effect, input, InputSignal, signal } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { BundledLanguage, BundledTheme, codeToHtml } from 'shiki'

@Component({
    selector: 'app-shiki',
    imports: [],
    templateUrl: './shiki.html',
    styleUrl: './shiki.scss',
})
export class Shiki {
    public code: InputSignal<string> = input('', {
        alias: 'code',
    });

    public language: InputSignal<BundledLanguage> = input('typescript' as BundledLanguage, {
        alias: 'language',
    });

    public theme: InputSignal<BundledTheme> = input('material-theme-ocean' as BundledTheme, {
        alias: 'theme',
    });

    public html = signal<SafeHtml>('');

    constructor(private sanitizer: DomSanitizer) {
        effect(() => {
            codeToHtml(this.code(), {
                lang: this.language(),
                theme: this.theme(),
            }).then((html) => {
                this.html.set(this.sanitizer.bypassSecurityTrustHtml(html));
            });
        });
    }
}
