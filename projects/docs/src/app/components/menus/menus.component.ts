import { Component, OnDestroy, signal } from '@angular/core';
import { Button, Divider, IconButton, IconElement, MaterialIcon, MenuService, SheetsService, SideSheetRef, TypeBody } from '@vip9008/ngx-md3';
import { SmapleMenu } from './smaple-menu/smaple-menu';
import { Playground } from '../playground/playground';
import { Shiki } from '../shiki/shiki';
import { MenuConfig } from './menu-config/menu-config';

@Component({
    selector: 'app-menus',
    imports: [
        Button,
        IconButton,
        MaterialIcon,
        IconElement,
        Playground,
        Divider,
        Shiki,
        TypeBody,
    ],
    templateUrl: './menus.component.html',
    styleUrl: './menus.component.scss',
})
export class MenusComponent implements OnDestroy {
    private configSheet: SideSheetRef<MenuConfig> | undefined;
    public configOpen = signal(false);

    public showIcon = signal<boolean>(true);

    public apiImport: string = `// Component imports
import {
    MenuService,
    MenuGroup,
    MenuItem,
    IconElement, // optional
    MaterialIcon, // optional
    Badge, // optional
} from '@vip9008/ngx-md3';`;

    public apiData: string = `// using menu service

// menu service
private menuService: MenuService = inject(MenuService);

// menu reference: can injected inside menu component
private menuRef: MenuRef = inject(MenuRef<YourMenuComponent, YourMenuResults>);

// open menu
const menuRef: MenuRef = menuService.open(YourMenuComponent, <MenuConfig>{...});

// close menu
menuRef.close(youMenuResult);

// after close
menuRef.afterClosed().subscribe((result: YourMenuResults) => {
    // optional: result when closing the menu
});`;

    public apiTypes: string = `// Types
import { MenuConfig, MenuRef } from '@vip9008/ngx-md3';

interface MenuConfig<D = unknown> {
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
     * When enabled, dialog won't close on scrim click
     * @default false
     */
    disableCloseEvents?: boolean;
    
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
    
class MenuRef<T = unknown, R = unknown> {
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
     * Close the dialog with optional result
     */
    public close(result?: R): void;

    /**
     * After dialog close observable. optional result will emit after dialog is closed
     */
    public afterClosed(): Observable<R | undefined>;
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
        private menuService: MenuService
    ) {}

    public sampleMenu(
        event: MouseEvent,
        vibrant: boolean = false,
        xPosition: 'start' | 'end' | 'before' | 'after' = 'start',
        yPosition: 'above' | 'below' = 'below',
    ) {
        const ref = this.menuService.open(SmapleMenu, {
            origin: event,
            xPosition,
            yPosition,
            menuColors: vibrant ? 'vibrant' : 'standard',
        });

        ref.afterClosed().subscribe((result) => {
            console.log('Menu closed, results:: ', result);
        });
    }

    public openConfig(): void {
        if (this.configOpen()) {
            this.configSheet?.close();
            return;
        }

        this.configSheet = this.sheetsService.openSideSheet(MenuConfig, {
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
        // this.configSheet?.componentInstance?.showIcon.setValue(this.showIcon());
        // this.configSheet?.componentInstance?.showIcon.registerOnChange(() => {
        //     this.showIcon.set(this.configSheet?.componentInstance?.showIcon.value);
        // });
    }
}
