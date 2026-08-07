import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import {
    CarouselAlignment,
    IconButton,
    IconElement,
    InputElement,
    MaterialIcon,
    RadioButton,
    SideSheetBody,
    SideSheetHeader,
    SideSheetRef,
    Slider,
    StateComponent,
    TypeBody,
    TypeLabel,
} from '@almoamendev/ngx-md3';

@Component({
    selector: 'app-carousel-config',
    imports: [
        SideSheetHeader,
        SideSheetBody,
        IconButton,
        MaterialIcon,
        IconElement,
        RadioButton,
        Slider,
        InputElement,
        StateComponent,
        TypeBody,
        TypeLabel,
    ],
    templateUrl: './carousel-config.html',
    styleUrl: './carousel-config.scss',
})
export class CarouselConfig {
    public alignment: FormControl = new FormControl<CarouselAlignment>('start');
    public itemSize: FormControl = new FormControl<number>(200);
    public gap: FormControl = new FormControl<number>(8);
    public itemCount: FormControl = new FormControl<number>(10);
    public aspectRatio: FormControl = new FormControl<string>('16/9');

    constructor(
        private sideSheetRef: SideSheetRef<CarouselConfig>
    ) {
    }

    public close(): void {
        this.sideSheetRef.close();
    }
}
