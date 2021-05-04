import { LayoutComponent } from '../layout/layout.component';
import { AuthGuard } from '../shared/guards/auth.guard';
import {
    BuildingsComponent, CharactersComponent, ProductsComponent, TutorialsComponent, TasksComponent,
    NotificationsComponent, LevelsComponent, ProfileComponent,UsersComponent,GameUsersComponent
} from './index';

export const routes = [
    { path: '', pathMatch: 'full', redirectTo: '/login' },
    {
        path: '',
        loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
    },
    {
        path: 'dashboard', component: LayoutComponent,
        canActivate: [AuthGuard],
        children: [
            { path: 'users', component: UsersComponent },
            { path: 'building', component: BuildingsComponent },
            { path: 'character', component: CharactersComponent },
            { path: 'product', component: ProductsComponent },
            { path: 'tutorial', component: TutorialsComponent },
            { path: 'task', component: TasksComponent },
            { path: 'notification', component: NotificationsComponent },
            { path: 'level', component: LevelsComponent },
            { path: 'game-users', component: GameUsersComponent },
            { path: 'profile', component: ProfileComponent }
        ]
    },
    { path: '**', redirectTo: 'login' }

];