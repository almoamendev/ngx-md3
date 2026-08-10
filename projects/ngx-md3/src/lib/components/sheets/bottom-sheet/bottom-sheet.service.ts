import { Dialog as CdkDialog, DialogRef as CdkDialogRef } from '@angular/cdk/dialog';
import { Overlay } from '@angular/cdk/overlay';
import { CdkPortalOutlet, ComponentPortal } from '@angular/cdk/portal';
import { ComponentRef, inject, Injectable, Injector, Type } from '@angular/core';
import { BottomSheet } from './bottom-sheet';
import { BottomSheetOutlet } from './bottom-sheet-outlet';
import {
    BOTTOM_SHEET_COMPONENT,
    BOTTOM_SHEET_CONFIG,
    BOTTOM_SHEET_DATA,
    BottomSheetRef,
    ModalBottomSheetRef,
    StandardBottomSheetRef,
} from './bottom-sheet-ref';
import { BottomSheetConfig, BottomSheetState, BottomSheetType } from '../../../interfaces/bottom-sheet-config.interface';

interface ResolvedBottomSheetConfig<D = unknown> extends BottomSheetConfig<D> {
    data: D | undefined;
    bindDataToInputs: boolean;
    type: BottomSheetType;
    handle: boolean;
    gestures: boolean;
    dismissible: boolean;
    initialState: BottomSheetState;
    scheme: 'inherit' | 'dark' | 'light';
    direction: null | 'ltr' | 'rtl';
    injector: Injector;
}

/** An outlet a standard sheet can be opened in, with the host attached into it. */
interface BottomSheetOutletState {
    outlet: CdkPortalOutlet;
    hostComponentRef: ComponentRef<BottomSheetOutlet>;
}

const PANEL_CLASS = 'md3-bottom-sheet-panel';
const OPENING_CLASS = 'md3-bottom-sheet-opening';

/**
 * Opens bottom sheets, in either of the two ways MD3 describes them.
 *
 * A modal sheet is a CDK dialog anchored to the bottom of the viewport, the same way a regular
 * dialog is always an overlay, so that path mirrors DialogService. A standard sheet is docked
 * into the scaffold instead, following the side sheet outlet model: it floats over the content
 * without a scrim, leaves the rest of the page usable, and needs an outlet to open into.
 *
 * One of each may be open at a time, and they replace only their own kind.
 */
@Injectable({
    providedIn: 'root',
})
export class BottomSheetService {
    private readonly cdkDialog = inject(CdkDialog);
    private readonly overlay = inject(Overlay);
    private readonly injector = inject(Injector);

    /**
     * Outlets registered from the page scaffold up to whatever took them over last. Standard
     * sheets always open in the outlet on top.
     */
    private readonly outlets: BottomSheetOutletState[] = [];

    private modalRef?: ModalBottomSheetRef<any, any>;
    private standardRef?: StandardBottomSheetRef<any, any>;

    /** Registers the outlet standard bottom sheets open into. Called by Scaffold. */
    public registerBottomSheetOutlet(outlet: CdkPortalOutlet): void {
        if (this.outlets.some((state) => state.outlet === outlet)) {
            return;
        }

        if (outlet.hasAttached()) {
            outlet.detach();
        }

        const portal = new ComponentPortal(BottomSheetOutlet, null, this.injector);

        this.outlets.push({
            outlet,
            hostComponentRef: outlet.attachComponentPortal(portal),
        });
    }

    public unregisterBottomSheetOutlet(outlet: CdkPortalOutlet): void {
        const index = this.outlets.findIndex((state) => state.outlet === outlet);

        if (index === -1) {
            return;
        }

        // A sheet open in this outlet goes with it, without an exit animation: the outlet is
        // being torn down, so there is nothing left to animate in.
        if (index === this.outlets.length - 1) {
            this.standardRef?.dispose();
        }

        this.outlets[index].outlet.detach();
        this.outlets.splice(index, 1);
    }

    public open<T, D = unknown, R = unknown>(
        component: Type<T>,
        config: BottomSheetConfig<D> = {},
    ): BottomSheetRef<T, R> {
        const sheetConfig = this.mergeConfig(config);

        return sheetConfig.type === 'standard'
            ? this.openStandard<T, D, R>(component, sheetConfig)
            : this.openModal<T, D, R>(component, sheetConfig);
    }

    /**
     * Closes the bottom sheet that is open. A modal sheet goes first when both kinds are up,
     * since it is the one covering the page.
     */
    public close<R = unknown>(result?: R): void {
        if (this.modalRef) {
            this.modalRef.close(result);

            return;
        }

        this.standardRef?.close(result);
    }

    private openModal<T, D, R>(
        component: Type<T>,
        sheetConfig: ResolvedBottomSheetConfig<D>,
    ): BottomSheetRef<T, R> {
        // Opening a new modal sheet always replaces the one that is open.
        this.modalRef?.close();

        let sheetRef!: ModalBottomSheetRef<T, R>;

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
                sheetRef = new ModalBottomSheetRef<T, R>(cdkDialogRef);

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
            // A modal bottom sheet blocks page scrolling for as long as it is open.
            scrollStrategy: this.overlay.scrollStrategies.block(),
            // Scrim and Escape handling lives in the reference so the sheet
            // can play its exit animation before the overlay is disposed.
            disableClose: true,
        });

        sheetRef.attachContainer(cdkRef.containerInstance as unknown as BottomSheet);
        sheetRef.componentInstance = cdkRef.componentInstance ?? undefined;

        if (cdkRef.componentRef) {
            this.bindDataToInputs(cdkRef.componentRef, sheetConfig);
        }

        this.modalRef = sheetRef;
        this.startOpenAnimation(sheetRef);

        sheetRef.afterClosed().subscribe(() => {
            if (this.modalRef === sheetRef) {
                this.modalRef = undefined;
            }
        });

        return sheetRef;
    }

    private openStandard<T, D, R>(
        component: Type<T>,
        sheetConfig: ResolvedBottomSheetConfig<D>,
    ): BottomSheetRef<T, R> {
        const host = this.activeOutlet();

        if (!host) {
            throw new Error(
                'No bottom sheet outlet is registered. A standard bottom sheet docks into the '
                + 'scaffold, so the layout has to be in place before one can open.',
            );
        }

        // Opening a new standard sheet always replaces the one that is open.
        this.standardRef?.close();

        const sheetRef: StandardBottomSheetRef<T, R> = new StandardBottomSheetRef<T, R>(() => {
            if (this.standardRef === sheetRef) {
                this.standardRef = undefined;
            }
        });

        const injector = this.createInjector(component, sheetConfig, sheetRef);
        const sheetComponentRef = host.hostComponentRef.instance.createSheet(injector);
        const contentComponentRef = sheetComponentRef.instance.attachContent(component, injector);

        sheetComponentRef.changeDetectorRef.detectChanges();

        sheetRef.attachSheet(sheetComponentRef, sheetComponentRef.instance);
        this.bindDataToInputs(contentComponentRef, sheetConfig);
        sheetRef.componentInstance = contentComponentRef.instance;

        this.standardRef = sheetRef;
        sheetComponentRef.instance.startEnterAnimation();

        return sheetRef;
    }

    private activeOutlet(): BottomSheetOutletState | undefined {
        return this.outlets[this.outlets.length - 1];
    }

    private createInjector<T, D>(
        component: Type<T>,
        config: ResolvedBottomSheetConfig<D>,
        sheetRef: BottomSheetRef<T, any>,
    ): Injector {
        return Injector.create({
            parent: config.injector,
            providers: [
                { provide: BottomSheetRef, useValue: sheetRef },
                { provide: BOTTOM_SHEET_DATA, useValue: config.data },
                { provide: BOTTOM_SHEET_CONFIG, useValue: config },
                { provide: BOTTOM_SHEET_COMPONENT, useValue: component },
            ],
        });
    }

    private startOpenAnimation(sheetRef: ModalBottomSheetRef<any, any>): void {
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
            ...config,
            data: config.data,
            bindDataToInputs: config.bindDataToInputs ?? false,
            type: config.type ?? 'modal',
            handle: config.handle ?? true,
            gestures: config.gestures ?? true,
            dismissible: config.dismissible ?? false,
            initialState: config.initialState ?? 'collapsed',
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
