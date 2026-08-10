import { Dialog as CdkDialog, DialogRef as CdkDialogRef } from '@angular/cdk/dialog';
import { Overlay } from '@angular/cdk/overlay';
import { ComponentRef, inject, Injectable, Injector, Type } from '@angular/core';
import { BottomSheet } from './bottom-sheet';
import { BOTTOM_SHEET_COMPONENT, BOTTOM_SHEET_CONFIG, BOTTOM_SHEET_DATA, BottomSheetRef } from './bottom-sheet-ref';
import { BottomSheetConfig } from '../../../interfaces/bottom-sheet-config.interface';

interface ResolvedBottomSheetConfig<D = unknown> extends BottomSheetConfig<D> {
    data: D | undefined;
    bindDataToInputs: boolean;
    handle: boolean;
    gestures: boolean;
    scheme: 'inherit' | 'dark' | 'light';
    direction: null | 'ltr' | 'rtl';
    injector: Injector;
}

const PANEL_CLASS = 'md3-bottom-sheet-panel';
const OPENING_CLASS = 'md3-bottom-sheet-opening';

/**
 * Opens bottom sheets as CDK dialogs anchored to the bottom of the viewport.
 * A bottom sheet is always a modal overlay, the same way a regular dialog is
 * always an overlay, so this mirrors DialogService rather than the side sheet
 * outlet model: there is no docked variant and nothing to register from the
 * scaffold.
 */
@Injectable({
    providedIn: 'root',
})
export class BottomSheetService {
    private readonly cdkDialog = inject(CdkDialog);
    private readonly overlay = inject(Overlay);
    private readonly injector = inject(Injector);

    /** Only one bottom sheet is ever open at a time. */
    private ref?: BottomSheetRef<any, any>;

    public open<T, D = unknown, R = unknown>(
        component: Type<T>,
        config: BottomSheetConfig<D> = {},
    ): BottomSheetRef<T, R> {
        const sheetConfig = this.mergeConfig(config);

        // Opening a new sheet always replaces the one that is open.
        this.ref?.close();

        let sheetRef!: BottomSheetRef<T, R>;

        const cdkRef = this.cdkDialog.open<R, D, T>(component, {
            // The MD3 shell replaces the default CDK container, so the overlay,
            // focus trap and focus restoration come from the CDK while the
            // shell only renders the surface.
            container: {
                type: BottomSheet,
                providers: () => [
                    { provide: BOTTOM_SHEET_CONFIG, useValue: sheetConfig },
                ],
            },
            // These tokens make the sheet controllable from the dynamic
            // component without coupling that component to the service.
            providers: (cdkDialogRef: CdkDialogRef<R, T>) => {
                sheetRef = new BottomSheetRef<T, R>(cdkDialogRef);

                return [
                    { provide: BottomSheetRef, useValue: sheetRef },
                    { provide: BOTTOM_SHEET_DATA, useValue: sheetConfig.data },
                    { provide: BOTTOM_SHEET_CONFIG, useValue: sheetConfig },
                    { provide: BOTTOM_SHEET_COMPONENT, useValue: component },
                ];
            },
            data: sheetConfig.data,
            role: 'dialog',
            ariaModal: true,
            direction: sheetConfig.direction ?? undefined,
            viewContainerRef: sheetConfig.viewContainerRef,
            injector: sheetConfig.injector,
            hasBackdrop: true,
            backdropClass: ['md3-bottom-sheet-scrim', OPENING_CLASS],
            panelClass: [PANEL_CLASS, OPENING_CLASS],
            positionStrategy: this.overlay.position()
                .global()
                .centerHorizontally()
                .bottom('0'),
            // Bottom sheets block page scrolling for as long as they are open.
            scrollStrategy: this.overlay.scrollStrategies.block(),
            // Scrim and Escape handling lives in BottomSheetRef so the sheet
            // can play its exit animation before the overlay is disposed.
            disableClose: true,
        });

        sheetRef.attachContainer(cdkRef.containerInstance as unknown as BottomSheet);
        sheetRef.componentInstance = cdkRef.componentInstance ?? undefined;

        if (cdkRef.componentRef) {
            this.bindDataToInputs(cdkRef.componentRef, sheetConfig);
        }

        this.ref = sheetRef;
        this.startOpenAnimation(sheetRef);

        sheetRef.afterClosed().subscribe(() => {
            if (this.ref === sheetRef) {
                this.ref = undefined;
            }
        });

        return sheetRef;
    }

    /** Closes the bottom sheet that is open, if there is one. */
    public close<R = unknown>(result?: R): void {
        this.ref?.close(result);
    }

    private startOpenAnimation(sheetRef: BottomSheetRef<any, any>): void {
        const overlayRef = sheetRef.overlayRef;
        const panel = overlayRef.overlayElement;
        const backdrop = overlayRef.backdropElement;

        // The overlay is inserted already rendered. Keep an initial class for
        // one frame, force style calculation, then remove it so CSS
        // transitions have a real from/to state.
        requestAnimationFrame(() => {
            setTimeout(() => {
                panel.getBoundingClientRect();
                panel.classList.remove(OPENING_CLASS);
                backdrop?.classList.remove(OPENING_CLASS);
            }, 100);
        });

        sheetRef.sheetInstance?.startEnterAnimation();
    }

    private mergeConfig<D>(config: BottomSheetConfig<D>): ResolvedBottomSheetConfig<D> {
        return {
            data: config.data,
            bindDataToInputs: config.bindDataToInputs ?? false,
            handle: config.handle ?? true,
            gestures: config.gestures ?? true,
            scheme: config.scheme ?? 'inherit',
            direction: config.direction ?? null,
            viewContainerRef: config.viewContainerRef,
            injector: config.injector ?? this.injector,
        };
    }

    private bindDataToInputs<T, D>(
        componentRef: ComponentRef<T>,
        config: ResolvedBottomSheetConfig<D>,
    ): void {
        if (!config.bindDataToInputs || !this.canBindDataToInputs(config.data)) {
            return;
        }

        Object.entries(config.data).forEach(([inputName, inputValue]) => {
            componentRef.setInput(inputName, inputValue);
        });
    }

    private canBindDataToInputs(data: unknown): data is Record<string, unknown> {
        return typeof data === 'object' && data !== null && !Array.isArray(data);
    }
}
