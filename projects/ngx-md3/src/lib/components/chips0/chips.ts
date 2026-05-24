import { AfterContentInit, booleanAttribute, Component, ContentChild, DestroyRef, ElementRef, EventEmitter, HostListener, Input, Output, signal } from '@angular/core';
import { AbstractControl, FormControlName } from '@angular/forms';
import { fromEvent } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { InputElement } from '../common/input-element';
import { MaterialIcon } from '../common/material-icon/material-icon';
import { StateComponent } from '../common/state-component';
import { ChipType } from '../../types/chip-type.type';

@Component({
    selector: 'md3-chip, button[md3-chip], a[md3-chip], label[md3-chip]',
    imports: [
        MaterialIcon,
    ],
    templateUrl: './chips.html',
    styleUrl: './chips.scss',
    hostDirectives: [
        StateComponent,
    ],
})
export class Chips implements AfterContentInit {
    @Input() control?: AbstractControl;
    @Input('remove-label') removeLabel = 'Remove';

    @Input('chip-type') set type(value: ChipType) {
        this.chipType.set(value);
        this.syncHostState();
    }

    @Input({ transform: booleanAttribute }) set elevated(value: boolean) {
        this.isElevated.set(value);
        this.syncHostState();
    }

    @Input({ transform: booleanAttribute }) set removable(value: boolean) {
        this.isRemovable.set(value);
        this.syncHostState();
    }

    @Input({ transform: booleanAttribute }) set avatar(value: boolean) {
        this.hasAvatar.set(value);
        this.syncHostState();
    }

    @Input({ transform: booleanAttribute }) set selected(value: boolean) {
        this.setSelected(value);
    }

    @Input({ transform: booleanAttribute }) set disabled(value: boolean) {
        this.disabledFromInput = value;
        this.isDisabled.set(value);
        this.syncHostState();
    }

    @Output() selectedChange = new EventEmitter<boolean>();
    @Output() removed = new EventEmitter<void>();

    @ContentChild(InputElement) input?: InputElement;
    @ContentChild(FormControlName) controlName?: FormControlName;

    protected readonly chipType = signal<ChipType>('assist');
    protected readonly isElevated = signal<boolean>(false);
    protected readonly isRemovable = signal<boolean>(false);
    protected readonly hasAvatar = signal<boolean>(false);
    protected readonly isSelected = signal<boolean>(false);
    protected readonly isDisabled = signal<boolean>(false);

    private disabledFromInput?: boolean;

    constructor(
        private el: ElementRef<HTMLElement>,
        private destroyRef: DestroyRef,
    ) {
    }

    public get element(): HTMLElement {
        return this.el.nativeElement;
    }

    public get formControl(): AbstractControl | undefined {
        if (this.control) {
            return this.control;
        }

        return this.controlName?.control;
    }

    ngAfterContentInit(): void {
        this.syncStateFromSource();
        this.syncHostState();

        if (this.input?.nativeElement) {
            fromEvent(this.input.nativeElement, 'change').pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
                this.setSelected(this.input?.nativeElement.checked ?? false, true);
            });

            fromEvent(this.input.nativeElement, 'focus').pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
                this.element.classList.add('md3-focused');
            });

            fromEvent(this.input.nativeElement, 'blur').pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
                this.element.classList.remove('md3-focused');
            });
        }

        this.formControl?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
            this.syncStateFromSource();
        });

        this.formControl?.statusChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
            this.syncDisabledStateFromSource();
            this.syncHostState();
        });
    }

    @HostListener('click', ['$event'])
    protected onClick(event: MouseEvent): void {
        if (this.isDisabled()) {
            event.preventDefault();
            event.stopImmediatePropagation();
            return;
        }

        if (this.chipType() !== 'filter' || this.input?.nativeElement) {
            return;
        }

        this.setSelected(!this.isSelected(), true);
    }

    @HostListener('keydown', ['$event'])
    protected onKeydown(event: KeyboardEvent): void {
        if (event.key !== 'Enter' && event.key !== ' ') {
            return;
        }

        if (this.isNativeInteractiveElement()) {
            return;
        }

        event.preventDefault();
        this.element.click();
    }

    protected removeChip(event: Event): void {
        event.preventDefault();
        event.stopPropagation();

        if (this.isDisabled()) {
            return;
        }

        this.removed.emit();
    }

    protected onRemoveKeydown(event: KeyboardEvent): void {
        if (event.key !== 'Enter' && event.key !== ' ') {
            return;
        }

        this.removeChip(event);
    }

    protected canRemove(): boolean {
        return this.isRemovable() && (this.chipType() === 'filter' || this.chipType() === 'input');
    }

    private syncStateFromSource(): void {
        this.syncDisabledStateFromSource();

        if (this.formControl) {
            this.setSelected(this.formControl.value === true);
            return;
        }

        if (this.input?.nativeElement) {
            this.setSelected(this.input.nativeElement.checked);
        }
    }

    private syncDisabledStateFromSource(): void {
        const sourceDisabled = this.formControl?.disabled ?? this.input?.nativeElement.disabled;

        if (sourceDisabled !== undefined) {
            this.isDisabled.set((this.disabledFromInput ?? false) || sourceDisabled);
        }
    }

    private setSelected(value: boolean, emit: boolean = false): void {
        this.isSelected.set(value);
        this.syncSelectionState();

        if (this.input?.nativeElement && this.input.nativeElement.checked !== value) {
            this.input.nativeElement.checked = value;
        }

        if (this.formControl && this.formControl.value !== value) {
            this.formControl.setValue(value);
        }

        if (emit) {
            this.selectedChange.emit(value);
        }
    }

    private syncHostState(): void {
        this.element.classList.remove('md3-assist', 'md3-filter', 'md3-input', 'md3-suggestion');
        this.element.classList.add('md3-' + this.chipType());
        this.element.classList.toggle('md3-elevated', this.isElevated());
        this.element.classList.toggle('md3-removable', this.canRemove());
        this.element.classList.toggle('md3-avatar', this.hasAvatar());

        this.syncSelectionState();
        this.syncDisabledState();

        if (!this.isNativeInteractiveElement()) {
            this.element.setAttribute('role', 'button');
            this.element.setAttribute('tabindex', this.isDisabled() ? '-1' : '0');
        }
    }

    private syncSelectionState(): void {
        const supportsSelection = this.chipType() === 'filter' || this.chipType() === 'input';
        const selected = supportsSelection && this.isSelected();

        this.element.classList.toggle('md3-selected', selected);

        if (supportsSelection && !this.input?.nativeElement) {
            this.element.setAttribute('aria-pressed', String(selected));
        } else {
            this.element.removeAttribute('aria-pressed');
        }
    }

    private syncDisabledState(): void {
        const disabled = this.isDisabled();

        this.element.classList.toggle('md3-disabled', disabled);
        this.element.setAttribute('aria-disabled', String(disabled));

        if (this.element instanceof HTMLButtonElement) {
            this.element.disabled = disabled;
        }

        if (this.input?.nativeElement) {
            this.input.nativeElement.disabled = disabled;
        }
    }

    private isNativeInteractiveElement(): boolean {
        return this.element instanceof HTMLButtonElement
            || this.element instanceof HTMLAnchorElement
            || this.element instanceof HTMLLabelElement;
    }

}

@Component({
    selector: 'md3-chip-set, md3-chips',
    template: '<ng-content></ng-content>',
    host: {
        'class': 'md3-chip-set',
        'role': 'toolbar',
    },
    styles: [`
        :host {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            gap: 0.5rem;
            max-width: 100%;
        }
    `],
})
export class ChipSet {
    constructor(private el: ElementRef<HTMLElement>) {
    }

    @HostListener('keydown', ['$event'])
    protected onKeydown(event: KeyboardEvent): void {
        if (this.shouldIgnoreKeydown(event)) {
            return;
        }

        if (!['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
            return;
        }

        const chips = this.focusableChips();

        if (!chips.length) {
            return;
        }

        event.preventDefault();

        const activeIndex = chips.findIndex((chip) => {
            return chip === document.activeElement || chip.contains(document.activeElement);
        });
        const currentIndex = activeIndex >= 0 ? activeIndex : 0;

        let nextIndex = currentIndex;

        if (event.key === 'Home') {
            nextIndex = 0;
        } else if (event.key === 'End') {
            nextIndex = chips.length - 1;
        } else if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
            nextIndex = (currentIndex + 1) % chips.length;
        } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
            nextIndex = (currentIndex - 1 + chips.length) % chips.length;
        }

        chips[nextIndex]?.focus();
    }

    private focusableChips(): HTMLElement[] {
        const chipHosts = Array.from(this.el.nativeElement.querySelectorAll<HTMLElement>(
            'md3-chip:not(.md3-disabled), button[md3-chip]:not(:disabled), a[md3-chip]:not(.md3-disabled), label[md3-chip]:not(.md3-disabled)'
        ));

        return chipHosts.map((chip) => {
            return chip.querySelector<HTMLElement>('.md3-input-element:not(:disabled)') ?? chip;
        }).filter((chip) => {
            return chip.tabIndex >= 0
                || chip instanceof HTMLButtonElement
                || chip instanceof HTMLAnchorElement
                || chip instanceof HTMLInputElement;
        });
    }

    private shouldIgnoreKeydown(event: KeyboardEvent): boolean {
        const target = event.target;

        if (!(target instanceof HTMLElement)) {
            return false;
        }

        if (target instanceof HTMLTextAreaElement || target.isContentEditable) {
            return true;
        }

        if (!(target instanceof HTMLInputElement)) {
            return false;
        }

        return target.type !== 'checkbox' && target.type !== 'radio';
    }
}
