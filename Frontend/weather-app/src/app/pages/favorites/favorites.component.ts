import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../shared/Modules/material.module';
import { MatSnackBar } from '@angular/material/snack-bar';

interface FavoriteLocation {
  id: string;
  name: string;
  country: string;
  temperature: number;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  pressure: number;
  visibility: number;
  uvIndex: number;
  feelsLike: number;
  lastUpdated: Date;
  coordinates: {
    lat: number;
    lon: number;
  };
}

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, MaterialModule, ReactiveFormsModule],
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss']
})
export class FavoritesComponent {
  private snackBar = inject(MatSnackBar);

  searchControl = new FormControl('');
  isLoading = signal(false);
  viewMode = signal<'grid' | 'list'>('grid');

  favoriteLocations = signal<FavoriteLocation[]>([
    {
      id: '1',
      name: 'Hà Nội',
      country: 'Việt Nam',
      temperature: 28,
      description: 'Có mây',
      icon: 'wb_cloudy',
      humidity: 65,
      windSpeed: 12,
      pressure: 1013,
      visibility: 10,
      uvIndex: 6,
      feelsLike: 30,
      lastUpdated: new Date(),
      coordinates: { lat: 21.0285, lon: 105.8542 }
    },
    {
      id: '2',
      name: 'Hồ Chí Minh',
      country: 'Việt Nam',
      temperature: 32,
      description: 'Nắng',
      icon: 'wb_sunny',
      humidity: 78,
      windSpeed: 8,
      pressure: 1010,
      visibility: 15,
      uvIndex: 9,
      feelsLike: 36,
      lastUpdated: new Date(),
      coordinates: { lat: 10.8231, lon: 106.6297 }
    },
    {
      id: '3',
      name: 'Đà Nẵng',
      country: 'Việt Nam',
      temperature: 30,
      description: 'Mưa nhẹ',
      icon: 'grain',
      humidity: 82,
      windSpeed: 15,
      pressure: 1008,
      visibility: 8,
      uvIndex: 4,
      feelsLike: 33,
      lastUpdated: new Date(),
      coordinates: { lat: 16.0544, lon: 108.2022 }
    },
    {
      id: '4',
      name: 'Tokyo',
      country: 'Nhật Bản',
      temperature: 24,
      description: 'Có mây',
      icon: 'wb_cloudy',
      humidity: 60,
      windSpeed: 10,
      pressure: 1020,
      visibility: 12,
      uvIndex: 5,
      feelsLike: 26,
      lastUpdated: new Date(),
      coordinates: { lat: 35.6762, lon: 139.6503 }
    },
    {
      id: '5',
      name: 'New York',
      country: 'Hoa Kỳ',
      temperature: 18,
      description: 'Mưa',
      icon: 'grain',
      humidity: 85,
      windSpeed: 20,
      pressure: 1005,
      visibility: 6,
      uvIndex: 2,
      feelsLike: 16,
      lastUpdated: new Date(),
      coordinates: { lat: 40.7128, lon: -74.0060 }
    },
    {
      id: '6',
      name: 'London',
      country: 'Anh',
      temperature: 15,
      description: 'Sương mù',
      icon: 'cloud',
      humidity: 90,
      windSpeed: 5,
      pressure: 1018,
      visibility: 3,
      uvIndex: 1,
      feelsLike: 13,
      lastUpdated: new Date(),
      coordinates: { lat: 51.5074, lon: -0.1278 }
    }
  ]);

  filteredLocations = signal<FavoriteLocation[]>([]);

  constructor() {
    // Initialize filtered locations
    this.filteredLocations.set(this.favoriteLocations());

    // Subscribe to search changes
    this.searchControl.valueChanges.subscribe(value => {
      this.filterLocations(value || '');
    });
  }

  filterLocations(searchTerm: string) {
    const filtered = this.favoriteLocations().filter(location =>
      location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.country.toLowerCase().includes(searchTerm.toLowerCase())
    );
    this.filteredLocations.set(filtered);
  }

  toggleViewMode() {
    this.viewMode.set(this.viewMode() === 'grid' ? 'list' : 'grid');
  }

  refreshWeather() {
    this.isLoading.set(true);

    // Simulate API call
    setTimeout(() => {
      // Update last updated time for all locations
      const updated = this.favoriteLocations().map(location => ({
        ...location,
        lastUpdated: new Date(),
        // Simulate small temperature changes
        temperature: location.temperature + (Math.random() - 0.5) * 4
      }));

      this.favoriteLocations.set(updated);
      this.filterLocations(this.searchControl.value || '');
      this.isLoading.set(false);

      this.snackBar.open('Đã cập nhật thời tiết!', 'Đóng', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom'
      });
    }, 2000);
  }

  removeFromFavorites(locationId: string) {
    const location = this.favoriteLocations().find(l => l.id === locationId);
    if (location) {
      const updated = this.favoriteLocations().filter(l => l.id !== locationId);
      this.favoriteLocations.set(updated);
      this.filterLocations(this.searchControl.value || '');

      this.snackBar.open(`Đã xóa ${location.name} khỏi danh sách yêu thích`, 'Hoàn tác', {
        duration: 5000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom'
      }).onAction().subscribe(() => {
        // Restore the location
        this.favoriteLocations.update(locations => [...locations, location]);
        this.filterLocations(this.searchControl.value || '');
      });
    }
  }

  viewDetails(location: FavoriteLocation) {
    this.snackBar.open(`Xem chi tiết thời tiết ${location.name}`, 'Đóng', {
      duration: 2000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    });
  }

  addNewLocation() {
    this.snackBar.open('Tính năng thêm địa điểm mới sẽ được phát triển sau', 'Đóng', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    });
  }

  getTemperatureColor(temp: number): string {
    if (temp <= 10) return '#2196F3'; // Blue
    if (temp <= 20) return '#4CAF50'; // Green
    if (temp <= 30) return '#FF9800'; // Orange
    return '#F44336'; // Red
  }

  getWeatherIcon(icon: string): string {
    const iconMap: { [key: string]: string } = {
      'wb_sunny': 'wb_sunny',
      'wb_cloudy': 'wb_cloudy',
      'cloud': 'cloud',
      'grain': 'grain',
      'thunderstorm': 'thunderstorm',
      'ac_unit': 'ac_unit'
    };
    return iconMap[icon] || 'wb_sunny';
  }

  formatLastUpdated(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);

    if (minutes < 1) return 'Vừa xong';
    if (minutes < 60) return `${minutes} phút trước`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} giờ trước`;

    const days = Math.floor(hours / 24);
    return `${days} ngày trước`;
  }

  trackByLocationId(index: number, location: FavoriteLocation): string {
    return location.id;
  }
}
