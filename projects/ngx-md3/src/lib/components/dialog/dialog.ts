import { AfterContentInit, Component, ComponentRef, inject, Injector, signal, Type, viewChild } from '@angular/core';
import { ComponentPortal, CdkPortalOutlet } from '@angular/cdk/portal';
import { DIALOG_CONFIG } from './dialog-ref';
import { DialogConfig } from '../../interfaces/dialog-config.interface';

@Component({
    selector: 'md3-dialog',
    imports: [
        CdkPortalOutlet,
    ],
    templateUrl: './dialog.html',
    styleUrl: './dialog.scss',
})
export class Dialog implements AfterContentInit {
    private readonly portalOutlet = viewChild<CdkPortalOutlet>(CdkPortalOutlet);

    public isActive = signal<boolean>(false);

    protected readonly config = inject<DialogConfig>(DIALOG_CONFIG, { optional: true }) ?? {};

    protected get role(): string {
        return this.config.role ?? 'dialog';
    }

    ngAfterContentInit(): void {
        requestAnimationFrame(() => {
            this.isActive.set(true);
        });
    }

    /**
     * The service creates this wrapper first, then calls this method to mount
     * the user supplied component into the dialog container.
     */
    public attachContent<T>(component: Type<T>, injector: Injector): ComponentRef<T> {
        const portal = new ComponentPortal(component, null, injector);

        return this.portalOutlet()!.attachComponentPortal(portal);
    }
}
