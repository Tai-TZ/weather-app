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

interface City {
  id: string;
  name: string;
  country: string;
  region: string;
  population: number;
  coordinates: {
    lat: number;
    lon: number;
  };
  timezone: string;
  weatherStationId?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

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

@Component({
  selector: 'app-admin-cities',
  standalone: true,
  imports: [CommonModule, MaterialModule, ReactiveFormsModule],
  templateUrl: './admin-cities.component.html',
  styleUrls: ['./admin-cities.component.scss']
})
export class AdminCitiesComponent {
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // State signals
  isLoading = signal(false);
  selectedCity = signal<City | null>(null);
  searchTerm = signal('');
  filterActive = signal<boolean | null>(null);

  // Table configuration
  displayedColumns: string[] = [
    'select',
    'name',
    'country',
    'region',
    'population',
    'coordinates',
    'timezone',
    'isActive',
    'actions'
  ];

  dataSource = new MatTableDataSource<City>([]);
  selection = new SelectionModel<City>(true, []);

  // Forms
  cityForm!: FormGroup;
  searchForm!: FormGroup;

  // Mock data - sẽ được thay thế bằng API service
  cities = signal<City[]>([
    {
      id: '1',
      name: 'Hà Nội',
      country: 'Việt Nam',
      region: 'Miền Bắc',
      population: 8053663,
      coordinates: { lat: 21.0285, lon: 105.8542 },
      timezone: 'Asia/Ho_Chi_Minh',
      weatherStationId: 'VN001',
      isActive: true,
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2024-01-01')
    },
    {
      id: '2',
      name: 'Hồ Chí Minh',
      country: 'Việt Nam',
      region: 'Miền Nam',
      population: 9420900,
      coordinates: { lat: 10.8231, lon: 106.6297 },
      timezone: 'Asia/Ho_Chi_Minh',
      weatherStationId: 'VN002',
      isActive: true,
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2024-01-01')
    },
    {
      id: '3',
      name: 'Đà Nẵng',
      country: 'Việt Nam',
      region: 'Miền Trung',
      population: 1230000,
      coordinates: { lat: 16.0544, lon: 108.2022 },
      timezone: 'Asia/Ho_Chi_Minh',
      weatherStationId: 'VN003',
      isActive: true,
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2024-01-01')
    },
    {
      id: '4',
      name: 'Tokyo',
      country: 'Nhật Bản',
      region: 'Kanto',
      population: 37400068,
      coordinates: { lat: 35.6762, lon: 139.6503 },
      timezone: 'Asia/Tokyo',
      weatherStationId: 'JP001',
      isActive: true,
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2024-01-01')
    },
    {
      id: '5',
      name: 'New York',
      country: 'Hoa Kỳ',
      region: 'New York',
      population: 8336817,
      coordinates: { lat: 40.7128, lon: -74.0060 },
      timezone: 'America/New_York',
      weatherStationId: 'US001',
      isActive: true,
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2024-01-01')
    },
    {
      id: '6',
      name: 'London',
      country: 'Anh',
      region: 'England',
      population: 9648110,
      coordinates: { lat: 51.5074, lon: -0.1278 },
      timezone: 'Europe/London',
      weatherStationId: 'UK001',
      isActive: false,
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2024-01-01')
    }
  ]);

  constructor() {
    this.initializeForms();
    this.loadCities();
    this.setupSearch();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  private initializeForms() {
    this.cityForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      country: ['', [Validators.required]],
      region: ['', [Validators.required]],
      population: [0, [Validators.required, Validators.min(1)]],
      lat: [0, [Validators.required, Validators.min(-90), Validators.max(90)]],
      lon: [0, [Validators.required, Validators.min(-180), Validators.max(180)]],
      timezone: ['', [Validators.required]],
      weatherStationId: [''],
      isActive: [true]
    });

    this.searchForm = this.fb.group({
      searchTerm: [''],
      filterActive: [null]
    });
  }

  private setupSearch() {
    this.searchForm.get('searchTerm')?.valueChanges.subscribe(value => {
      this.searchTerm.set(value || '');
      this.applyFilter();
    });

    this.searchForm.get('filterActive')?.valueChanges.subscribe(value => {
      this.filterActive.set(value);
      this.applyFilter();
    });
  }

  private loadCities() {
    this.dataSource.data = this.cities();
  }

  private applyFilter() {
    const searchTerm = this.searchTerm().toLowerCase();
    const activeFilter = this.filterActive();

    this.dataSource.filterPredicate = (data: City) => {
      const matchesSearch = !searchTerm ||
        data.name.toLowerCase().includes(searchTerm) ||
        data.country.toLowerCase().includes(searchTerm) ||
        data.region.toLowerCase().includes(searchTerm);

      const matchesActive = activeFilter === null || data.isActive === activeFilter;

      return matchesSearch && matchesActive;
    };

    this.dataSource.filter = Math.random().toString(); // Trigger filter
  }

  // CRUD Operations
  openAddDialog() {
    this.selectedCity.set(null);
    this.cityForm.reset({
      name: '',
      country: '',
      region: '',
      population: 0,
      lat: 0,
      lon: 0,
      timezone: '',
      weatherStationId: '',
      isActive: true
    });
  }

  openEditDialog(city: City) {
    this.selectedCity.set(city);
    this.cityForm.patchValue({
      name: city.name,
      country: city.country,
      region: city.region,
      population: city.population,
      lat: city.coordinates.lat,
      lon: city.coordinates.lon,
      timezone: city.timezone,
      weatherStationId: city.weatherStationId || '',
      isActive: city.isActive
    });
  }

  saveCity() {
    if (this.cityForm.valid) {
      this.isLoading.set(true);

      const formData: CityFormData = this.cityForm.value;
      const now = new Date();

      if (this.selectedCity()) {
        // Update existing city
        this.updateCity(this.selectedCity()!.id, formData);
      } else {
        // Create new city
        this.createCity(formData);
      }
    } else {
      this.snackBar.open('Vui lòng kiểm tra lại thông tin!', 'Đóng', {
        duration: 3000
      });
    }
  }

  private createCity(formData: CityFormData) {
    setTimeout(() => {
      const newCity: City = {
        id: Date.now().toString(),
        name: formData.name,
        country: formData.country,
        region: formData.region,
        population: formData.population,
        coordinates: {
          lat: formData.lat,
          lon: formData.lon
        },
        timezone: formData.timezone,
        weatherStationId: formData.weatherStationId,
        isActive: formData.isActive,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      this.cities.update(cities => [...cities, newCity]);
      this.loadCities();
      this.isLoading.set(false);
      this.selectedCity.set(null);

      this.snackBar.open('Đã thêm thành phố mới!', 'Đóng', {
        duration: 3000
      });
    }, 1500);
  }

  private updateCity(id: string, formData: CityFormData) {
    setTimeout(() => {
      this.cities.update(cities =>
        cities.map(city =>
          city.id === id
            ? {
              ...city,
              name: formData.name,
              country: formData.country,
              region: formData.region,
              population: formData.population,
              coordinates: {
                lat: formData.lat,
                lon: formData.lon
              },
              timezone: formData.timezone,
              weatherStationId: formData.weatherStationId,
              isActive: formData.isActive,
              updatedAt: new Date()
            }
            : city
        )
      );

      this.loadCities();
      this.isLoading.set(false);
      this.selectedCity.set(null);

      this.snackBar.open('Đã cập nhật thành phố!', 'Đóng', {
        duration: 3000
      });
    }, 1500);
  }

  deleteCity(city: City) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Xác nhận xóa',
        message: `Bạn có chắc chắn muốn xóa thành phố "${city.name}"?`,
        confirmText: 'Xóa',
        cancelText: 'Hủy'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.performDelete(city.id);
      }
    });
  }

  private performDelete(id: string) {
    this.isLoading.set(true);

    setTimeout(() => {
      const deletedCity = this.cities().find(c => c.id === id);
      this.cities.update(cities => cities.filter(city => city.id !== id));
      this.loadCities();
      this.isLoading.set(false);

      this.snackBar.open(`Đã xóa thành phố "${deletedCity?.name}"`, 'Hoàn tác', {
        duration: 5000
      }).onAction().subscribe(() => {
        // Restore city
        if (deletedCity) {
          this.cities.update(cities => [...cities, deletedCity]);
          this.loadCities();
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
        message: `Bạn có chắc chắn muốn xóa ${this.selection.selected.length} thành phố đã chọn?`,
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
    const idsToDelete = this.selection.selected.map(city => city.id);
    this.isLoading.set(true);

    setTimeout(() => {
      this.cities.update(cities =>
        cities.filter(city => !idsToDelete.includes(city.id))
      );
      this.loadCities();
      this.selection.clear();
      this.isLoading.set(false);

      this.snackBar.open(`Đã xóa ${idsToDelete.length} thành phố`, 'Đóng', {
        duration: 3000
      });
    }, 1500);
  }

  bulkToggleStatus() {
    if (this.selection.selected.length === 0) return;

    this.isLoading.set(true);

    setTimeout(() => {
      const selectedIds = this.selection.selected.map(city => city.id);

      this.cities.update(cities =>
        cities.map(city =>
          selectedIds.includes(city.id)
            ? { ...city, isActive: !city.isActive, updatedAt: new Date() }
            : city
        )
      );

      this.loadCities();
      this.selection.clear();
      this.isLoading.set(false);

      this.snackBar.open('Đã cập nhật trạng thái các thành phố', 'Đóng', {
        duration: 3000
      });
    }, 1000);
  }

  // Utility methods
  formatCoordinates(lat: number, lon: number): string {
    return `${lat.toFixed(4)}, ${lon.toFixed(4)}`;
  }

  formatPopulation(population: number): string {
    return population.toLocaleString('vi-VN');
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString('vi-VN');
  }

  getFormError(fieldName: string): string {
    const field = this.cityForm.get(fieldName);

    if (field?.errors && field.touched) {
      if (field.errors['required']) return 'Trường này là bắt buộc';
      if (field.errors['minlength']) return `Tối thiểu ${field.errors['minlength'].requiredLength} ký tự`;
      if (field.errors['min']) return `Giá trị tối thiểu là ${field.errors['min'].min}`;
      if (field.errors['max']) return `Giá trị tối đa là ${field.errors['max'].max}`;
    }
    return '';
  }

  exportData() {
    const dataToExport = this.dataSource.filteredData.map(city => ({
      'Tên thành phố': city.name,
      'Quốc gia': city.country,
      'Vùng/Khu vực': city.region,
      'Dân số': city.population,
      'Vĩ độ': city.coordinates.lat,
      'Kinh độ': city.coordinates.lon,
      'Múi giờ': city.timezone,
      'Trạng thái': city.isActive ? 'Hoạt động' : 'Không hoạt động',
      'Ngày tạo': this.formatDate(city.createdAt),
      'Cập nhật cuối': this.formatDate(city.updatedAt)
    }));

    const csvContent = this.convertToCSV(dataToExport);
    this.downloadCSV(csvContent, 'cities-export.csv');

    this.snackBar.open('Đã xuất dữ liệu thành công!', 'Đóng', {
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
    this.selectedCity.set(null);
    this.cityForm.reset();
  }
}

// Confirm Dialog Component (sẽ được tạo riêng)
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

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
