import { Component, OnDestroy, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Button, Divider, IconButton, IconElement, MaterialIcon, MenuService, SheetsService, SideSheetRef, TypeBody, TypeDisplay } from '@vip9008/ngx-md3';
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
        TypeDisplay,
        RouterLink,
    ],
    templateUrl: './menus.component.html',
    styleUrl: './menus.component.scss',
})
export class MenusComponent implements OnDestroy {
    private configSheet: SideSheetRef<MenuConfig> | undefined;
    public configOpen = signal(false);

    public vibrant = signal<boolean>(false);
    public overlapTrigger = signal<boolean>(false);
    public xPosition = signal<'start' | 'end' | 'before' | 'after'>('start');
    public yPosition = signal<'above' | 'below'>('below');
    public darkMode = signal<boolean>(true);
    public direction = signal<'ltr' | 'rtl'>('ltr');

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

// open menu anchored to a click event, element or point
const menuRef: MenuRef = menuService.open(YourMenuComponent, <MenuConfig>{
    origin: event,
    xPosition: 'start',
    yPosition: 'below',
});

// open a sub menu anchored beside its parent item
const subMenuRef: MenuRef = menuService.openSubMenu(YourMenuComponent, <MenuConfig>{
    origin: event,
});

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
     * Optional data passed to the component opened inside the menu.
     * The dynamic component can read it by injecting MENU_DATA.
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
     * Menu surface color scheme.
     * @default standard
     */
    menuColors?: 'standard' | 'vibrant';

    /**
     * Element or point the menu should open from. If omitted, the service uses
     * the currently focused element, which usually is the trigger button.
     */
    origin?: MenuPositionOrigin;

    /**
     * Horizontal alignment against the origin.
     * start/end align edges, before/after place the menu beside the origin (used for sub menus).
     * @default start
     */
    xPosition?: 'start' | 'end' | 'before' | 'after' | 'center';

    /**
     * Vertical alignment against the origin.
     * @default below
     */
    yPosition?: 'above' | 'below' | 'center';

    /**
     * Keep the menu on top of the trigger instead of opening outside it.
     * @default false
     */
    overlapTrigger?: boolean;

    /**
     * Additional pixel offsets from the resolved connected position.
     * @default 0 / 4
     */
    offsetX?: number;
    offsetY?: number;

    /**
     * Distance in pixels the menu should keep from the viewport edge.
     * Values below 0.5em are raised to 0.5em.
     */
    viewportMargin?: number;

    /**
     * Custom CDK connected positions. When provided, these replace the default
     * Material-style fallback positions.
     */
    positions?: ConnectedPosition[];

    /**
     * How the menu reacts when the page scrolls.
     * @default reposition
     */
    scrollStrategy?: 'reposition' | 'block' | 'close' | 'noop';
    
    /**
     * Menu scheme colors
     * @default inherit
     */
    scheme?: 'inherit' | 'dark' | 'light';
    
    /**
     * Menu direction. when null the direction will depends on default page direction.
     * @default null
     */
    direction?: null | 'ltr' | 'rtl';

    /**
     * Optional Angular context for the dynamic component.
     * Passing a ViewContainerRef keeps dependency lookup close to the caller.
     */
    viewContainerRef?: ViewContainerRef;

    /**
     * Optional Angular injector used when creating the menu component.
     */
    injector?: Injector;
}

class MenuRef<T = unknown, R = unknown> {
    /**
     * Filled by MenuService after the user component is attached.
     * This instance is the Material 3 menu which will host the user component.
     */
    public menuInstance?: Menu;

    /**
     * Filled by MenuService after the user component is attached.
     * The instance here lets callers imperatively update inputs when that is useful.
     */
    public componentInstance?: T;

    /**
     * Close the menu with optional result
     */
    public close(result?: R): void;

    /**
     * After menu close observable. optional result will emit after menu is closed
     */
    public afterClosed(): Observable<R | undefined>;
}`;

    public apiUsage: string = `<!-- Component usage -->

<md3-menu-group>
    <button md3-menu-item label="Item 1"></button>
    <button md3-menu-item label="Item 2"></button>
</md3-menu-group>

<!-- leading/trailing icons, badge and a sub menu trigger -->
<md3-menu-group>
    <button md3-menu-item (click)="openSubMenu($event)" label="Rename">
        <md3-icon md3-icon-element="leading">edit</md3-icon>
        <md3-badge>New</md3-badge>
        <md3-icon md3-icon-element="trailing">arrow_right</md3-icon>
    </button>
    <button md3-menu-item label="Copy" trailing-text="⌘+C">
        <md3-icon md3-icon-element="leading">content_copy</md3-icon>
    </button>
    <button md3-menu-item disabled label="Delete (disabled)">
        <md3-icon md3-icon-element="leading">delete</md3-icon>
    </button>
</md3-menu-group>

<!-- selectable items (checkbox affordance) -->
<md3-menu-group>
    <button md3-menu-item [selected]="true" label="Show ruler"></button>
    <button md3-menu-item [selected]="false" label="Show minimap"></button>
</md3-menu-group>`;

    constructor(
        private sheetsService: SheetsService,
        private menuService: MenuService
    ) {}

    public sampleMenu(event: MouseEvent) {
        const ref = this.menuService.open(SmapleMenu, {
            origin: event,
            xPosition: this.xPosition(),
            yPosition: this.yPosition(),
            overlapTrigger: this.overlapTrigger(),
            menuColors: this.vibrant() ? 'vibrant' : 'standard',
            scheme: this.darkMode() ? 'dark' : 'light',
            direction: this.direction(),
        });

        // ref.afterClosed().subscribe((result) => {
        //     console.log('Menu closed, results:: ', result);
        // });
    }

    public openConfig(): void {
        if (this.configOpen()) {
            this.configSheet?.close();
            return;
        }

        this.configSheet = this.sheetsService.openSideSheet(MenuConfig, {
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
        this.configSheet?.componentInstance?.vibrant.setValue(this.vibrant());
        this.configSheet?.componentInstance?.vibrant.registerOnChange(() => {
            this.vibrant.set(this.configSheet?.componentInstance?.vibrant.value);
        });

        this.configSheet?.componentInstance?.overlapTrigger.setValue(this.overlapTrigger());
        this.configSheet?.componentInstance?.overlapTrigger.registerOnChange(() => {
            this.overlapTrigger.set(this.configSheet?.componentInstance?.overlapTrigger.value);
        });

        this.configSheet?.componentInstance?.xPosition.setValue(this.xPosition());
        this.configSheet?.componentInstance?.xPosition.registerOnChange(() => {
            this.xPosition.set(this.configSheet?.componentInstance?.xPosition.value);
        });

        this.configSheet?.componentInstance?.yPosition.setValue(this.yPosition());
        this.configSheet?.componentInstance?.yPosition.registerOnChange(() => {
            this.yPosition.set(this.configSheet?.componentInstance?.yPosition.value);
        });

        this.configSheet?.componentInstance?.darkMode.setValue(this.darkMode());
        this.configSheet?.componentInstance?.darkMode.registerOnChange(() => {
            this.darkMode.set(this.configSheet?.componentInstance?.darkMode.value);
        });

        this.configSheet?.componentInstance?.direction.setValue(this.direction());
        this.configSheet?.componentInstance?.direction.registerOnChange(() => {
            this.direction.set(this.configSheet?.componentInstance?.direction.value);
        });
    }
}
