import { NgTemplateOutlet } from '@angular/common';
import { Component, ElementRef, HostListener, OnDestroy, OnInit, TemplateRef, effect, inject, signal } from '@angular/core';
import { Button } from '../buttons/button/button';
import { IconButton } from '../buttons/icon-button/icon-button';
import { MaterialIcon } from '../common/material-icon/material-icon';
import { LayoutService } from '../../foundations/layout.service';
import { SnackbarConfig } from '../../interfaces/snackbar-config.interface';
import { SNACKBAR_ACTION_LABEL, SNACKBAR_CONFIG, SNACKBAR_MESSAGE, SnackbarRef } from './snackbar-ref';

@Component({
    selector: 'md3-snackbar',
    imports: [
        NgTemplateOutlet,
        Button,
        IconButton,
        MaterialIcon,
    ],
    templateUrl: './snackbar.html',
    styleUrl: './snackbar.scss',
})
export class Snackbar implements OnInit, OnDestroy {
    private readonly snackbarRef = inject(SnackbarRef, { optional: true });
    private readonly layout = inject(LayoutService);

    public isActive = signal<boolean>(false);

    protected readonly config = inject<SnackbarConfig>(SNACKBAR_CONFIG, { optional: true }) ?? {};
    protected readonly message = inject<string | TemplateRef<unknown>>(SNACKBAR_MESSAGE, { optional: true }) ?? '';
    protected readonly actionLabel = inject<string | undefined>(SNACKBAR_ACTION_LABEL, { optional: true });

    protected get role(): string {
        return this.config.politeness === 'assertive' ? 'alert' : 'status';
    }

    protected get isTemplateMessage(): boolean {
        return this.message instanceof TemplateRef;
    }

    protected get templateMessage(): TemplateRef<unknown> {
        return this.message as TemplateRef<unknown>;
    }

    protected get textMessage(): string {
        return this.message as string;
    }

    protected get templateContext(): unknown {
        return this.config.data ?? null;
    }

    constructor(private readonly el: ElementRef<HTMLElement>) {
        effect(() => {
            this.el.nativeElement.style.setProperty('--md3-snackbar-bottom-inset', `${this.layout.bottomInset()}px`);
        });
    }

    @HostListener('pointerenter')
    @HostListener('focusin')
    protected onInteractionStart(): void {
        this.snackbarRef?.pauseTimer();
    }

    @HostListener('pointerleave')
    @HostListener('focusout')
    protected onInteractionEnd(): void {
        this.snackbarRef?.resumeTimer();
    }

    ngOnInit(): void {
        requestAnimationFrame(() => {
            this.isActive.set(true);
        });

        this.snackbarRef?.startTimer();
    }

    ngOnDestroy(): void {
        this.snackbarRef?.pauseTimer();
    }

    protected onActionClick(): void {
        this.snackbarRef?.triggerAction();
    }

    protected onCloseClick(): void {
        this.snackbarRef?.close('manual');
    }
}
