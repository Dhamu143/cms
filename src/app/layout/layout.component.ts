import { Component } from '@angular/core';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent {
  public isCollapsed: boolean = false;
  public menu = [
    {
      title: 'Users',
      icon: 'usergroup-add',
      routerLink: '/dashboard/users',
    },
    {
      title: 'Buildings',
      icon: 'build',
      routerLink: '/dashboard/building',
    },
    {
      title: 'Characters',
      icon: 'appstore',
      routerLink: '/dashboard/character',
    },
    {
      title: 'Products',
      icon: 'project',
      routerLink: '/dashboard/product',
    },
    {
      title: 'Tutorials',
      icon: 'fund-projection-screen',
      routerLink: '/dashboard/tutorial',
    },
    {
      title: 'Tasks',
      icon: 'highlight',
      routerLink: '/dashboard/task',
    },
    {
      title: 'Notifications',
      icon: 'notification',
      routerLink: '/dashboard/notification',
    },
    {
      title: 'Levels',
      icon: 'align-center',
      routerLink: '/dashboard/level',
    },
    {
      title: 'Default Profile',
      icon: 'profile',
      routerLink: '/dashboard/profile',
    },
    {
      title: 'Game Users',
      icon: 'user',
      routerLink: '/dashboard/game-users',
    },
  ];
}
