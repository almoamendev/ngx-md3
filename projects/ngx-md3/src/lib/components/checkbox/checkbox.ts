import { AfterContentInit, Component, ContentChild, DestroyRef, ElementRef } from '@angular/core';
import { StateComponent } from '../common/state-component';
import { InputElement } from '../common/input-element';
import { MaterialIcon } from '../common/material-icon/material-icon';
import { fromEvent } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    selector: 'md3-checkbox',
    imports: [
        MaterialIcon
    ],
    templateUrl: './checkbox.html',
    styleUrl: './checkbox.scss',
    hostDirectives: [
        StateComponent
    ],
})
export class Checkbox implements AfterContentInit {
    public checkboxIcon: 'check_small' | 'check_indeterminate_small' = 'check_small';

    @ContentChild(InputElement) InputElement!: InputElement;

    constructor(
        private el: ElementRef<HTMLElement>,
        private destroyRef: DestroyRef
    ) {
    }

    ngAfterContentInit(): void {
        fromEvent(this.InputElement.nativeElement, 'focus').pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
            this.el.nativeElement.classList.add('md3-focused');
        });

        fromEvent(this.InputElement.nativeElement, 'blur').pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
            this.el.nativeElement.classList.remove('md3-focused');
        });

        fromEvent(this.InputElement.nativeElement, 'change').pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
            if (this.InputElement.nativeElement.indeterminate) {
                this.checkboxIcon = 'check_indeterminate_small';
            } else {
                this.checkboxIcon = 'check_small';
            }
        });
    }
}
