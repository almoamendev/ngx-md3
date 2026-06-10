import { computed, Injectable, signal } from '@angular/core';
import { LayoutService } from '@vip9008/ngx-md3';

@Injectable({
    providedIn: 'root',
})
export class AppLayout {
    public darkMode = signal<boolean>(true);
    public direction = computed<'ltr' | 'rtl'>(() => this.md3Layout.direction());

    constructor(
        private md3Layout: LayoutService
    ) {
    }
}
