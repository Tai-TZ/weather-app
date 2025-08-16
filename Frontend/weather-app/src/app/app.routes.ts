import { Routes } from '@angular/router';
import { LoginComponent } from './pages/auth/login/login.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { ProfileComponent } from './pages/profile/profile/profile.component';
import { HomeComponent } from './pages/home/home.component';
import { FavoritesComponent } from './pages/favorites/favorites.component';
import { AdminCitiesComponent } from './pages/admin/cities/admin-cities/admin-cities.component';
import { AdminWeatherComponent } from './pages/admin/weather/admin-weather/admin-weather.component';
import { AdminUsersComponent } from './pages/admin/users/admin-users/admin-users.component';

// Layout Components
import { MainLayoutComponent } from './core/layouts/main-layout/main-layout.component';
import { AdminLayoutComponent } from './core/layouts/admin-layout/admin-layout.component';
import { AuthLayoutComponent } from './core/layouts/auth-layout/auth-layout.component';

export const routes: Routes = [
    // Auth routes (standalone, no layout wrapper for simplicity)
    {
        path: 'auth',
        component: AuthLayoutComponent,
        children: [
            { path: 'login', component: LoginComponent },
            { path: 'register', component: RegisterComponent },
            { path: '', redirectTo: 'login', pathMatch: 'full' }
        ]
    },

    // Redirect old paths to new auth paths
    { path: 'login', redirectTo: 'auth/login', pathMatch: 'full' },
    { path: 'register', redirectTo: 'auth/register', pathMatch: 'full' },

    // Admin routes (with admin layout)
    {
        path: 'admin',
        component: AdminLayoutComponent,
        children: [
            { path: 'cities', component: AdminCitiesComponent },
            { path: 'weather', component: AdminWeatherComponent },
            { path: 'users', component: AdminUsersComponent },
            { path: '', redirectTo: 'cities', pathMatch: 'full' }
        ]
    },

    // Main app routes (with main layout) - catch all other routes
    {
        path: '',
        component: MainLayoutComponent,
        children: [
            { path: 'home', component: HomeComponent },
            { path: 'profile', component: ProfileComponent },
            { path: 'favorites', component: FavoritesComponent },
            { path: '', redirectTo: 'home', pathMatch: 'full' }
        ]
    },

    // 404 - redirect to home
    { path: '**', redirectTo: '', pathMatch: 'full' }
];
