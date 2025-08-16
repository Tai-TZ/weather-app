# Trang Profile - Weather App

## Tổng quan

Trang **Profile** (`/profile`) là nơi người dùng quản lý thông tin cá nhân, cài đặt ứng dụng và bảo mật tài khoản. Trang được thiết kế với 3 tabs chính và giao diện hiện đại, responsive.

## Tính năng chính

### 👤 Thông tin cá nhân

- **Chỉnh sửa profile**: Họ tên, email, số điện thoại, địa chỉ
- **Avatar management**: Upload và thay đổi ảnh đại diện
- **Bio**: Mô tả bản thân (tối đa 500 ký tự)
- **Thông tin tài khoản**: Ngày tham gia, đăng nhập cuối

### ⚙️ Cài đặt thời tiết

- **Đơn vị đo lường**: Nhiệt độ (°C/°F), gió (km/h, mph), áp suất (hPa, inHg)
- **Hiển thị**: Định dạng thời gian (24h/12h), ngôn ngữ, theme
- **Thông báo**: Cảnh báo thời tiết, dự báo hàng ngày, cảnh báo nghiêm trọng
- **Tự động định vị**: Sử dụng GPS để dự báo thời tiết

### 🔒 Bảo mật

- **Đổi mật khẩu**: Cập nhật mật khẩu bảo mật
- **Xuất dữ liệu**: Download backup dữ liệu cá nhân
- **Xóa tài khoản**: Xóa vĩnh viễn tài khoản (với cảnh báo)

## Cấu trúc giao diện

### 1. Profile Header

```html
<div class="profile-header">
  <div class="avatar-section">
    <div class="avatar-container">
      <div class="avatar">NV</div>
      <button class="avatar-edit-btn">✏️</button>
    </div>
  </div>

  <div class="profile-info">
    <h1>Nguyễn Văn A</h1>
    <p>nguyenvana@email.com</p>
    <p>📍 Hà Nội, Việt Nam</p>
    <p>Bio description...</p>
  </div>

  <div class="profile-actions">
    <button>Chỉnh sửa</button>
  </div>
</div>
```

**Đặc điểm:**

- Gradient background (blue-purple)
- Glass-morphism avatar với initials
- Responsive layout
- Edit button với animation

### 2. Stats Cards

```html
<div class="stats-section">
  <div class="stats-grid">
    <mat-card class="stat-card">
      <div class="stat-content">
        <mat-icon class="stat-icon searches">🔍</mat-icon>
        <div class="stat-info">
          <span class="stat-number">1,247</span>
          <span class="stat-label">Lượt tìm kiếm</span>
        </div>
      </div>
    </mat-card>
    <!-- More stats... -->
  </div>
</div>
```

**Hiển thị:**

- **Lượt tìm kiếm**: Tổng số lần search thời tiết
- **Địa điểm yêu thích**: Số lượng favorites
- **Thời gian hoạt động**: Số ngày/tháng/năm sử dụng
- **Kiểm tra cuối**: Lần kiểm tra thời tiết gần nhất

### 3. Tab Navigation

```html
<mat-tab-group [(selectedIndex)]="activeTab">
  <mat-tab label="Thông tin cá nhân">
    <!-- Personal info forms -->
  </mat-tab>

  <mat-tab label="Cài đặt thời tiết">
    <!-- Weather preferences -->
  </mat-tab>

  <mat-tab label="Bảo mật">
    <!-- Security settings -->
  </mat-tab>
</mat-tab-group>
```

## Data Interfaces

### User Profile Interface

```typescript
interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatar: string;
  bio: string;
  location: {
    city: string;
    country: string;
    coordinates: { lat: number; lon: number };
  };
  joinDate: Date;
  lastLoginDate: Date;
}
```

### Weather Preferences Interface

```typescript
interface WeatherPreferences {
  temperatureUnit: "celsius" | "fahrenheit";
  windSpeedUnit: "kmh" | "mph";
  pressureUnit: "hpa" | "inHg";
  timeFormat: "24h" | "12h";
  language: "vi" | "en";
  notifications: {
    weatherAlerts: boolean;
    dailyForecast: boolean;
    severeLearning: boolean;
  };
  autoLocation: boolean;
  theme: "light" | "dark" | "auto";
}
```

### User Stats Interface

```typescript
interface UserStats {
  totalSearches: number;
  favoritesCount: number;
  daysActive: number;
  lastWeatherCheck: Date;
}
```

## Component Methods

### Core Functionality

```typescript
// Form Management
toggleEdit(): void                        // Toggle edit mode
saveProfile(): void                       // Save personal info
savePreferences(): void                   // Save weather settings
resetProfileForm(): void                  // Reset form to original values

// Actions
uploadAvatar(): void                      // Avatar upload
changePassword(): void                    // Password change
deleteAccount(): void                     // Account deletion
exportData(): void                        // Data export

// Utilities
getFullName(): string                     // Get formatted full name
getAvatarText(): string                   // Get initials for avatar
formatDate(date: Date): string           // Format date display
formatDateTime(date: Date): string       // Format datetime display
getDaysActiveText(): string              // Format active days
getFormError(form: string, field: string): string  // Get validation errors
```

### State Management

```typescript
// Signals (Angular 17+)
activeTab = signal(0);                   // Current tab index
isEditing = signal(false);               // Edit mode state
isLoading = signal(false);               // Loading state
userProfile = signal<UserProfile>(...);  // User data
weatherPreferences = signal<WeatherPreferences>(...); // Settings
userStats = signal<UserStats>(...);     // Statistics

// Reactive Forms
profileForm: FormGroup;                  // Personal info form
preferencesForm: FormGroup;              // Preferences form
```

## Form Validation

### Personal Info Validation

```typescript
profileForm = this.fb.group({
  firstName: ["", [Validators.required, Validators.minLength(2)]],
  lastName: ["", [Validators.required, Validators.minLength(2)]],
  email: ["", [Validators.required, Validators.email]],
  phone: [""],
  bio: ["", [Validators.maxLength(500)]],
  city: ["", [Validators.required]],
  country: ["", [Validators.required]],
});
```

### Error Messages

- **required**: "Trường này là bắt buộc"
- **email**: "Email không hợp lệ"
- **minlength**: "Tối thiểu X ký tự"
- **maxlength**: "Tối đa X ký tự"

## Styling Architecture

### Color Scheme & Gradients

```scss
// Header gradient
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

// Stats icons gradients
.searches {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
.favorites {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}
.active {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}
.last-check {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
}
```

### Layout Structure

```scss
// Main container
.profile-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
}

// Header layout
.header-content {
  display: flex;
  align-items: center;
  gap: 32px;
  flex-wrap: wrap;
}

// Stats grid
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

// Form layouts
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
}

.preferences-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
}
```

### Responsive Breakpoints

```scss
// Tablet (≤768px)
@media (max-width: 768px) {
  .form-grid,
  .preferences-grid {
    grid-template-columns: 1fr;
  }

  .header-content {
    flex-direction: column;
    text-align: center;
  }
}

// Mobile (≤480px)
@media (max-width: 480px) {
  .avatar {
    width: 80px;
    height: 80px;
  }
  .profile-name {
    font-size: 1.8rem;
  }
}
```

## User Experience Features

### 1. Progressive Enhancement

- **Read-only mode**: Display info clearly
- **Edit mode**: Show forms with validation
- **Loading states**: Spinner during save operations
- **Success feedback**: Snackbar notifications

### 2. Avatar Management

```scss
.avatar-container {
  position: relative;

  .avatar {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(10px);

    .avatar-text {
      font-size: 2.5rem;
      font-weight: 300;
      color: white;
    }
  }

  .avatar-edit-btn {
    position: absolute;
    bottom: 0;
    right: 0;
  }
}
```

### 3. Form States

- **Pristine**: Original data, read-only
- **Dirty**: Modified data, show save/cancel
- **Invalid**: Show validation errors
- **Submitting**: Disable form, show spinner

### 4. Statistics Display

```typescript
getDaysActiveText(): string {
  const days = this.userStats().daysActive;
  if (days < 30) return `${days} ngày`;
  if (days < 365) return `${Math.floor(days / 30)} tháng`;
  return `${Math.floor(days / 365)} năm`;
}
```

## Security Features

### 1. Password Management

```html
<mat-card class="security-card">
  <div class="security-item">
    <mat-icon>🔒</mat-icon>
    <div class="security-info">
      <h4>Đổi mật khẩu</h4>
      <p>Cập nhật mật khẩu để bảo vệ tài khoản</p>
    </div>
    <button (click)="changePassword()">Đổi mật khẩu</button>
  </div>
</mat-card>
```

### 2. Data Export

- GDPR compliance
- JSON format export
- Personal data backup

### 3. Account Deletion

```html
<mat-card class="security-card danger">
  <div class="security-item">
    <mat-icon class="security-icon">🗑️</mat-icon>
    <div class="security-info">
      <h4>Xóa tài khoản</h4>
      <p>Xóa vĩnh viễn tài khoản và tất cả dữ liệu</p>
    </div>
    <button color="warn" (click)="deleteAccount()">Xóa tài khoản</button>
  </div>
</mat-card>
```

## Integration Points

### 1. Local Storage Integration

```typescript
// Save preferences to localStorage
savePreferences() {
  const prefs = this.preferencesForm.value;
  localStorage.setItem('weatherPreferences', JSON.stringify(prefs));
}

// Load preferences from localStorage
loadPreferences() {
  const saved = localStorage.getItem('weatherPreferences');
  if (saved) {
    this.weatherPreferences.set(JSON.parse(saved));
  }
}
```

### 2. API Integration Points

```typescript
// Future API endpoints
interface ProfileService {
  updateProfile(profile: UserProfile): Observable<UserProfile>;
  uploadAvatar(file: File): Observable<string>;
  changePassword(oldPassword: string, newPassword: string): Observable<void>;
  deleteAccount(): Observable<void>;
  exportUserData(): Observable<Blob>;
}
```

### 3. Notification Integration

```typescript
// Push notification setup based on preferences
setupNotifications() {
  const prefs = this.weatherPreferences();

  if (prefs.notifications.weatherAlerts) {
    // Register for weather alerts
  }

  if (prefs.notifications.dailyForecast) {
    // Schedule daily notifications
  }
}
```

## Performance Optimization

### 1. Form Optimization

```typescript
// Debounce form changes
this.profileForm.valueChanges.pipe(debounceTime(300), distinctUntilChanged()).subscribe((changes) => {
  // Handle changes
});
```

### 2. Image Optimization

```typescript
// Avatar compression before upload
compressAvatar(file: File): Promise<File> {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = 200;
      canvas.height = 200;
      ctx.drawImage(img, 0, 0, 200, 200);

      canvas.toBlob(resolve, 'image/jpeg', 0.8);
    };

    img.src = URL.createObjectURL(file);
  });
}
```

### 3. Memory Management

```typescript
// Cleanup subscriptions
ngOnDestroy() {
  this.destroy$.next();
  this.destroy$.complete();
}
```

## Testing Strategy

### Unit Tests

```typescript
describe("ProfileComponent", () => {
  it("should toggle edit mode correctly", () => {
    component.toggleEdit();
    expect(component.isEditing()).toBe(true);
  });

  it("should validate form fields", () => {
    component.profileForm.patchValue({ email: "invalid-email" });
    expect(component.profileForm.get("email")?.invalid).toBe(true);
  });

  it("should format dates correctly", () => {
    const date = new Date("2023-01-15");
    expect(component.formatDate(date)).toContain("2023");
  });
});
```

### Integration Tests

```typescript
describe("Profile Integration", () => {
  it("should save profile changes", async () => {
    // Fill form
    // Click save
    // Verify API call
    // Verify success message
  });

  it("should handle validation errors", () => {
    // Submit invalid form
    // Verify error messages
    // Verify form state
  });
});
```

## Accessibility Features

### 1. ARIA Labels

```html
<button mat-mini-fab aria-label="Thay đổi ảnh đại diện" matTooltip="Thay đổi ảnh đại diện">
  <mat-icon>edit</mat-icon>
</button>
```

### 2. Keyboard Navigation

- Tab order optimization
- Enter key submissions
- Escape key cancellation

### 3. Screen Reader Support

- Semantic HTML structure
- Form labels and descriptions
- Status announcements

## Future Enhancements

### Planned Features

- [ ] Two-factor authentication
- [ ] Social media integration
- [ ] Advanced avatar editing
- [ ] Profile themes/customization
- [ ] Activity timeline
- [ ] Privacy settings granularity

### Technical Improvements

- [ ] Real-time form sync
- [ ] Progressive Web App features
- [ ] Offline profile editing
- [ ] Advanced form validation
- [ ] Drag & drop avatar upload
- [ ] Profile sharing functionality

---

## Kết luận

Trang Profile cung cấp một giao diện toàn diện để quản lý:

- **Thông tin cá nhân** với validation đầy đủ
- **Cài đặt ứng dụng** weather-specific
- **Bảo mật tài khoản** với các tính năng an toàn
- **Responsive design** hoạt động mượt mà trên mọi thiết bị
- **User experience** tối ưu với feedback và loading states

Đây là foundation vững chắc cho việc mở rộng thêm các tính năng user management trong tương lai!
