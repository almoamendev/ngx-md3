import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Injectable, Injector, TemplateRef, inject } from '@angular/core';
import { SnackbarConfig, SnackbarPoliteness } from '../../interfaces/snackbar-config.interface';
import { Snackbar } from './snackbar';
import { SNACKBAR_ACTION_LABEL, SNACKBAR_CONFIG, SNACKBAR_MESSAGE, SnackbarRef } from './snackbar-ref';

const DEFAULT_DURATION_MS = 4000;

interface ResolvedSnackbarConfig extends SnackbarConfig {
    showCloseIcon: boolean;
    stackedAction: boolean;
    duration: number;
    politeness: SnackbarPoliteness;
    replaceCurrent: boolean;
    ariaLabel: string;
    scheme: 'inherit' | 'dark' | 'light';
    direction: null | 'ltr' | 'rtl';
    position: 'start' | 'center' | 'end';
    injector: Injector;
}

// Internally every queued snackbar is tracked as SnackbarRef<unknown> — the
// caller-facing generic <R> only matters for the ref that open() hands back,
// so it's applied once at that single return point instead of threaded
// through the queue/active bookkeeping.
interface QueuedSnackbar {
    message: string | TemplateRef<unknown>;
    actionLabel: string | undefined;
    config: ResolvedSnackbarConfig;
    ref: SnackbarRef;
}

@Injectable({
    providedIn: 'root',
})
export class SnackbarService {
    private readonly overlay = inject(Overlay);
    private readonly injector = inject(Injector);

    private readonly queue: QueuedSnackbar[] = [];
    private active?: QueuedSnackbar;

    /**
     * Opens a snackbar. Only one is ever visible at a time — if another is
     * already showing, this one waits in a FIFO queue unless
     * config.replaceCurrent is set.
     *
     * message can be a plain string, or a TemplateRef for cases like a
     * progress indicator that needs to keep re-rendering as the caller's own
     * state changes. The surrounding surface, action button, close icon,
     * positioning, and animation are always owned by the Snackbar shell —
     * there's no arbitrary custom-component API, since that's how you end up
     * with something that isn't a snackbar anymore per MD3.
     *
     * config.onAction, if provided, is called when the action button (never
     * the close icon) is clicked — an alternative to ref.onAction().subscribe()
     * for callers that don't want to hold onto the returned ref.
     */
    public open<D = unknown, R = unknown>(
        message: string | TemplateRef<D>,
        actionLabel?: string,
        config: SnackbarConfig<D> = {},
    ): SnackbarRef<R> {
        const snackbarConfig = this.mergeConfig(config);

        if (snackbarConfig.showCloseIcon && actionLabel) {
            throw new Error(
                'Snackbar cannot have both an action and a close icon — Material Design 3 snackbars support only one.',
            );
        }

        const ref = new SnackbarRef(snackbarConfig.duration);
        const queued: QueuedSnackbar = {
            message,
            actionLabel,
            config: snackbarConfig,
            ref,
        };

        ref.afterDismissed().subscribe(() => this.onDismissed(queued));

        if (snackbarConfig.onAction) {
            // Only ever fires for the action button — SnackbarRef.actionTriggered
            // is exclusively raised from the action button's click handler, never
            // from the close icon, which just closes without emitting.
            ref.onAction().subscribe(() => snackbarConfig.onAction!());
        }

        if (snackbarConfig.replaceCurrent && this.active) {
            this.queue.unshift(queued);
            this.active.ref.close('manual');
        } else if (this.active) {
            this.queue.push(queued);
        } else {
            this.show(queued);
        }

        return ref as SnackbarRef<R>;
    }

    /** Dismisses whichever snackbar is currently showing, if any. */
    public dismiss<R = unknown>(result?: R): void {
        this.active?.ref.close('manual', result);
    }

    /** Dismisses the visible snackbar and clears everything still queued. */
    public dismissAll(): void {
        const stillQueued = this.queue.splice(0, this.queue.length);
        stillQueued.forEach((item) => item.ref.close('manual'));
        this.active?.ref.close('manual');
    }

    private show(queued: QueuedSnackbar): void {
        this.active = queued;

        const overlayRef = this.createOverlay(queued.config);
        queued.ref.attachOverlay(overlayRef);

        const injector = this.createInjector(queued);
        const portal = new ComponentPortal(Snackbar, queued.config.viewContainerRef ?? null, injector);
        const componentRef = overlayRef.attach(portal);

        queued.ref.snackbarInstance = componentRef.instance;
    }

    private onDismissed(queued: QueuedSnackbar): void {
        if (this.active === queued) {
            this.active = undefined;
        } else {
            const index = this.queue.indexOf(queued);

            if (index !== -1) {
                this.queue.splice(index, 1);
            }

            return;
        }

        const next = this.queue.shift();

        if (next) {
            this.show(next);
        }
    }

    private mergeConfig(config: SnackbarConfig): ResolvedSnackbarConfig {
        return {
            data: config.data,
            showCloseIcon: config.showCloseIcon ?? false,
            stackedAction: config.stackedAction ?? false,
            onAction: config.onAction,
            duration: config.duration ?? DEFAULT_DURATION_MS,
            politeness: config.politeness ?? 'polite',
            replaceCurrent: config.replaceCurrent ?? false,
            ariaLabel: config.ariaLabel ?? '',
            scheme: config.scheme ?? 'inherit',
            direction: config.direction ?? null,
            position: config.position ?? 'start',
            viewContainerRef: config.viewContainerRef,
            injector: config.injector ?? this.injector,
        };
    }

    private createOverlay(config: ResolvedSnackbarConfig): OverlayRef {
        let panelClass = ['md3-snackbar-panel', 'md3-position-' + config.position];
        if (config.direction !== null) {
            panelClass.push('md3-direction-' + config.direction);
        }

        const overlayConfig = new OverlayConfig({
            hasBackdrop: false,
            panelClass: panelClass,
            positionStrategy: this.overlay.position().global(),
            scrollStrategy: this.overlay.scrollStrategies.noop(),
        });

        return this.overlay.create(overlayConfig);
    }

    private createInjector(queued: QueuedSnackbar): Injector {
        return Injector.create({
            parent: queued.config.injector,
            providers: [
                { provide: SnackbarRef, useValue: queued.ref },
                { provide: SNACKBAR_MESSAGE, useValue: queued.message },
                { provide: SNACKBAR_ACTION_LABEL, useValue: queued.actionLabel },
                { provide: SNACKBAR_CONFIG, useValue: queued.config },
            ],
        });
    }
}
