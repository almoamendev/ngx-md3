/**
 * Catalog of every CSS custom property shipped in the library's token files.
 *
 * Only names and descriptions live here — the documented *values* are read
 * live from the running page (see TokenValuesService), so these tables can
 * never drift out of sync with the SCSS.
 */

export interface TokenEntry {
    /** Full custom property name, including the leading double dash. */
    name: string;
    /** What the token is for. */
    description: string;
    /**
     * Material tonal palette step this value comes from in the light scheme,
     * e.g. "P-40". Dark scheme uses a different step for most roles.
     */
    tone?: string;
}

export interface TokenSection {
    label: string;
    entries: TokenEntry[];
}

/** md-scheme.scss — color roles. */
export const COLOR_TOKENS: TokenSection[] = [
    {
        label: 'Primary',
        entries: [
            { name: '--md-scheme-primary', tone: 'P-40', description: 'Highest-emphasis color. Used for key components such as filled buttons and active states.' },
            { name: '--md-scheme-on-primary', tone: 'P-100', description: 'Text and icons drawn on top of primary.' },
            { name: '--md-scheme-primary-container', tone: 'P-90', description: 'Standout fill that is less prominent than primary itself.' },
            { name: '--md-scheme-on-primary-container', tone: 'P-30', description: 'Text and icons drawn on top of primary-container.' },
        ],
    },
    {
        label: 'Secondary',
        entries: [
            { name: '--md-scheme-secondary', tone: 'S-40', description: 'Less prominent accent, for components that support the primary action.' },
            { name: '--md-scheme-on-secondary', tone: 'S-100', description: 'Text and icons drawn on top of secondary.' },
            { name: '--md-scheme-secondary-container', tone: 'S-90', description: 'Container fill for secondary emphasis, such as the navigation active indicator.' },
            { name: '--md-scheme-on-secondary-container', tone: 'S-30', description: 'Text and icons drawn on top of secondary-container.' },
        ],
    },
    {
        label: 'Tertiary',
        entries: [
            { name: '--md-scheme-tertiary', tone: 'T-40', description: 'Contrasting accent used to balance primary and secondary, or to draw attention.' },
            { name: '--md-scheme-on-tertiary', tone: 'T-100', description: 'Text and icons drawn on top of tertiary.' },
            { name: '--md-scheme-tertiary-container', tone: 'T-90', description: 'Container fill for tertiary emphasis.' },
            { name: '--md-scheme-on-tertiary-container', tone: 'T-30', description: 'Text and icons drawn on top of tertiary-container.' },
        ],
    },
    {
        label: 'Fixed',
        entries: [
            { name: '--md-scheme-primary-fixed', tone: 'P-90', description: 'Primary container that keeps the same value in both schemes.' },
            { name: '--md-scheme-primary-fixed-dim', tone: 'P-80', description: 'Slightly dimmer variant of primary-fixed, for stronger emphasis.' },
            { name: '--md-scheme-on-primary-fixed', tone: 'P-20', description: 'Highest-emphasis text and icons on the fixed primary colors.' },
            { name: '--md-scheme-on-primary-fixed-variant', tone: 'P-40', description: 'Lower-emphasis text and icons on the fixed primary colors.' },
            { name: '--md-scheme-secondary-fixed', tone: 'S-90', description: 'Secondary container that keeps the same value in both schemes.' },
            { name: '--md-scheme-secondary-fixed-dim', tone: 'S-80', description: 'Slightly dimmer variant of secondary-fixed.' },
            { name: '--md-scheme-on-secondary-fixed', tone: 'S-20', description: 'Highest-emphasis text and icons on the fixed secondary colors.' },
            { name: '--md-scheme-on-secondary-fixed-variant', tone: 'S-40', description: 'Lower-emphasis text and icons on the fixed secondary colors.' },
            { name: '--md-scheme-tertiary-fixed', tone: 'T-90', description: 'Tertiary container that keeps the same value in both schemes.' },
            { name: '--md-scheme-tertiary-fixed-dim', tone: 'T-80', description: 'Slightly dimmer variant of tertiary-fixed.' },
            { name: '--md-scheme-on-tertiary-fixed', tone: 'T-20', description: 'Highest-emphasis text and icons on the fixed tertiary colors.' },
            { name: '--md-scheme-on-tertiary-fixed-variant', tone: 'T-40', description: 'Lower-emphasis text and icons on the fixed tertiary colors.' },
        ],
    },
    {
        label: 'Error',
        entries: [
            { name: '--md-scheme-error', tone: 'E-40', description: 'Indicates errors, such as an invalid text field or a badge count.' },
            { name: '--md-scheme-on-error', tone: 'E-100', description: 'Text and icons drawn on top of error.' },
            { name: '--md-scheme-error-container', tone: 'E-90', description: 'Lower-emphasis error fill.' },
            { name: '--md-scheme-on-error-container', tone: 'E-30', description: 'Text and icons drawn on top of error-container.' },
        ],
    },
    {
        label: 'Surface',
        entries: [
            { name: '--md-scheme-surface-dim', tone: 'N-87', description: 'Dimmest surface in the light scheme.' },
            { name: '--md-scheme-surface', tone: 'N-98', description: 'Default background for the page and most components.' },
            { name: '--md-scheme-surface-bright', tone: 'N-98', description: 'Brightest surface in the light scheme.' },
            { name: '--md-scheme-surface-container-lowest', tone: 'N-100', description: 'Lowest-emphasis container surface. Furthest back in the elevation order.' },
            { name: '--md-scheme-surface-container-low', tone: 'N-96', description: 'Container surface one step above lowest.' },
            { name: '--md-scheme-surface-container', tone: 'N-94', description: 'Default container surface, used by cards, sheets and menus.' },
            { name: '--md-scheme-surface-container-high', tone: 'N-92', description: 'Container surface one step above the default.' },
            { name: '--md-scheme-surface-container-highest', tone: 'N-90', description: 'Highest container surface. Used for filled text fields.' },
        ],
    },
    {
        label: 'On surface and outline',
        entries: [
            { name: '--md-scheme-on-surface', tone: 'N-10', description: 'Default text and icon color on any surface.' },
            { name: '--md-scheme-on-surface-variant', tone: 'NV-30', description: 'Lower-emphasis text and icons, such as supporting text and inactive icons.' },
            { name: '--md-scheme-outline', tone: 'NV-50', description: 'Borders that need to meet contrast requirements, such as outlined text fields.' },
            { name: '--md-scheme-outline-variant', tone: 'NV-80', description: 'Decorative borders and dividers where contrast is not required.' },
        ],
    },
    {
        label: 'Inverse',
        entries: [
            { name: '--md-scheme-inverse-surface', tone: 'N-20', description: 'Surface that contrasts with the current scheme, used by snackbars.' },
            { name: '--md-scheme-inverse-on-surface', tone: 'N-95', description: 'Text and icons drawn on top of inverse-surface.' },
            { name: '--md-scheme-inverse-primary', tone: 'P-80', description: 'Primary-equivalent accent for use on inverse-surface.' },
        ],
    },
    {
        label: 'Other',
        entries: [
            { name: '--md-scheme-scrim', description: 'Scrim behind modal surfaces such as dialogs and modal sheets. Always applied at partial opacity.' },
            { name: '--md-scheme-shadow', description: 'Base color the elevation shadows are built from.' },
        ],
    },
];

/** md-elevation.scss — shadows. */
export const ELEVATION_TOKENS: TokenSection[] = [
    {
        label: 'Shadows',
        entries: [
            { name: '--md-shadow-0dp', description: 'Resting level. A zero-size shadow rather than none, so transitions to a raised level animate smoothly.' },
            { name: '--md-shadow-1dp', description: 'Level 1. Elevated cards and the app bar once content scrolls under it.' },
            { name: '--md-shadow-3dp', description: 'Level 2. FABs at rest, and raised buttons.' },
            { name: '--md-shadow-6dp', description: 'Level 3. Menus, and FABs while pressed.' },
            { name: '--md-shadow-8dp', description: 'Level 4. Navigation drawers and side sheets.' },
            { name: '--md-shadow-12dp', description: 'Level 5. The highest surfaces, such as modal dialogs.' },
        ],
    },
];

/** md-border-radius.scss — shape. */
export const SHAPE_TOKENS: TokenSection[] = [
    {
        label: 'Corner radius',
        entries: [
            { name: '--md-border-radius-none', description: 'Square corners.' },
            { name: '--md-border-radius-xsmall', description: '4dp. Small chips and compact surfaces.' },
            { name: '--md-border-radius-small', description: '8dp.' },
            { name: '--md-border-radius-medium', description: '12dp. Cards and menus.' },
            { name: '--md-border-radius-large', description: '16dp. Sheets and larger containers.' },
            { name: '--md-border-radius-large-i', description: '20dp. Increased large, between large and extra large.' },
            { name: '--md-border-radius-xlarge', description: '28dp. Dialogs and extended FABs.' },
            { name: '--md-border-radius-xlarge-i', description: '32dp. Increased extra large.' },
            { name: '--md-border-radius-xxlarge', description: '48dp. The largest fixed radius.' },
            { name: '--md-border-radius-rounded', description: 'Fully rounded. Large enough that any element resolves to a pill or circle.' },
        ],
    },
];

/** md-motion.scss — duration and easing. */
export const MOTION_TOKENS: TokenSection[] = [
    {
        label: 'Expressive — spatial',
        entries: [
            { name: '--md-motion-expressive-fast-spatial-duration', description: 'Duration for small, quick movements.' },
            { name: '--md-motion-expressive-fast-spatial-easing', description: 'Easing for small, quick movements. Overshoots slightly.' },
            { name: '--md-motion-expressive-default-spatial-duration', description: 'Default duration for movement and size changes.' },
            { name: '--md-motion-expressive-default-spatial-easing', description: 'Default easing for movement and size changes.' },
            { name: '--md-motion-expressive-slow-spatial-duration', description: 'Duration for large or full-screen movements.' },
            { name: '--md-motion-expressive-slow-spatial-easing', description: 'Easing for large or full-screen movements.' },
        ],
    },
    {
        label: 'Expressive — effects',
        entries: [
            { name: '--md-motion-expressive-fast-effects-duration', description: 'Duration for quick opacity and color changes.' },
            { name: '--md-motion-expressive-fast-effects-easing', description: 'Easing for quick opacity and color changes.' },
            { name: '--md-motion-expressive-default-effects-duration', description: 'Default duration for opacity and color changes.' },
            { name: '--md-motion-expressive-default-effects-easing', description: 'Default easing for opacity and color changes.' },
            { name: '--md-motion-expressive-slow-effects-duration', description: 'Duration for slower opacity and color changes.' },
            { name: '--md-motion-expressive-slow-effects-easing', description: 'Easing for slower opacity and color changes.' },
        ],
    },
    {
        label: 'Standard — spatial',
        entries: [
            { name: '--md-motion-standard-fast-spatial-duration', description: 'Duration for small, quick movements.' },
            { name: '--md-motion-standard-fast-spatial-easing', description: 'Easing for small, quick movements. No overshoot.' },
            { name: '--md-motion-standard-default-spatial-duration', description: 'Default duration for movement and size changes.' },
            { name: '--md-motion-standard-default-spatial-easing', description: 'Default easing for movement and size changes.' },
            { name: '--md-motion-standard-slow-spatial-duration', description: 'Duration for large or full-screen movements.' },
            { name: '--md-motion-standard-slow-spatial-easing', description: 'Easing for large or full-screen movements.' },
        ],
    },
    {
        label: 'Standard — effects',
        entries: [
            { name: '--md-motion-standard-fast-effects-duration', description: 'Duration for quick opacity and color changes.' },
            { name: '--md-motion-standard-fast-effects-easing', description: 'Easing for quick opacity and color changes.' },
            { name: '--md-motion-standard-default-effects-duration', description: 'Default duration for opacity and color changes.' },
            { name: '--md-motion-standard-default-effects-easing', description: 'Default easing for opacity and color changes.' },
            { name: '--md-motion-standard-slow-effects-duration', description: 'Duration for slower opacity and color changes.' },
            { name: '--md-motion-standard-slow-effects-easing', description: 'Easing for slower opacity and color changes.' },
        ],
    },
];

/** md-grid.scss — responsive layout grid. */
export const GRID_TOKENS: TokenSection[] = [
    {
        label: 'Layout grid',
        entries: [
            { name: '--md-grid-columns', description: 'Number of columns in the responsive grid. 4 on compact, 8 on medium and expanded, 12 on large and extra-large.' },
            { name: '--md-grid-margin', description: 'Outer padding on the grid container. 16dp on compact, 24dp above it.' },
            { name: '--md-grid-gutter', description: 'Gap between columns. 16dp on compact, 24dp above it.' },
        ],
    },
];

/** Total number of tokens documented across every file. */
export function countTokens(sections: TokenSection[]): number {
    return sections.reduce((total, section) => total + section.entries.length, 0);
}
