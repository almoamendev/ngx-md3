import { Routes } from '@angular/router';
import { ErrorComponent } from './error/error.component';
import { LayoutComponent } from './layout/layout.component';
import { ButtonsComponent } from './components/buttons/buttons/buttons.component';
import { FabsComponent } from './components/buttons/fabs/fabs.component';
import { IconButtonsComponent } from './components/buttons/icon-buttons/icon-buttons.component';
import { LoadingIndicatorsComponent } from './components/loading-and-progress/loading-indicators/loading-indicators.component';
import { ProgressIndicatorsComponent } from './components/loading-and-progress/progress-indicators/progress-indicators.component';
import { CardsComponent } from './components/cards/cards.component';
import { TextFieldsComponent } from './components/text-fields/text-fields.component';
import { CheckboxesComponent } from './components/checkboxes/checkboxes.component';

export const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            {
                path: 'buttons',
                children: [
                    {
                        path: 'buttons',
                        component: ButtonsComponent,
                    },
                    {
                        path: 'floating-action-buttons',
                        component: FabsComponent,
                    },
                    {
                        path: 'icon-buttons',
                        component: IconButtonsComponent,
                    },
                ],
            },
            {
                path: 'cards',
                component: CardsComponent,
            },
            {
                path: 'checkboxes',
                component: CheckboxesComponent,
            },
            {
                path: 'loading-and-progress',
                children: [
                    {
                        path: 'loading-indicators',
                        component: LoadingIndicatorsComponent,
                    },
                    {
                        path: 'progress-indicators',
                        component: ProgressIndicatorsComponent,
                    },
                ],
            },
            {
                path: 'text-fields',
                component: TextFieldsComponent,
            },
            {
                path: '**',
                component: ErrorComponent
            },
        ],
    },
];
