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
import { CheckboxesComponent } from './components/selection-controls/checkboxes/checkboxes.component';
import { TypographyComponent } from './styles/typography/typography.component';
import { ListsComponent } from './components/lists/lists.component';
import { RadioButtonsComponent } from './components/selection-controls/radio-buttons/radio-buttons.component';
import { SlidersComponent } from './components/sliders/sliders.component';
import { SwitchesComponent } from './components/selection-controls/switches/switches.component';
import { ButtonGroupsComponent } from './components/buttons/button-groups/button-groups.component';
import { DialogsComponent } from './components/dialogs/dialogs.component';
import { ChipsComponent } from './components/chips/chips.component';
import { MenusComponent } from './components/menus/menus.component';
import { SplitButtonsComponent } from './components/buttons/split-buttons/split-buttons.component';
import { NavigationRailComponent } from './components/navigations/navigation-rail/navigation-rail.component';
import { ScaffoldComponent } from './foundations/scaffold/scaffold.component';
import { GridsComponent } from './foundations/grids/grids.component';
import { NavigationBarComponent } from './components/navigations/navigation-bar/navigation-bar.component';
import { NavigationItemComponent } from './components/navigations/navigation-item/navigation-item.component';
import { AppBarComponent } from './components/app-bar/app-bar.component';
import { SnackbarsComponent } from './components/snackbars/snackbars.component';
import { HomeComponent } from './home/home.component';
import { BadgesComponent } from './components/badges/badges.component';
import { ComponentsComponent } from './components/components.component';
import { GettingStartedComponent } from './foundations/getting-started/getting-started.component';
import { ColorTokensComponent } from './styles/color-tokens/color-tokens.component';
import { ElevationTokensComponent } from './styles/elevation-tokens/elevation-tokens.component';
import { ShapeTokensComponent } from './styles/shape-tokens/shape-tokens.component';
import { MotionTokensComponent } from './styles/motion-tokens/motion-tokens.component';
import { GridTokensComponent } from './styles/grid-tokens/grid-tokens.component';

export const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            {
                path: 'home',
                component: HomeComponent,
            },
            {
                path: 'styles',
                children: [
                    {
                        path: 'typography',
                        component: TypographyComponent,
                    },
                    {
                        path: 'color',
                        component: ColorTokensComponent,
                    },
                    {
                        path: 'elevation',
                        component: ElevationTokensComponent,
                    },
                    {
                        path: 'shape',
                        component: ShapeTokensComponent,
                    },
                    {
                        path: 'motion',
                        component: MotionTokensComponent,
                    },
                    {
                        path: 'grid',
                        component: GridTokensComponent,
                    },
                ],
            },
            {
                path: 'foundations',
                children: [
                    {
                        path: 'getting-started',
                        component: GettingStartedComponent,
                    },
                    {
                        path: 'scaffold',
                        component: ScaffoldComponent,
                    },
                    {
                        path: 'grids',
                        component: GridsComponent,
                    },
                ],
            },
            {
                path: 'components',
                children: [
                    {
                        path: '',
                        component: ComponentsComponent,
                    },
                    {
                        path: 'app-bar',
                        component: AppBarComponent,
                    },
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
                            {
                                path: 'split-buttons',
                                component: SplitButtonsComponent,
                            },
                            {
                                path: 'button-groups',
                                component: ButtonGroupsComponent,
                            },
                        ],
                    },
                    {
                        path: 'badges',
                        component: BadgesComponent,
                    },
                    {
                        path: 'cards',
                        component: CardsComponent,
                    },
                    {
                        path: 'chips',
                        component: ChipsComponent,
                    },
                    {
                        path: 'selection-controls',
                        children: [
                            {
                                path: 'checkboxes',
                                component: CheckboxesComponent,
                            },
                            {
                                path: 'switches',
                                component: SwitchesComponent,
                            },
                            {
                                path: 'radio-buttons',
                                component: RadioButtonsComponent,
                            },
                        ],
                    },
                    {
                        path: 'dialogs',
                        component: DialogsComponent,
                    },
                    {
                        path: 'navigations',
                        children: [
                            {
                                path: 'navigation-bar',
                                component: NavigationBarComponent,
                            },
                            {
                                path: 'navigation-rail',
                                component: NavigationRailComponent,
                            },
                            {
                                path: 'navigation-item',
                                component: NavigationItemComponent,
                            },
                        ],
                    },
                    {
                        path: 'sliders',
                        component: SlidersComponent,
                    },
                    {
                        path: 'lists',
                        component: ListsComponent,
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
                        path: 'menus',
                        component: MenusComponent,
                    },
                    {
                        path: 'snackbars',
                        component: SnackbarsComponent,
                    },
                    {
                        path: 'text-fields',
                        component: TextFieldsComponent,
                    },
                ],
            },
            {
                path: '',
                redirectTo: '/home',
                pathMatch: 'full'
            },
            {
                path: '**',
                component: ErrorComponent
            },
        ],
    },
];
