import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MaterialModule } from '../../../shared/Modules/material.module';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
    selector: 'app-main-layout',
    standalone: true,
    imports: [CommonModule, RouterModule, MaterialModule],
    templateUrl: './main-layout.component.html',
    styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent {
    private breakpointObserver = inject(BreakpointObserver);
    private router = inject(Router);

    isHandset = signal(false);
    isLoggedIn = signal(false); // TODO: Kết nối với auth service sau
    userName = signal('User'); // TODO: Lấy từ auth service

    navigationItems = [
        { icon: 'home', label: 'Trang chủ', route: '/home' },
        { icon: 'favorite', label: 'Yêu thích', route: '/favorites', requireAuth: true },
        { icon: 'person', label: 'Hồ sơ', route: '/profile', requireAuth: true }
    ];

    constructor() {
        this.breakpointObserver.observe(Breakpoints.Handset)
            .subscribe(result => {
                console.log(result);
                this.isHandset.set(result.matches);
            });

        // TODO: Kết nối với auth service để lấy trạng thái đăng nhập
        // Tạm thời set mặc định là đã đăng nhập
        this.isLoggedIn.set(true);
    }

    navigateTo(route: string) {
        this.router.navigate([route]);
    }

    onLogin() {
        this.router.navigate(['/auth/login']);
    }

    onRegister() {
        this.router.navigate(['/auth/register']);
    }

    onLogout() {
        // TODO: Implement logout logic
        this.isLoggedIn.set(false);
        this.router.navigate(['/home']);
    }

    onAdminPanel() {
        this.router.navigate(['/admin/cities']);
    }

    get filteredNavigationItems() {
        return this.navigationItems.filter(item =>
            !item.requireAuth || this.isLoggedIn()
        );
    }
} 