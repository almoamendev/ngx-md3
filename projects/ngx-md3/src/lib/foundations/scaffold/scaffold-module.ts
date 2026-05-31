import { NgModule } from '@angular/core';
import { Scaffold } from './scaffold';
import { ScaffoldBar } from '../scaffold-bar';
import { ScaffoldRail } from '../scaffold-rail';
import { ScaffoldPane } from '../scaffold-pane';

@NgModule({
    declarations: [
        Scaffold,
    ],
    imports: [
        ScaffoldBar,
        ScaffoldRail,
        ScaffoldPane,
    ],
    exports: [
        Scaffold,
        ScaffoldBar,
        ScaffoldRail,
        ScaffoldPane,
    ],
})
export class ScaffoldModule { }
