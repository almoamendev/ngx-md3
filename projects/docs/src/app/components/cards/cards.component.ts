import { Component, OnDestroy, signal } from '@angular/core';
import { Card, CardType, IconButton, IconElement, MaterialIcon, SheetsService, SideSheetRef, TypeBody, TypeDisplay } from "@vip9008/ngx-md3";
import { CardConfig } from './card-config/card-config';
import { Playground } from '../playground/playground';
import { Shiki } from '../shiki/shiki';

@Component({
    selector: 'app-cards',
    imports: [
        Card,
        IconButton,
        MaterialIcon,
        IconElement,
        Playground,
        Shiki,
        TypeBody,
        TypeDisplay,
    ],
    templateUrl: './cards.component.html',
    styleUrl: './cards.component.scss',
})
export class CardsComponent implements OnDestroy {
    private configSheet: SideSheetRef<CardConfig> | undefined;
    public configOpen = signal(false);

    public cardType = signal<CardType>('elevated');
    public interactive = signal<boolean>(false);

    public apiImport: string = `// Component imports
import {
    Card,
} from '@vip9008/ngx-md3';`;

    public apiData: string = `// Inputs
public cardType = input<CardType>('elevated', {
    alias: 'card-type',
});

public isInteractive = input<boolean, unknown>(false, {
    alias: 'interactive',
    transform: booleanAttribute,
});`;

    public apiTypes: string = `// Types
import { CardType } from '@vip9008/ngx-md3';

type CardType = 'elevated' | 'filled' | 'outlined';`;

    public apiUsage: string = `<!-- Component usage -->

<md3-card card-type="elevated" [interactive]="false">
    ...
</md3-card>

<button md3-card card-type="elevated">
    ...
</button>

<a href="..." md3-card card-type="elevated">
    ...
</a>`;
    
    constructor(
        private sheetsService: SheetsService,
    ) {
    }

    public openConfig(): void {
        if (this.configOpen()) {
            this.configSheet?.close();
            return;
        }

        this.configSheet = this.sheetsService.openSideSheet(CardConfig, {
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
        this.configSheet?.componentInstance?.cardType.setValue(this.cardType());
        this.configSheet?.componentInstance?.cardType.registerOnChange(() => {
            this.cardType.set(this.configSheet?.componentInstance?.cardType.value);
        });

        this.configSheet?.componentInstance?.interactive.setValue(this.interactive());
        this.configSheet?.componentInstance?.interactive.registerOnChange(() => {
            this.interactive.set(this.configSheet?.componentInstance?.interactive.value);
        });
    }
}
