# Trang Admin Cities - Weather App

## Tổng quan

Trang **Admin Cities** (`/admin/cities`) là module quản lý thành phố trong hệ thống admin, cho phép admin thực hiện các thao tác CRUD (Create, Read, Update, Delete) đối với danh sách thành phố trong cơ sở dữ liệu.

## Tính năng chính

### 🏙️ Quản lý thành phố

- **Thêm thành phố mới**: Form đầy đủ với validation
- **Chỉnh sửa thông tin**: Cập nhật dữ liệu thành phố
- **Xóa thành phố**: Với confirmation và undo function
- **Kích hoạt/Vô hiệu hóa**: Toggle trạng thái thành phố

### 📊 Data Table Management

- **Material Data Table**: Với sorting, pagination, filtering
- **Multi-select**: Checkbox để chọn nhiều items
- **Bulk operations**: Xóa/cập nhật nhiều thành phố cùng lúc
- **Responsive table**: Hiển thị tối ưu trên mọi thiết bị

### 🔍 Search & Filter

- **Real-time search**: Tìm kiếm theo tên, quốc gia, vùng
- **Status filter**: Lọc theo trạng thái hoạt động
- **Instant results**: Kết quả hiển thị ngay khi gõ

### 📤 Data Export

- **CSV Export**: Xuất dữ liệu ra file CSV
- **Filtered data**: Chỉ xuất dữ liệu đã được lọc
- **Vietnamese headers**: Tiêu đề bằng tiếng Việt

## Cấu trúc giao diện

### 1. Page Header

```html
<div class="page-header">
  <div class="header-content">
    <div class="title-section">
      <h1>🏙️ Quản lý thành phố</h1>
      <p>Quản lý danh sách các thành phố và thông tin địa lý</p>
    </div>

    <div class="header-actions">
      <button>➕ Thêm thành phố</button>
      <button>📥 Xuất dữ liệu</button>
    </div>
  </div>
</div>
```

**Đặc điểm:**

- Admin gradient theme (red-orange)
- Responsive action buttons
- Clear title and description

### 2. Search & Filter Controls

```html
<mat-card class="search-card">
  <form [formGroup]="searchForm">
    <div class="search-controls">
      <mat-form-field class="search-field">
        <input placeholder="Tìm kiếm thành phố..." />
        <mat-icon matPrefix>🔍</mat-icon>
      </mat-form-field>

      <mat-form-field class="filter-field">
        <mat-select placeholder="Trạng thái">
          <mat-option value="all">Tất cả</mat-option>
          <mat-option value="active">Hoạt động</mat-option>
          <mat-option value="inactive">Không hoạt động</mat-option>
        </mat-select>
      </mat-form-field>
    </div>
  </form>
</mat-card>
```

### 3. Bulk Actions Bar

```html
<div class="bulk-actions" *ngIf="selection.selected.length > 0">
  <mat-card>
    <div class="bulk-actions-content">
      <span>Đã chọn {{ selection.selected.length }} thành phố</span>

      <div class="bulk-buttons">
        <button (click)="bulkToggleStatus()">🔄 Đổi trạng thái</button>
        <button (click)="bulkDelete()">🗑️ Xóa đã chọn</button>
      </div>
    </div>
  </mat-card>
</div>
```

### 4. Data Table

```html
<mat-table [dataSource]="dataSource" matSort>
  <!-- Checkbox Column -->
  <ng-container matColumnDef="select">
    <th><mat-checkbox></mat-checkbox></th>
    <td><mat-checkbox></mat-checkbox></td>
  </ng-container>

  <!-- Data Columns -->
  <ng-container matColumnDef="name">
    <th mat-sort-header>Tên thành phố</th>
    <td>
      <div class="city-name">
        <strong>{{ city.name }}</strong>
        <span class="weather-station">ID: {{ city.weatherStationId }}</span>
      </div>
    </td>
  </ng-container>

  <!-- Actions Column -->
  <ng-container matColumnDef="actions">
    <th>Thao tác</th>
    <td>
      <button mat-icon-button (click)="editCity()">✏️</button>
      <button mat-icon-button (click)="deleteCity()">🗑️</button>
    </td>
  </ng-container>
</mat-table>
```

**Table Features:**

- **Sortable columns**: Tên, quốc gia, vùng, dân số, trạng thái
- **Pagination**: 5, 10, 20, 50 items per page
- **Row selection**: Multi-select với checkbox
- **Action buttons**: Edit, Delete cho mỗi row

### 5. Add/Edit Form Dialog

```html
<div class="form-dialog">
  <mat-card class="form-card">
    <mat-card-header>
      <mat-card-title> {{ selectedCity ? 'Chỉnh sửa' : 'Thêm' }} thành phố </mat-card-title>
    </mat-card-header>

    <form [formGroup]="cityForm">
      <div class="form-grid">
        <!-- Basic Information -->
        <div class="form-section">
          <h3>Thông tin cơ bản</h3>
          <mat-form-field>
            <input matInput placeholder="Tên thành phố" formControlName="name" />
          </mat-form-field>
          <!-- More fields... -->
        </div>

        <!-- Geographic Information -->
        <div class="form-section">
          <h3>Thông tin địa lý</h3>
          <mat-form-field>
            <input matInput type="number" placeholder="Vĩ độ" formControlName="lat" />
          </mat-form-field>
          <!-- More fields... -->
        </div>
      </div>
    </form>
  </mat-card>
</div>
```

## Data Model & Interfaces

### City Interface

```typescript
interface City {
  id: string; // Unique identifier
  name: string; // Tên thành phố
  country: string; // Quốc gia
  region: string; // Vùng/Khu vực
  population: number; // Dân số
  coordinates: {
    // Tọa độ địa lý
    lat: number; // Vĩ độ (-90 to 90)
    lon: number; // Kinh độ (-180 to 180)
  };
  timezone: string; // Múi giờ (ví dụ: Asia/Ho_Chi_Minh)
  weatherStationId?: string; // ID trạm thời tiết (tùy chọn)
  isActive: boolean; // Trạng thái hoạt động
  createdAt: Date; // Ngày tạo
  updatedAt: Date; // Ngày cập nhật cuối
}
```

### Form Data Interface

```typescript
interface CityFormData {
  name: string;
  country: string;
  region: string;
  population: number;
  lat: number;
  lon: number;
  timezone: string;
  weatherStationId?: string;
  isActive: boolean;
}
```

## Component Architecture

### Core Methods

#### CRUD Operations

```typescript
// Create
openAddDialog(): void                           // Mở dialog thêm mới
createCity(formData: CityFormData): void       // Tạo thành phố mới

// Read
loadCities(): void                             // Load danh sách thành phố
applyFilter(): void                            // Apply search/filter

// Update
openEditDialog(city: City): void               // Mở dialog chỉnh sửa
updateCity(id: string, formData: CityFormData): void  // Cập nhật thành phố

// Delete
deleteCity(city: City): void                   // Xóa một thành phố
performDelete(id: string): void                // Thực hiện xóa
```

#### Bulk Operations

```typescript
toggleSelectAll(): void                        // Chọn/bỏ chọn tất cả
isAllSelected(): boolean                       // Kiểm tra đã chọn tất cả
bulkDelete(): void                             // Xóa nhiều thành phố
bulkToggleStatus(): void                       // Đổi trạng thái nhiều thành phố
```

#### Utility Methods

```typescript
formatCoordinates(lat: number, lon: number): string    // Format tọa độ
formatPopulation(population: number): string           // Format dân số
formatDate(date: Date): string                         // Format ngày tháng
getFormError(fieldName: string): string               // Lấy lỗi validation
exportData(): void                                     // Xuất dữ liệu CSV
```

### State Management

```typescript
// Signals (Angular 17+)
isLoading = signal(false); // Trạng thái loading
selectedCity = signal<City | null>(null); // Thành phố đang chọn
searchTerm = signal(""); // Từ khóa tìm kiếm
filterActive = signal<boolean | null>(null); // Filter trạng thái
cities = signal<City[]>([]); // Danh sách thành phố

// Material Table
dataSource = new MatTableDataSource<City>([]); // Data source cho table
selection = new SelectionModel<City>(true, []); // Multi-selection model

// Forms
cityForm: FormGroup; // Form thêm/sửa thành phố
searchForm: FormGroup; // Form tìm kiếm
```

## Form Validation

### Validation Rules

```typescript
cityForm = this.fb.group({
  name: ["", [Validators.required, Validators.minLength(2)]],
  country: ["", [Validators.required]],
  region: ["", [Validators.required]],
  population: [0, [Validators.required, Validators.min(1)]],
  lat: [0, [Validators.required, Validators.min(-90), Validators.max(90)]],
  lon: [0, [Validators.required, Validators.min(-180), Validators.max(180)]],
  timezone: ["", [Validators.required]],
  weatherStationId: [""], // Optional
  isActive: [true],
});
```

### Error Messages (Tiếng Việt)

- **required**: "Trường này là bắt buộc"
- **minlength**: "Tối thiểu X ký tự"
- **min/max**: "Giá trị phải từ X đến Y"
- **Custom validation**: Specific rules cho coordinates, timezone

## Styling Architecture

### Color Scheme

```scss
// Admin theme colors
$admin-primary: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
$admin-card-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
$admin-hover-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);

// Status colors
$active-color: #e8f5e8; // Light green
$inactive-color: #ffebee; // Light red
$text-active: #2e7d32; // Dark green
$text-inactive: #c62828; // Dark red
```

### Layout Structure

```scss
// Container
.admin-cities-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 16px;
}

// Header
.page-header {
  background: $admin-primary;
  border-radius: 0 0 20px 20px;
  color: white;
  margin: -20px -16px 24px -16px;
}

// Data table
.table-card {
  border-radius: 12px;
  box-shadow: $admin-card-shadow;

  .cities-table {
    .mat-mdc-row:hover {
      background-color: #f8f9fa;
    }
  }
}

// Form dialog
.form-dialog {
  position: fixed;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;

  .form-card {
    max-width: 800px;
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  }
}
```

### Responsive Design

```scss
// Desktop (>768px): Full layout
// Tablet (≤768px): Adjusted spacing
@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
  }

  .search-controls {
    flex-direction: column;
  }
}

// Mobile (≤480px): Stacked layout
@media (max-width: 480px) {
  .header-actions {
    flex-direction: column;
  }

  .bulk-buttons button {
    width: 100%;
  }
}
```

## User Experience Features

### 1. Loading States

```typescript
// Button loading
<button [disabled]="isLoading()">
  <mat-icon *ngIf="isLoading()">refresh</mat-icon>
  {{ isLoading() ? 'Đang lưu...' : 'Lưu' }}
</button>

// Overlay loading
<div class="loading-overlay" *ngIf="isLoading()">
  <mat-spinner></mat-spinner>
</div>
```

### 2. User Feedback

```typescript
// Success messages
this.snackBar.open("Đã thêm thành phố mới!", "Đóng", {
  duration: 3000,
});

// Undo functionality
this.snackBar
  .open("Đã xóa thành phố", "Hoàn tác", {
    duration: 5000,
  })
  .onAction()
  .subscribe(() => {
    // Restore deleted item
  });

// Confirmation dialogs
const dialogRef = this.dialog.open(ConfirmDialogComponent, {
  data: {
    title: "Xác nhận xóa",
    message: "Bạn có chắc chắn muốn xóa?",
  },
});
```

### 3. Form UX

- **Progressive disclosure**: Sections với clear titles
- **Inline validation**: Real-time error display
- **Smart defaults**: Active = true, population = 0
- **Clear error messages**: Vietnamese error text

### 4. Table UX

- **Hover effects**: Row highlighting
- **Sort indicators**: Visual sort direction
- **Empty states**: Helpful messages when no data
- **Mobile optimization**: Responsive column display

## Data Operations

### CSV Export Format

```csv
Tên thành phố,Quốc gia,Vùng/Khu vực,Dân số,Vĩ độ,Kinh độ,Múi giờ,Trạng thái,Ngày tạo,Cập nhật cuối
Hà Nội,Việt Nam,Miền Bắc,8053663,21.0285,105.8542,Asia/Ho_Chi_Minh,Hoạt động,01/01/2023,01/01/2024
```

### Search Algorithm

```typescript
dataSource.filterPredicate = (data: City) => {
  const matchesSearch = !searchTerm || data.name.toLowerCase().includes(searchTerm) || data.country.toLowerCase().includes(searchTerm) || data.region.toLowerCase().includes(searchTerm);

  const matchesActive = activeFilter === null || data.isActive === activeFilter;

  return matchesSearch && matchesActive;
};
```

## Performance Optimization

### 1. Efficient Filtering

```typescript
// Real-time search với debounce
this.searchForm
  .get("searchTerm")
  ?.valueChanges.pipe(debounceTime(300), distinctUntilChanged())
  .subscribe((value) => {
    this.applyFilter();
  });
```

### 2. ViewChild Optimization

```typescript
@ViewChild(MatPaginator) paginator!: MatPaginator;
@ViewChild(MatSort) sort!: MatSort;

ngAfterViewInit() {
  this.dataSource.paginator = this.paginator;
  this.dataSource.sort = this.sort;
}
```

### 3. Change Detection

```typescript
// Signals cho reactive updates
cities = signal<City[]>([]);

// Efficient table updates
this.cities.update((cities) => cities.map((city) => (city.id === id ? { ...city, ...updates } : city)));
```

## Testing Strategy

### Unit Tests

```typescript
describe("AdminCitiesComponent", () => {
  it("should create city", () => {
    component.createCity(mockCityData);
    expect(component.cities().length).toBe(1);
  });

  it("should filter cities by search term", () => {
    component.searchTerm.set("Hanoi");
    component.applyFilter();
    expect(component.dataSource.filteredData.length).toBe(1);
  });

  it("should validate form fields", () => {
    component.cityForm.patchValue({ name: "" });
    expect(component.cityForm.get("name")?.invalid).toBe(true);
  });
});
```

### Integration Tests

```typescript
describe("Admin Cities Integration", () => {
  it("should open add dialog", () => {
    component.openAddDialog();
    expect(component.selectedCity()).toBeNull();
    expect(component.cityForm.pristine).toBe(true);
  });

  it("should perform bulk delete", async () => {
    component.selection.select(mockCity1, mockCity2);
    component.bulkDelete();
    // Verify confirmation dialog
    // Verify deletion
  });
});
```

## API Integration Points

### Future Service Integration

```typescript
interface CityService {
  getCities(): Observable<City[]>;
  getCity(id: string): Observable<City>;
  createCity(city: CityFormData): Observable<City>;
  updateCity(id: string, city: CityFormData): Observable<City>;
  deleteCity(id: string): Observable<void>;
  bulkDelete(ids: string[]): Observable<void>;
  exportCities(): Observable<Blob>;
}
```

### Error Handling

```typescript
createCity(formData: CityFormData) {
  this.cityService.createCity(formData).subscribe({
    next: (city) => {
      this.cities.update(cities => [...cities, city]);
      this.snackBar.open('Đã thêm thành phố!', 'Đóng');
    },
    error: (error) => {
      this.snackBar.open('Lỗi: ' + error.message, 'Đóng');
    }
  });
}
```

## Security Considerations

### 1. Input Validation

- **Client-side**: Angular Validators
- **Server-side**: API validation required
- **Sanitization**: Prevent XSS attacks

### 2. Permission Checks

```typescript
// Future implementation
@Injectable()
export class AdminGuard {
  canActivate(): boolean {
    return this.authService.hasRole("admin");
  }
}
```

### 3. Data Protection

- **CSRF protection**: Required for state changes
- **Rate limiting**: Prevent bulk operation abuse
- **Audit logging**: Track admin actions

## Deployment & Monitoring

### Build Optimization

```bash
ng build --configuration production
# Enables: tree shaking, minification, compression
```

### Performance Monitoring

```typescript
// Track user actions
analytics.track("admin_city_created", {
  cityName: city.name,
  country: city.country,
});

// Monitor performance
performance.mark("cities-table-render-start");
// ... render table
performance.mark("cities-table-render-end");
```

## Future Enhancements

### Planned Features

- [ ] Advanced search với multiple filters
- [ ] Bulk import từ CSV/Excel files
- [ ] Map integration để chọn coordinates
- [ ] Weather data preview cho thành phố
- [ ] City templates cho quick add
- [ ] Activity log và audit trail

### Technical Improvements

- [ ] Virtual scrolling cho large datasets
- [ ] Offline support với Service Worker
- [ ] Real-time updates với WebSocket
- [ ] Advanced caching strategies
- [ ] Progressive Web App features

---

## Kết luận

Trang Admin Cities cung cấp một interface toàn diện để quản lý dữ liệu thành phố với:

- **Complete CRUD operations** với validation đầy đủ
- **Modern Material Design** với admin theme
- **Responsive layout** hoạt động mượt mà trên mọi thiết bị
- **Efficient data management** với search, filter, bulk operations
- **Excellent UX** với loading states, confirmations, undo actions
- **Performance optimized** với signals và efficient change detection

Đây là foundation vững chắc cho việc mở rộng thêm các module admin khác trong hệ thống!
