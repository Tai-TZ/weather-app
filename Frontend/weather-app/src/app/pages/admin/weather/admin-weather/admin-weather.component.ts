import { Component, inject, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MaterialModule } from '../../../../shared/Modules/material.module';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

interface WeatherData {
  id: string;
  cityId: string;
  cityName: string;
  country: string;
  timestamp: Date;
  temperature: number;
  feelsLike: number;
  humidity: number;
  pressure: number;
  windSpeed: number;
  windDirection: number;
  visibility: number;
  uvIndex: number;
  cloudCover: number;
  weatherCondition: string;
  weatherDescription: string;
  weatherIcon: string;
  isActive: boolean;
  dataSource: 'api' | 'manual' | 'sensor';
  lastUpdated: Date;
}

interface WeatherFormData {
  cityId: string;
  temperature: number;
  feelsLike: number;
  humidity: number;
  pressure: number;
  windSpeed: number;
  windDirection: number;
  visibility: number;
  uvIndex: number;
  cloudCover: number;
  weatherCondition: string;
  weatherDescription: string;
  weatherIcon: string;
  dataSource: 'api' | 'manual' | 'sensor';
}

interface WeatherStats {
  totalRecords: number;
  todayRecords: number;
  activeStations: number;
  avgTemperature: number;
  maxTemperature: number;
  minTemperature: number;
  lastUpdateTime: Date;
}

interface City {
  id: string;
  name: string;
  country: string;
}

@Component({
  selector: 'app-admin-weather',
  standalone: true,
  imports: [CommonModule, MaterialModule, ReactiveFormsModule],
  templateUrl: './admin-weather.component.html',
  styleUrls: ['./admin-weather.component.scss']
})
export class AdminWeatherComponent {
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // State signals
  isLoading = signal(false);
  selectedWeather = signal<WeatherData | null>(null);
  searchTerm = signal('');
  filterCity = signal<string>('');
  filterDataSource = signal<string>('');
  activeTab = signal(0);

  // Table configuration
  displayedColumns: string[] = [
    'select',
    'cityName',
    'timestamp',
    'temperature',
    'humidity',
    'pressure',
    'windSpeed',
    'weatherCondition',
    'dataSource',
    'actions'
  ];

  dataSource = new MatTableDataSource<WeatherData>([]);
  selection = new SelectionModel<WeatherData>(true, []);

  // Forms
  weatherForm: FormGroup = this.fb.group({});
  searchForm: FormGroup = this.fb.group({});

  // Stats and data
  weatherStats = signal<WeatherStats>({
    totalRecords: 1247,
    todayRecords: 67,
    activeStations: 15,
    avgTemperature: 26.5,
    maxTemperature: 42.1,
    minTemperature: 8.3,
    lastUpdateTime: new Date()
  });

  cities = signal<City[]>([
    { id: '1', name: 'Hà Nội', country: 'Việt Nam' },
    { id: '2', name: 'Hồ Chí Minh', country: 'Việt Nam' },
    { id: '3', name: 'Đà Nẵng', country: 'Việt Nam' },
    { id: '4', name: 'Tokyo', country: 'Nhật Bản' },
    { id: '5', name: 'New York', country: 'Hoa Kỳ' },
    { id: '6', name: 'London', country: 'Anh' }
  ]);

  // Mock weather data
  weatherData = signal<WeatherData[]>([
    {
      id: '1',
      cityId: '1',
      cityName: 'Hà Nội',
      country: 'Việt Nam',
      timestamp: new Date(),
      temperature: 28.5,
      feelsLike: 32.1,
      humidity: 65,
      pressure: 1013,
      windSpeed: 12,
      windDirection: 180,
      visibility: 10,
      uvIndex: 6,
      cloudCover: 40,
      weatherCondition: 'Partly Cloudy',
      weatherDescription: 'Có mây',
      weatherIcon: 'partly-cloudy',
      isActive: true,
      dataSource: 'api',
      lastUpdated: new Date()
    },
    {
      id: '2',
      cityId: '2',
      cityName: 'Hồ Chí Minh',
      country: 'Việt Nam',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      temperature: 32.8,
      feelsLike: 38.2,
      humidity: 78,
      pressure: 1010,
      windSpeed: 8,
      windDirection: 90,
      visibility: 15,
      uvIndex: 9,
      cloudCover: 20,
      weatherCondition: 'Sunny',
      weatherDescription: 'Nắng',
      weatherIcon: 'sunny',
      isActive: true,
      dataSource: 'sensor',
      lastUpdated: new Date(Date.now() - 1000 * 60 * 30)
    },
    {
      id: '3',
      cityId: '3',
      cityName: 'Đà Nẵng',
      country: 'Việt Nam',
      timestamp: new Date(Date.now() - 1000 * 60 * 45),
      temperature: 30.2,
      feelsLike: 33.8,
      humidity: 82,
      pressure: 1008,
      windSpeed: 15,
      windDirection: 225,
      visibility: 8,
      uvIndex: 4,
      cloudCover: 80,
      weatherCondition: 'Rainy',
      weatherDescription: 'Mưa nhẹ',
      weatherIcon: 'rainy',
      isActive: true,
      dataSource: 'api',
      lastUpdated: new Date(Date.now() - 1000 * 60 * 45)
    },
    {
      id: '4',
      cityId: '4',
      cityName: 'Tokyo',
      country: 'Nhật Bản',
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
      temperature: 24.1,
      feelsLike: 26.3,
      humidity: 60,
      pressure: 1020,
      windSpeed: 10,
      windDirection: 270,
      visibility: 12,
      uvIndex: 5,
      cloudCover: 50,
      weatherCondition: 'Cloudy',
      weatherDescription: 'Có mây',
      weatherIcon: 'cloudy',
      isActive: true,
      dataSource: 'api',
      lastUpdated: new Date(Date.now() - 1000 * 60 * 15)
    },
    {
      id: '5',
      cityId: '5',
      cityName: 'New York',
      country: 'Hoa Kỳ',
      timestamp: new Date(Date.now() - 1000 * 60 * 60),
      temperature: 18.3,
      feelsLike: 16.8,
      humidity: 85,
      pressure: 1005,
      windSpeed: 20,
      windDirection: 315,
      visibility: 6,
      uvIndex: 2,
      cloudCover: 90,
      weatherCondition: 'Rainy',
      weatherDescription: 'Mưa',
      weatherIcon: 'rainy',
      isActive: false,
      dataSource: 'manual',
      lastUpdated: new Date(Date.now() - 1000 * 60 * 60)
    }
  ]);

  constructor() {
    this.initializeForms();
    this.loadWeatherData();
    this.setupSearch();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  private initializeForms() {
    this.weatherForm = this.fb.group({
      cityId: ['', [Validators.required]],
      temperature: [0, [Validators.required, Validators.min(-50), Validators.max(60)]],
      feelsLike: [0, [Validators.required, Validators.min(-50), Validators.max(60)]],
      humidity: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
      pressure: [1013, [Validators.required, Validators.min(800), Validators.max(1200)]],
      windSpeed: [0, [Validators.required, Validators.min(0), Validators.max(300)]],
      windDirection: [0, [Validators.required, Validators.min(0), Validators.max(360)]],
      visibility: [10, [Validators.required, Validators.min(0), Validators.max(50)]],
      uvIndex: [0, [Validators.required, Validators.min(0), Validators.max(15)]],
      cloudCover: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
      weatherCondition: ['', [Validators.required]],
      weatherDescription: ['', [Validators.required]],
      weatherIcon: ['', [Validators.required]],
      dataSource: ['manual' as 'manual', [Validators.required]]
    });

    this.searchForm = this.fb.group({
      searchTerm: [''],
      filterCity: [''],
      filterDataSource: ['']
    });
  }

  private setupSearch() {
    this.searchForm.get('searchTerm')?.valueChanges.subscribe(value => {
      this.searchTerm.set(value || '');
      this.applyFilter();
    });

    this.searchForm.get('filterCity')?.valueChanges.subscribe(value => {
      this.filterCity.set(value || '');
      this.applyFilter();
    });

    this.searchForm.get('filterDataSource')?.valueChanges.subscribe(value => {
      this.filterDataSource.set(value || '');
      this.applyFilter();
    });
  }

  private loadWeatherData() {
    this.dataSource.data = this.weatherData();
  }

  private applyFilter() {
    const searchTerm = this.searchTerm().toLowerCase();
    const cityFilter = this.filterCity();
    const sourceFilter = this.filterDataSource();

    this.dataSource.filterPredicate = (data: WeatherData) => {
      const matchesSearch = !searchTerm ||
        data.cityName.toLowerCase().includes(searchTerm) ||
        data.country.toLowerCase().includes(searchTerm) ||
        data.weatherDescription.toLowerCase().includes(searchTerm);

      const matchesCity = !cityFilter || data.cityId === cityFilter;
      const matchesSource = !sourceFilter || data.dataSource === sourceFilter;

      return matchesSearch && matchesCity && matchesSource;
    };

    this.dataSource.filter = Math.random().toString();
  }

  // Tab management
  onTabChange(index: number) {
    this.activeTab.set(index);
  }

  // CRUD Operations
  openAddDialog() {
    this.selectedWeather.set(null);
    this.weatherForm.reset({
      cityId: '',
      temperature: 25,
      feelsLike: 25,
      humidity: 60,
      pressure: 1013,
      windSpeed: 0,
      windDirection: 0,
      visibility: 10,
      uvIndex: 5,
      cloudCover: 0,
      weatherCondition: '',
      weatherDescription: '',
      weatherIcon: 'sunny',
      dataSource: 'manual'
    });
  }

  openEditDialog(weather: WeatherData) {
    this.selectedWeather.set(weather);
    this.weatherForm.patchValue({
      cityId: weather.cityId,
      temperature: weather.temperature,
      feelsLike: weather.feelsLike,
      humidity: weather.humidity,
      pressure: weather.pressure,
      windSpeed: weather.windSpeed,
      windDirection: weather.windDirection,
      visibility: weather.visibility,
      uvIndex: weather.uvIndex,
      cloudCover: weather.cloudCover,
      weatherCondition: weather.weatherCondition,
      weatherDescription: weather.weatherDescription,
      weatherIcon: weather.weatherIcon,
      dataSource: weather.dataSource
    });
  }

  saveWeatherData() {
    if (this.weatherForm.valid) {
      this.isLoading.set(true);

      const formData: WeatherFormData = this.weatherForm.value;

      if (this.selectedWeather()) {
        this.updateWeatherData(this.selectedWeather()!.id, formData);
      } else {
        this.createWeatherData(formData);
      }
    } else {
      this.snackBar.open('Vui lòng kiểm tra lại thông tin!', 'Đóng', {
        duration: 3000
      });
    }
  }

  private createWeatherData(formData: WeatherFormData) {
    setTimeout(() => {
      const selectedCity = this.cities().find(c => c.id === formData.cityId);

      const newWeatherData: WeatherData = {
        id: Date.now().toString(),
        cityId: formData.cityId,
        cityName: selectedCity?.name || '',
        country: selectedCity?.country || '',
        timestamp: new Date(),
        temperature: formData.temperature,
        feelsLike: formData.feelsLike,
        humidity: formData.humidity,
        pressure: formData.pressure,
        windSpeed: formData.windSpeed,
        windDirection: formData.windDirection,
        visibility: formData.visibility,
        uvIndex: formData.uvIndex,
        cloudCover: formData.cloudCover,
        weatherCondition: formData.weatherCondition,
        weatherDescription: formData.weatherDescription,
        weatherIcon: formData.weatherIcon,
        isActive: true,
        dataSource: formData.dataSource,
        lastUpdated: new Date()
      };

      this.weatherData.update(data => [...data, newWeatherData]);
      this.loadWeatherData();
      this.updateStats();
      this.isLoading.set(false);
      this.selectedWeather.set(null);

      this.snackBar.open('Đã thêm dữ liệu thời tiết mới!', 'Đóng', {
        duration: 3000
      });
    }, 1500);
  }

  private updateWeatherData(id: string, formData: WeatherFormData) {
    setTimeout(() => {
      const selectedCity = this.cities().find(c => c.id === formData.cityId);

      this.weatherData.update(data =>
        data.map(weather =>
          weather.id === id
            ? {
              ...weather,
              cityId: formData.cityId,
              cityName: selectedCity?.name || weather.cityName,
              country: selectedCity?.country || weather.country,
              temperature: formData.temperature,
              feelsLike: formData.feelsLike,
              humidity: formData.humidity,
              pressure: formData.pressure,
              windSpeed: formData.windSpeed,
              windDirection: formData.windDirection,
              visibility: formData.visibility,
              uvIndex: formData.uvIndex,
              cloudCover: formData.cloudCover,
              weatherCondition: formData.weatherCondition,
              weatherDescription: formData.weatherDescription,
              weatherIcon: formData.weatherIcon,
              dataSource: formData.dataSource,
              lastUpdated: new Date()
            }
            : weather
        )
      );

      this.loadWeatherData();
      this.updateStats();
      this.isLoading.set(false);
      this.selectedWeather.set(null);

      this.snackBar.open('Đã cập nhật dữ liệu thời tiết!', 'Đóng', {
        duration: 3000
      });
    }, 1500);
  }

  deleteWeatherData(weather: WeatherData) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Xác nhận xóa',
        message: `Bạn có chắc chắn muốn xóa dữ liệu thời tiết của ${weather.cityName}?`,
        confirmText: 'Xóa',
        cancelText: 'Hủy'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.performDelete(weather.id);
      }
    });
  }

  private performDelete(id: string) {
    this.isLoading.set(true);

    setTimeout(() => {
      const deletedData = this.weatherData().find(w => w.id === id);
      this.weatherData.update(data => data.filter(weather => weather.id !== id));
      this.loadWeatherData();
      this.updateStats();
      this.isLoading.set(false);

      this.snackBar.open(`Đã xóa dữ liệu thời tiết "${deletedData?.cityName}"`, 'Hoàn tác', {
        duration: 5000
      }).onAction().subscribe(() => {
        if (deletedData) {
          this.weatherData.update(data => [...data, deletedData]);
          this.loadWeatherData();
          this.updateStats();
        }
      });
    }, 1000);
  }

  // Bulk operations
  toggleSelectAll() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach(row => this.selection.select(row));
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  bulkDelete() {
    if (this.selection.selected.length === 0) return;

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Xác nhận xóa nhiều',
        message: `Bạn có chắc chắn muốn xóa ${this.selection.selected.length} bản ghi thời tiết đã chọn?`,
        confirmText: 'Xóa tất cả',
        cancelText: 'Hủy'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.performBulkDelete();
      }
    });
  }

  private performBulkDelete() {
    const idsToDelete = this.selection.selected.map(weather => weather.id);
    this.isLoading.set(true);

    setTimeout(() => {
      this.weatherData.update(data =>
        data.filter(weather => !idsToDelete.includes(weather.id))
      );
      this.loadWeatherData();
      this.updateStats();
      this.selection.clear();
      this.isLoading.set(false);

      this.snackBar.open(`Đã xóa ${idsToDelete.length} bản ghi thời tiết`, 'Đóng', {
        duration: 3000
      });
    }, 1500);
  }

  refreshWeatherData() {
    this.isLoading.set(true);

    setTimeout(() => {
      // Simulate API refresh
      this.weatherData.update(data =>
        data.map(weather => ({
          ...weather,
          timestamp: new Date(),
          temperature: weather.temperature + (Math.random() - 0.5) * 2,
          humidity: Math.max(0, Math.min(100, weather.humidity + (Math.random() - 0.5) * 10)),
          lastUpdated: new Date()
        }))
      );

      this.loadWeatherData();
      this.updateStats();
      this.isLoading.set(false);

      this.snackBar.open('Đã cập nhật dữ liệu thời tiết từ API!', 'Đóng', {
        duration: 3000
      });
    }, 2000);
  }

  private updateStats() {
    const data = this.weatherData();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayRecords = data.filter(w => {
      const recordDate = new Date(w.timestamp);
      recordDate.setHours(0, 0, 0, 0);
      return recordDate.getTime() === today.getTime();
    }).length;

    const temperatures = data.map(w => w.temperature);
    const activeStations = new Set(data.filter(w => w.isActive).map(w => w.cityId)).size;

    this.weatherStats.update(stats => ({
      ...stats,
      totalRecords: data.length,
      todayRecords,
      activeStations,
      avgTemperature: temperatures.length > 0 ? temperatures.reduce((a, b) => a + b, 0) / temperatures.length : 0,
      maxTemperature: temperatures.length > 0 ? Math.max(...temperatures) : 0,
      minTemperature: temperatures.length > 0 ? Math.min(...temperatures) : 0,
      lastUpdateTime: new Date()
    }));
  }

  // Utility methods
  formatTemperature(temp: number): string {
    return `${temp.toFixed(1)}°C`;
  }

  formatTimestamp(timestamp: Date): string {
    return timestamp.toLocaleString('vi-VN');
  }

  formatTimeAgo(timestamp: Date): string {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);

    if (minutes < 1) return 'Vừa xong';
    if (minutes < 60) return `${minutes} phút trước`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} giờ trước`;

    const days = Math.floor(hours / 24);
    return `${days} ngày trước`;
  }

  getDataSourceIcon(source: string): string {
    switch (source) {
      case 'api': return 'cloud_download';
      case 'sensor': return 'sensors';
      case 'manual': return 'edit';
      default: return 'help';
    }
  }

  getDataSourceText(source: string): string {
    switch (source) {
      case 'api': return 'API';
      case 'sensor': return 'Cảm biến';
      case 'manual': return 'Thủ công';
      default: return 'Không xác định';
    }
  }

  getWeatherIcon(icon: string): string {
    const iconMap: { [key: string]: string } = {
      'sunny': 'wb_sunny',
      'partly-cloudy': 'wb_cloudy',
      'cloudy': 'cloud',
      'rainy': 'grain',
      'stormy': 'thunderstorm',
      'snowy': 'ac_unit',
      'foggy': 'foggy'
    };
    return iconMap[icon] || 'wb_sunny';
  }

  getFormError(fieldName: string): string {
    const field = this.weatherForm.get(fieldName);

    if (field?.errors && field.touched) {
      if (field.errors['required']) return 'Trường này là bắt buộc';
      if (field.errors['min']) return `Giá trị tối thiểu là ${field.errors['min'].min}`;
      if (field.errors['max']) return `Giá trị tối đa là ${field.errors['max'].max}`;
    }
    return '';
  }

  exportData() {
    const dataToExport = this.dataSource.filteredData.map(weather => ({
      'Thành phố': weather.cityName,
      'Quốc gia': weather.country,
      'Thời gian': this.formatTimestamp(weather.timestamp),
      'Nhiệt độ (°C)': weather.temperature,
      'Cảm giác như (°C)': weather.feelsLike,
      'Độ ẩm (%)': weather.humidity,
      'Áp suất (hPa)': weather.pressure,
      'Tốc độ gió (km/h)': weather.windSpeed,
      'Hướng gió (°)': weather.windDirection,
      'Tầm nhìn (km)': weather.visibility,
      'Chỉ số UV': weather.uvIndex,
      'Độ che phủ mây (%)': weather.cloudCover,
      'Điều kiện thời tiết': weather.weatherCondition,
      'Mô tả': weather.weatherDescription,
      'Nguồn dữ liệu': this.getDataSourceText(weather.dataSource),
      'Cập nhật cuối': this.formatTimestamp(weather.lastUpdated)
    }));

    const csvContent = this.convertToCSV(dataToExport);
    this.downloadCSV(csvContent, 'weather-data-export.csv');

    this.snackBar.open('Đã xuất dữ liệu thời tiết thành công!', 'Đóng', {
      duration: 3000
    });
  }

  private convertToCSV(data: any[]): string {
    if (data.length === 0) return '';

    const headers = Object.keys(data[0]);
    const csvRows = [headers.join(',')];

    for (const row of data) {
      const values = headers.map(header => {
        const value = row[header];
        return typeof value === 'string' && value.includes(',')
          ? `"${value}"`
          : value;
      });
      csvRows.push(values.join(','));
    }

    return csvRows.join('\n');
  }

  private downloadCSV(content: string, filename: string) {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');

    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  cancelEdit() {
    this.selectedWeather.set(null);
    this.weatherForm.reset();
  }
}

// Reuse ConfirmDialog from cities component
interface ConfirmDialogData {
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
}

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [MaterialModule],
  template: `
    <h2 mat-dialog-title>{{ data.title }}</h2>
    <mat-dialog-content>
      <p>{{ data.message }}</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">{{ data.cancelText }}</button>
      <button mat-raised-button color="warn" (click)="onConfirm()">{{ data.confirmText }}</button>
    </mat-dialog-actions>
  `
})
export class ConfirmDialogComponent {
  data = inject(MAT_DIALOG_DATA) as ConfirmDialogData;

  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>
  ) { }

  onConfirm() {
    this.dialogRef.close(true);
  }

  onCancel() {
    this.dialogRef.close(false);
  }
}
