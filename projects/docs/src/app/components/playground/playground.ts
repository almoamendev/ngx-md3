import { NgClass } from '@angular/common';
import { Component, input, signal } from '@angular/core';
import { Button, Card, IconButton, IconElement, MaterialIcon } from '@vip9008/ngx-md3';

@Component({
    selector: 'app-playground',
    imports: [
        Button,
        IconButton,
        MaterialIcon,
        IconElement,
        Card,
        NgClass,
    ],
    templateUrl: './playground.html',
    styleUrl: './playground.scss',
})
export class Playground {
    public title = input<string>('Playground');
    public darkMode = signal<boolean>(true);
    public backgroundVariant = input<boolean>(false, {
        alias: 'bg-variant',
    });
    public rtl = signal<boolean>(false);

    public toggleDarkMode() {
        this.darkMode.update((mode) => !mode);
    }

    public toggleRtl() {
        this.rtl.update((mode) => !mode);
    }
}
