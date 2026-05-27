import { Component } from '@angular/core';
import { IconElement, MaterialIcon, SplitButton } from '@vip9008/ngx-md3';

@Component({
    selector: 'app-split-buttons.component',
    imports: [
        SplitButton,
        MaterialIcon,
        IconElement,
    ],
    templateUrl: './split-buttons.component.html',
    styleUrl: './split-buttons.component.scss',
})
export class SplitButtonsComponent {
    public logAction(name: string): void {
        console.log('Split button action:: ', name);
    }

    public logMenu(name: string): void {
        console.log('Split button menu:: ', name);
    }
}
