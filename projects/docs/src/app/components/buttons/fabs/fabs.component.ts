import { Component, effect, OnDestroy, signal } from '@angular/core';
import { FabSize, FabType, FloatingActionButton, IconButton, IconElement, MaterialIcon, SheetsService, SideSheetRef, TypeBody, TypeDisplay } from "@almoamendev/ngx-md3";
import { Playground } from '../../playground/playground';
import { Shiki } from '../../shiki/shiki';
import { FabsConfig } from './fabs-config/fabs-config';

@Component({
	selector: 'app-fabs',
	imports: [
		FloatingActionButton,
        IconButton,
        MaterialIcon,
        IconElement,
        Playground,
        Shiki,
        TypeBody,
        TypeDisplay,
	],
	templateUrl: './fabs.component.html',
	styleUrl: './fabs.component.scss',
})
export class FabsComponent implements OnDestroy {
    private configSheet: SideSheetRef<FabsConfig> | undefined;
    public configOpen = signal(false);

    public showIcon = signal<boolean>(true);
    public buttonSize = signal<FabSize>('small');
    public buttonType = signal<FabType>('tonal-primary');
    public isExtended = signal<boolean>(false);

    public apiImport: string = `// Component imports
import {
    FloatingActionButton,
    IconElement, // optional
    MaterialIcon, // optional
} from '@almoamendev/ngx-md3';`;

    public apiData: string = `// Inputs
public buttonSize = input<FabSize>('small', {
	alias: 'button-size',
});
public buttonType = input<FabType>('tonal-primary', {
	alias: 'button-type',
});
public isExtended = input<boolean, unknown>(false, {
	alias: 'extended',
	transform: booleanAttribute,
});`;

    public apiTypes: string = `// Types
import { FabSize, FabType } from '@almoamendev/ngx-md3';

type FabSize = 'small' | 'medium' | 'large';
type FabType = 'tonal-primary' | 'tonal-secondary' | 'tonal-tertiary' | 'primary' | 'secondary' | 'tertiary';`;

    public apiUsage: string = `<!-- Component usage -->

<!-- md3-fab can be used on <button> or <a> -->
<button md3-fab>
    ...
</button>
<a href="" md3-fab>
    ...
</a>

<!-- using material icons -->
<button md3-fab button-size="small" button-type="tonal-primary" [extended]="false">
    <md3-icon md3-icon-element>edit</md3-icon>
</button>

<!-- using custom icon -->
<button md3-fab button-size="small" button-type="tonal-primary" [extended]="false">
    <your-custom-icon-element md3-icon-element></your-custom-icon-element>
</button>

<!-- extended Fab -->
<button md3-fab button-size="small" button-type="tonal-primary" extended>
	<md3-icon md3-icon-element>edit</md3-icon>
	Compose
</button>`;
    
    constructor(
        private sheetsService: SheetsService,
    ) {
		effect(() => {
			const showIcon = this.showIcon();
			if (!showIcon) {
        		this.configSheet?.componentInstance?.isExtended.setValue(true);
			}
		});

		effect (() => {
			const isExtended = this.isExtended();
			if (!isExtended) {
        		this.configSheet?.componentInstance?.showIcon.setValue(true);
			}
		});
    }

    public openConfig(): void {
        if (this.configOpen()) {
            this.configSheet?.close();
            return;
        }

        this.configSheet = this.sheetsService.openSideSheet(FabsConfig, {
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
        this.configSheet?.componentInstance?.showIcon.setValue(this.showIcon());
        this.configSheet?.componentInstance?.showIcon.registerOnChange(() => {
            this.showIcon.set(this.configSheet?.componentInstance?.showIcon.value);
        });

        this.configSheet?.componentInstance?.buttonSize.setValue(this.buttonSize());
        this.configSheet?.componentInstance?.buttonSize.registerOnChange(() => {
            this.buttonSize.set(this.configSheet?.componentInstance?.buttonSize.value);
        });

        this.configSheet?.componentInstance?.buttonType.setValue(this.buttonType());
        this.configSheet?.componentInstance?.buttonType.registerOnChange(() => {
            this.buttonType.set(this.configSheet?.componentInstance?.buttonType.value);
        });

        this.configSheet?.componentInstance?.isExtended.setValue(this.isExtended());
        this.configSheet?.componentInstance?.isExtended.registerOnChange(() => {
            this.isExtended.set(this.configSheet?.componentInstance?.isExtended.value);
        });
    }
}
