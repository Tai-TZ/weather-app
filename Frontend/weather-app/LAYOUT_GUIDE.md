# Layout System - Weather App

## Tổng quan

Hệ thống layout được thiết kế với 3 layout chính cho các nhóm trang khác nhau:

### 1. Main Layout (`MainLayoutComponent`)

- **Đường dẫn**: `src/app/core/layouts/main-layout/`
- **Sử dụng cho**: Các trang chính của ứng dụng (Home, Profile, Favorites)
- **Tính năng**:
  - Sidebar navigation với menu chính
  - Responsive design (desktop sidebar, mobile drawer)
  - User authentication status
  - Quick access buttons (Login/Logout)
  - Modern gradient theme (blue-purple)

### 2. Admin Layout (`AdminLayoutComponent`)

- **Đường dẫn**: `src/app/core/layouts/admin-layout/`
- **Sử dụng cho**: Các trang quản trị (Admin Cities, Weather, Users)
- **Tính năng**:
  - Admin-specific navigation
  - Red-orange gradient theme to distinguish from main app
  - Back to main app button
  - Admin user info display
  - Dedicated admin toolbar

### 3. Auth Layout (`AuthLayoutComponent`)

- **Đường dẫn**: `src/app/core/layouts/auth-layout/`
- **Sử dụng cho**: Đăng nhập và đăng ký
- **Tính năng**:
  - Centered design với glassmorphism effect
  - Brand display với logo và slogan
  - Animated background
  - Responsive card container

## Cấu trúc Routing

```typescript
// Auth routes
/auth/login     → AuthLayout → LoginComponent
/auth/register  → AuthLayout → RegisterComponent

// Main app routes
/home          → MainLayout → HomeComponent
/profile       → MainLayout → ProfileComponent
/favorites     → MainLayout → FavoritesComponent

// Admin routes
/admin/cities  → AdminLayout → AdminCitiesComponent
/admin/weather → AdminLayout → AdminWeatherComponent
/admin/users   → AdminLayout → AdminUsersComponent
```

## Cách sử dụng

### 1. Thêm trang mới vào Main Layout

```typescript
// Trong app.routes.ts
{
  path: '',
  component: MainLayoutComponent,
  children: [
    { path: 'your-new-page', component: YourNewPageComponent }
  ]
}
```

### 2. Thêm navigation item mới

```typescript
// Trong main-layout.component.ts
navigationItems = [{ icon: "your-icon", label: "Your Page", route: "/your-new-page" }];
```

### 3. Tạo layout mới (nếu cần)

1. Tạo thư mục trong `src/app/core/layouts/`
2. Tạo component với:
   - TypeScript file với logic navigation
   - HTML template với `<router-outlet>`
   - SCSS file với styles
3. Import và sử dụng trong routes

## Responsive Design

Tất cả layouts đều responsive:

- **Desktop (>768px)**: Sidebar cố định bên trái
- **Mobile (≤768px)**: Hamburger menu với drawer overlay

## Customization

### Thay đổi theme colors

```scss
// Trong layout component SCSS
.sidenav-header {
  background: linear-gradient(135deg, #your-color1 0%, #your-color2 100%);
}
```

### Thêm animation

```scss
.your-element {
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0);
  }
}
```

## Dependencies

Layout system sử dụng:

- **Angular Material**: UI components và theming
- **Angular CDK Layout**: Responsive breakpoint detection
- **Angular Router**: Navigation management

## Best Practices

1. **Consistency**: Sử dụng cùng một layout cho các trang có chức năng tương tự
2. **Performance**: Lazy load layouts nếu có nhiều routes
3. **Accessibility**: Đảm bảo navigation có proper ARIA labels
4. **Mobile-first**: Thiết kế responsive từ mobile lên desktop
5. **User Experience**: Hiển thị loading states và smooth transitions

## Troubleshooting

### Common Issues:

1. **Layout không hiển thị đúng**

   - Kiểm tra import MaterialModule trong component
   - Verify routing configuration

2. **Responsive breakpoints không hoạt động**

   - Import BreakpointObserver từ @angular/cdk/layout
   - Kiểm tra CSS media queries

3. **Navigation không hoạt động**
   - Verify RouterModule import
   - Check route paths trong navigation items

## Future Enhancements

- [ ] Theme switcher (Dark/Light mode)
- [ ] Layout customization settings
- [ ] Advanced user role-based navigation
- [ ] Breadcrumb navigation
- [ ] Progressive Web App (PWA) features
