import { booleanAttribute, Component, ElementRef, HostListener, Input } from '@angular/core';
import { StateComponent } from '../../common/state-component';

@Component({
    selector: 'md3-menu-item, button[md3-menu-item], a[md3-menu-item]',
    imports: [],
    templateUrl: './menu-item.html',
    styleUrl: './menu-item.scss',
    hostDirectives: [
        StateComponent,
    ],
    host: {
        'class': 'md3-menu-item',
        '[class.md3-selected]': 'selected',
        '[class.md3-disabled]': 'disabled',
        '[attr.role]': 'itemRole',
        '[attr.aria-disabled]': 'disabled ? "true" : null',
        '[attr.aria-checked]': 'isCheckableRole ? selected : null',
        '[attr.aria-selected]': 'itemRole === "option" ? selected : null',
        '[attr.tabindex]': 'tabIndex',
        '[attr.disabled]': 'disabled && isButton ? "" : null',
    },
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

    @HostListener('click', ['$event'])
    protected onClick(event: Event): void {
        if (!this.disabled) {
            return;
        }

        event.preventDefault();
        event.stopImmediatePropagation();
    }

    @HostListener('keydown', ['$event'])
    protected onKeydown(event: KeyboardEvent): void {
        if (this.disabled || this.isNativeInteractiveElement) {
            return;
        }

        if (event.key !== 'Enter' && event.key !== ' ') {
            return;
        }

        event.preventDefault();
        this.element.click();
    }
}
