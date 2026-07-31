import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Button, Card, IconElement, MaterialIcon, TypeBody, TypeDisplay, TypeLabel, TypeTitle } from '@vip9008/ngx-md3';
import { Shiki } from '../components/shiki/shiki';

interface HomeFeature {
    icon: string;
    title: string;
    description: string;
}

interface HomeCategory {
    icon: string;
    label: string;
    description: string;
    link: string;
}

@Component({
    selector: 'app-home',
    imports: [
        RouterLink,
        Button,
        Card,
        MaterialIcon,
        IconElement,
        TypeDisplay,
        TypeTitle,
        TypeBody,
        TypeLabel,
        Shiki,
    ],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss',
})
export class HomeComponent {
    public readonly features: HomeFeature[] = [
        {
            icon: 'palette',
            title: 'Material Design 3',
            description: 'Color, shape, elevation, and motion tokens taken straight from the MD3 spec — not a reskin of Material 2.',
        },
        {
            icon: 'bolt',
            title: 'Signals-first',
            description: 'Standalone components built on Angular Signals, with model() for real two-way bindings where they matter.',
        },
        {
            icon: 'accessibility_new',
            title: 'Accessible by default',
            description: 'Correct ARIA roles, states, and keyboard behavior are built into every component, not bolted on afterward.',
        },
        {
            icon: 'checklist',
            title: 'Plays well with forms',
            description: 'Every input-like component works with Angular Reactive Forms out of the box — FormControl in, FormControl out.',
        },
        {
            icon: 'tune',
            title: 'Fully themeable',
            description: 'Swap the entire palette by overriding CSS custom properties — no rebuild and no SCSS pipeline required.',
        },
        {
            icon: 'inventory_2',
            title: 'Tree-shakeable',
            description: 'Every component is a standalone import — pull in a button without dragging along the rest of the library.',
        },
    ];

    public readonly categories: HomeCategory[] = [
        {
            icon: 'rocket_launch',
            label: 'Getting started',
            description: 'Install, wire up md3.scss, and theme with tokens',
            link: '/foundations/getting-started',
        },
        {
            icon: 'view_quilt',
            label: 'Scaffold',
            description: 'The layout foundation: bars, rails, and panes',
            link: '/foundations/scaffold',
        },
        {
            icon: 'format_size',
            label: 'Typography',
            description: 'Display, headline, title, body, and label scales',
            link: '/styles/typography',
        },
        {
            icon: 'smart_button',
            label: 'Buttons',
            description: 'Filled, tonal, outlined, elevated, and text',
            link: '/components/buttons/buttons',
        },
        {
            icon: 'text_fields',
            label: 'Text fields',
            description: 'Filled and outlined text inputs',
            link: '/components/text-fields',
        },
        {
            icon: 'navigation',
            label: 'Navigation bar',
            description: 'Switch between views on compact screens',
            link: '/components/navigations/navigation-bar',
        },
        {
            icon: 'notifications',
            label: 'Snackbars',
            description: 'Brief, transient status messages',
            link: '/components/snackbars',
        },
    ];

    public installCode: string = `npm install @vip9008/ngx-md3`;

    public quickStartCode: string = `import { Component } from '@angular/core';
import { Button } from '@vip9008/ngx-md3';

@Component({
    selector: 'app-example',
    imports: [Button],
    template: \`
        <button md3-button button-type="filled">
            Get started
        </button>
    \`,
})
export class ExampleComponent {}`;
}
