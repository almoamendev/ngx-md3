import { Dialog as CdkDialog, DialogRef as CdkDialogRef } from '@angular/cdk/dialog';
import { DOCUMENT } from '@angular/common';
import { Overlay } from '@angular/cdk/overlay';
import { ComponentRef, inject, Injectable, Injector, Type, ViewContainerRef } from '@angular/core';
import { Dialog } from './dialog';
import { FullScreenDialog } from './full-screen-dialog/full-screen-dialog';
import { DIALOG_COMPONENT, DIALOG_CONFIG, DIALOG_DATA, DialogRef } from './dialog-ref';
import { DialogConfig, DialogContainer, PreviousDialog } from '../../interfaces/dialog-config.interface';
import { FullScreenDialogConfig } from '../../interfaces/full-screen-dialog-config.interface';

interface ResolvedDialogConfig<D = unknown> extends DialogConfig<D> {
    data: D | undefined;
    bindDataToInputs: boolean;
    disableCloseEvents: boolean;
    previousDialog: PreviousDialog;
    role: 'dialog' | 'alertdialog';
    ariaLabel: string;
    ariaLabelledBy: string;
    ariaDescribedBy: string;
    scheme: 'inherit' | 'dark' | 'light';
    direction: null | 'ltr' | 'rtl';
    viewContainerRef?: ViewContainerRef;
    injector: Injector;
}

const PANEL_CLASS = 'md3-dialog-panel';
const FULL_SCREEN_PANEL_CLASS = 'md3-fullscreen-dialog-panel';
const OPENING_CLASS = 'md3-dialog-opening';
const SCRIM_KEPT_CLASS = 'md3-dialog-scrim-kept';
const SCRIM_INSTANT_CLASS = 'md3-dialog-scrim-instant';

/**
 * Head start given to a dialog that leaves the screen before the dialog taking
 * its place animates in. Long enough to read as one dialog replacing another,
 * short enough to still feel like a single gesture.
 */
const DIALOG_HANDOVER_DELAY_MS = 160;

@Injectable({
    providedIn: 'root',
})
export class DialogService {
    private readonly cdkDialog = inject(CdkDialog);
    private readonly overlay = inject(Overlay);
    private readonly injector = inject(Injector);
    private readonly document = inject(DOCUMENT);

    /** Open dialogs, from the first one opened to the one currently on top. */
    private readonly refs: DialogRef<any, any>[] = [];

    /**
     * Page scrolling is blocked here instead of per overlay, so stacked dialogs
     * cannot unblock the page while another dialog is still open.
     */
    private readonly scrollBlock = this.overlay.scrollStrategies.block();

    /** Element that was focused before the first dialog of the stack opened. */
    private rootTrigger: HTMLElement | null = null;

    public get openDialogs(): readonly DialogRef<any, any>[] {
        return this.refs;
    }

    /** The full screen dialog that is open, if there is one. */
    public get fullScreenDialog(): DialogRef<any, any> | undefined {
        return this.refs.find((ref) => ref.isFullScreen && !ref.isClosing);
    }

    public open<T, D = unknown, R = unknown>(
        component: Type<T>,
        config: DialogConfig<D> = {},
    ): DialogRef<T, R> {
        const dialogConfig = this.mergeConfig(config);

        if (this.refs.length === 0) {
            this.rootTrigger = this.getFocusedElement();
        }

        // The dialog that is on screen starts leaving first, so the two dialogs
        // never animate on top of each other. A full screen dialog is not part
        // of this: regular dialogs open on top of it and leave it alone.
        const previousRef = this.topRegularRef();

        if (previousRef) {
            this.dismissPrevious(previousRef, dialogConfig.previousDialog);
        }

        let dialogRef!: DialogRef<T, R>;

        const cdkRef = this.cdkDialog.open<R, D, T>(component, {
            // The MD3 shell replaces the default CDK container, so the overlay,
            // focus trap and focus restoration come from the CDK while the shell
            // only renders the surface.
            container: {
                type: Dialog,
                providers: () => [
                    { provide: DIALOG_CONFIG, useValue: dialogConfig },
                ],
            },
            // These tokens make the dialog controllable from the dynamic
            // component without coupling that component to the service.
            providers: (cdkDialogRef: CdkDialogRef<R, T>) => {
                dialogRef = new DialogRef<T, R>(cdkDialogRef, dialogConfig.disableCloseEvents);

                return [
                    { provide: DialogRef, useValue: dialogRef },
                    { provide: DIALOG_DATA, useValue: dialogConfig.data },
                    { provide: DIALOG_CONFIG, useValue: dialogConfig },
                    { provide: DIALOG_COMPONENT, useValue: component },
                ];
            },
            data: dialogConfig.data,
            role: dialogConfig.role,
            ariaModal: true,
            ariaLabel: dialogConfig.ariaLabel || null,
            ariaLabelledBy: dialogConfig.ariaLabelledBy || null,
            ariaDescribedBy: dialogConfig.ariaDescribedBy || null,
            direction: dialogConfig.direction ?? undefined,
            viewContainerRef: dialogConfig.viewContainerRef,
            injector: dialogConfig.injector,
            hasBackdrop: true,
            backdropClass: ['md3-dialog-scrim', OPENING_CLASS],
            panelClass: [PANEL_CLASS, OPENING_CLASS],
            positionStrategy: this.overlay.position()
                .global()
                .centerHorizontally()
                .centerVertically(),
            // Scrolling is blocked by the service for the whole stack.
            scrollStrategy: this.overlay.scrollStrategies.noop(),
            // Focus goes back to whatever opened the stack, even when the dialog
            // that was open underneath has been closed in the meantime.
            restoreFocus: this.rootTrigger ?? true,
            // Scrim and Escape handling lives in DialogRef so the dialog can
            // play its exit animation before the overlay is disposed.
            disableClose: true,
        });

        this.registerDialog(dialogRef, cdkRef, dialogConfig, previousRef);

        return dialogRef;
    }

    /**
     * Opens a dialog that covers the whole screen. Only one can be open at a
     * time, so it replaces whatever is open, and while it is up the side sheet
     * outlets belong to it: side sheets open inside the dialog, not behind it.
     */
    public openFullScreen<T, D = unknown, R = unknown>(
        component: Type<T>,
        config: FullScreenDialogConfig<D> = {},
    ): DialogRef<T, R> {
        const dialogConfig = this.mergeConfig(config);

        if (this.refs.length === 0) {
            this.rootTrigger = this.getFocusedElement();
        }

        // A full screen dialog is a context of its own: the dialog it replaces
        // and anything stacked on that dialog goes with it.
        const previousRef = this.topRef();

        if (previousRef) {
            // Everything open belongs to the context being replaced, including
            // a full screen dialog that is already up.
            this.closeAll();
        }

        let dialogRef!: DialogRef<T, R>;

        const cdkRef = this.cdkDialog.open<R, D, T>(component, {
            container: {
                type: FullScreenDialog,
                providers: () => [
                    { provide: DIALOG_CONFIG, useValue: dialogConfig },
                ],
            },
            providers: (cdkDialogRef: CdkDialogRef<R, T>) => {
                dialogRef = new DialogRef<T, R>(cdkDialogRef, dialogConfig.disableCloseEvents, true);

                return [
                    { provide: DialogRef, useValue: dialogRef },
                    { provide: DIALOG_DATA, useValue: dialogConfig.data },
                    { provide: DIALOG_CONFIG, useValue: dialogConfig },
                    { provide: DIALOG_COMPONENT, useValue: component },
                ];
            },
            data: dialogConfig.data,
            role: dialogConfig.role,
            ariaModal: true,
            ariaLabel: dialogConfig.ariaLabel || null,
            ariaLabelledBy: dialogConfig.ariaLabelledBy || null,
            ariaDescribedBy: dialogConfig.ariaDescribedBy || null,
            direction: dialogConfig.direction ?? undefined,
            viewContainerRef: dialogConfig.viewContainerRef,
            injector: dialogConfig.injector,
            // The dialog covers the page on its own, so there is nothing left
            // for a scrim to dim.
            hasBackdrop: false,
            panelClass: [FULL_SCREEN_PANEL_CLASS, OPENING_CLASS],
            // The CDK writes the size on the panel and the global strategy then
            // drops its centering margins, which is how the panel ends up
            // covering the whole wrapper.
            width: '100%',
            height: '100%',
            positionStrategy: this.overlay.position().global(),
            scrollStrategy: this.overlay.scrollStrategies.noop(),
            restoreFocus: this.rootTrigger ?? true,
            disableClose: true,
        });

        this.registerDialog(dialogRef, cdkRef, dialogConfig, previousRef);

        return dialogRef;
    }

    /** Wires a freshly created dialog into the stack and starts its animation. */
    private registerDialog<T, D, R>(
        dialogRef: DialogRef<T, R>,
        cdkRef: CdkDialogRef<R, T>,
        dialogConfig: ResolvedDialogConfig<D>,
        previousRef: DialogRef<any, any> | undefined,
    ): void {
        dialogRef.dialogInstance = cdkRef.containerInstance as unknown as DialogContainer;
        dialogRef.componentInstance = cdkRef.componentInstance ?? undefined;

        if (cdkRef.componentRef) {
            this.bindDataToInputs(cdkRef.componentRef, dialogConfig);
        }

        this.refs.push(dialogRef);
        this.updateScrollBlock();

        if (previousRef) {
            setTimeout(
                () => this.startReplacingAnimation(dialogRef, previousRef),
                DIALOG_HANDOVER_DELAY_MS,
            );
        } else {
            this.startOpenAnimation(dialogRef);
        }

        // Restoring starts with the exit animation, so the dialog underneath is
        // already coming back while this one is fading out.
        dialogRef.beforeClosed().subscribe(() => this.restorePreviousDialog(dialogRef));
        dialogRef.afterClosed().subscribe(() => this.removeRef(dialogRef));
    }

    /** Closes every open dialog, including the hidden and the full screen ones. */
    public closeAll(): Promise<void> {
        // Closed from the bottom up so a closing dialog never brings back a
        // hidden dialog that is about to close as well.
        return Promise.all([...this.refs].map((ref) => ref.close())).then(() => undefined);
    }

    /** Closes the regular dialogs and leaves a full screen dialog alone. */
    private closeRegularDialogs(): Promise<void> {
        const closing = this.refs
            .filter((ref) => !ref.isFullScreen)
            .map((ref) => ref.close());

        return Promise.all(closing).then(() => undefined);
    }

    private mergeConfig<D>(config: DialogConfig<D>): ResolvedDialogConfig<D> {
        return {
            data: config.data,
            bindDataToInputs: config.bindDataToInputs ?? false,
            disableCloseEvents: config.disableCloseEvents ?? false,
            previousDialog: config.previousDialog ?? 'close',
            role: config.role ?? 'dialog',
            ariaLabel: config.ariaLabel ?? '',
            ariaLabelledBy: config.ariaLabelledBy ?? '',
            ariaDescribedBy: config.ariaDescribedBy ?? '',
            scheme: config.scheme ?? 'inherit',
            direction: config.direction ?? null,
            viewContainerRef: config.viewContainerRef,
            injector: config.injector ?? this.injector,
        };
    }

    /**
     * Hides or closes the dialog that is on screen. Its scrim stays up until
     * the dialog taking over is ready for it, so the page behind never
     * brightens between the two dialogs.
     */
    private dismissPrevious(
        previousRef: DialogRef<any, any>,
        behavior: PreviousDialog,
    ): Promise<void> {
        previousRef.overlayRef.backdropElement?.classList.add(SCRIM_KEPT_CLASS);

        return behavior === 'hide' ? previousRef.hide() : this.closeRegularDialogs();
    }

    private startOpenAnimation(dialogRef: DialogRef<any, any>): void {
        const overlayRef = dialogRef.overlayRef;
        const panel = overlayRef.overlayElement;
        const backdrop = overlayRef.backdropElement;

        // The overlay is inserted already rendered. Keep an initial class for
        // one frame, force style calculation, then remove it so CSS transitions
        // have a real from/to state.
        requestAnimationFrame(() => {
            setTimeout(() => {
                panel.getBoundingClientRect();
                panel.classList.remove(OPENING_CLASS);
                backdrop?.classList.remove(OPENING_CLASS);
            }, 100);
        });

        dialogRef.dialogInstance?.startEnterAnimation();
    }

    /** Opening animation for a dialog that took the place of another one. */
    private startReplacingAnimation(
        dialogRef: DialogRef<any, any>,
        previousRef: DialogRef<any, any>,
    ): void {
        if (dialogRef.isClosing) {
            return;
        }

        const panel = dialogRef.overlayRef.overlayElement;
        const backdrop = dialogRef.overlayRef.backdropElement;

        this.beginScrimHandover(previousRef, dialogRef);

        panel.getBoundingClientRect();
        panel.classList.remove(OPENING_CLASS);
        backdrop?.classList.remove(OPENING_CLASS);

        this.endScrimHandover(previousRef, dialogRef);

        dialogRef.dialogInstance?.startEnterAnimation();
    }

    /** Opening animation for a dialog coming back from behind a closing one. */
    private startRestoringAnimation(
        closingRef: DialogRef<any, any>,
        previousRef: DialogRef<any, any>,
    ): void {
        if (previousRef.isClosing) {
            return;
        }

        this.beginScrimHandover(closingRef, previousRef);
        previousRef.show();
        this.endScrimHandover(closingRef, previousRef);
    }

    /**
     * Moves both scrims to their new value in a single frame, without a
     * transition on either side, so the dim behind the dialogs never changes.
     */
    private beginScrimHandover(fromRef: DialogRef<any, any>, toRef: DialogRef<any, any>): void {
        const from = fromRef.overlayRef.backdropElement;
        const to = toRef.overlayRef.backdropElement;

        // Nothing to hand the scrim over to, e.g. a full screen dialog: the
        // outgoing scrim fades out on its own instead.
        if (!to) {
            return;
        }

        from?.classList.add(SCRIM_INSTANT_CLASS);
        from?.classList.remove(SCRIM_KEPT_CLASS);
        to?.classList.add(SCRIM_INSTANT_CLASS);
    }

    /** Gives the scrims their transitions back once the handover is painted. */
    private endScrimHandover(fromRef: DialogRef<any, any>, toRef: DialogRef<any, any>): void {
        const from = fromRef.overlayRef.backdropElement;
        const to = toRef.overlayRef.backdropElement;

        requestAnimationFrame(() => {
            from?.classList.remove(SCRIM_INSTANT_CLASS);
            to?.classList.remove(SCRIM_INSTANT_CLASS);
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

    private canBindDataToInputs(data: unknown): data is Record<string, unknown> {
        return typeof data === 'object' && data !== null && !Array.isArray(data);
    }

    /** Last dialog of the stack that is not closing yet. */
    private topRef(): DialogRef<any, any> | undefined {
        for (let index = this.refs.length - 1; index >= 0; index--) {
            if (!this.refs[index].isClosing) {
                return this.refs[index];
            }
        }

        return undefined;
    }

    /**
     * Same, without the full screen dialog: it hosts the dialogs opened on top
     * of it, so it is never the one that gets hidden or closed to make room.
     */
    private topRegularRef(): DialogRef<any, any> | undefined {
        const ref = this.topRef();

        return ref?.isFullScreen ? undefined : ref;
    }

    private restorePreviousDialog(ref: DialogRef<any, any>): void {
        const index = this.refs.indexOf(ref);

        if (index < 1) {
            return;
        }

        for (let previousIndex = index - 1; previousIndex >= 0; previousIndex--) {
            const previousRef = this.refs[previousIndex];

            if (previousRef.isClosing) {
                continue;
            }

            // The closing dialog gets the same head start it was given when it
            // took the screen, and keeps the scrim until then. Nothing to keep
            // when the dialog underneath has no scrim of its own.
            if (previousRef.overlayRef.backdropElement) {
                ref.overlayRef.backdropElement?.classList.add(SCRIM_KEPT_CLASS);
            }

            setTimeout(
                () => this.startRestoringAnimation(ref, previousRef),
                DIALOG_HANDOVER_DELAY_MS,
            );
            return;
        }
    }

    private removeRef(ref: DialogRef<any, any>): void {
        const index = this.refs.indexOf(ref);

        if (index === -1) {
            return;
        }

        this.refs.splice(index, 1);

        if (this.refs.length === 0) {
            this.rootTrigger = null;
        }

        this.updateScrollBlock();
    }

    private updateScrollBlock(): void {
        if (this.refs.length > 0) {
            this.scrollBlock.enable();
        } else {
            this.scrollBlock.disable();
        }
    }

    private getFocusedElement(): HTMLElement | null {
        const activeElement = this.document.activeElement;
        return activeElement instanceof HTMLElement ? activeElement : null;
    }
}
