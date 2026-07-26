import { Component, OnDestroy, TemplateRef, signal, viewChild } from '@angular/core';
import { Button, Divider, IconButton, IconElement, LinearProgressIndicator, MaterialIcon, SheetsService, SideSheetRef, SnackbarRef, SnackbarService, TypeBody } from '@vip9008/ngx-md3';
import { Playground } from '../playground/playground';
import { Shiki } from '../shiki/shiki';
import { SnackbarConfig } from './snackbar-config/snackbar-config';

@Component({
    selector: 'app-snackbars',
    imports: [
        Button,
        IconButton,
        MaterialIcon,
        IconElement,
        LinearProgressIndicator,
        Playground,
        Divider,
        Shiki,
        TypeBody,
    ],
    templateUrl: './snackbars.component.html',
    styleUrl: './snackbars.component.scss',
})
export class SnackbarsComponent implements OnDestroy {
    private configSheet: SideSheetRef<SnackbarConfig> | undefined;
    public configOpen = signal(false);

    public showCloseIcon = signal<boolean>(false);
    public replaceCurrent = signal<boolean>(false);
    public duration = signal<number>(4000);
    public politeness = signal<'polite' | 'assertive'>('polite');
    public direction = signal<'ltr' | 'rtl'>('ltr');

    private progressTemplate = viewChild<TemplateRef<unknown>>('progressTpl');
    public progressPercent = signal<number>(0);
    private progressTimer?: ReturnType<typeof setInterval>;
    private progressRef?: SnackbarRef;

    public apiImport: string = `// Component imports
import {
    SnackbarService,
} from '@vip9008/ngx-md3';`;

    public apiData: string = `// using snackbar service

// snackbar service
private snackbarService: SnackbarService = inject(SnackbarService);

// open a plain message. only one snackbar is ever visible — additional
// calls made while one is showing wait in a FIFO queue.
const ref: SnackbarRef = snackbarService.open('Conversation archived', 'Undo', <SnackbarConfig>{
    duration: 4000,
});

// react to the action button
ref.onAction().subscribe(() => {
    // e.g. undo the archive
});

// after dismissed (by timeout, action, or manual close), with the reason
ref.afterDismissed().subscribe(({ reason, result }) => {
    // reason: 'timeout' | 'action' | 'manual'
});

// dismiss whatever is currently showing / clear everything queued
snackbarService.dismiss();
snackbarService.dismissAll();`;

    public apiTypes: string = `// Types
import { SnackbarConfig, SnackbarRef } from '@vip9008/ngx-md3';

interface SnackbarConfig<D = unknown> {
    /**
     * Context object made available to the message when it is a TemplateRef,
     * via NgTemplateOutlet's context. Ignored for plain string messages.
     * @default undefined
     */
    data?: D;

    /**
     * Shows a close icon instead of a text action. A snackbar can have an
     * action OR a close icon, never both — Material Design 3 doesn't support
     * that combination, so passing an actionLabel to open() together with
     * showCloseIcon: true throws.
     * @default false
     */
    showCloseIcon?: boolean;

    /**
     * Auto-dismiss delay in milliseconds. Pass 0 to disable auto-dismiss —
     * useful for a progress/status snackbar that closes itself once its
     * TemplateRef-driven content is done.
     * @default 4000
     */
    duration?: number;

    /**
     * aria-live politeness and implicit role: 'polite' -> role="status",
     * 'assertive' -> role="alert".
     * @default polite
     */
    politeness?: 'polite' | 'assertive';

    /**
     * Immediately dismisses whatever is currently showing and moves this one
     * to the front of the queue instead of waiting its turn.
     * @default false
     */
    replaceCurrent?: boolean;

    ariaLabel?: string;

    /**
     * Snackbar direction. when null the direction will depend on the page direction.
     * @default null
     */
    direction?: null | 'ltr' | 'rtl';

    /**
     * Optional Angular context for the message TemplateRef.
     */
    viewContainerRef?: ViewContainerRef;
    injector?: Injector;
}

class SnackbarRef<R = unknown> {
    /**
     * Filled by SnackbarService once the snackbar is dequeued and attached.
     * This is the Material 3 snackbar shell hosting the message/action/icon.
     */
    public snackbarInstance?: Snackbar;

    /** Pauses/resumes the auto-dismiss timer (the shell already does this on hover/focus). */
    public pauseTimer(): void;
    public resumeTimer(): void;

    /** Close the snackbar with an optional reason and result. */
    public close(reason?: 'timeout' | 'action' | 'manual', result?: R): void;

    /** Emits when the action button is clicked, right before close(). */
    public onAction(): Observable<void>;

    /** Emits once, after the snackbar finishes closing. */
    public afterDismissed(): Observable<{ reason: 'timeout' | 'action' | 'manual'; result?: R }>;
}`;

    public apiUsage: string = `<!-- Message as a TemplateRef, e.g. for a live progress snackbar. -->
<!-- Declared in your own component, so it can read your own signals/state -->
<!-- directly — no custom-component API needed, the surface/action/icon are -->
<!-- always owned by the snackbar shell. -->

<ng-template #uploadStatus let-percent="percent">
    Uploading… {{ percent }}%
    <md3-linear-progress-indicator [progress]="percent"></md3-linear-progress-indicator>
</ng-template>`;

    constructor(
        private sheetsService: SheetsService,
        private snackbarService: SnackbarService,
    ) {}

    public showBasicSnackbar(): void {
        this.snackbarService.open('This is a snackbar message', undefined, {
            showCloseIcon: this.showCloseIcon(),
            replaceCurrent: this.replaceCurrent(),
            duration: this.duration(),
            politeness: this.politeness(),
            direction: this.direction(),
        });
    }

    public showActionSnackbar(): void {
        const ref = this.snackbarService.open('Conversation archived', 'Undo', {
            replaceCurrent: this.replaceCurrent(),
            duration: this.duration(),
            politeness: this.politeness(),
            direction: this.direction(),
        });

        ref.onAction().subscribe(() => {
            // handle undo here
        });
    }

    public showProgressSnackbar(): void {
        const template = this.progressTemplate();

        if (!template) {
            return;
        }

        this.clearProgressTimer();
        this.progressPercent.set(0);

        this.progressRef = this.snackbarService.open(template, undefined, {
            replaceCurrent: this.replaceCurrent(),
            direction: this.direction(),
            duration: 0,
        });

        this.progressTimer = setInterval(() => {
            this.progressPercent.update((value) => Math.min(100, value + 10));

            if (this.progressPercent() >= 100) {
                this.clearProgressTimer();
                this.progressRef?.close();
            }
        }, 300);

        this.progressRef.afterDismissed().subscribe(() => this.clearProgressTimer());
    }

    public dismissAll(): void {
        this.snackbarService.dismissAll();
    }

    public openConfig(): void {
        if (this.configOpen()) {
            this.configSheet?.close();
            return;
        }

        this.configSheet = this.sheetsService.openSideSheet(SnackbarConfig, {
            side: 'end',
            type: 'default',
            inset: true,
            closeExisting: true,
            bindDataToInputs: true,
        });
        this.configOpen.set(true);

        this.registerConfigEvents();

        this.configSheet.afterClosed().subscribe((_) => {
            this.configSheet = undefined;
            this.configOpen.set(false);
        });
    }

    ngOnDestroy(): void {
        this.configSheet?.close();
        this.clearProgressTimer();
    }

    private clearProgressTimer(): void {
        if (this.progressTimer) {
            clearInterval(this.progressTimer);
            this.progressTimer = undefined;
        }
    }

    private registerConfigEvents() {
        this.configSheet?.componentInstance?.showCloseIcon.setValue(this.showCloseIcon());
        this.configSheet?.componentInstance?.showCloseIcon.registerOnChange(() => {
            this.showCloseIcon.set(this.configSheet?.componentInstance?.showCloseIcon.value);
        });

        this.configSheet?.componentInstance?.replaceCurrent.setValue(this.replaceCurrent());
        this.configSheet?.componentInstance?.replaceCurrent.registerOnChange(() => {
            this.replaceCurrent.set(this.configSheet?.componentInstance?.replaceCurrent.value);
        });

        this.configSheet?.componentInstance?.duration.setValue(String(this.duration()));
        this.configSheet?.componentInstance?.duration.registerOnChange(() => {
            this.duration.set(Number(this.configSheet?.componentInstance?.duration.value));
        });

        this.configSheet?.componentInstance?.politeness.setValue(this.politeness());
        this.configSheet?.componentInstance?.politeness.registerOnChange(() => {
            this.politeness.set(this.configSheet?.componentInstance?.politeness.value);
        });

        this.configSheet?.componentInstance?.direction.setValue(this.direction());
        this.configSheet?.componentInstance?.direction.registerOnChange(() => {
            this.direction.set(this.configSheet?.componentInstance?.direction.value);
        });
    }
}
