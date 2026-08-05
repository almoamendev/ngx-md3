import { CdkDialogContainer } from '@angular/cdk/dialog';
import { CdkPortalOutlet, ComponentPortal } from '@angular/cdk/portal';
import { Component, ComponentRef, ElementRef, inject, Injector, signal, Type, viewChild } from '@angular/core';
import { DIALOG_CONFIG } from './dialog-ref';
import { DialogConfig, DialogContainer } from '../../interfaces/dialog-config.interface';

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
export class Dialog extends CdkDialogContainer implements DialogContainer {
    private readonly surface = viewChild<ElementRef<HTMLElement>>('surface');

    public isActive = signal<boolean>(false);

    protected readonly config = inject<DialogConfig>(DIALOG_CONFIG, { optional: true }) ?? {};

    public get surfaceElement(): HTMLElement | null {
        return this.surface()?.nativeElement ?? null;
    }

    /**
     * Started by DialogService, either right after the dialog is created or
     * once the dialog it replaces has had its head start. The animation runs on
     * the next frame so the surface has a real from/to state.
     */
    public startEnterAnimation(): void {
        requestAnimationFrame(() => {
            this.isActive.set(true);
        });
    }

    public setActive(value: boolean): void {
        this.isActive.set(value);
    }

    public recaptureFocus(): void {
        this._recaptureFocus();
    }

    /**
     * @deprecated The CDK dialog service attaches the content. Kept for
     * backwards compatibility and will be removed in a future release.
     */
    public attachContent<T>(component: Type<T>, injector: Injector): ComponentRef<T> {
        return this.attachComponentPortal(new ComponentPortal(component, null, injector));
    }
}
