import { Component, OnDestroy, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Button, DialogService, Divider, IconButton, IconElement, MaterialIcon, PreviousDialog, SheetsService, SideSheetRef, TypeBody, TypeDisplay } from '@almoamendev/ngx-md3';
import { SampleDialog } from './sample-dialog/sample-dialog';
import { SampleFullScreenDialog } from './sample-fullscreen-dialog/sample-fullscreen-dialog';
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
        RouterLink,
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

// hide the dialog and bring it back later, with its content and state intact
dialogRef.hide();
dialogRef.show();

// hide every dialog on screen, then put them back
dialogService.hideAll();
dialogService.showAll();

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
     * hidden, on request or behind another dialog.
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
     * then bring it back with the opening animation. Also handled
     * automatically when opening a dialog with previousDialog: 'hide'.
     * Resolves once the dialog is out of sight
     */
    public hide(): Promise<void>;
    public show(): void;

    /**
     * Emits when the dialog starts closing, before the exit animation runs
     */
    public beforeClosed(): Observable<void>;

    /**
     * Emits the new value of isHidden every time the dialog is hidden or shown
     */
    public hiddenChanged(): Observable<boolean>;

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

    /**
     * Open dialogs that are currently on screen, from the bottom one up
     */
    public get visibleDialogs(): readonly DialogRef[];

    /**
     * The full screen dialog that is open, if there is one
     */
    public get fullScreenDialog(): DialogRef | undefined;

    public open<T, D = unknown, R = unknown>(
        component: Type<T>,
        config?: DialogConfig<D>,
    ): DialogRef<T, R>;

    /**
     * Open a dialog that covers the whole screen. Only one can be open
     * at a time. FullScreenDialogConfig is DialogConfig without
     * previousDialog, which does not apply to full screen dialogs
     */
    public openFullScreen<T, D = unknown, R = unknown>(
        component: Type<T>,
        config?: FullScreenDialogConfig<D>,
    ): DialogRef<T, R>;

    /**
     * Hide every dialog on screen, the full screen one included, keeping
     * them alive. Resolves once they are all out of sight
     */
    public hideAll(): Promise<void>;

    /**
     * Put the dialogs back on screen: the dialog that was on top, along
     * with the full screen dialog it sits in. Dialogs hidden behind
     * another dialog stay hidden
     */
    public showAll(): void;

    /**
     * Close every open dialog, including the hidden ones.
     * Resolves once they are all closed
     */
    public closeAll(): Promise<void>;
}`;

    public apiFullScreen: string = `// Full screen dialog

// what the content component of a full screen dialog imports
import {
    Layout,        // md3-layout, the root of the content
    ScaffoldBar,   // md3-scaffold-bar="top", for the app bar
    ScaffoldRail,  // md3-scaffold-rail="trailing", for a toolbar
    ScaffoldPane,  // md3-scaffold-pane="main", the pane that scrolls
    AppBar,
    DialogBody,
} from '@almoamendev/ngx-md3';

// opens edge to edge, replacing whatever dialog is open
const dialogRef: DialogRef = dialogService.openFullScreen(YourDialogComponent, <FullScreenDialogConfig>{...});

// side sheets opened from now on land inside the dialog
sheetsService.openSideSheet(YourSheetComponent, { side: 'end' });

// regular dialogs stack on top of it and leave it alone
dialogService.open(YourDialogComponent);

// the full screen dialog that is open, if any
const current = dialogService.fullScreenDialog;

// hides and shows like any other dialog, side sheets included
dialogRef.hide();
dialogRef.show();`;

    public apiFullScreenUsage: string = `<!-- Full screen dialog component usage -->

<!-- the content of a full screen dialog is a layout: the same regions the scaffold places -->
<md3-layout>
    <!-- the app bar of the dialog. It carries no banner role inside a dialog. -->
    <md3-app-bar md3-scaffold-bar="top" bar-type="small" bar-title="Full screen dialog">
        <!-- leading icon button, usually leaves the dialog -->
        <button type="button" md3-icon-button md3-app-bar-leading button-type="standard" (click)="close()">
            <md3-icon md3-icon-element bi-directional>arrow_back</md3-icon>
        </button>
        <!-- trailing action -->
        <button md3-app-bar-trailing type="button" md3-button button-type="text" (click)="close(true)">Save</button>
    </md3-app-bar>

    <!-- a toolbar works here too, in a bar region or in a rail region -->
    <md3-toolbar md3-scaffold-rail="trailing" toolbar-type="floating">
        <md3-toolbar-item>
            <button type="button" md3-icon-button button-type="standard">
                <md3-icon md3-icon-element>format_bold</md3-icon>
            </button>
        </md3-toolbar-item>
    </md3-toolbar>

    <!-- takes the rest of the dialog and scrolls under the app bar -->
    <div md3-scaffold-pane="main">
        <md3-dialog-body>...</md3-dialog-body>
    </div>
</md3-layout>`;

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

    public fullScreenDialog(): void {
        this.dialogService.openFullScreen(SampleFullScreenDialog, {
            data: {
                showIcon: this.showIcon(),
            },
            bindDataToInputs: true,
            disableCloseEvents: !this.closeEvents(),
            ariaLabel: 'Sample full screen dialog',
            scheme: this.darkMode() ? 'dark' : 'light',
            direction: this.direction(),
        });
    }

    /** Brings back whatever the "Hide" action inside the dialogs sent away. */
    public showHiddenDialogs(): void {
        this.dialogService.showAll();
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
