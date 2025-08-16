import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MaterialModule } from '../../../shared/Modules/material.module';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';

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
    coordinates: {
      lat: number;
      lon: number;
    };
  };
  joinDate: Date;
  lastLoginDate: Date;
}

interface WeatherPreferences {
  temperatureUnit: 'celsius' | 'fahrenheit';
  windSpeedUnit: 'kmh' | 'mph';
  pressureUnit: 'hpa' | 'inHg';
  timeFormat: '24h' | '12h';
  language: 'vi' | 'en';
  notifications: {
    weatherAlerts: boolean;
    dailyForecast: boolean;
    severeLearning: boolean;
  };
  autoLocation: boolean;
  theme: 'light' | 'dark' | 'auto';
}

interface UserStats {
  totalSearches: number;
  favoritesCount: number;
  daysActive: number;
  lastWeatherCheck: Date;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, MaterialModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);

  activeTab = signal(0);
  isEditing = signal(false);
  isLoading = signal(false);

  userProfile = signal<UserProfile>({
    id: '1',
    firstName: 'Nguyễn',
    lastName: 'Văn A',
    email: 'nguyenvana@email.com',
    phone: '+84 123 456 789',
    avatar: '',
    bio: 'Yêu thích theo dõi thời tiết và du lịch. Luôn muốn biết thời tiết ở mọi nơi trên thế giới.',
    location: {
      city: 'Hà Nội',
      country: 'Việt Nam',
      coordinates: { lat: 21.0285, lon: 105.8542 }
    },
    joinDate: new Date('2023-01-15'),
    lastLoginDate: new Date()
  });

  weatherPreferences = signal<WeatherPreferences>({
    temperatureUnit: 'celsius',
    windSpeedUnit: 'kmh',
    pressureUnit: 'hpa',
    timeFormat: '24h',
    language: 'vi',
    notifications: {
      weatherAlerts: true,
      dailyForecast: true,
      severeLearning: false
    },
    autoLocation: true,
    theme: 'auto'
  });

  userStats = signal<UserStats>({
    totalSearches: 1247,
    favoritesCount: 6,
    daysActive: 89,
    lastWeatherCheck: new Date()
  });

  profileForm: FormGroup;
  preferencesForm: FormGroup;

  constructor() {
    this.profileForm = this.fb.group({
      firstName: [this.userProfile().firstName, [Validators.required, Validators.minLength(2)]],
      lastName: [this.userProfile().lastName, [Validators.required, Validators.minLength(2)]],
      email: [this.userProfile().email, [Validators.required, Validators.email]],
      phone: [this.userProfile().phone],
      bio: [this.userProfile().bio, [Validators.maxLength(500)]],
      city: [this.userProfile().location.city, [Validators.required]],
      country: [this.userProfile().location.country, [Validators.required]]
    });

    this.preferencesForm = this.fb.group({
      temperatureUnit: [this.weatherPreferences().temperatureUnit],
      windSpeedUnit: [this.weatherPreferences().windSpeedUnit],
      pressureUnit: [this.weatherPreferences().pressureUnit],
      timeFormat: [this.weatherPreferences().timeFormat],
      language: [this.weatherPreferences().language],
      weatherAlerts: [this.weatherPreferences().notifications.weatherAlerts],
      dailyForecast: [this.weatherPreferences().notifications.dailyForecast],
      severeLearning: [this.weatherPreferences().notifications.severeLearning],
      autoLocation: [this.weatherPreferences().autoLocation],
      theme: [this.weatherPreferences().theme]
    });
  }

  onTabChange(index: number) {
    this.activeTab.set(index);
  }

  toggleEdit() {
    if (this.isEditing()) {
      // Cancel editing, reset form
      this.resetProfileForm();
    }
    this.isEditing.set(!this.isEditing());
  }

  saveProfile() {
    if (this.profileForm.valid) {
      this.isLoading.set(true);

      // Simulate API call
      setTimeout(() => {
        const formValue = this.profileForm.value;
        this.userProfile.update(profile => ({
          ...profile,
          firstName: formValue.firstName,
          lastName: formValue.lastName,
          email: formValue.email,
          phone: formValue.phone,
          bio: formValue.bio,
          location: {
            ...profile.location,
            city: formValue.city,
            country: formValue.country
          }
        }));

        this.isEditing.set(false);
        this.isLoading.set(false);

        this.snackBar.open('Đã cập nhật thông tin cá nhân!', 'Đóng', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom'
        });
      }, 1500);
    } else {
      this.snackBar.open('Vui lòng kiểm tra lại thông tin!', 'Đóng', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom'
      });
    }
  }

  savePreferences() {
    this.isLoading.set(true);

    // Simulate API call
    setTimeout(() => {
      const formValue = this.preferencesForm.value;
      this.weatherPreferences.update(prefs => ({
        ...prefs,
        temperatureUnit: formValue.temperatureUnit,
        windSpeedUnit: formValue.windSpeedUnit,
        pressureUnit: formValue.pressureUnit,
        timeFormat: formValue.timeFormat,
        language: formValue.language,
        notifications: {
          weatherAlerts: formValue.weatherAlerts,
          dailyForecast: formValue.dailyForecast,
          severeLearning: formValue.severeLearning
        },
        autoLocation: formValue.autoLocation,
        theme: formValue.theme
      }));

      this.isLoading.set(false);

      this.snackBar.open('Đã cập nhật cài đặt!', 'Đóng', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom'
      });
    }, 1000);
  }

  resetProfileForm() {
    this.profileForm.patchValue({
      firstName: this.userProfile().firstName,
      lastName: this.userProfile().lastName,
      email: this.userProfile().email,
      phone: this.userProfile().phone,
      bio: this.userProfile().bio,
      city: this.userProfile().location.city,
      country: this.userProfile().location.country
    });
  }

  uploadAvatar() {
    this.snackBar.open('Tính năng upload avatar sẽ được phát triển sau', 'Đóng', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    });
  }

  changePassword() {
    this.snackBar.open('Tính năng đổi mật khẩu sẽ được phát triển sau', 'Đóng', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    });
  }

  deleteAccount() {
    this.snackBar.open('Tính năng xóa tài khoản sẽ được phát triển sau', 'Đóng', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    });
  }

  exportData() {
    this.snackBar.open('Đang chuẩn bị xuất dữ liệu...', 'Đóng', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    });
  }

  getFullName(): string {
    return `${this.userProfile().firstName} ${this.userProfile().lastName}`;
  }

  getAvatarText(): string {
    const profile = this.userProfile();
    return `${profile.firstName.charAt(0)}${profile.lastName.charAt(0)}`.toUpperCase();
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  formatDateTime(date: Date): string {
    return date.toLocaleString('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getDaysActiveText(): string {
    const days = this.userStats().daysActive;
    if (days < 30) return `${days} ngày`;
    if (days < 365) return `${Math.floor(days / 30)} tháng`;
    return `${Math.floor(days / 365)} năm`;
  }

  getFormError(formName: 'profile' | 'preferences', fieldName: string): string {
    const form = formName === 'profile' ? this.profileForm : this.preferencesForm;
    const field = form.get(fieldName);

    if (field?.errors && field.touched) {
      if (field.errors['required']) return 'Trường này là bắt buộc';
      if (field.errors['email']) return 'Email không hợp lệ';
      if (field.errors['minlength']) return `Tối thiểu ${field.errors['minlength'].requiredLength} ký tự`;
      if (field.errors['maxlength']) return `Tối đa ${field.errors['maxlength'].requiredLength} ký tự`;
    }
    return '';
  }
}
