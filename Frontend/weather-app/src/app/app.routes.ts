import { Routes } from '@angular/router';
import { LoginComponent } from './pages/auth/login/login.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { ProfileComponent } from './pages/profile/profile/profile.component';
import { HomeComponent } from './pages/home/home.component';
import { FavoritesComponent } from './pages/favorites/favorites.component';
import { AdminCitiesComponent } from './pages/admin/cities/admin-cities/admin-cities.component';
import { AdminWeatherComponent } from './pages/admin/weather/admin-weather/admin-weather.component';
import { AdminUsersComponent } from './pages/admin/users/admin-users/admin-users.component';

export const routes: Routes = [

    // Publuc routes
    { path: '', component: HomeComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },


    // User (Auth)
    { path: 'profile', component: ProfileComponent },
    { path: 'favorites', component: FavoritesComponent },


    // Admin (Auth + Role)
    { path: 'admin/cities', component: AdminCitiesComponent },
    { path: 'admin/weather', component: AdminWeatherComponent },
    { path: 'admin/users', component: AdminUsersComponent },


    // 404
    { path: '**', redirectTo: '', pathMatch: 'full' }
];
