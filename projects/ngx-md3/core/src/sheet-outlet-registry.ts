import { Injectable } from '@angular/core';
import type { CdkPortalOutlet } from '@angular/cdk/portal';
import { SheetOutletOptions } from './types/sheet-host.type';

/** The scaffold region a sheet outlet sits in. */
export type SheetOutletSlot = 'start' | 'end' | 'bottom';

/** What a sheet service does with the outlets of one slot. */
export interface SheetOutletHandler {
    register(outlet: CdkPortalOutlet, options: SheetOutletOptions): void;
    unregister(outlet: CdkPortalOutlet): void;
}

interface SheetOutletEntry {
    slot: SheetOutletSlot;
    outlet: CdkPortalOutlet;
    options: SheetOutletOptions;
}

/**
 * Where scaffolds and full screen dialogs register their sheet outlets.
 *
 * The scaffold does not know the sheet services, so an app that never opens a sheet does not
 * load them. A sheet service connects when it is first created, receives every outlet that is
 * already registered in registration order, and from then on hears about each change.
 *
 * Used by the library's own entry points; apps do not need to call it.
 */
@Injectable({
    providedIn: 'root',
})
export class SheetOutletRegistry {
    private readonly entries: SheetOutletEntry[] = [];
    private readonly handlers = new Map<SheetOutletSlot, SheetOutletHandler>();

    public register(slot: SheetOutletSlot, outlet: CdkPortalOutlet, options: SheetOutletOptions = {}): void {
        if (this.entries.some((entry) => entry.slot === slot && entry.outlet === outlet)) {
            return;
        }

        this.entries.push({ slot, outlet, options });
        this.handlers.get(slot)?.register(outlet, options);
    }

    public unregister(slot: SheetOutletSlot, outlet: CdkPortalOutlet): void {
        const index = this.entries.findIndex((entry) => entry.slot === slot && entry.outlet === outlet);

        if (index === -1) {
            return;
        }

        this.entries.splice(index, 1);
        this.handlers.get(slot)?.unregister(outlet);
    }

    /** Makes `handler` the receiver for `slot`, and replays the outlets registered so far. */
    public connect(slot: SheetOutletSlot, handler: SheetOutletHandler): void {
        this.handlers.set(slot, handler);

        for (const entry of this.entries) {
            if (entry.slot === slot) {
                handler.register(entry.outlet, entry.options);
            }
        }
    }
}
