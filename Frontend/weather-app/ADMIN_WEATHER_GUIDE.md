# Trang Admin Weather - Weather App

## Tổng quan

Trang **Admin Weather** (`/admin/weather`) là module quản lý dữ liệu thời tiết trong hệ thống admin, cung cấp dashboard toàn diện để theo dõi, quản lý và phân tích thông tin thời tiết từ nhiều nguồn khác nhau.

## Tính năng chính

### 🌤️ Weather Dashboard

- **Real-time Statistics**: 6 thẻ thống kê cập nhật thời gian thực
- **Multi-source Monitoring**: Theo dõi dữ liệu từ API, sensor, manual
- **Weather Analytics**: Phân tích xu hướng và patterns
- **Live Data Refresh**: Cập nhật dữ liệu tự động từ API

### 📊 Data Management

- **Complete CRUD Operations**: Thêm, sửa, xóa dữ liệu thời tiết
- **Advanced Filtering**: Lọc theo thành phố, nguồn dữ liệu, thời gian
- **Bulk Operations**: Xử lý nhiều bản ghi cùng lúc
- **Data Validation**: Kiểm tra tính hợp lệ của dữ liệu thời tiết

### 🔍 Search & Analytics

- **Smart Search**: Tìm kiếm thông minh theo nhiều tiêu chí
- **Weather Trends**: Phân tích xu hướng thay đổi thời tiết
- **Station Monitoring**: Theo dõi trạng thái các trạm thời tiết
- **Data Export**: Xuất báo cáo CSV với định dạng chuẩn

### 📱 Responsive Interface

- **Mobile-first Design**: Tối ưu cho mọi thiết bị
- **Touch-friendly**: Giao diện thân thiện với touch
- **Real-time Updates**: Cập nhật dữ liệu không cần reload
- **Intuitive Navigation**: Điều hướng dễ sử dụng

## Cấu trúc giao diện

### 1. Dashboard Header

```html
<div class="page-header">
  <div class="header-content">
    <div class="title-section">
      <h1>🌤️ Quản lý dữ liệu thời tiết</h1>
      <p>Dashboard và quản lý thông tin thời tiết thời gian thực</p>
    </div>

    <div class="header-actions">
      <button class="refresh-btn">🔄 Cập nhật dữ liệu</button>
      <button class="export-btn">📥 Xuất dữ liệu</button>
    </div>
  </div>
</div>
```

**Đặc điểm:**

- Admin gradient theme (red-orange)
- Real-time action buttons
- Loading animations
- Professional header design

### 2. Statistics Cards

```html
<div class="stats-grid">
  <!-- Total Records Card -->
  <mat-card class="stat-card total-records">
    <div class="stat-content">
      <mat-icon>storage</mat-icon>
      <div class="stat-info">
        <span class="stat-number">1,247</span>
        <span class="stat-label">Tổng bản ghi</span>
      </div>
    </div>
  </mat-card>

  <!-- Today Records Card -->
  <mat-card class="stat-card today-records">
    <div class="stat-content">
      <mat-icon>today</mat-icon>
      <div class="stat-info">
        <span class="stat-number">67</span>
        <span class="stat-label">Bản ghi hôm nay</span>
      </div>
    </div>
  </mat-card>

  <!-- Additional cards... -->
</div>
```

**6 Statistics Cards:**

1. **Tổng bản ghi**: Tổng số dữ liệu thời tiết
2. **Bản ghi hôm nay**: Dữ liệu được thêm trong ngày
3. **Trạm hoạt động**: Số trạm thời tiết đang hoạt động
4. **Nhiệt độ TB**: Nhiệt độ trung bình
5. **Nhiệt độ cao nhất**: Nhiệt độ cao nhất recorded
6. **Nhiệt độ thấp nhất**: Nhiệt độ thấp nhất recorded

### 3. Tab Navigation

```html
<mat-tab-group class="weather-tabs">
  <!-- Data Management Tab -->
  <mat-tab label="Quản lý dữ liệu">
    <!-- Search, filter, table content -->
  </mat-tab>

  <!-- Analytics Tab -->
  <mat-tab label="Phân tích">
    <!-- Charts and analytics content -->
  </mat-tab>
</mat-tab-group>
```

### 4. Advanced Search & Filter

```html
<mat-card class="search-card">
  <form [formGroup]="searchForm">
    <div class="search-controls">
      <!-- Global Search -->
      <mat-form-field class="search-field">
        <input placeholder="Tìm kiếm thành phố, quốc gia, mô tả..." />
        <mat-icon matPrefix>search</mat-icon>
      </mat-form-field>

      <!-- City Filter -->
      <mat-form-field class="filter-field">
        <mat-select placeholder="Thành phố">
          <mat-option value="">Tất cả thành phố</mat-option>
          <mat-option value="hanoi">Hà Nội</mat-option>
          <mat-option value="hcm">TP.HCM</mat-option>
        </mat-select>
      </mat-form-field>

      <!-- Data Source Filter -->
      <mat-form-field class="filter-field">
        <mat-select placeholder="Nguồn dữ liệu">
          <mat-option value="">Tất cả nguồn</mat-option>
          <mat-option value="api">API</mat-option>
          <mat-option value="sensor">Cảm biến</mat-option>
          <mat-option value="manual">Thủ công</mat-option>
        </mat-select>
      </mat-form-field>
    </div>
  </form>
</mat-card>
```

### 5. Weather Data Table

```html
<mat-table [dataSource]="dataSource" class="weather-table">
  <!-- Checkbox Column -->
  <ng-container matColumnDef="select">
    <th><mat-checkbox></mat-checkbox></th>
    <td><mat-checkbox></mat-checkbox></td>
  </ng-container>

  <!-- City Column -->
  <ng-container matColumnDef="cityName">
    <th mat-sort-header>Thành phố</th>
    <td>
      <div class="city-info">
        <strong>{{ weather.cityName }}</strong>
        <span class="country">{{ weather.country }}</span>
      </div>
    </td>
  </ng-container>

  <!-- Temperature Column -->
  <ng-container matColumnDef="temperature">
    <th mat-sort-header>Nhiệt độ</th>
    <td>
      <div class="temperature-info">
        <span class="temp-main">{{ weather.temperature }}°C</span>
        <span class="feels-like">Cảm giác {{ weather.feelsLike }}°C</span>
      </div>
    </td>
  </ng-container>

  <!-- Weather Condition Column -->
  <ng-container matColumnDef="weatherCondition">
    <th>Điều kiện</th>
    <td>
      <div class="weather-condition">
        <mat-icon class="weather-icon">{{ getWeatherIcon(weather.icon) }}</mat-icon>
        <div class="condition-text">
          <span>{{ weather.condition }}</span>
          <span>{{ weather.description }}</span>
        </div>
      </div>
    </td>
  </ng-container>
</mat-table>
```

**Table Features:**

- **10 Columns**: Select, City, Timestamp, Temperature, Humidity, Pressure, Wind, Weather Condition, Data Source, Actions
- **Sortable**: All data columns có thể sort
- **Multi-select**: Checkbox selection với bulk operations
- **Responsive**: Horizontal scroll trên mobile
- **Rich Data Display**: Visual icons, color coding, detailed info

### 6. Add/Edit Weather Form

```html
<div class="form-dialog">
  <mat-card class="form-card">
    <form [formGroup]="weatherForm">
      <div class="form-grid">
        <!-- Location Section -->
        <div class="form-section">
          <h3>Vị trí</h3>
          <mat-form-field>
            <mat-select formControlName="cityId" placeholder="Chọn thành phố">
              <mat-option value="hanoi">Hà Nội, Việt Nam</mat-option>
              <mat-option value="hcm">TP.HCM, Việt Nam</mat-option>
            </mat-select>
          </mat-form-field>
        </div>

        <!-- Temperature Section -->
        <div class="form-section">
          <h3>Nhiệt độ</h3>
          <div class="form-row">
            <mat-form-field>
              <input type="number" formControlName="temperature" placeholder="Nhiệt độ (°C)" />
            </mat-form-field>
            <mat-form-field>
              <input type="number" formControlName="feelsLike" placeholder="Cảm giác như (°C)" />
            </mat-form-field>
          </div>
        </div>

        <!-- Atmospheric Conditions -->
        <div class="form-section full-width">
          <h3>Điều kiện khí quyển</h3>
          <div class="form-row">
            <mat-form-field>
              <input type="number" formControlName="humidity" placeholder="Độ ẩm (%)" />
            </mat-form-field>
            <mat-form-field>
              <input type="number" formControlName="pressure" placeholder="Áp suất (hPa)" />
            </mat-form-field>
            <mat-form-field>
              <input type="number" formControlName="cloudCover" placeholder="Độ che phủ mây (%)" />
            </mat-form-field>
          </div>
        </div>
      </div>
    </form>
  </mat-card>
</div>
```

## Data Models & Interfaces

### Weather Data Interface

```typescript
interface WeatherData {
  id: string; // Unique identifier
  cityId: string; // City reference ID
  cityName: string; // Tên thành phố
  country: string; // Quốc gia
  timestamp: Date; // Thời gian đo

  // Core weather metrics
  temperature: number; // Nhiệt độ (°C)
  feelsLike: number; // Cảm giác như (°C)
  humidity: number; // Độ ẩm (%)
  pressure: number; // Áp suất (hPa)

  // Wind information
  windSpeed: number; // Tốc độ gió (km/h)
  windDirection: number; // Hướng gió (độ)

  // Visibility and environmental
  visibility: number; // Tầm nhìn (km)
  uvIndex: number; // Chỉ số UV (0-15)
  cloudCover: number; // Độ che phủ mây (%)

  // Weather description
  weatherCondition: string; // Điều kiện thời tiết
  weatherDescription: string; // Mô tả chi tiết
  weatherIcon: string; // Icon code

  // Metadata
  isActive: boolean; // Trạng thái hoạt động
  dataSource: "api" | "manual" | "sensor"; // Nguồn dữ liệu
  lastUpdated: Date; // Cập nhật cuối
}
```

### Weather Form Data Interface

```typescript
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
  dataSource: "api" | "manual" | "sensor";
}
```

### Weather Statistics Interface

```typescript
interface WeatherStats {
  totalRecords: number; // Tổng số bản ghi
  todayRecords: number; // Bản ghi hôm nay
  activeStations: number; // Trạm hoạt động
  avgTemperature: number; // Nhiệt độ trung bình
  maxTemperature: number; // Nhiệt độ cao nhất
  minTemperature: number; // Nhiệt độ thấp nhất
  lastUpdateTime: Date; // Thời gian cập nhật cuối
}
```

## Component Architecture

### Core Weather Methods

#### Data Management

```typescript
// Load and refresh
loadWeatherData(): void                              // Load tất cả dữ liệu
refreshWeatherData(): void                           // Refresh từ API
updateStats(): void                                  // Cập nhật statistics

// Search and filter
applyFilter(): void                                  // Apply search/filter
setupSearch(): void                                  // Setup real-time search
```

#### CRUD Operations

```typescript
// Create
openAddDialog(): void                                // Mở dialog thêm mới
createWeatherData(formData: WeatherFormData): void   // Tạo weather data

// Read
formatTimestamp(timestamp: Date): string             // Format thời gian
formatTimeAgo(timestamp: Date): string               // Format "x phút trước"
formatTemperature(temp: number): string              // Format nhiệt độ

// Update
openEditDialog(weather: WeatherData): void           // Mở dialog chỉnh sửa
updateWeatherData(id: string, formData: WeatherFormData): void  // Cập nhật

// Delete
deleteWeatherData(weather: WeatherData): void        // Xóa weather data
performDelete(id: string): void                      // Thực hiện xóa
```

#### Bulk Operations

```typescript
toggleSelectAll(): void                              // Chọn/bỏ chọn tất cả
isAllSelected(): boolean                             // Kiểm tra đã chọn tất cả
bulkDelete(): void                                   // Xóa nhiều bản ghi
performBulkDelete(): void                            // Thực hiện bulk delete
```

#### Utility Methods

```typescript
getDataSourceIcon(source: string): string           // Icon cho data source
getDataSourceText(source: string): string           // Text cho data source
getWeatherIcon(icon: string): string                // Weather icon mapping
getFormError(fieldName: string): string             // Lấy lỗi form
exportData(): void                                   // Xuất dữ liệu CSV
```

### State Management

```typescript
// Angular Signals (v17+)
isLoading = signal(false);                          // Loading state
selectedWeather = signal<WeatherData | null>(null); // Selected weather
searchTerm = signal('');                            // Search term
filterCity = signal<string>('');                    // City filter
filterDataSource = signal<string>('');             // Source filter
activeTab = signal(0);                              // Active tab index

// Weather data and stats
weatherData = signal<WeatherData[]>([]);            // All weather data
weatherStats = signal<WeatherStats>({...});        // Statistics
cities = signal<City[]>([]);                       // Available cities

// Material Table
dataSource = new MatTableDataSource<WeatherData>(); // Table data source
selection = new SelectionModel<WeatherData>(true, []); // Multi-selection

// Forms
weatherForm: FormGroup;                             // Add/edit form
searchForm: FormGroup;                              // Search form
```

## Form Validation

### Validation Rules

```typescript
weatherForm = this.fb.group({
  cityId: ["", [Validators.required]],

  // Temperature validation (-50°C to 60°C)
  temperature: [0, [Validators.required, Validators.min(-50), Validators.max(60)]],
  feelsLike: [0, [Validators.required, Validators.min(-50), Validators.max(60)]],

  // Humidity (0-100%)
  humidity: [0, [Validators.required, Validators.min(0), Validators.max(100)]],

  // Pressure (800-1200 hPa)
  pressure: [1013, [Validators.required, Validators.min(800), Validators.max(1200)]],

  // Wind speed (0-300 km/h)
  windSpeed: [0, [Validators.required, Validators.min(0), Validators.max(300)]],

  // Wind direction (0-360°)
  windDirection: [0, [Validators.required, Validators.min(0), Validators.max(360)]],

  // UV Index (0-15)
  uvIndex: [0, [Validators.required, Validators.min(0), Validators.max(15)]],

  // Other fields...
  visibility: [10, [Validators.required, Validators.min(0), Validators.max(50)]],
  cloudCover: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
  weatherCondition: ["", [Validators.required]],
  weatherDescription: ["", [Validators.required]],
  weatherIcon: ["", [Validators.required]],
  dataSource: ["manual", [Validators.required]],
});
```

### Error Messages (Tiếng Việt)

```typescript
getFormError(fieldName: string): string {
  const field = this.weatherForm.get(fieldName);

  if (field?.errors && field.touched) {
    if (field.errors['required']) return 'Trường này là bắt buộc';
    if (field.errors['min']) return `Giá trị tối thiểu là ${field.errors['min'].min}`;
    if (field.errors['max']) return `Giá trị tối đa là ${field.errors['max'].max}`;
  }
  return '';
}
```

### Weather-Specific Validation

- **Temperature Range**: -50°C đến 60°C (realistic weather range)
- **Humidity**: 0% đến 100% (percentage)
- **Pressure**: 800 đến 1200 hPa (atmospheric pressure range)
- **Wind Speed**: 0 đến 300 km/h (maximum recorded wind speeds)
- **UV Index**: 0 đến 15 (WHO UV Index scale)
- **Cloud Cover**: 0% đến 100% (percentage)

## Styling Architecture

### Color Scheme & Admin Theme

```scss
// Admin weather theme colors
$admin-primary: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
$admin-card-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
$admin-hover-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);

// Statistics card gradients
$stat-total: linear-gradient(135deg, #667eea 0%, #764ba2 100%); // Purple-blue
$stat-today: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); // Pink-red
$stat-stations: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); // Blue-cyan
$stat-avg: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); // Green-cyan
$stat-max: linear-gradient(135deg, #fa709a 0%, #fee140 100%); // Pink-yellow
$stat-min: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%); // Light blue-pink

// Data source colors
$source-api: #e3f2fd / #1565c0; // Light/dark blue
$source-sensor: #e8f5e8 / #2e7d32; // Light/dark green
$source-manual: #fff3e0 / #ef6c00; // Light/dark orange
```

### Layout Structure

```scss
// Dashboard container
.admin-weather-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 16px;
}

// Statistics grid
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

// Weather table
.weather-table {
  width: 100%;
  min-width: 1200px; // Horizontal scroll on smaller screens

  .temperature-info .temp-main {
    font-weight: 600;
    font-size: 1.1rem;
    color: #ff6b6b; // Temperature highlight color
  }
}

// Form dialog
.form-dialog {
  .form-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 24px;
  }
}
```

### Responsive Design

```scss
// Desktop (>768px): Full 6-column stats, wide table
// Tablet (≤768px): 3-column stats, adjusted controls
@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  }

  .search-controls {
    flex-direction: column;
  }

  .weather-table {
    min-width: 800px; // Horizontal scroll
  }
}

// Mobile (≤480px): 1-column stats, compact table
@media (max-width: 480px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }

  .weather-table {
    min-width: 600px;
  }
}
```

## User Experience Features

### 1. Real-time Dashboard

```typescript
// Auto-refresh weather data
refreshWeatherData() {
  this.isLoading.set(true);

  setTimeout(() => {
    // Simulate API call with realistic data changes
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
  }, 2000);
}
```

### 2. Smart Search & Filtering

```typescript
// Real-time search across multiple fields
dataSource.filterPredicate = (data: WeatherData) => {
  const matchesSearch = !searchTerm || data.cityName.toLowerCase().includes(searchTerm) || data.country.toLowerCase().includes(searchTerm) || data.weatherDescription.toLowerCase().includes(searchTerm);

  const matchesCity = !cityFilter || data.cityId === cityFilter;
  const matchesSource = !sourceFilter || data.dataSource === sourceFilter;

  return matchesSearch && matchesCity && matchesSource;
};
```

### 3. Weather-Specific UI Elements

```typescript
// Weather icon mapping
getWeatherIcon(icon: string): string {
  const iconMap: { [key: string]: string } = {
    'sunny': 'wb_sunny',           // ☀️
    'partly-cloudy': 'wb_cloudy',  // ⛅
    'cloudy': 'cloud',             // ☁️
    'rainy': 'grain',              // 🌧️
    'stormy': 'thunderstorm',      // ⛈️
    'snowy': 'ac_unit',            // ❄️
    'foggy': 'foggy'               // 🌫️
  };
  return iconMap[icon] || 'wb_sunny';
}

// Data source visual indicators
getDataSourceIcon(source: string): string {
  switch (source) {
    case 'api': return 'cloud_download';      // API integration
    case 'sensor': return 'sensors';          // IoT sensors
    case 'manual': return 'edit';             // Manual entry
    default: return 'help';
  }
}
```

### 4. Loading States & Feedback

```html
<!-- Spinning refresh button -->
<button [disabled]="isLoading()">
  <mat-icon [class.spinning]="isLoading()">refresh</mat-icon>
  {{ isLoading() ? 'Đang cập nhật...' : 'Cập nhật dữ liệu' }}
</button>

<!-- Table loading overlay -->
<div class="loading-overlay" *ngIf="isLoading()">
  <mat-spinner diameter="50"></mat-spinner>
</div>

<!-- Success/error snackbars -->
this.snackBar.open('Đã cập nhật dữ liệu thời tiết từ API!', 'Đóng', { duration: 3000 });
```

### 5. Advanced Form UX

```html
<!-- Progressive form sections -->
<div class="form-section">
  <h3 class="section-title">Điều kiện khí quyển</h3>

  <!-- Smart default values -->
  <mat-form-field>
    <input formControlName="pressure" placeholder="1013" value="1013" />
    <mat-hint>Áp suất tiêu chuẩn: 1013 hPa</mat-hint>
  </mat-form-field>

  <!-- Weather condition dropdowns -->
  <mat-form-field>
    <mat-select formControlName="weatherIcon">
      <mat-option value="sunny">☀️ Nắng</mat-option>
      <mat-option value="partly-cloudy">⛅ Có mây</mat-option>
      <mat-option value="rainy">🌧️ Mưa</mat-option>
    </mat-select>
  </mat-form-field>
</div>
```

## Data Operations

### CSV Export Format

```csv
Thành phố,Quốc gia,Thời gian,Nhiệt độ (°C),Cảm giác như (°C),Độ ẩm (%),Áp suất (hPa),Tốc độ gió (km/h),Hướng gió (°),Tầm nhìn (km),Chỉ số UV,Độ che phủ mây (%),Điều kiện thời tiết,Mô tả,Nguồn dữ liệu,Cập nhật cuối
Hà Nội,Việt Nam,01/01/2024 10:30:00,28.5,32.1,65,1013,12,180,10,6,40,Partly Cloudy,Có mây,API,01/01/2024 10:25:00
```

### Statistics Calculation

```typescript
private updateStats() {
  const data = this.weatherData();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Today's records
  const todayRecords = data.filter(w => {
    const recordDate = new Date(w.timestamp);
    recordDate.setHours(0, 0, 0, 0);
    return recordDate.getTime() === today.getTime();
  }).length;

  // Temperature statistics
  const temperatures = data.map(w => w.temperature);
  const activeStations = new Set(data.filter(w => w.isActive).map(w => w.cityId)).size;

  this.weatherStats.update(stats => ({
    ...stats,
    totalRecords: data.length,
    todayRecords,
    activeStations,
    avgTemperature: temperatures.reduce((a, b) => a + b, 0) / temperatures.length,
    maxTemperature: Math.max(...temperatures),
    minTemperature: Math.min(...temperatures),
    lastUpdateTime: new Date()
  }));
}
```

### Smart Data Refresh

```typescript
// Simulate realistic weather data changes
refreshWeatherData() {
  this.weatherData.update(data =>
    data.map(weather => ({
      ...weather,
      timestamp: new Date(),
      // Small temperature variations
      temperature: weather.temperature + (Math.random() - 0.5) * 2,
      // Humidity changes
      humidity: Math.max(0, Math.min(100, weather.humidity + (Math.random() - 0.5) * 10)),
      // Update timestamp
      lastUpdated: new Date()
    }))
  );
}
```

## Performance Optimization

### 1. Efficient Change Detection

```typescript
// Angular Signals for reactive updates
weatherData = signal<WeatherData[]>([]);
weatherStats = signal<WeatherStats>({...});

// Computed values
filteredData = computed(() => {
  const data = this.weatherData();
  const search = this.searchTerm();
  // ... filtering logic
  return filtered;
});
```

### 2. Table Performance

```typescript
// Efficient table data source
ngAfterViewInit() {
  this.dataSource.paginator = this.paginator;
  this.dataSource.sort = this.sort;

  // Custom filter predicate for better performance
  this.dataSource.filterPredicate = (data: WeatherData) => {
    // Optimized filtering logic
  };
}

// Virtual scrolling for large datasets (future enhancement)
<cdk-virtual-scroll-viewport itemSize="50">
  <tr *cdkVirtualFor="let weather of weatherData()"></tr>
</cdk-virtual-scroll-viewport>
```

### 3. Search Debouncing

```typescript
// Prevent excessive API calls
this.searchForm
  .get("searchTerm")
  ?.valueChanges.pipe(
    debounceTime(300), // Wait 300ms after last keystroke
    distinctUntilChanged() // Only if value actually changed
  )
  .subscribe((value) => {
    this.searchTerm.set(value || "");
    this.applyFilter();
  });
```

### 4. Memory Management

```typescript
// Clean up subscriptions
private destroy$ = new Subject<void>();

ngOnDestroy() {
  this.destroy$.next();
  this.destroy$.complete();
}

// Use takeUntil for subscription cleanup
this.searchForm.valueChanges
  .pipe(takeUntil(this.destroy$))
  .subscribe(/* ... */);
```

## Testing Strategy

### Unit Tests

```typescript
describe("AdminWeatherComponent", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AdminWeatherComponent, NoopAnimationsModule],
      providers: [
        { provide: MatSnackBar, useValue: mockSnackBar },
        { provide: MatDialog, useValue: mockDialog },
      ],
    });
  });

  it("should create weather data", () => {
    const formData: WeatherFormData = {
      cityId: "1",
      temperature: 25,
      humidity: 60,
      // ... other fields
    };

    component.createWeatherData(formData);
    expect(component.weatherData().length).toBe(1);
  });

  it("should filter weather data by search term", () => {
    component.searchTerm.set("Hanoi");
    component.applyFilter();

    const filtered = component.dataSource.filteredData;
    expect(filtered.every((w) => w.cityName.includes("Hanoi"))).toBe(true);
  });

  it("should calculate statistics correctly", () => {
    component.updateStats();
    const stats = component.weatherStats();

    expect(stats.totalRecords).toBe(component.weatherData().length);
    expect(stats.avgTemperature).toBeGreaterThan(0);
  });

  it("should validate temperature range", () => {
    const form = component.weatherForm;
    form.patchValue({ temperature: 100 }); // Invalid high temp

    expect(form.get("temperature")?.invalid).toBe(true);
    expect(form.get("temperature")?.errors?.["max"]).toBeTruthy();
  });
});
```

### Integration Tests

```typescript
describe("Weather Data Integration", () => {
  it("should refresh data from API", fakeAsync(() => {
    component.refreshWeatherData();
    tick(2000); // Wait for simulated API call

    expect(component.isLoading()).toBe(false);
    expect(component.weatherData().length).toBeGreaterThan(0);
  }));

  it("should export CSV data", () => {
    spyOn(component, "downloadCSV");
    component.exportData();

    expect(component.downloadCSV).toHaveBeenCalledWith(jasmine.stringContaining("Thành phố,Quốc gia"), "weather-data-export.csv");
  });

  it("should handle bulk delete operations", () => {
    const initialCount = component.weatherData().length;
    component.selection.select(component.weatherData()[0], component.weatherData()[1]);

    component.performBulkDelete();

    expect(component.weatherData().length).toBe(initialCount - 2);
  });
});
```

### E2E Tests

```typescript
describe("Admin Weather E2E", () => {
  it("should display weather dashboard", () => {
    cy.visit("/admin/weather");

    cy.get("[data-cy=page-title]").should("contain", "Quản lý dữ liệu thời tiết");
    cy.get("[data-cy=stats-grid]").should("be.visible");
    cy.get("[data-cy=weather-table]").should("be.visible");
  });

  it("should add new weather data", () => {
    cy.get("[data-cy=add-weather-btn]").click();
    cy.get("[data-cy=city-select]").select("Hà Nội");
    cy.get("[data-cy=temperature-input]").type("25");
    cy.get("[data-cy=save-btn]").click();

    cy.get("[data-cy=weather-table]").should("contain", "Hà Nội");
  });

  it("should search and filter weather data", () => {
    cy.get("[data-cy=search-input]").type("Hà Nội");
    cy.get("[data-cy=weather-table] tr").should("have.length.lessThan", 10);

    cy.get("[data-cy=source-filter]").select("API");
    cy.get("[data-cy=weather-table]").should("contain", "API");
  });
});
```

## API Integration Points

### Future Service Integration

```typescript
interface WeatherService {
  // CRUD operations
  getWeatherData(filters?: WeatherFilters): Observable<WeatherData[]>;
  getWeatherById(id: string): Observable<WeatherData>;
  createWeatherData(data: WeatherFormData): Observable<WeatherData>;
  updateWeatherData(id: string, data: WeatherFormData): Observable<WeatherData>;
  deleteWeatherData(id: string): Observable<void>;
  bulkDeleteWeatherData(ids: string[]): Observable<void>;

  // Analytics
  getWeatherStats(): Observable<WeatherStats>;
  getWeatherTrends(period: string): Observable<WeatherTrend[]>;

  // External APIs
  refreshFromExternalAPI(): Observable<WeatherData[]>;
  validateWeatherStation(stationId: string): Observable<boolean>;

  // Export
  exportWeatherData(format: "csv" | "json" | "xml"): Observable<Blob>;
}
```

### Real-time Updates

```typescript
// WebSocket integration for live updates
@Injectable()
export class WeatherWebSocketService {
  private socket = new WebSocket('ws://api.weather.com/live');

  weatherUpdates$ = new Subject<WeatherData>();

  connect() {
    this.socket.onmessage = (event) => {
      const weatherData = JSON.parse(event.data);
      this.weatherUpdates$.next(weatherData);
    };
  }
}

// Component integration
ngOnInit() {
  this.weatherSocket.weatherUpdates$
    .pipe(takeUntil(this.destroy$))
    .subscribe(updatedWeather => {
      this.weatherData.update(data =>
        data.map(weather =>
          weather.id === updatedWeather.id ? updatedWeather : weather
        )
      );
    });
}
```

### Error Handling

```typescript
createWeatherData(formData: WeatherFormData) {
  this.weatherService.createWeatherData(formData).subscribe({
    next: (weather) => {
      this.weatherData.update(data => [...data, weather]);
      this.snackBar.open('Đã thêm dữ liệu thời tiết!', 'Đóng');
    },
    error: (error) => {
      console.error('Error creating weather data:', error);

      if (error.status === 400) {
        this.snackBar.open('Dữ liệu không hợp lệ!', 'Đóng');
      } else if (error.status === 429) {
        this.snackBar.open('Quá nhiều yêu cầu, vui lòng thử lại!', 'Đóng');
      } else {
        this.snackBar.open('Lỗi server, vui lòng thử lại!', 'Đóng');
      }
    }
  });
}
```

## Security Considerations

### 1. Data Validation

```typescript
// Client-side validation
const WEATHER_VALIDATION = {
  temperature: { min: -50, max: 60 },
  humidity: { min: 0, max: 100 },
  pressure: { min: 800, max: 1200 },
  windSpeed: { min: 0, max: 300 },
  uvIndex: { min: 0, max: 15 }
};

// Sanitize user input
sanitizeWeatherInput(input: string): string {
  return input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
}
```

### 2. Permission Checks

```typescript
// Admin role verification
@Injectable()
export class WeatherAdminGuard implements CanActivate {
  canActivate(): boolean {
    return this.authService.hasRole('weather_admin') ||
           this.authService.hasRole('super_admin');
  }
}

// Feature-specific permissions
canEditWeatherData(): boolean {
  return this.authService.hasPermission('weather:edit');
}

canDeleteWeatherData(): boolean {
  return this.authService.hasPermission('weather:delete');
}
```

### 3. Data Protection

```typescript
// Rate limiting for bulk operations
private lastBulkOperation = 0;

performBulkDelete() {
  const now = Date.now();
  if (now - this.lastBulkOperation < 5000) { // 5 second cooldown
    this.snackBar.open('Vui lòng chờ 5 giây giữa các thao tác bulk!', 'Đóng');
    return;
  }

  this.lastBulkOperation = now;
  // ... proceed with bulk delete
}

// Audit logging
logWeatherAction(action: string, weatherId: string, details?: any) {
  this.auditService.log({
    action: `weather_${action}`,
    resourceId: weatherId,
    userId: this.authService.getCurrentUserId(),
    timestamp: new Date(),
    details
  });
}
```

## Deployment & Monitoring

### Build Optimization

```bash
# Production build with weather-specific optimizations
ng build --configuration production \
  --source-map=false \
  --optimization=true \
  --vendor-chunk=true \
  --common-chunk=true

# Enable compression for weather data files
gzip -9 *.csv *.json
```

### Performance Monitoring

```typescript
// Track weather dashboard performance
performance.mark('weather-dashboard-start');

ngAfterViewInit() {
  performance.mark('weather-dashboard-end');
  performance.measure('weather-dashboard-render',
    'weather-dashboard-start',
    'weather-dashboard-end'
  );

  const measure = performance.getEntriesByName('weather-dashboard-render')[0];
  if (measure.duration > 2000) { // Slow render warning
    console.warn(`Weather dashboard slow render: ${measure.duration}ms`);
  }
}

// Track user interactions
trackWeatherAction(action: string, data?: any) {
  this.analytics.track('weather_admin_action', {
    action,
    timestamp: new Date(),
    weatherDataCount: this.weatherData().length,
    ...data
  });
}
```

### Health Monitoring

```typescript
// Weather data health checks
@Injectable()
export class WeatherHealthService {
  checkDataFreshness(): Observable<boolean> {
    const recentData = this.weatherData().filter(
      (w) => new Date().getTime() - w.timestamp.getTime() < 3600000 // 1 hour
    );

    return of(recentData.length > 0);
  }

  checkTemperatureAnomalies(): Observable<WeatherAnomaly[]> {
    const anomalies = this.weatherData()
      .filter((w) => w.temperature > 50 || w.temperature < -40)
      .map((w) => ({ type: "temperature", weather: w }));

    return of(anomalies);
  }
}
```

## Future Enhancements

### Planned Features

- [ ] **Real-time Weather Maps**: Tích hợp bản đồ thời tiết interactive
- [ ] **Weather Alerts System**: Cảnh báo thời tiết cực đoan
- [ ] **Historical Data Analysis**: Phân tích dữ liệu lịch sử với charts
- [ ] **Weather Station Management**: Quản lý các trạm thời tiết IoT
- [ ] **API Integration**: Kết nối với OpenWeatherMap, AccuWeather
- [ ] **Machine Learning**: Dự báo thời tiết với AI
- [ ] **Mobile App**: Companion mobile app cho weather monitoring
- [ ] **Weather Widgets**: Embeddable weather widgets
- [ ] **Multi-language Support**: Hỗ trợ đa ngôn ngữ
- [ ] **Advanced Reporting**: Báo cáo thời tiết chi tiết với templates

### Technical Improvements

- [ ] **WebSocket Integration**: Real-time data streaming
- [ ] **Offline Support**: PWA với offline weather data
- [ ] **Advanced Caching**: Redis caching cho weather API
- [ ] **Microservices Architecture**: Tách weather service
- [ ] **GraphQL API**: Flexible weather data queries
- [ ] **Time Series Database**: InfluxDB cho weather time series
- [ ] **Event Sourcing**: Weather data event store
- [ ] **CQRS Pattern**: Command Query Responsibility Segregation

### Analytics & Visualization

- [ ] **Weather Charts**: Temperature, humidity, pressure trends
- [ ] **Heat Maps**: Geographic weather visualization
- [ ] **Forecast Accuracy**: Track prediction vs actual
- [ ] **Comparative Analysis**: Multi-city weather comparison
- [ ] **Seasonal Patterns**: Weather pattern recognition
- [ ] **Climate Data**: Long-term climate analysis

---

## Kết luận

Trang Admin Weather cung cấp một hệ thống quản lý dữ liệu thời tiết toàn diện với:

- **Professional Weather Dashboard** với real-time statistics và visual indicators
- **Complete Weather Data Management** với advanced CRUD operations và validation
- **Multi-source Data Support** cho API, sensor, và manual data entry
- **Advanced Search & Analytics** với intelligent filtering và export capabilities
- **Responsive Admin Interface** tối ưu cho mọi thiết bị và use case
- **Future-ready Architecture** với signals, modern Angular patterns, và scalable design

Đây là foundation mạnh mẽ cho một hệ thống weather management professional, sẵn sàng mở rộng với real-time features, advanced analytics, và external API integrations! 🌤️⚡
