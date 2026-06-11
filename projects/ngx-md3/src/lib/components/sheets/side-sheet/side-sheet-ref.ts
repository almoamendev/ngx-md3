import { ComponentRef, InjectionToken, Injector, Type, ViewContainerRef } from '@angular/core';
import { Observable, Subject } from 'rxjs';

export type SideSheetSide = 'start' | 'end';
export type SideSheetType = 'default' | 'standard' | 'modal';

export interface SideSheetConfig<D = unknown> {
    data?: D;
    bindDataToInputs?: boolean;
    side?: SideSheetSide;
    type?: SideSheetType;
    inset?: boolean;
    closeExisting?: boolean;
    viewContainerRef?: ViewContainerRef;
    injector?: Injector;
}

export interface SideSheetContainer {
    element: HTMLElement;
    showSheet(value: boolean): void;
    setHidden(value: boolean): void;
}

export const SIDE_SHEET_DATA = new InjectionToken<unknown>('MD3_SIDE_SHEET_DATA');
export const SIDE_SHEET_CONFIG = new InjectionToken<SideSheetConfig>('MD3_SIDE_SHEET_CONFIG');
export const SIDE_SHEET_COMPONENT = new InjectionToken<Type<unknown>>('MD3_SIDE_SHEET_COMPONENT');

const SIDE_SHEET_EXIT_ANIMATION_FALLBACK_MS = 300;

export class SideSheetRef<T = unknown, R = unknown> {
    private readonly closed = new Subject<R | undefined>();
    private isClosed = false;
    private isHidden = false;
    private sheetComponentRef?: ComponentRef<SideSheetContainer>;

    public componentInstance?: T;
    public sheetInstance?: SideSheetContainer;

    constructor(
        public readonly side: SideSheetSide,
        private readonly onClosed: () => void,
    ) {
    }

    public attachSheetComponentRef(sheetComponentRef: ComponentRef<SideSheetContainer>): void {
        this.sheetComponentRef = sheetComponentRef;
        this.sheetInstance = sheetComponentRef.instance;
    }

    public hide(): void {
        this.isHidden = true;
        this.sheetInstance?.setHidden(true);
    }

    public show(): void {
        this.isHidden = false;
        this.sheetInstance?.setHidden(false);
        this.sheetInstance?.showSheet(true);
    }

    public close(result?: R): void {
        if (this.isClosed) {
            return;
        }

        this.isClosed = true;
        this.startCloseAnimation().then(() => {
            this.destroySheet();
            this.onClosed();
            this.closed.next(result);
            this.closed.complete();
        });
    }

    public dispose(result?: R): void {
        if (this.isClosed) {
            return;
        }

        this.isClosed = true;
        this.destroySheet();
        this.onClosed();
        this.closed.next(result);
        this.closed.complete();
    }

    public afterClosed(): Observable<R | undefined> {
        return this.closed.asObservable();
    }

    private destroySheet(): void {
        this.sheetComponentRef?.destroy();
        this.sheetComponentRef = undefined;
        this.sheetInstance = undefined;
    }

    private startCloseAnimation(): Promise<void> {
        const animatedElement = this.sheetInstance?.element;

        if (this.isHidden) {
            return Promise.resolve();
        }

        this.sheetInstance?.setHidden(false);
        this.sheetInstance?.showSheet(false);

        return new Promise((resolve) => {
            if (!animatedElement) {
                resolve();
                return;
            }

            let isResolved = false;
            const timeoutId = setTimeout(done, SIDE_SHEET_EXIT_ANIMATION_FALLBACK_MS);

            function done(): void {
                if (isResolved) {
                    return;
                }

                isResolved = true;
                clearTimeout(timeoutId);
                animatedElement!.removeEventListener('transitionend', onTransitionEnd);
                resolve();
            }

            function onTransitionEnd(event: TransitionEvent): void {
                if (event.target === animatedElement) {
                    done();
                }
            }

            animatedElement.addEventListener('transitionend', onTransitionEnd);
        });
    }
}
