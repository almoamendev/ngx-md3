import { Directive, effect, ElementRef, HostListener, Input, OnInit, Renderer2, signal } from '@angular/core';

@Directive({
    selector: '[md3-state-component]',
    host: {
        class: 'md3-state-component',
    },
})
export class StateComponent implements OnInit {
    private stateLayer?: HTMLDivElement;
    private stateLayerSignal = signal<boolean>(true);

    constructor(
        private el: ElementRef<HTMLElement>,
        private renderer: Renderer2
    ) {
        effect(() => {
            if (this.stateLayerSignal()) {
                this.enable();
            } else {
                this.disable();
            }
        });
    }

    ngOnInit(): void {
        this.init();
    }

    private init(): void {
        if (!this.stateLayerSignal() || this.stateLayer) {
            return;
        }

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

    public setStateLayer(value: boolean) {
        this.stateLayerSignal.set(value);
    }

    private enable(): void {
        this.el.nativeElement.classList.add('md3-state-component');
        this.init();
    }

    private disable(): void {
        this.el.nativeElement.classList.remove('md3-state-component');
        this.stateLayer?.remove();
        this.stateLayer = undefined;
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
