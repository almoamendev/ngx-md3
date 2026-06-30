import { Component, effect, OnDestroy, signal } from '@angular/core';
import { IconButton, IconElement, InputElement, MaterialIcon, SheetsService, SideSheetRef, Slider, SliderSize, TypeBody } from '@vip9008/ngx-md3';
import { Playground } from '../playground/playground';
import { Shiki } from '../shiki/shiki';
import { SliderConfig } from './slider-config/slider-config';

@Component({
    selector: 'app-sliders',
    imports: [
        Slider,
        InputElement,
        MaterialIcon,
        IconElement,
        IconButton,
        Playground,
        Shiki,
        TypeBody,
    ],
    templateUrl: './sliders.component.html',
    styleUrl: './sliders.component.scss',
})
export class SlidersComponent implements OnDestroy {
    private configSheet: SideSheetRef<SliderConfig> | undefined;
    public configOpen = signal(false);

    public showIcon = signal<boolean>(false);
    public sliderSize = signal<SliderSize>('x-small');
    public showValueLabel = signal<boolean>(false);
    public disable = signal<boolean>(false);

    public apiImport: string = `// Component imports
import {
    Slider,
    InputElement,
    MaterialIcon, // optional
    IconElement, // optional
} from '@vip9008/ngx-md3';`;

    public apiData: string = `// Inputs
public control = input<AbstractControl | undefined>(undefined, {
    alias: 'control',
});
public sliderSize = input<SliderSize>('x-small', {
    alias: 'slider-size',
});
public showValueLabel = input<boolean>(false, {
    alias: 'show-value-label'
});`;

    public apiTypes: string = `// Types
import { SliderSize } from '@vip9008/ngx-md3';

type SliderSize = 'x-small' | 'small' | 'medium' | 'large' | 'x-large';`;

    public apiUsage: string = `<!-- Component usage -->

<!-- regular slider input -->
<md3-slider [show-value-label]="true" slider-size="x-small">
    <input type="range" min="0" max="100" step="1" md3-input-element>
</md3-slider>

<!-- adding material icons -->
<md3-slider [show-value-label]="true" slider-size="medium">
    <!-- only visible when slider size is medium or larger -->
    <md3-icon md3-icon-element>volume_up</md3-icon>
    <input type="range" min="0" max="100" step="1" md3-input-element>
</md3-slider>

<!-- adding custom icon -->
<md3-slider [show-value-label]="true" slider-size="medium">
    <!-- only visible when slider size is medium or larger -->
    <your-custom-icon-element md3-icon-element></your-custom-icon-element>
    <input type="range" min="0" max="100" step="1" md3-input-element>
</md3-slider>

<!-- checkbox input using form control -->
<md3-slider [show-value-label]="true" slider-size="x-small" [control]="sliderControl">
    <input type="range" min="0" max="100" step="1" md3-input-element>
</md3-slider>

<!-- checkbox input using form control name directive -->
<md3-slider [show-value-label]="true" slider-size="x-small">
    <input type="range" min="0" max="100" step="1" md3-input-element formControlName="sliderControlName">
</md3-slider>`;
    
    constructor(
        private sheetsService: SheetsService,
    ) {
		effect(() => {
			const size = this.sliderSize();
			if (size == 'x-small' || size == 'small') {
        		this.configSheet?.componentInstance?.showIcon.setValue(false);
        		this.configSheet?.componentInstance?.showIcon.disable();
			} else {
        		this.configSheet?.componentInstance?.showIcon.enable();
            }
		});
    }

    public openConfig(): void {
        if (this.configOpen()) {
            this.configSheet?.close();
            return;
        }

        this.configSheet = this.sheetsService.openSideSheet(SliderConfig, {
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
        this.configSheet?.componentInstance?.sliderSize.setValue(this.sliderSize());
        this.configSheet?.componentInstance?.sliderSize.registerOnChange(() => {
            this.sliderSize.set(this.configSheet?.componentInstance?.sliderSize.value);
        });

        this.configSheet?.componentInstance?.showValueLabel.setValue(this.showValueLabel());
        this.configSheet?.componentInstance?.showValueLabel.registerOnChange(() => {
            this.showValueLabel.set(this.configSheet?.componentInstance?.showValueLabel.value);
        });

        this.configSheet?.componentInstance?.showIcon.setValue(this.showIcon());
        this.configSheet?.componentInstance?.showIcon.registerOnChange(() => {
            this.showIcon.set(this.configSheet?.componentInstance?.showIcon.value);
        });

        this.configSheet?.componentInstance?.disable.setValue(this.disable());
        this.configSheet?.componentInstance?.disable.registerOnChange(() => {
            this.disable.set(this.configSheet?.componentInstance?.disable.value);
        });
    }
}
