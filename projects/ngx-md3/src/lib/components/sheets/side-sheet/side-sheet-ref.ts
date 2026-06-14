import { ComponentRef, InjectionToken, Type } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { SideSheetConfig, SideSheetContainer, SideSheetSide, SideSheetType } from '../../../interfaces/side-sheet-config.interface';
import { SideSheet } from './side-sheet';

export const SIDE_SHEET_DATA = new InjectionToken<unknown>('MD3_SIDE_SHEET_DATA');
export const SIDE_SHEET_CONFIG = new InjectionToken<SideSheetConfig>('MD3_SIDE_SHEET_CONFIG');
export const SIDE_SHEET_COMPONENT = new InjectionToken<Type<unknown>>('MD3_SIDE_SHEET_COMPONENT');

const SIDE_SHEET_EXIT_ANIMATION_FALLBACK_MS = 300;

export class SideSheetRef<T = unknown, R = unknown> {
    private readonly closed = new Subject<R | undefined>();
    private isClosed = false;
    private isHidden = false;
    private sheetComponentRef?: ComponentRef<SideSheet>;

    public componentInstance?: T;
    public sheetInstance?: SideSheetContainer;

    constructor(
        public readonly side: SideSheetSide,
        private readonly onClosed: () => void,
    ) {
    }

    public attachSheetComponentRef(sheetComponentRef: ComponentRef<SideSheet>): void {
        this.sheetComponentRef = sheetComponentRef;
        this.sheetInstance = sheetComponentRef.instance as SideSheetContainer;
    }

    public setSide(side: SideSheetSide): void {
        this.sheetComponentRef?.instance?.side.set(side);
    }

    public setSheetType(type: SideSheetType): void {
        this.sheetComponentRef?.instance?.sheetType.set(type);
    }

    public setInset(isInset: boolean): void {
        this.sheetComponentRef?.instance?.isInset.set(isInset);
    }

    public setDivider(showDivider: boolean): void {
        this.sheetComponentRef?.instance?.showDivider.set(showDivider);
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
