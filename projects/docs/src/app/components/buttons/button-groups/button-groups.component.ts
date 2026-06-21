import { Component, OnDestroy, signal } from '@angular/core';
import { Button, ButtonGroupModule, ButtonGroupSelection, ButtonGroupType, ButtonSize, SheetsService, SideSheetRef } from '@vip9008/ngx-md3';
import { ButtonGroupConfig } from './button-group-config/button-group-config';
import { Playground } from '../../playground/playground';
import { codeToHtml } from 'shiki'
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
    selector: 'app-button-groups',
    imports: [
        Button,
        ButtonGroupModule,
        Playground,
    ],
    templateUrl: './button-groups.component.html',
    styleUrl: './button-groups.component.scss',
})
export class ButtonGroupsComponent implements OnDestroy {
    private configSheet: SideSheetRef<ButtonGroupConfig> | undefined;
    public configOpen = signal(false);

    public buttonSize = signal<ButtonSize>('small');
    public groupType = signal<ButtonGroupType>('standard');
    public selection = signal<ButtonGroupSelection>('none');

    public apiImport: SafeHtml = `// Component imports
import { ButtonGroupModule } from '@vip9008/ngx-md3';`;

    public apiData: SafeHtml = `// Inputs
public buttonSize: InputSignal<ButtonSize> = input<ButtonSize>('small', {
    alias: 'button-size',
});
public groupType: InputSignal<ButtonGroupType> = input<ButtonGroupType>('standard', {
    alias: 'group-type',
});
public groupSelection: InputSignal<ButtonGroupSelection> = input<ButtonGroupSelection>('none', {
    alias: 'selection',
});`;

    public apiTypes: SafeHtml = `// Types
type ButtonSize = 'x-small' | 'small' | 'medium' | 'large' | 'x-large';
type ButtonGroupType = 'standard' | 'connected';
type ButtonGroupSelection = 'none' | 'single' | 'multiple';`;

    public apiUsage: SafeHtml = `<!-- Component usage -->
<md3-button-group button-size="small" group-type="standard" selection="none">
    <!-- button -->
    <button md3-button>
        <md3-icon md3-icon-element>bluetooth</md3-icon>
        Bluetooth
    </button>
    .
    .
    .
    <!-- icon button -->
    <button md3-icon-button>
        <md3-icon md3-icon-element>alarm</md3-icon>
    </button>
    .
    .
    .
</md3-button-group>`;

    constructor(
        private sheetsService: SheetsService,
        private sanitizer: DomSanitizer,
    ) {
        // this.apiData.forEach(async (item) => {
        //     const code = item.type;
        //     item.type = this.sanitizer.bypassSecurityTrustHtml(await codeToHtml(code as string, {
        //         lang: 'typescript',
        //         theme: 'material-theme-ocean',
        //     }));
        //     console.log(item.type);
        // });

        codeToHtml(this.apiImport as string, {
            lang: 'typescript',
            theme: 'material-theme-ocean',
        }).then((html) => {
            this.apiImport = this.sanitizer.bypassSecurityTrustHtml(html);
        });

        codeToHtml(this.apiData as string, {
            lang: 'typescript',
            theme: 'material-theme-ocean',
        }).then((html) => {
            this.apiData = this.sanitizer.bypassSecurityTrustHtml(html);
        });

        codeToHtml(this.apiTypes as string, {
            lang: 'typescript',
            theme: 'material-theme-ocean',
        }).then((html) => {
            this.apiTypes = this.sanitizer.bypassSecurityTrustHtml(html);
        });

        codeToHtml(this.apiUsage as string, {
            lang: 'html',
            theme: 'material-theme-ocean',
        }).then((html) => {
            this.apiUsage = this.sanitizer.bypassSecurityTrustHtml(html);
        });
    }

    public openConfig(): void {
        if (this.configOpen()) {
            this.configSheet?.close();
            return;
        }

        this.configSheet = this.sheetsService.openSideSheet(ButtonGroupConfig, {
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
        this.configSheet?.componentInstance?.buttonSize.setValue(this.buttonSize());
        this.configSheet?.componentInstance?.buttonSize.registerOnChange(() => {
            this.buttonSize.set(this.configSheet?.componentInstance?.buttonSize.value);
        });

        this.configSheet?.componentInstance?.isConntected.setValue(this.groupType() == 'connected');
        this.configSheet?.componentInstance?.isConntected.registerOnChange(() => {
            this.groupType.set(this.configSheet?.componentInstance?.isConntected.value ? 'connected' : 'standard');
        });

        this.configSheet?.componentInstance?.selectionType.setValue(this.selection());
        this.configSheet?.componentInstance?.selectionType.registerOnChange(() => {
            this.selection.set(this.configSheet?.componentInstance?.selectionType.value);
        });
    }
}
