import { CdkDialogContainer } from '@angular/cdk/dialog';
import { CdkPortalOutlet, ComponentPortal } from '@angular/cdk/portal';
import { Component, ComponentRef, inject, Injector, signal, Type } from '@angular/core';
import { DIALOG_CONFIG } from './dialog-ref';
import { DialogConfig } from '../../interfaces/dialog-config.interface';

/**
 * Material 3 dialog shell. It extends the CDK dialog container, so focus
 * trapping, focus restoration and the ARIA attributes are handled by the CDK
 * while this component only owns the MD3 surface and its animation.
 */
@Component({
    selector: 'md3-dialog',
    imports: [
        CdkPortalOutlet,
    ],
    templateUrl: './dialog.html',
    styleUrl: './dialog.scss',
})
export class Dialog extends CdkDialogContainer {
    public isActive = signal<boolean>(false);

    protected readonly config = inject<DialogConfig>(DIALOG_CONFIG, { optional: true }) ?? {};

    /**
     * Started by DialogService, either right after the dialog is created or
     * once the dialog it replaces has finished animating out. The animation
     * runs on the next frame so the surface has a real from/to state.
     */
    public startEnterAnimation(): void {
        requestAnimationFrame(() => {
            this.isActive.set(true);
        });
    }

    /**
     * @deprecated The CDK dialog service attaches the content. Kept for
     * backwards compatibility and will be removed in a future release.
     */
    public attachContent<T>(component: Type<T>, injector: Injector): ComponentRef<T> {
        return this.attachComponentPortal(new ComponentPortal(component, null, injector));
    }
}
