import { Directive, ElementRef, HostListener, OnInit, Renderer2 } from '@angular/core';

@Directive({
    selector: '[md3-state-component]',
    host: {
        class: 'md3-state-component',
    },
})
export class StateComponent implements OnInit {
    private stateLayer?: HTMLDivElement;

    constructor(
        private el: ElementRef<HTMLElement>,
        private renderer: Renderer2
    ) {}

    ngOnInit(): void {
        this.init();
    }

    private init(): void {
        let layer = this.el.nativeElement.querySelector(
            ':scope > .md3-state-layer'
        ) as HTMLDivElement | null;

        if (!layer) {
            // Create the state layer and insert as the first child
            layer = this.renderer.createElement('div') as HTMLDivElement;
            this.renderer.addClass(layer, 'md3-state-layer');

            this.renderer.appendChild(
                this.el.nativeElement,
                layer
            );

        }

        this.stateLayer = layer;
    }

    public enable(): void {
        this.el.nativeElement.classList.add('md3-state-component');
        this.init();
    }

    public disable(): void {
        this.el.nativeElement.classList.remove('md3-state-component');
        this.stateLayer?.remove();
    }

    @HostListener('pointerdown', ['$event'])
    onPointerDown(event: PointerEvent): void {
        if (!this.stateLayer) {
            return;
        }

        const rect = this.el.nativeElement.getBoundingClientRect();
        const w = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        this.stateLayer.style.setProperty('--ripple-w', `${w}px`);
        this.stateLayer.style.setProperty('--ripple-x', `${x}px`);
        this.stateLayer.style.setProperty('--ripple-y', `${y}px`);
    }
}
