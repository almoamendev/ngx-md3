/**
 * Single source of truth for the documented component list.
 *
 * Both the components side sheet menu and the /components index page render
 * from this catalog, so a new component only needs to be added here (plus its
 * route in app.routes.ts, which needs a real component reference).
 */

export interface ComponentEntry {
    /** Display name. */
    label: string;
    /** Router link to the component's documentation page. */
    link: string;
    /** Group the entry belongs to. Entries with no group are listed on their own. */
    group?: ComponentGroup;
    /** One-line summary shown on the index page cards. */
    description: string;
    /** Material symbol name shown beside the entry. */
    icon: string;
    /** Material symbol name shown beside the entry. */
    image?: string;
}

export type ComponentGroup =
    | 'Navigation'
    | 'Buttons'
    | 'Selection controls'
    | 'Sheets'
    | 'Loading & progress';

/** Group render order. Ungrouped entries are rendered last. */
export const COMPONENT_GROUPS: ComponentGroup[] = [
    'Navigation',
    'Buttons',
    'Selection controls',
    'Sheets',
    'Loading & progress',
];

export const COMPONENTS: ComponentEntry[] = [
    {
        label: 'App bar',
        link: '/components/app-bar',
        description: 'Top bar for titles, navigation, and page-level actions.',
        icon: 'web_asset',
        image: 'md3-app-bar.png',
    },

    {
        label: 'Navigation bar',
        link: '/components/navigations/navigation-bar',
        group: 'Navigation',
        description: 'Switch between top-level views on compact screens.',
        icon: 'navigation',
        image: 'md3-nav-bar.png',
    },
    {
        label: 'Navigation rail',
        link: '/components/navigations/navigation-rail',
        group: 'Navigation',
        description: 'Collapsible side navigation for medium and larger screens.',
        icon: 'view_sidebar',
        image: 'md3-nav-rail.png',
    },
    {
        label: 'Navigation item',
        link: '/components/navigations/navigation-item',
        group: 'Navigation',
        description: 'The individual destination projected into a bar or rail.',
        icon: 'chevron_right',
        image: 'md3-nav-rail.png',
    },

    {
        label: 'Buttons',
        link: '/components/buttons/buttons',
        group: 'Buttons',
        description: 'Filled, tonal, outlined, elevated, and text buttons.',
        icon: 'smart_button',
        image: 'md3-button.png',
    },
    {
        label: 'Icon buttons',
        link: '/components/buttons/icon-buttons',
        group: 'Buttons',
        description: 'Compact, icon-only actions with optional toggle behavior.',
        icon: 'touch_app',
        image: 'md3-icon-button.png',
    },
    {
        label: 'FABs',
        link: '/components/buttons/floating-action-buttons',
        group: 'Buttons',
        description: 'Floating action buttons for the primary action on a screen.',
        icon: 'add_circle',
        image: 'md3-fab.png',
    },
    {
        label: 'Split buttons',
        link: '/components/buttons/split-buttons',
        group: 'Buttons',
        description: 'A main action paired with a menu of related actions.',
        icon: 'call_split',
        image: 'md3-split-button.png',
    },
    {
        label: 'Button groups',
        link: '/components/buttons/button-groups',
        group: 'Buttons',
        description: 'Related buttons grouped into a single connected control.',
        icon: 'view_week',
        image: 'md3-button-group.png',
    },

    {
        label: 'Checkboxes',
        link: '/components/selection-controls/checkboxes',
        group: 'Selection controls',
        description: 'Select one or more options, with indeterminate support.',
        icon: 'check_box',
        image: 'md3-checkbox.png',
    },
    {
        label: 'Switches',
        link: '/components/selection-controls/switches',
        group: 'Selection controls',
        description: 'Toggle a single setting on or off.',
        icon: 'toggle_on',
        image: 'md3-switch.png',
    },
    {
        label: 'Radio buttons',
        link: '/components/selection-controls/radio-buttons',
        group: 'Selection controls',
        description: 'Select exactly one option from a set.',
        icon: 'radio_button_checked',
        image: 'md3-radio-button.png',
    },

    {
        label: 'Side sheets',
        link: '/components/sheets/side-sheets',
        group: 'Sheets',
        description: 'Panels anchored to the start or end of the layout for supporting content.',
        icon: 'right_panel_open',
        image: 'md3-side-sheet.png',
    },
    {
        label: 'Bottom sheets',
        link: '/components/sheets/bottom-sheets',
        group: 'Sheets',
        description: 'Panels that slide up from the bottom of the viewport, over the page or docked into it.',
        icon: 'vertical_align_bottom',
        image: 'md3-bottom-sheet.png',
    },

    {
        label: 'Loading indicators',
        link: '/components/loading-and-progress/loading-indicators',
        group: 'Loading & progress',
        description: 'Show that work is happening without a known duration.',
        icon: 'sync',
        image: 'md3-loading-indicator.png',
    },
    {
        label: 'Progress indicators',
        link: '/components/loading-and-progress/progress-indicators',
        group: 'Loading & progress',
        description: 'Linear and circular indicators for measurable progress.',
        icon: 'progress_activity',
        image: 'md3-progress-indicator.png',
    },

    {
        label: 'Badges',
        link: '/components/badges',
        description: 'Notification dots, counts, and short labels on other elements.',
        icon: 'notifications_active',
        image: 'md3-nav-bar.png',
    },
    {
        label: 'Cards',
        link: '/components/cards',
        description: 'Elevated, filled, and outlined containers for related content.',
        icon: 'dashboard',
        image: 'md3-card.png',
    },
    {
        label: 'Carousel',
        link: '/components/carousel',
        description: 'Scrollable collections of visual items that resize as they move.',
        icon: 'view_carousel',
        image: 'md3-carousel.png',
    },
    {
        label: 'Chips',
        link: '/components/chips',
        description: 'Assist, filter, input, and suggestion chips.',
        icon: 'label',
        image: 'md3-chips.png',
    },
    {
        label: 'Dialogs',
        link: '/components/dialogs',
        description: 'Modal surfaces for decisions and focused sub-tasks.',
        icon: 'chat_bubble',
        image: 'md3-dialog.png',
    },
    {
        label: 'Lists',
        link: '/components/lists',
        description: 'Vertical sets of related items with leading and trailing content.',
        icon: 'list',
        image: 'md3-list.png',
    },
    {
        label: 'Menus',
        link: '/components/menus',
        description: 'Anchored menus and sub menus opened through the menu service.',
        icon: 'menu_open',
        image: 'md3-menu.png',
    },
    {
        label: 'Sliders',
        link: '/components/sliders',
        description: 'Select a value or range from a continuous or stepped scale.',
        icon: 'tune',
        image: 'md3-slider.png',
    },
    {
        label: 'Snackbars',
        link: '/components/snackbars',
        description: 'Brief, transient status messages with an optional action.',
        icon: 'notifications',
        image: 'md3-snackbar.png',
    },
    {
        label: 'Text fields',
        link: '/components/text-fields',
        description: 'Filled and outlined inputs with icons, counters, and validation.',
        icon: 'text_fields',
        image: 'md3-text-field.png',
    },
];

/** Entries belonging to the given group, in catalog order. */
export function componentsInGroup(group: ComponentGroup): ComponentEntry[] {
    return COMPONENTS.filter((entry) => entry.group == group);
}

/** Entries that don't belong to any group, in catalog order. */
export function ungroupedComponents(): ComponentEntry[] {
    return COMPONENTS.filter((entry) => !entry.group);
}
