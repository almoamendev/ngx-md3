import { CdkPortalOutlet } from '@angular/cdk/portal';
import { Component } from '@angular/core';
import { LayoutService } from '../layout.service';
import { Scaffold } from '../scaffold/scaffold';

/**
 * A layout region shell that fills its parent instead of the window.
 *
 * It places the same regions as `md3-scaffold` — the bar rows, the rail columns and the three
 * panes — so the same region attributes work inside it:
 *
 * ```html
 * <md3-layout>
 *     <md3-toolbar md3-scaffold-bar="bottom" toolbar-type="floating">...</md3-toolbar>
 *
 *     <div md3-scaffold-pane="main">...</div>
 * </md3-layout>
 * ```
 *
 * Use it wherever a page-sized scaffold does not fit: the content of a full screen dialog, a
 * card, a preview pane. A full screen dialog is the common one, because a toolbar needs a bar
 * or a rail region and the dialog shell has none of its own.
 *
 * The layout provides its own {@link LayoutService}, so everything inside it reads the scroll
 * position and the floating insets of *this* container. A floating toolbar therefore pads the
 * main pane of the layout, and `scroll-action` follows the pane of the layout — never the page
 * behind it. The window size, the breakpoints, the reading direction and the color scheme stay
 * shared with the rest of the application.
 */
@Component({
    selector: 'md3-layout',
    imports: [
        CdkPortalOutlet,
    ],
    templateUrl: '../scaffold/scaffold.html',
    styleUrl: './layout.scss',
    providers: [
        LayoutService,
    ],
})
export class Layout extends Scaffold {
}
