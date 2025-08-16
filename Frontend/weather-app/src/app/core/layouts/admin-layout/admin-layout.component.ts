import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MaterialModule } from '../../../shared/Modules/material.module';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
    selector: 'app-admin-layout',
    standalone: true,
    imports: [CommonModule, RouterModule, MaterialModule],
    templateUrl: './admin-layout.component.html',
    styleUrls: ['./admin-layout.component.scss']
})
export class AdminLayoutComponent {
    private breakpointObserver = inject(BreakpointObserver);
    private router = inject(Router);

    isHandset = signal(false);
    userName = signal('Admin'); // TODO: Lấy từ auth service

    adminNavigationItems = [
        { icon: 'location_city', label: 'Quản lý thành phố', route: '/admin/cities' },
        { icon: 'cloud', label: 'Quản lý thời tiết', route: '/admin/weather' },
        { icon: 'people', label: 'Quản lý người dùng', route: '/admin/users' }
    ];

    constructor() {
        this.breakpointObserver.observe(Breakpoints.Handset)
            .subscribe(result => {
                this.isHandset.set(result.matches);
            });
    }

    navigateTo(route: string) {
        this.router.navigate([route]);
    }

    backToMain() {
        this.router.navigate(['/home']);
    }

    onLogout() {
        // TODO: Implement logout logic
        this.router.navigate(['/home']);
    }
} 