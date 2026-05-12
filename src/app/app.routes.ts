import { Routes } from '@angular/router';
import { AstaLive } from './pages/asta-live/asta-live';
import { HomePage } from './pages/layout/home-page/home-page';
import { Layout } from './pages/layout/layout';

export const routes: Routes = [

    {
        path: "",
        component: Layout,
        children: [
            {
                path: "",
                component: HomePage
            },
            {
                path: "asta/live",
                component: AstaLive
            }
        ]
    }
];
