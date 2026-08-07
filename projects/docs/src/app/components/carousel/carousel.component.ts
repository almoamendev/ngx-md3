import { Component, computed, OnDestroy, signal } from '@angular/core';
import {
    Button,
    Carousel,
    CarouselAlignment,
    CarouselItem,
    IconButton,
    IconElement,
    MaterialIcon,
    SheetsService,
    SideSheetRef,
    TypeBody,
    TypeDisplay,
    TypeLabel,
} from '@almoamendev/ngx-md3';
import { Playground } from '../playground/playground';
import { Shiki } from '../shiki/shiki';
import { CarouselConfig } from './carousel-config/carousel-config';

interface DemoSlide {
    id: number;
    label: string;
    gradient: string;
}

const PALETTE: string[] = [
    'linear-gradient(135deg, #6750a4, #9a82db)',
    'linear-gradient(135deg, #1d6a52, #4fb99a)',
    'linear-gradient(135deg, #8c4a60, #e08fa4)',
    'linear-gradient(135deg, #38618c, #7aa5d2)',
    'linear-gradient(135deg, #8a5a2b, #d9a15c)',
    'linear-gradient(135deg, #4a4458, #8e879b)',
];

@Component({
    selector: 'app-carousel',
    imports: [
        Button,
        Carousel,
        CarouselItem,
        IconButton,
        IconElement,
        MaterialIcon,
        Playground,
        Shiki,
        TypeBody,
        TypeDisplay,
        TypeLabel,
    ],
    templateUrl: './carousel.component.html',
    styleUrl: './carousel.component.scss',
})
export class CarouselComponent implements OnDestroy {
    private configSheet: SideSheetRef<CarouselConfig> | undefined;
    public configOpen = signal(false);

    public alignment = signal<CarouselAlignment>('start');
    public itemSize = signal<number>(200);
    public gap = signal<number>(8);
    public itemCount = signal<number>(10);
    public aspectRatio = signal<string>('16/9');
    public selected = signal<number>(0);

    public readonly slides = computed<DemoSlide[]>(() => {
        return Array.from({ length: this.itemCount() }, (_, index) => ({
            id: index,
            label: `Item ${index + 1}`,
            gradient: PALETTE[index % PALETTE.length],
        }));
    });

    public readonly selectedLabel = computed<string>(() => {
        return this.slides()[this.selected()]?.label ?? '—';
    });

    public apiImport: string = `// Component imports
import {
    Carousel,
    CarouselItem,
} from '@almoamendev/ngx-md3';`;

    public apiData: string = `// Inputs
public carouselLayout = input<CarouselLayout>('multi-browse', {
    alias: 'carousel-layout',
});

public alignment = input<CarouselAlignment>('start', {
    alias: 'alignment',
});

public itemSize = input<number, unknown>(200, {
    alias: 'item-size',
    transform: numberAttribute,
});

public smallItemSizeMin = input<number, unknown>(40, {
    alias: 'small-item-size-min',
    transform: numberAttribute,
});

public smallItemSizeMax = input<number, unknown>(56, {
    alias: 'small-item-size-max',
    transform: numberAttribute,
});

public gap = input<number, unknown>(8, {
    alias: 'gap',
    transform: numberAttribute,
});

public aspectRatio = input<number | undefined, unknown>(undefined, {
    alias: 'aspect-ratio',
    transform: parseCarouselAspectRatio,
});

// Two-way model
public index = model<number>(0);

// Read-only state
public readonly lastIndex: Signal<number>;
public readonly atStart: Signal<boolean>;
public readonly atEnd: Signal<boolean>;
public readonly snap: Signal<boolean>;
public readonly resolvedHeight: Signal<number | undefined>;
public readonly arrangement: Signal<CarouselArrangement | undefined>;

// Methods
public scrollToIndex(index: number, behavior?: ScrollBehavior): void;
public next(): void;
public previous(): void;`;

    public apiTypes: string = `// Types
import {
    CarouselLayout,
    CarouselAlignment,
    CarouselOrientation,
    CarouselItemSize,
} from '@almoamendev/ngx-md3';

type CarouselLayout = 'multi-browse';
type CarouselAlignment = 'start' | 'center';
type CarouselOrientation = 'horizontal';
type CarouselItemSize = 'large' | 'medium' | 'small';`;

    public apiUsage: string = `<!-- Component usage -->

<md3-carousel [(index)]="selected" [item-size]="200" alignment="start">
    @for (photo of photos(); track photo.id) {
        <md3-carousel-item>
            <img [src]="photo.url" [alt]="photo.alt" />
        </md3-carousel-item>
    }
</md3-carousel>`;

    public apiControlled: string = `<!-- Bind buttons to atStart / atEnd, not to the item count -->

<md3-carousel #carousel [(index)]="selected" [item-size]="200">
    ...
</md3-carousel>

<button md3-button (click)="carousel.previous()" [disabled]="carousel.atStart()">
    Previous
</button>

<button md3-button (click)="carousel.next()" [disabled]="carousel.atEnd()">
    Next
</button>`;

    public apiSizeClasses: string = `/* Items carry the size band they currently render at */

md3-carousel-item {
    .caption {
        transition: opacity 150ms;
    }

    /* Hide the caption once the item is too narrow to read it */
    &.md3-small .caption,
    &.md3-medium .caption {
        opacity: 0;
    }
}`;

    public apiMask: string = `<!-- Or track the crop continuously -->

<md3-carousel [item-size]="224">
    @for (photo of photos(); track photo.id) {
        <md3-carousel-item #item>
            <img [src]="photo.url" [alt]="photo.alt" />

            <span class="caption" [style.opacity]="1 - item.maskRatio() * 3">
                {{ photo.title }}
            </span>
        </md3-carousel-item>
    }
</md3-carousel>`;

    public apiHeight: string = `<!-- Items keep their shape as the container resizes -->

<md3-carousel aspect-ratio="16 / 9">...</md3-carousel>
<md3-carousel aspect-ratio="4 / 3">...</md3-carousel>
<md3-carousel [aspect-ratio]="1">...</md3-carousel>`;

    public apiCustomProperties: string = `/* Sizing from CSS, when aspect-ratio is not set */

md3-carousel {
    --md3-carousel-height: 14em;
}

md3-carousel-item {
    --background-color: rgb(var(--md-scheme-surface-container-high));
    --border-radius: var(--md-border-radius-xlarge);
}`;

    constructor(
        private sheetsService: SheetsService,
    ) {
    }

    public openConfig(): void {
        if (this.configOpen()) {
            this.configSheet?.close();
            return;
        }

        this.configSheet = this.sheetsService.openSideSheet(CarouselConfig, {
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

    /** Rounds a solved size for display, since the solver works in fractional pixels. */
    public round(value: number): number {
        return Math.round(value);
    }

    ngOnDestroy(): void {
        this.configSheet?.close();
    }

    private registerConfigEvents(): void {
        const config = this.configSheet?.componentInstance;

        if (!config) {
            return;
        }

        config.alignment.setValue(this.alignment());
        config.alignment.registerOnChange(() => {
            this.alignment.set(config.alignment.value);
        });

        config.itemSize.setValue(this.itemSize());
        config.itemSize.registerOnChange(() => {
            this.itemSize.set(Number(config.itemSize.value));
        });

        config.gap.setValue(this.gap());
        config.gap.registerOnChange(() => {
            this.gap.set(Number(config.gap.value));
        });

        config.itemCount.setValue(this.itemCount());
        config.itemCount.registerOnChange(() => {
            this.itemCount.set(Number(config.itemCount.value));
        });

        config.aspectRatio.setValue(this.aspectRatio());
        config.aspectRatio.registerOnChange(() => {
            this.aspectRatio.set(config.aspectRatio.value);
        });
    }
}
