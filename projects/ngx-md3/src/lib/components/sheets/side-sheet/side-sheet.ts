import { CdkPortalOutlet, ComponentPortal } from '@angular/cdk/portal';
import { AfterContentInit, Component, ComponentRef, computed, effect, ElementRef, inject, Injector, signal, Type, ViewChild } from '@angular/core';
import { SIDE_SHEET_CONFIG, SideSheetRef } from './side-sheet-ref';
import { SideSheetConfig, SideSheetSide, SideSheetType } from '../../../interfaces/side-sheet-config.interface';
import { LayoutService } from '../../../foundations/layout.service';

@Component({
    selector: 'md3-side-sheet',
    imports: [
        CdkPortalOutlet,
    ],
    templateUrl: './side-sheet.html',
    styleUrl: './side-sheet.scss',
    host: {
        '[class.md3-active]': 'isActive()',
        '[class.md3-hidden]': 'isHidden()',
        '[class.md3-start]': 'side() === "start"',
        '[class.md3-end]': 'side() === "end"',
        '[class.md3-inset]': 'isInset()',
        '[class.md3-show-divider]': 'showDivider()',
    },
})
export class SideSheet implements AfterContentInit {
    @ViewChild(CdkPortalOutlet, { static: true })
    private readonly portalOutlet!: CdkPortalOutlet;

    protected readonly config = inject<SideSheetConfig>(SIDE_SHEET_CONFIG, { optional: true }) ?? {};
    private readonly sideSheetRef = inject<SideSheetRef>(SideSheetRef, { optional: true });

    public readonly isActive = signal<boolean>(false);
    public readonly isHidden = signal<boolean>(false);
    public readonly side = signal<SideSheetSide>(this.config.side ?? 'end');
    public readonly sheetType = signal<SideSheetType>(this.config.type ?? 'default');
    public readonly isInset = signal<boolean>(this.config.inset ?? false);
    public readonly showDivider = signal<boolean>(this.config.divider ?? false);
    private readonly resolvedSheetType = computed<SideSheetType>(() => {
        if (this.layoutService.isMedium() || this.layoutService.isCompact()) {
            return 'modal';
        }
        
        return this.sheetType();
    });

    constructor(
        private layoutService: LayoutService,
        private el: ElementRef<HTMLElement>
    ) {
        effect((onCleanUp) => {
            const type = 'md3-style-' + this.resolvedSheetType();
            this.element.classList.add(type);

            onCleanUp(() => {
                this.element.classList.remove(type);
            });
        });
    }

    public get element(): HTMLElement {
        return this.el.nativeElement;
    }

    ngAfterContentInit(): void {
        requestAnimationFrame(() => {
            this.showSheet(true);
        });
    }

    public showSheet(value: boolean): void {
        this.isActive.set(value);
    }

    public setHidden(value: boolean): void {
        this.isHidden.set(value);
    }

    public close(): void {
        this.sideSheetRef?.close();
    }

    public attachContent<T>(component: Type<T>, injector: Injector): ComponentRef<T> {
        const portal = new ComponentPortal(component, this.config.viewContainerRef ?? null, injector);

        return this.portalOutlet.attachComponentPortal(portal);
    }
}
