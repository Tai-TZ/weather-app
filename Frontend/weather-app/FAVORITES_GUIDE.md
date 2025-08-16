# Trang Favorites - Weather App

## Tổng quan

Trang **Favorites** (`/favorites`) là nơi người dùng quản lý danh sách các địa điểm yêu thích và theo dõi thời tiết tại những nơi này. Trang được thiết kế với giao diện hiện đại, responsive và đầy đủ chức năng.

## Tính năng chính

### 🌟 Hiển thị danh sách yêu thích

- **Grid View**: Hiển thị dạng lưới với cards chi tiết
- **List View**: Hiển thị dạng danh sách compact
- **Responsive**: Tự động điều chỉnh layout trên mobile

### 🔍 Tìm kiếm và lọc

- Tìm kiếm theo tên thành phố hoặc quốc gia
- Real-time filtering khi người dùng gõ
- Clear search với nút X

### 🔄 Cập nhật thời tiết

- Nút refresh để cập nhật thời tiết mới nhất
- Loading spinner và progress indicator
- Thông báo khi cập nhật thành công

### ❤️ Quản lý danh sách

- Xóa địa điểm khỏi danh sách yêu thích
- Undo action với Snackbar
- Confirmation và feedback cho user

## Cấu trúc giao diện

### 1. Header Section

```html
<div class="favorites-header">
  <div class="header-content">
    <div class="title-section">
      <h1>Địa điểm yêu thích</h1>
      <p>Theo dõi thời tiết tại X địa điểm</p>
    </div>

    <div class="header-actions">
      <button>Thêm địa điểm</button>
      <button>Refresh</button>
    </div>
  </div>
</div>
```

**Đặc điểm:**

- Gradient background (pink to red)
- Responsive actions layout
- Dynamic count display
- Spinning refresh icon khi loading

### 2. Search & Controls

```html
<div class="search-controls">
  <mat-form-field class="search-field">
    <input placeholder="Tìm kiếm địa điểm" />
  </mat-form-field>

  <mat-button-toggle-group>
    <mat-button-toggle value="grid">Grid</mat-button-toggle>
    <mat-button-toggle value="list">List</mat-button-toggle>
  </mat-button-toggle-group>
</div>
```

**Chức năng:**

- Angular Reactive Forms với FormControl
- Material Design form field
- Toggle button group cho view modes

### 3. Weather Cards (Grid View)

```html
<mat-card class="weather-card">
  <mat-card-header>
    <mat-card-title>Hà Nội</mat-card-title>
    <mat-card-subtitle>Việt Nam</mat-card-subtitle>
    <button class="remove-btn">❤️</button>
  </mat-card-header>

  <mat-card-content>
    <div class="main-weather">
      <div class="temperature-section">28°</div>
      <div class="weather-icon-section">☀️</div>
    </div>

    <div class="weather-details">
      <!-- Chi tiết thời tiết -->
    </div>
  </mat-card-content>

  <mat-card-actions>
    <button>Chi tiết</button>
    <button>Xóa</button>
  </mat-card-actions>
</mat-card>
```

**Hiển thị:**

- **Temperature**: Màu động theo nhiệt độ
- **Weather Details**: Độ ẩm, gió, áp suất, tầm nhìn, UV Index
- **Last Updated**: Thời gian cập nhật gần nhất
- **Hover Effects**: Transform và shadow

### 4. Weather List (List View)

```html
<mat-card class="list-item">
  <div class="list-content">
    <div class="location-info">
      <h3>Tokyo</h3>
      <p>Nhật Bản</p>
    </div>

    <div class="weather-summary">
      <mat-icon>☀️</mat-icon>
      <div class="temperature-info">
        <span>24°C</span>
        <span>Có mây</span>
      </div>
    </div>

    <div class="quick-stats">
      <div>💧 60%</div>
      <div>💨 10 km/h</div>
    </div>

    <div class="list-actions">
      <button>ℹ️</button>
      <button>❤️</button>
    </div>
  </div>
</mat-card>
```

## Data Interface

```typescript
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
```

## Component Methods

### Core Functionality

```typescript
// Filtering
filterLocations(searchTerm: string)
trackByLocationId(index: number, location: FavoriteLocation)

// Actions
refreshWeather()
removeFromFavorites(locationId: string)
viewDetails(location: FavoriteLocation)
addNewLocation()
toggleViewMode()

// Utilities
getTemperatureColor(temp: number): string
getWeatherIcon(icon: string): string
formatLastUpdated(date: Date): string
```

### State Management

```typescript
// Signals (Angular 17+)
favoriteLocations = signal<FavoriteLocation[]>([]);
filteredLocations = signal<FavoriteLocation[]>([]);
isLoading = signal(false);
viewMode = signal<"grid" | "list">("grid");

// Form Control
searchControl = new FormControl("");
```

## Styling Architecture

### Color Scheme

- **Primary**: Blue (#1976d2)
- **Accent**: Pink gradient (#f093fb to #f5576c)
- **Temperature Colors**:
  - Cold (≤10°C): Blue (#2196F3)
  - Cool (≤20°C): Green (#4CAF50)
  - Warm (≤30°C): Orange (#FF9800)
  - Hot (>30°C): Red (#F44336)

### Responsive Breakpoints

- **Desktop** (>768px): Full grid layout
- **Tablet** (768px): Adjusted grid and layout
- **Mobile** (≤480px): Single column, stacked elements

### Animations

```scss
// Hover effects
.weather-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
}

// Loading spinner
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

// Card entrance
@keyframes slideUp {
  from {
    transform: translateY(30px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
```

## User Experience Features

### 1. Loading States

- Spinner khi đang refresh weather
- Disabled buttons during operations
- Progress feedback

### 2. Empty States

- Illustration khi không có favorites
- Call-to-action để thêm địa điểm
- Search empty state

### 3. Feedback & Notifications

- Success snackbar khi refresh
- Undo action khi xóa location
- Error handling với user-friendly messages

### 4. Accessibility

- Proper ARIA labels
- Keyboard navigation support
- Screen reader friendly
- High contrast colors

## Integration Points

### 1. Weather API

```typescript
// Future integration với weather service
weatherService.getWeatherByLocation(coordinates);
weatherService.refreshAllLocations(locations);
```

### 2. Local Storage

```typescript
// Persist favorites locally
localStorage.setItem("favorites", JSON.stringify(locations));
```

### 3. User Preferences

```typescript
// Save view mode preference
userPreferences.viewMode = "grid" | "list";
```

## Performance Optimization

### 1. TrackBy Functions

```typescript
trackByLocationId(index: number, location: FavoriteLocation) {
  return location.id; // Prevents unnecessary re-renders
}
```

### 2. OnPush Change Detection

```typescript
// Future optimization
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush
})
```

### 3. Virtual Scrolling

```typescript
// For large lists (future enhancement)
<cdk-virtual-scroll-viewport>
  <div *cdkVirtualFor="let location of locations">
    <!-- Location card -->
  </div>
</cdk-virtual-scroll-viewport>
```

## Testing Strategy

### Unit Tests

```typescript
// Component logic
describe("FavoritesComponent", () => {
  it("should filter locations by search term");
  it("should remove location from favorites");
  it("should toggle view mode");
  it("should format last updated time correctly");
});
```

### Integration Tests

```typescript
// User interactions
describe("Favorites Integration", () => {
  it("should search and find locations");
  it("should refresh weather data");
  it("should handle empty states");
});
```

## Future Enhancements

### Planned Features

- [ ] Drag & drop reordering
- [ ] Location grouping/categories
- [ ] Weather alerts & notifications
- [ ] Detailed weather forecast modal
- [ ] Export/import favorites
- [ ] Offline mode support

### Technical Improvements

- [ ] Virtual scrolling for performance
- [ ] PWA features (push notifications)
- [ ] Advanced filtering options
- [ ] Weather data caching strategy
- [ ] Real-time weather updates (WebSocket)

## Deployment Notes

### Build Optimization

```bash
ng build --configuration production
# Enables tree shaking, minification, and optimization
```

### Bundle Analysis

```bash
ng build --configuration production --stats-json
npm install -g webpack-bundle-analyzer
webpack-bundle-analyzer dist/weather-app/stats.json
```

---

## Kết luận

Trang Favorites được thiết kế để mang lại trải nghiệm người dùng tốt nhất với:

- **Giao diện đẹp và hiện đại**
- **Responsive design hoàn hảo**
- **Chức năng đầy đủ và intuitive**
- **Performance tối ưu**
- **Accessibility compliant**

Trang này là foundation tốt để mở rộng thêm các tính năng weather app trong tương lai.
