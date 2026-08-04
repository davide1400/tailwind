import { Routes } from '@angular/router';
import { AstaLive } from './pages/components/asta-live/asta-live';
import { HomePage } from './pages/layout/home-page/home-page';
import { Layout } from './pages/layout/layout';
import { Scambi } from './pages/components/scambi/scambi';

export const routes: Routes = [

    {
        path: "",
        //Pagina wrapper che contiene il router-outlet
        component: Layout,
        children: [
            {
                path: "",
                //di conseguenza viene caricata l'home-page
                component: HomePage
            },
            {
                path: "asta/live",
                component: AstaLive,
                data: {
                    nascondiMenu: true,
                }
            },
            {
                path: "scambi",
                component: Scambi,
            }
        ]
    }
];
