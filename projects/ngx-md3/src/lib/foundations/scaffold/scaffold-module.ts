import { NgModule } from '@angular/core';
import { Scaffold } from './scaffold';
import { ScaffoldBar } from '../scaffold-bar';
import { ScaffoldRail } from '../scaffold-rail';
import { ScaffoldPane } from '../scaffold-pane';
import { CdkPortalOutlet } from '@angular/cdk/portal';

@NgModule({
    declarations: [
        Scaffold,
    ],
    imports: [
        ScaffoldBar,
        ScaffoldRail,
        ScaffoldPane,
        CdkPortalOutlet,
    ],
    exports: [
        Scaffold,
        ScaffoldBar,
        ScaffoldRail,
        ScaffoldPane,
    ],
})
export class ScaffoldModule { }
