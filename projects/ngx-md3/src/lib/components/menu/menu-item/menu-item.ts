import { booleanAttribute, Component, ElementRef, HostListener, Input } from '@angular/core';
import { StateComponent } from '../../common/state-component';

@Component({
    selector: 'button[md3-menu-item], a[md3-menu-item]',
    imports: [],
    templateUrl: './menu-item.html',
    styleUrl: './menu-item.scss',
    hostDirectives: [
        StateComponent,
    ],
})
export class MenuItem {
    @Input({ transform: booleanAttribute }) selected = false;
    @Input({ transform: booleanAttribute }) disabled = false;
    @Input('item-role') itemRole: 'menuitem' | 'menuitemcheckbox' | 'menuitemradio' | 'option' = 'menuitem';
    @Input('supporting-text') supportingText?: string;
    @Input('trailing-text') trailingText?: string;

    constructor(private el: ElementRef<HTMLElement>) {
    }

    public get element(): HTMLElement {
        return this.el.nativeElement;
    }

    public get isButton(): boolean {
        return this.element instanceof HTMLButtonElement;
    }

    public get isNativeInteractiveElement(): boolean {
        return this.element instanceof HTMLButtonElement || this.element instanceof HTMLAnchorElement;
    }

    public get isCheckableRole(): boolean {
        return this.itemRole === 'menuitemcheckbox' || this.itemRole === 'menuitemradio';
    }

    public get tabIndex(): string | null {
        if (this.disabled) {
            return '-1';
        }

        return this.isNativeInteractiveElement ? null : '0';
    }
}
