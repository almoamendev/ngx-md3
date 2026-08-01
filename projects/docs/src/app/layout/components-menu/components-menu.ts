import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IconButton, SideSheetHeader, IconElement, MaterialIcon, SideSheetRef, NavigationGroup, NavigationItem, Divider, SideSheetBody, Badge } from '@almoamendev/ngx-md3';
import { COMPONENT_GROUPS, ComponentEntry, COMPONENTS, componentsInGroup, ungroupedComponents } from '../../components/components.catalog';

interface MenuSection {
    /** Rendered as the nav group label. Undefined renders an unlabeled group. */
    label?: string;
    entries: ComponentEntry[];
}

@Component({
    selector: 'app-components-menu',
    imports: [
        SideSheetHeader,
        SideSheetBody,
        IconButton,
        IconElement,
        MaterialIcon,
        RouterLink,
        NavigationGroup,
        NavigationItem,
        Badge,
        Divider,
    ],
    templateUrl: './components-menu.html',
    styleUrl: './components-menu.scss',
})
export class ComponentsMenu {
    public readonly sections: MenuSection[] = [
        ...COMPONENT_GROUPS.map((group) => ({
            label: group as string | undefined,
            entries: componentsInGroup(group),
        })),
        {
            label: undefined,
            entries: ungroupedComponents(),
        },
    ].filter((section) => section.entries.length > 0);

    public readonly componentsCount: number = COMPONENTS.length;

    constructor(
        private sideSheetRef: SideSheetRef<ComponentsMenu>
    ) {
    }

    public close(): void {
        this.sideSheetRef.close();
    }
}
