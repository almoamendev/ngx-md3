import { ComponentRef, inject, Injectable, Injector, Type } from '@angular/core';
import { CdkPortalOutlet, ComponentPortal } from '@angular/cdk/portal';
import { SideSheetStack } from './side-sheet/side-sheet-stack';
import {
    SIDE_SHEET_COMPONENT,
    SIDE_SHEET_CONFIG,
    SIDE_SHEET_DATA,
    SideSheetConfig,
    SideSheetRef,
    SideSheetSide,
    SideSheetType,
} from './side-sheet/side-sheet-ref';

interface ResolvedSideSheetConfig<D = unknown> extends SideSheetConfig<D> {
    data: D | undefined;
    bindDataToInputs: boolean;
    side: SideSheetSide;
    type: SideSheetType;
    inset: boolean;
    closeExisting: boolean;
    injector: Injector;
}

interface SideSheetOutletState<T = unknown, R = unknown> {
    outlet: CdkPortalOutlet;
    stackComponentRef: ComponentRef<SideSheetStack>;
    refs: SideSheetRef<T, R>[];
}

@Injectable({
    providedIn: 'root',
})
export class SheetsService {
    private readonly injector = inject(Injector);
    private readonly states = new Map<SideSheetSide, SideSheetOutletState>();

    public registerSideSheetOutlet(side: SideSheetSide, outlet: CdkPortalOutlet): void {
        const currentState = this.states.get(side);

        if (currentState?.outlet === outlet) {
            return;
        }

        if (currentState) {
            this.disposeOutletState(currentState);
        }

        if (outlet.hasAttached()) {
            outlet.detach();
        }

        const stackPortal = new ComponentPortal(SideSheetStack, null, this.injector);
        const stackComponentRef = outlet.attachComponentPortal(stackPortal);

        this.states.set(side, {
            outlet,
            stackComponentRef,
            refs: [],
        });
    }

    public unregisterSideSheetOutlet(side: SideSheetSide, outlet: CdkPortalOutlet): void {
        const state = this.states.get(side);

        if (!state || state.outlet !== outlet) {
            return;
        }

        this.disposeOutletState(state);
        this.states.delete(side);
    }

    public openSideSheet<T = unknown, D = unknown, R = unknown>(
        component: Type<T>,
        config: SideSheetConfig<D> = {},
    ): SideSheetRef<T, R> {
        const sheetConfig = this.mergeConfig(config);
        const state = this.states.get(sheetConfig.side);

        if (!state) {
            throw new Error(`No ${sheetConfig.side} side sheet outlet is registered.`);
        }

        if (sheetConfig.closeExisting) {
            this.disposeSideSheetRefs(state);
        } else {
            this.getVisibleRef(state)?.hide();
        }

        const sheetRef = new SideSheetRef<T, R>(
            sheetConfig.side,
            () => this.removeSideSheetRef(state, sheetRef as SideSheetRef),
        );
        const injector = this.createInjector(component, sheetConfig, sheetRef);
        const { sheetComponentRef, contentComponentRef } = state.stackComponentRef.instance.createSheet(
            component,
            injector,
        );

        sheetComponentRef.instance.side.set(sheetConfig.side);
        sheetComponentRef.instance.sheetType.set(sheetConfig.type);
        sheetComponentRef.instance.isInset.set(sheetConfig.inset);

        sheetRef.attachSheetComponentRef(sheetComponentRef);
        this.bindDataToInputs(contentComponentRef, sheetConfig);
        sheetRef.componentInstance = contentComponentRef.instance;
        state.refs.push(sheetRef as SideSheetRef);

        return sheetRef;
    }

    public closeSideSheet<R = unknown>(side: SideSheetSide = 'end', result?: R): void {
        this.getVisibleRef(this.states.get(side))?.close(result);
    }

    private mergeConfig<D>(config: SideSheetConfig<D>): ResolvedSideSheetConfig<D> {
        return {
            data: config.data,
            bindDataToInputs: config.bindDataToInputs ?? false,
            side: config.side ?? 'end',
            type: config.type ?? 'default',
            inset: config.inset ?? false,
            closeExisting: config.closeExisting ?? false,
            viewContainerRef: config.viewContainerRef,
            injector: config.injector ?? this.injector,
        };
    }

    private createInjector<T, D, R>(
        component: Type<T>,
        config: ResolvedSideSheetConfig<D>,
        sheetRef: SideSheetRef<T, R>,
    ): Injector {
        return Injector.create({
            parent: config.injector,
            providers: [
                { provide: SideSheetRef, useValue: sheetRef },
                { provide: SIDE_SHEET_DATA, useValue: config.data },
                { provide: SIDE_SHEET_CONFIG, useValue: config },
                { provide: SIDE_SHEET_COMPONENT, useValue: component },
            ],
        });
    }

    private bindDataToInputs<T, D>(
        componentRef: ComponentRef<T>,
        config: ResolvedSideSheetConfig<D>,
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

    private disposeOutletState(state: SideSheetOutletState): void {
        this.disposeSideSheetRefs(state);

        if (state.outlet.hasAttached()) {
            state.outlet.detach();
        }
    }

    private disposeSideSheetRefs(state: SideSheetOutletState): void {
        const refs = [...state.refs];

        state.refs.length = 0;

        refs.forEach((ref) => {
            ref.dispose();
        });
    }

    private removeSideSheetRef(state: SideSheetOutletState, sheetRef: SideSheetRef): void {
        const index = state.refs.indexOf(sheetRef);

        if (index === -1) {
            return;
        }

        state.refs.splice(index, 1);
        this.getVisibleRef(state)?.show();
    }

    private getVisibleRef(state: SideSheetOutletState | undefined): SideSheetRef | undefined {
        if (!state || state.refs.length === 0) {
            return undefined;
        }

        return state.refs[state.refs.length - 1];
    }
}
