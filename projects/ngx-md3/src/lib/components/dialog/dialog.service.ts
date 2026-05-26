import { DOCUMENT } from '@angular/common';
import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { ComponentRef, inject, Injectable, Injector, Type, ViewContainerRef } from '@angular/core';
import { filter, take } from 'rxjs';
import { Dialog } from './dialog';
import { DIALOG_COMPONENT, DIALOG_CONFIG, DIALOG_DATA, DialogRef } from './dialog-ref';
import { DialogConfig } from '../../interfaces/dialog-config.interface';

interface ResolvedDialogConfig<D = unknown> extends DialogConfig<D> {
    data: D | undefined;
    bindDataToInputs: boolean;
    disableCloseEvents: boolean;
    role: 'dialog' | 'alertdialog';
    ariaLabel: string;
    ariaLabelledBy: string;
    ariaDescribedBy: string;
    viewContainerRef?: ViewContainerRef;
    injector: Injector;
}

@Injectable({
    providedIn: 'root',
})
export class DialogService {
    private readonly overlay = inject(Overlay);
    private readonly injector = inject(Injector);
    private readonly document = inject(DOCUMENT);

    public open<T, D = unknown, R = unknown>(
        component: Type<T>,
        config: DialogConfig<D> = {},
    ): DialogRef<T, R> {
        const dialogConfig = this.mergeConfig(config);
        const previouslyFocusedElement = this.getFocusedElement();
        const overlayRef = this.createOverlay();
        const dialogRef = new DialogRef<T, R>(
            overlayRef,
            previouslyFocusedElement
        );
        const injector = this.createInjector(component, dialogConfig, dialogRef);

        // The overlay hosts the MD3 dialog shell. The shell is responsible for
        // the surface markup and receives the dynamic content through a portal.
        const dialogPortal = new ComponentPortal(
            Dialog,
            dialogConfig.viewContainerRef ?? null,
            injector,
        );
        const dialogComponentRef = overlayRef.attach(dialogPortal);
        const contentComponentRef = dialogComponentRef.instance.attachContent(component, injector);

        this.bindDataToInputs(contentComponentRef, dialogConfig);
        dialogRef.componentInstance = contentComponentRef.instance;
        dialogRef.dialogInstance = dialogComponentRef.instance;
        this.startOpenAnimation(overlayRef);
        this.connectCloseEvents(overlayRef, dialogRef, dialogConfig);
        this.focusDialog(overlayRef);

        return dialogRef;
    }

    private mergeConfig<D>(config: DialogConfig<D>): ResolvedDialogConfig<D> {
        return {
            data: config.data,
            bindDataToInputs: config.bindDataToInputs ?? false,
            disableCloseEvents: config.disableCloseEvents ?? false,
            role: config.role ?? 'dialog',
            ariaLabel: config.ariaLabel ?? '',
            ariaLabelledBy: config.ariaLabelledBy ?? '',
            ariaDescribedBy: config.ariaDescribedBy ?? '',
            viewContainerRef: config.viewContainerRef,
            injector: config.injector ?? this.injector,
        };
    }

    private createOverlay(): OverlayRef {
        const overlayConfig = new OverlayConfig({
            hasBackdrop: true,
            backdropClass: ['md3-dialog-scrim', 'md3-dialog-opening'],
            panelClass: ['md3-dialog-panel', 'md3-dialog-opening'],
            positionStrategy: this.overlay.position()
                .global()
                .centerHorizontally()
                .centerVertically(),
            scrollStrategy: this.overlay.scrollStrategies.block(),
        });

        return this.overlay.create(overlayConfig);
    }

    private startOpenAnimation(overlayRef: OverlayRef): void {
        const panel = overlayRef.overlayElement;
        const backdrop = overlayRef.backdropElement;

        // The overlay is inserted already rendered. Keep an initial class for
        // one frame, force style calculation, then remove it so CSS transitions
        // have a real from/to state.
        requestAnimationFrame(() => {
            setTimeout(() => {
                panel.getBoundingClientRect();
                panel.classList.remove('md3-dialog-opening');
                backdrop?.classList.remove('md3-dialog-opening');
            }, 100);
        });
    }

    private createInjector<T, D, R>(
        component: Type<T>,
        config: ResolvedDialogConfig<D>,
        dialogRef: DialogRef<T, R>,
    ): Injector {
        return Injector.create({
            parent: config.injector,
            providers: [
                // These tokens make the dialog controllable from the dynamic
                // component without coupling that component to the service.
                { provide: DialogRef, useValue: dialogRef },
                { provide: DIALOG_DATA, useValue: config.data },
                { provide: DIALOG_CONFIG, useValue: config },
                { provide: DIALOG_COMPONENT, useValue: component },
            ],
        });
    }

    private bindDataToInputs<T, D>(
        componentRef: ComponentRef<T>,
        config: ResolvedDialogConfig<D>,
    ): void {
        if (!config.bindDataToInputs || !this.canBindDataToInputs(config.data)) {
            return;
        }

        // setInput runs Angular's normal input pipeline, so input setters,
        // transforms, signal inputs, and change detection are handled for us.
        Object.entries(config.data).forEach(([inputName, inputValue]) => {
            componentRef.setInput(inputName, inputValue);
        });
    }

    private connectCloseEvents<T, R>(
        overlayRef: OverlayRef,
        dialogRef: DialogRef<T, R>,
        config: ResolvedDialogConfig,
    ): void {
        if (config.disableCloseEvents) {
            return;
        }

        overlayRef.backdropClick().pipe(take(1)).subscribe(() => dialogRef.close());
        overlayRef.keydownEvents().pipe(
            filter((event) => event.key === 'Escape'),
            take(1),
        ).subscribe(() => dialogRef.close());
    }

    private focusDialog(overlayRef: OverlayRef): void {
        queueMicrotask(() => {
            const surface = overlayRef.overlayElement.querySelector<HTMLElement>('.md3-dialog-container');
            const focusTarget = surface?.querySelector<HTMLElement>([
                'button:not([disabled])',
                '[href]',
                'input:not([disabled])',
                'select:not([disabled])',
                'textarea:not([disabled])',
                '[tabindex]:not([tabindex="-1"])',
            ].join(', '));

            (focusTarget ?? surface)?.focus();
        });
    }

    private getFocusedElement(): HTMLElement | null {
        const activeElement = this.document.activeElement;
        return activeElement instanceof HTMLElement ? activeElement : null;
    }

    private canBindDataToInputs(data: unknown): data is Record<string, unknown> {
        return typeof data === 'object' && data !== null && !Array.isArray(data);
    }
}
