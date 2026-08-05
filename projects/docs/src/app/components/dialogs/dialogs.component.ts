import { Component, OnDestroy, signal } from '@angular/core';
import { Button, DialogService, Divider, IconButton, IconElement, MaterialIcon, PreviousDialog, SheetsService, SideSheetRef, TypeBody, TypeDisplay } from '@almoamendev/ngx-md3';
import { SampleDialog } from './sample-dialog/sample-dialog';
import { Playground } from '../playground/playground';
import { Shiki } from '../shiki/shiki';
import { DialogConfig } from './dialog-config/dialog-config';

@Component({
    selector: 'app-dialogs',
    imports: [
        Button,
        IconButton,
        MaterialIcon,
        IconElement,
        Playground,
        Divider,
        Shiki,
        TypeBody,
        TypeDisplay,
    ],
    templateUrl: './dialogs.component.html',
    styleUrl: './dialogs.component.scss',
})
export class DialogsComponent implements OnDestroy {
    private configSheet: SideSheetRef<DialogConfig> | undefined;
    public configOpen = signal(false);

    public showIcon = signal<boolean>(true);
    public closeEvents = signal<boolean>(true);
    public darkMode = signal<boolean>(true);
    public direction = signal<'ltr' | 'rtl'>('ltr');
    public previousDialog = signal<PreviousDialog>('close');

    public apiImport: string = `// Component imports
import {
    DialogService,
    DialogHeader, // optional
    IconElement, // optional
    MaterialIcon, // optional
    DialogBody, // optional
    DialogActions, // optional
    Button, // optional
} from '@almoamendev/ngx-md3';`;

    public apiData: string = `// using dialog service

// dialog service
private dialogService: DialogService = inject(DialogService);

// dialog reference: can injected inside dialog component
private dialogRef: DialogRef = inject(DialogRef<YourDialogComponent, YourDialogResults>);

// open dialog
const dialogRef: DialogRef = dialogService.open(YourDialogComponent, <DialogConfig>{...});

// open a dialog on top of the current one, hiding it until this one closes
dialogService.open(YourDialogComponent, { previousDialog: 'hide' });

// close dialog
dialogRef.close(youDialogResult);

// close every open dialog
dialogService.closeAll();

// after close
dialogRef.afterClosed().subscribe((result: YourDialogResults) => {
    // optional: result when closing the dialog
});`;

    public apiTypes: string = `// Types
import { DialogConfig, DialogRef } from '@almoamendev/ngx-md3';

interface DialogConfig<D = unknown> {
    /**
     * Optional data passed to the component opened inside the dialog.
     * The dynamic component can read it by injecting DIALOG_DATA.
     * @default {}
     */
    data?: D;

    /**
     * When enabled, object keys from data are also assigned to matching inputs
     * on the dynamic component through Angular's setInput API.
     * @default false
     */
    bindDataToInputs?: boolean;

    /**
     * When enabled, dialog won't close on scrim click or Escape key
     * @default false
     */
    disableCloseEvents?: boolean;

    /**
     * What happens to a dialog that is already open when this dialog opens.
     * A hidden dialog keeps its state and is shown again once this dialog closes.
     * @default close
     */
    previousDialog?: 'close' | 'hide';

    /**
     * Dialog html role attribute
     * @default dialog
     */
    role?: DialogRole;
    
    /**
     * Dialog html aria attributes
     * @default null
     */
    ariaLabel?: string;
    ariaLabelledBy?: string;
    ariaDescribedBy?: string;
    
    /**
     * Dialog scheme colors
     * @default inherit
     */
    scheme?: 'inherit' | 'dark' | 'light';
    
    /**
     * Dialog direction. when null the direction will depends on default page direction.
     * @default null
     */
    direction?: null | 'ltr' | 'rtl';

    /**
     * Optional Angular context for the dynamic component.
     * Passing a ViewContainerRef keeps dependency lookup close to the caller.
     */
    viewContainerRef?: ViewContainerRef;

    /**
     * Optional Angular injector used when creating the dialog component.
     */
    injector?: Injector;
}
    
class DialogRef<T = unknown, R = unknown> {
    /**
     * Filled by DialogService after the user component is attached.
     * This instance is the Material 3 dialog which will host the user component.
     */
    public dialogInstance?: Dialog;

    /**
     * Filled by DialogService after the user component is attached.
     * The instance here lets callers imperatively update inputs when that is useful.
     */
    public componentInstance?: T;

    /**
     * Whether the dialog started closing, and whether it is currently
     * hidden behind another dialog.
     */
    public get isClosing(): boolean;
    public get isHidden(): boolean;

    /**
     * Close the dialog with optional result.
     * Resolves once the closing animation is done
     */
    public close(result?: R): Promise<void>;

    /**
     * Hide the dialog with the closing animation while keeping it alive,
     * then bring it back with the opening animation. Handled automatically
     * when opening a dialog with previousDialog: 'hide'.
     */
    public hide(): Promise<void>;
    public show(): void;

    /**
     * Emits when the dialog starts closing, before the exit animation runs
     */
    public beforeClosed(): Observable<void>;

    /**
     * After dialog close observable. optional result will emit after dialog is closed
     */
    public afterClosed(): Observable<R | undefined>;
}

class DialogService {
    /**
     * Open dialogs, from the first one opened to the one currently on top
     */
    public get openDialogs(): readonly DialogRef[];

    public open<T, D = unknown, R = unknown>(
        component: Type<T>,
        config?: DialogConfig<D>,
    ): DialogRef<T, R>;

    /**
     * Close every open dialog, including the hidden ones.
     * Resolves once they are all closed
     */
    public closeAll(): Promise<void>;
}`;

    public apiUsage: string = `<!-- Component usage -->

<!-- optional dialog header seaction -->
<md3-dialog-header>
    <!-- optional header icon (custom icons can be used by adding md3-icon-element directive) -->
    <md3-icon md3-icon-element>chat_info</md3-icon>
    <!-- header title -->
    <span>Basic dialog title</span>
</md3-dialog-header>

<!-- optional dialog body section -->
<md3-dialog-body>...</md3-dialog-body>

<!-- optional dialog actions -->
<md3-dialog-actions>
    <button type="button" md3-button button-type="text">Action 1</button>
    <button type="button" md3-button button-type="text">Action 2</button>
</md3-dialog-actions>`;
    
    constructor(
        private sheetsService: SheetsService,
        private dialogService: DialogService
    ) {}

    public sampleDialog() {
        const ref = this.dialogService.open(SampleDialog, {
            data: {
                showIcon: this.showIcon(),
                level: 1,
            },
            bindDataToInputs: true,
            disableCloseEvents: !this.closeEvents(),
            previousDialog: this.previousDialog(),
            ariaLabel: 'Sample Dialog',
            scheme: this.darkMode() ? 'dark' : 'light',
            direction: this.direction(),
        });
    }

    public openConfig(): void {
        if (this.configOpen()) {
            this.configSheet?.close();
            return;
        }

        this.configSheet = this.sheetsService.openSideSheet(DialogConfig, {
            // data: { title: 'First sheet' },
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
    }

    private registerConfigEvents() {
        this.configSheet?.componentInstance?.showIcon.setValue(this.showIcon());
        this.configSheet?.componentInstance?.showIcon.registerOnChange(() => {
            this.showIcon.set(this.configSheet?.componentInstance?.showIcon.value);
        });

        this.configSheet?.componentInstance?.closeEvents.setValue(this.closeEvents());
        this.configSheet?.componentInstance?.closeEvents.registerOnChange(() => {
            this.closeEvents.set(this.configSheet?.componentInstance?.closeEvents.value);
        });

        this.configSheet?.componentInstance?.darkMode.setValue(this.darkMode());
        this.configSheet?.componentInstance?.darkMode.registerOnChange(() => {
            this.darkMode.set(this.configSheet?.componentInstance?.darkMode.value);
        });

        this.configSheet?.componentInstance?.direction.setValue(this.direction());
        this.configSheet?.componentInstance?.direction.registerOnChange(() => {
            this.direction.set(this.configSheet?.componentInstance?.direction.value);
        });

        this.configSheet?.componentInstance?.previousDialog.setValue(this.previousDialog());
        this.configSheet?.componentInstance?.previousDialog.registerOnChange(() => {
            this.previousDialog.set(this.configSheet?.componentInstance?.previousDialog.value);
        });
    }
}
