import { Routes } from '@angular/router';
import { HomePageComponent } from './core/components/home/home.component';
import { PathResolveService } from './auth/services/path-resolve.service';
import { PageNotFoundComponent } from './auth/components/page-not-found/page-not-found.component';
import { AuthGuard } from './auth/guards/auth.guard';
import { loginComponent } from './auth/components/login/login.component';
import { registerComponent } from './auth/components/register/register.component';
import { ResetPasswordComponent } from './auth/components/reset-password/reset-password.component';
import { AboutContactComponent } from './core/components/about-contact/about-contact.component';
import { ProfileResolverService } from './profile/resolves/profile.resolve';
import { BookResolverService } from './book/resolves/book.resolve';
import { PageResolverService } from './page/resolves/page.resolve';
import { UserResolverService } from './user/resolves/user.resolve';
import { PrivacyPolicyComponent } from './core/components/privacy-policy/privacy-policy.component';
import { HeroResolverService } from './hero/resolves/hero.resolve';
import { TermsOfServiceComponent } from './core/components/terms-of-service/terms-of-service.component';
import { ProjectOverviewComponent } from './core/components/project-details/project-details.component';


export const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    component: HomePageComponent,
  },
  {
    path: 'login',
    component: loginComponent,
  },
  {
    path: 'register',
    component: registerComponent,
  },
  {
    path: 'reset-password',
    component: ResetPasswordComponent,
  },
  {
    path: 'about-contact',
    component: AboutContactComponent,
  },
  {
    path: 'terms-of-service',
    component: TermsOfServiceComponent

  },
  {
    path: 'privacy-policy',
    component: PrivacyPolicyComponent

  },
  {
    path: 'project',
    component: ProjectOverviewComponent

  },
  {
    path: 'one-of-you-public',
    loadComponent: () => import('./hero/components/one-of-you-public/one-of-you-public.component').then(m => m.OneOfYouPublicComponent),
  },
  {
    path: 'try-chatgpt',
    loadComponent: () => import('./hero/components/try-chatgpt/try-chatgpt.component').then(m => m.TryChatgptComponent),
  },
  {
    path: 'projects-selection',
    loadComponent: () => import('./projects/components/projects-selection/projects-selection.component').then(m => m.ProjectsSelectionComponent),
  },
  {
    path: 'project-diary-dawn',
    loadComponent: () => import('./projects/components/diary-dawn/project-diary-dawn/project-diary-dawn.component').then(m => m.ProjectDiaryDawnComponent),
  },
  {
    path: 'project-cortex-connections',
    loadComponent: () => import('./projects/components/cortex-connections/project-cortex-connections/project-cortex-connections.component').then(m => m.ProjectCortexConnectionsComponent),
  },
  {
    path: 'profile',
    loadComponent: () => import('./profile/components/profile/profile.component').then(m => m.ProfileComponent),
    canActivate: [AuthGuard],
    resolve: {
      user: UserResolverService,
      profile: ProfileResolverService,
      book: BookResolverService,
      pages: PageResolverService,
    },
  },
  {
    path: 'bookshelf',
    loadComponent: () => import('./book/components/bookshelf/bookshelf.component').then(m => m.BookshelfComponent),
    canActivate: [AuthGuard],
    resolve: {
      book: BookResolverService,
      pages: PageResolverService,
    },
  },
  {
    path: 'pages',
    loadComponent: () => import('./page/components/pages/pages.component').then(m => m.PagesComponent),
    canActivate: [AuthGuard],
    resolve: {
      pages: PageResolverService,
    },
  },
  {
    path: 'one-of-you',
    loadComponent: () => import('./hero/components/one-of-you/one-of-you.component').then(m => m.OneOfYouComponent),
    canActivate: [AuthGuard],
    resolve: {
      hero: HeroResolverService,
    },
  },
  {
    path: '**',
    resolve: {
      path: PathResolveService,
    },
    component: PageNotFoundComponent,
  },
];