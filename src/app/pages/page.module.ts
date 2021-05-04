import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { routes } from './page';
import { BuildingsComponent, CharactersComponent, LevelsComponent, NotificationsComponent, ProductsComponent, ProfileComponent, TasksComponent, TutorialsComponent,UsersComponent
  ,GameUsersComponent} from './index';
import { SharedModule } from '../shared/shared.module';
import { TaskTutorialsComponent } from './tasks/task-tutorials/task-tutorials.component';

@NgModule({
  declarations: [
    BuildingsComponent,
    CharactersComponent,
    ProductsComponent,
    TutorialsComponent,
    TasksComponent,
    NotificationsComponent,
    LevelsComponent,
    ProfileComponent,
    UsersComponent,
    GameUsersComponent,
    TaskTutorialsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' }),
  ],
  exports: [
    RouterModule,
  ]
})
export class PageModule { }
