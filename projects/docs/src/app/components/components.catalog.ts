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
}

export type ComponentGroup =
    | 'Navigation'
    | 'Buttons'
    | 'Selection controls'
    | 'Loading & progress';

/** Group render order. Ungrouped entries are rendered last. */
export const COMPONENT_GROUPS: ComponentGroup[] = [
    'Navigation',
    'Buttons',
    'Selection controls',
    'Loading & progress',
];

export const COMPONENTS: ComponentEntry[] = [
    {
        label: 'App bar',
        link: '/components/app-bar',
        description: 'Top bar for titles, navigation, and page-level actions.',
        icon: 'web_asset',
    },

    {
        label: 'Navigation bar',
        link: '/components/navigations/navigation-bar',
        group: 'Navigation',
        description: 'Switch between top-level views on compact screens.',
        icon: 'navigation',
    },
    {
        label: 'Navigation rail',
        link: '/components/navigations/navigation-rail',
        group: 'Navigation',
        description: 'Collapsible side navigation for medium and larger screens.',
        icon: 'view_sidebar',
    },
    {
        label: 'Navigation item',
        link: '/components/navigations/navigation-item',
        group: 'Navigation',
        description: 'The individual destination projected into a bar or rail.',
        icon: 'chevron_right',
    },

    {
        label: 'Buttons',
        link: '/components/buttons/buttons',
        group: 'Buttons',
        description: 'Filled, tonal, outlined, elevated, and text buttons.',
        icon: 'smart_button',
    },
    {
        label: 'Icon buttons',
        link: '/components/buttons/icon-buttons',
        group: 'Buttons',
        description: 'Compact, icon-only actions with optional toggle behavior.',
        icon: 'touch_app',
    },
    {
        label: 'FABs',
        link: '/components/buttons/floating-action-buttons',
        group: 'Buttons',
        description: 'Floating action buttons for the primary action on a screen.',
        icon: 'add_circle',
    },
    {
        label: 'Split buttons',
        link: '/components/buttons/split-buttons',
        group: 'Buttons',
        description: 'A main action paired with a menu of related actions.',
        icon: 'call_split',
    },
    {
        label: 'Button groups',
        link: '/components/buttons/button-groups',
        group: 'Buttons',
        description: 'Related buttons grouped into a single connected control.',
        icon: 'view_week',
    },

    {
        label: 'Checkboxes',
        link: '/components/selection-controls/checkboxes',
        group: 'Selection controls',
        description: 'Select one or more options, with indeterminate support.',
        icon: 'check_box',
    },
    {
        label: 'Switches',
        link: '/components/selection-controls/switches',
        group: 'Selection controls',
        description: 'Toggle a single setting on or off.',
        icon: 'toggle_on',
    },
    {
        label: 'Radio buttons',
        link: '/components/selection-controls/radio-buttons',
        group: 'Selection controls',
        description: 'Select exactly one option from a set.',
        icon: 'radio_button_checked',
    },

    {
        label: 'Loading indicators',
        link: '/components/loading-and-progress/loading-indicators',
        group: 'Loading & progress',
        description: 'Show that work is happening without a known duration.',
        icon: 'sync',
    },
    {
        label: 'Progress indicators',
        link: '/components/loading-and-progress/progress-indicators',
        group: 'Loading & progress',
        description: 'Linear and circular indicators for measurable progress.',
        icon: 'progress_activity',
    },

    {
        label: 'Badges',
        link: '/components/badges',
        description: 'Notification dots, counts, and short labels on other elements.',
        icon: 'notifications_active',
    },
    {
        label: 'Cards',
        link: '/components/cards',
        description: 'Elevated, filled, and outlined containers for related content.',
        icon: 'dashboard',
    },
    {
        label: 'Chips',
        link: '/components/chips',
        description: 'Assist, filter, input, and suggestion chips.',
        icon: 'label',
    },
    {
        label: 'Dialogs',
        link: '/components/dialogs',
        description: 'Modal surfaces for decisions and focused sub-tasks.',
        icon: 'chat_bubble',
    },
    {
        label: 'Lists',
        link: '/components/lists',
        description: 'Vertical sets of related items with leading and trailing content.',
        icon: 'list',
    },
    {
        label: 'Menus',
        link: '/components/menus',
        description: 'Anchored menus and sub menus opened through the menu service.',
        icon: 'menu_open',
    },
    {
        label: 'Sliders',
        link: '/components/sliders',
        description: 'Select a value or range from a continuous or stepped scale.',
        icon: 'tune',
    },
    {
        label: 'Snackbars',
        link: '/components/snackbars',
        description: 'Brief, transient status messages with an optional action.',
        icon: 'notifications',
    },
    {
        label: 'Text fields',
        link: '/components/text-fields',
        description: 'Filled and outlined inputs with icons, counters, and validation.',
        icon: 'text_fields',
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
