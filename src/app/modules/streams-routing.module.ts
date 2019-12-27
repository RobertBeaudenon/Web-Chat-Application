import { NgModule } from '@angular/core';

import { Routes, RouterModule } from '@angular/router';
import { AuthTabsComponent } from '../components/auth-tabs/auth-tabs.component';
import { StreamsComponent } from '../components/streams/streams.component';
import { AuthGuard } from '../guards/auth.guard';
import { CommentsComponent } from '../components/comments/comments.component';
import { PeopleComponent } from '../components/people/people.component';
import { RequestingComponent } from '../components/requesting/requesting.component';
import { RequestersComponent } from '../components/requesters/requesters.component';
import { NotificationsComponent } from '../components/notifications/notifications.component';

//obj of routes
const routes: Routes = [
  //routes
  {
    path: 'streams',
    component: StreamsComponent,
    canActivate: [AuthGuard] //if user has a valid token he will be able to access streams page otherwise he will be redirected to login/register page
  },
  {
    path: 'post/:id',
    component: CommentsComponent,
    canActivate: [AuthGuard] //if user has a valid token he will be able to access comment page
  },
  {
    path: 'people',
    component: PeopleComponent,
    canActivate: [AuthGuard] //if user has a valid token he will be able to access comment page
  },
  {
    path: 'people/requesting',
    component: RequestingComponent,
    canActivate: [AuthGuard] //if user has a valid token he will be able to access comment page
  },
  {
    path: 'people/requesters',
    component: RequestersComponent,
    canActivate: [AuthGuard] //if user has a valid token he will be able to access comment page
  },
  {
    path: 'notifications',
    component: NotificationsComponent,
    canActivate: [AuthGuard] //if user has a valid token he will be able to access comment page
  }
];

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forRoot(routes)]
})
export class StreamsRoutingModule {}
