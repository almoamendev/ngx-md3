import { Component, computed, OnDestroy, signal } from '@angular/core';
import { IconButton, IconElement, MaterialIcon, SheetsService, SideSheetRef, TextSize, TextColor, TypeBody, TypeDisplay, TypeHeadline, TypeLabel, TypeTitle } from '@vip9008/ngx-md3';
import { Playground } from '../../components/playground/playground';
import { Shiki } from '../../components/shiki/shiki';
import { TypographyConfig } from './typography-config/typography-config';

type TypeScale = 'display' | 'headline' | 'title' | 'body' | 'label';

@Component({
    selector: 'app-typography',
    imports: [
        TypeDisplay,
        TypeHeadline,
        TypeTitle,
        TypeBody,
        TypeLabel,
        IconButton,
        IconElement,
        MaterialIcon,
        Playground,
        Shiki,
    ],
    templateUrl: './typography.component.html',
    styleUrl: './typography.component.scss',
})
export class TypographyComponent implements OnDestroy {
    private configSheet: SideSheetRef<TypographyConfig> | undefined;
    public configOpen = signal(false);

    public scale = signal<TypeScale>('display');
    public size = signal<TextSize>('large');
    public emphasized = signal<boolean>(false);
    public color = signal<TextColor | 'default'>('default');

    public previewBackground = computed<string | null>(() => {
        switch (this.color()) {
            case 'on-primary':
                return 'rgb(var(--md-scheme-primary))';
            case 'on-secondary':
                return 'rgb(var(--md-scheme-secondary))';
            case 'on-tertiary':
                return 'rgb(var(--md-scheme-tertiary))';
            case 'on-error':
                return 'rgb(var(--md-scheme-error))';
            default:
                return null;
        }
    });

    public previewCode = computed<string>(() => {
        let code = `<md3-type-${this.scale()} size="${this.size()}"`;
        if (this.emphasized()) {
            code += ` emphasized`;
        }
        if (this.color() !== 'default') {
            code += ` color="${this.color()}"`;
        }
        code += `>...</md3-type-${this.scale()}>`;
        return code;
    });

    public apiImport: string = `// Directive imports
import {
    TypeDisplay,
    TypeHeadline,
    TypeTitle,
    TypeBody,
    TypeLabel,
} from '@vip9008/ngx-md3';`;

    public apiData: string = `// Shared shape across all 5 directives; only the selector and base class differ
public size = input<TextSize | 'default'>('default');
public color = input<TextColor | 'default'>('default');
public emphasized = input(false, {
    transform: booleanAttribute,
});

// size and emphasized toggle a CSS class on the host element:
// size 'large'    -> adds .md3-text-large
// emphasized true -> adds .md3-emphasized
// size 'default'  -> adds .md3-text-default, which matches no CSS rule,
//                    so the element falls back to the base style`;

    public apiTypes: string = `// Types
import { TextSize, TextColor } from '@vip9008/ngx-md3';

type TextSize = 'large' | 'medium' | 'small';

type TextColor = 'on-primary' | 'on-primary-container'
    | 'on-secondary' | 'on-secondary-container'
    | 'on-tertiary' | 'on-tertiary-container'
    | 'on-primary-fixed' | 'on-primary-fixed-variant'
    | 'on-secondary-fixed' | 'on-secondary-fixed-variant'
    | 'on-tertiary-fixed' | 'on-tertiary-fixed-variant'
    | 'on-error' | 'on-error-container'
    | 'on-surface' | 'on-surface-variant'
    | 'inverse-on-surface';`;

    public apiUsage: string = `<!-- Directive usage -->

<md3-type-display>Display</md3-type-display>
<md3-type-body>Body</md3-type-body>
<md3-type-title>Title</md3-type-title>
<md3-type-label>Label</md3-type-label>
<md3-type-headline>Headline</md3-type-headline>

<!-- on a heading -->
<h1 md3-type-display size="large">Display large</h1>

<!-- on any other element -->
<div md3-type-body size="medium">Body medium</div>

<!-- emphasized: a higher font-weight variant -->
<div md3-type-title size="medium" emphasized>Title medium (emphasized)</div>

<!-- colored text -->
<div md3-type-label size="large" color="on-primary">Label large</div>

<!-- combined -->
<div md3-type-headline size="small" emphasized color="on-error">Headline small</div>

<!-- all three are real inputs, so bindings work too -->
<div md3-type-body [size]="bodySize()" [emphasized]="isEmphasized()" [color]="bodyColor()">
    Reactive body text
</div>`;

    constructor(
        private sheetsService: SheetsService,
    ) {
    }

    public openConfig(): void {
        if (this.configOpen()) {
            this.configSheet?.close();
            return;
        }

        this.configSheet = this.sheetsService.openSideSheet(TypographyConfig, {
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
        this.configSheet?.componentInstance?.scale.setValue(this.scale());
        this.configSheet?.componentInstance?.scale.registerOnChange(() => {
            this.scale.set(this.configSheet?.componentInstance?.scale.value);
        });

        this.configSheet?.componentInstance?.size.setValue(this.size());
        this.configSheet?.componentInstance?.size.registerOnChange(() => {
            this.size.set(this.configSheet?.componentInstance?.size.value);
        });

        this.configSheet?.componentInstance?.emphasized.setValue(this.emphasized());
        this.configSheet?.componentInstance?.emphasized.registerOnChange(() => {
            this.emphasized.set(this.configSheet?.componentInstance?.emphasized.value);
        });

        this.configSheet?.componentInstance?.color.setValue(this.color());
        this.configSheet?.componentInstance?.color.registerOnChange(() => {
            this.color.set(this.configSheet?.componentInstance?.color.value);
        });
    }
}
