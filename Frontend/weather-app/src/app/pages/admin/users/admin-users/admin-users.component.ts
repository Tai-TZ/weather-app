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

interface User {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  fullName: string;
  avatar?: string;
  phone?: string;
  role: 'super_admin' | 'admin' | 'user' | 'moderator';
  status: 'active' | 'inactive' | 'suspended' | 'pending';
  emailVerified: boolean;
  phoneVerified: boolean;
  lastLogin: Date | null;
  loginCount: number;
  createdAt: Date;
  updatedAt: Date;
  lastActiveAt: Date;
  location?: string;
  timezone?: string;
  preferences: {
    language: string;
    theme: 'light' | 'dark' | 'auto';
    notifications: boolean;
  };
}

interface UserFormData {
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: 'super_admin' | 'admin' | 'user' | 'moderator';
  status: 'active' | 'inactive' | 'suspended' | 'pending';
  location?: string;
  timezone?: string;
  language: string;
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
}

interface UserStats {
  totalUsers: number;
  activeUsers: number;
  newUsersToday: number;
  newUsersThisWeek: number;
  suspendedUsers: number;
  pendingUsers: number;
  onlineUsers: number;
  averageSessionTime: number;
  topLocations: Array<{ location: string; count: number }>;
  roleDistribution: Array<{ role: string; count: number; percentage: number }>;
}

interface Role {
  id: string;
  name: string;
  displayName: string;
  description: string;
  permissions: string[];
  color: string;
}

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, MaterialModule, ReactiveFormsModule],
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.scss']
})
export class AdminUsersComponent {
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // State signals
  isLoading = signal(false);
  selectedUser = signal<User | null>(null);
  searchTerm = signal('');
  filterRole = signal<string>('');
  filterStatus = signal<string>('');
  activeTab = signal(0);
  showUserDetails = signal(false);

  // Table configuration
  displayedColumns: string[] = [
    'select',
    'avatar',
    'user',
    'contact',
    'role',
    'status',
    'lastLogin',
    'loginCount',
    'createdAt',
    'actions'
  ];

  dataSource = new MatTableDataSource<User>([]);
  selection = new SelectionModel<User>(true, []);

  // Forms
  userForm: FormGroup = this.fb.group({});
  searchForm: FormGroup = this.fb.group({});

  // Available roles
  roles = signal<Role[]>([
    {
      id: 'super_admin',
      name: 'super_admin',
      displayName: 'Super Admin',
      description: 'Toàn quyền hệ thống',
      permissions: ['*'],
      color: '#f44336'
    },
    {
      id: 'admin',
      name: 'admin',
      displayName: 'Admin',
      description: 'Quản trị viên',
      permissions: ['users:read', 'users:write', 'cities:*', 'weather:*'],
      color: '#ff9800'
    },
    {
      id: 'moderator',
      name: 'moderator',
      displayName: 'Moderator',
      description: 'Điều hành viên',
      permissions: ['users:read', 'weather:read', 'cities:read'],
      color: '#2196f3'
    },
    {
      id: 'user',
      name: 'user',
      displayName: 'User',
      description: 'Người dùng thông thường',
      permissions: ['profile:read', 'profile:write', 'weather:read'],
      color: '#4caf50'
    }
  ]);

  // User statistics
  userStats = signal<UserStats>({
    totalUsers: 1247,
    activeUsers: 892,
    newUsersToday: 23,
    newUsersThisWeek: 156,
    suspendedUsers: 12,
    pendingUsers: 8,
    onlineUsers: 147,
    averageSessionTime: 45, // minutes
    topLocations: [
      { location: 'Việt Nam', count: 456 },
      { location: 'United States', count: 234 },
      { location: 'Singapore', count: 123 },
      { location: 'Japan', count: 89 },
      { location: 'Thailand', count: 67 }
    ],
    roleDistribution: [
      { role: 'User', count: 1089, percentage: 87.3 },
      { role: 'Moderator', count: 95, percentage: 7.6 },
      { role: 'Admin', count: 51, percentage: 4.1 },
      { role: 'Super Admin', count: 12, percentage: 1.0 }
    ]
  });

  // Mock user data
  users = signal<User[]>([
    {
      id: '1',
      email: 'admin@weather.com',
      username: 'admin',
      firstName: 'Nguyễn',
      lastName: 'Quản Trị',
      fullName: 'Nguyễn Quản Trị',
      avatar: '',
      phone: '+84901234567',
      role: 'super_admin',
      status: 'active',
      emailVerified: true,
      phoneVerified: true,
      lastLogin: new Date(),
      loginCount: 1247,
      createdAt: new Date('2023-01-15'),
      updatedAt: new Date(),
      lastActiveAt: new Date(),
      location: 'Hà Nội, Việt Nam',
      timezone: 'Asia/Ho_Chi_Minh',
      preferences: {
        language: 'vi',
        theme: 'dark',
        notifications: true
      }
    },
    {
      id: '2',
      email: 'john.doe@example.com',
      username: 'johndoe',
      firstName: 'John',
      lastName: 'Doe',
      fullName: 'John Doe',
      avatar: '',
      phone: '+1234567890',
      role: 'admin',
      status: 'active',
      emailVerified: true,
      phoneVerified: false,
      lastLogin: new Date(Date.now() - 1000 * 60 * 30),
      loginCount: 456,
      createdAt: new Date('2023-03-22'),
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
      lastActiveAt: new Date(Date.now() - 1000 * 60 * 15),
      location: 'New York, USA',
      timezone: 'America/New_York',
      preferences: {
        language: 'en',
        theme: 'light',
        notifications: true
      }
    },
    {
      id: '3',
      email: 'moderator@weather.com',
      username: 'moderator',
      firstName: 'Trần',
      lastName: 'Điều Hành',
      fullName: 'Trần Điều Hành',
      avatar: '',
      phone: '+84987654321',
      role: 'moderator',
      status: 'active',
      emailVerified: true,
      phoneVerified: true,
      lastLogin: new Date(Date.now() - 1000 * 60 * 60 * 2),
      loginCount: 234,
      createdAt: new Date('2023-05-10'),
      updatedAt: new Date(Date.now() - 1000 * 60 * 60),
      lastActiveAt: new Date(Date.now() - 1000 * 60 * 45),
      location: 'TP.HCM, Việt Nam',
      timezone: 'Asia/Ho_Chi_Minh',
      preferences: {
        language: 'vi',
        theme: 'auto',
        notifications: false
      }
    },
    {
      id: '4',
      email: 'user@example.com',
      username: 'user123',
      firstName: 'Lê',
      lastName: 'Người Dùng',
      fullName: 'Lê Người Dùng',
      avatar: '',
      phone: '',
      role: 'user',
      status: 'active',
      emailVerified: true,
      phoneVerified: false,
      lastLogin: new Date(Date.now() - 1000 * 60 * 60 * 24),
      loginCount: 89,
      createdAt: new Date('2023-08-15'),
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 12),
      lastActiveAt: new Date(Date.now() - 1000 * 60 * 60 * 18),
      location: 'Đà Nẵng, Việt Nam',
      timezone: 'Asia/Ho_Chi_Minh',
      preferences: {
        language: 'vi',
        theme: 'light',
        notifications: true
      }
    },
    {
      id: '5',
      email: 'suspended@example.com',
      username: 'suspended_user',
      firstName: 'Bị',
      lastName: 'Khóa',
      fullName: 'Bị Khóa',
      avatar: '',
      phone: '+84123456789',
      role: 'user',
      status: 'suspended',
      emailVerified: false,
      phoneVerified: false,
      lastLogin: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
      loginCount: 12,
      createdAt: new Date('2023-11-01'),
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
      lastActiveAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
      location: 'Cần Thơ, Việt Nam',
      timezone: 'Asia/Ho_Chi_Minh',
      preferences: {
        language: 'vi',
        theme: 'light',
        notifications: false
      }
    }
  ]);

  constructor() {
    this.initializeForms();
    this.loadUsers();
    this.setupSearch();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  private initializeForms() {
    this.userForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      phone: [''],
      role: ['user', [Validators.required]],
      status: ['active', [Validators.required]],
      location: [''],
      timezone: ['Asia/Ho_Chi_Minh'],
      language: ['vi', [Validators.required]],
      theme: ['light', [Validators.required]],
      notifications: [true]
    });

    this.searchForm = this.fb.group({
      searchTerm: [''],
      filterRole: [''],
      filterStatus: ['']
    });
  }

  private setupSearch() {
    this.searchForm.get('searchTerm')?.valueChanges.subscribe(value => {
      this.searchTerm.set(value || '');
      this.applyFilter();
    });

    this.searchForm.get('filterRole')?.valueChanges.subscribe(value => {
      this.filterRole.set(value || '');
      this.applyFilter();
    });

    this.searchForm.get('filterStatus')?.valueChanges.subscribe(value => {
      this.filterStatus.set(value || '');
      this.applyFilter();
    });
  }

  private loadUsers() {
    this.dataSource.data = this.users();
    this.updateStats();
  }

  private applyFilter() {
    const searchTerm = this.searchTerm().toLowerCase();
    const roleFilter = this.filterRole();
    const statusFilter = this.filterStatus();

    this.dataSource.filterPredicate = (data: User, _filter: string): boolean => {
      const matchesSearch = !searchTerm ||
        data.fullName.toLowerCase().includes(searchTerm) ||
        data.email.toLowerCase().includes(searchTerm) ||
        data.username.toLowerCase().includes(searchTerm) ||
        (data.phone ? data.phone.includes(searchTerm) : false) ||
        (data.location ? data.location.toLowerCase().includes(searchTerm) : false);

      const matchesRole = !roleFilter || data.role === roleFilter;
      const matchesStatus = !statusFilter || data.status === statusFilter;

      return Boolean(matchesSearch && matchesRole && matchesStatus);
    };

    this.dataSource.filter = Math.random().toString();
  }

  // Tab management
  onTabChange(index: number) {
    this.activeTab.set(index);
  }

  // CRUD Operations
  openAddDialog() {
    this.selectedUser.set(null);
    this.userForm.reset({
      email: '',
      username: '',
      firstName: '',
      lastName: '',
      phone: '',
      role: 'user',
      status: 'active',
      location: '',
      timezone: 'Asia/Ho_Chi_Minh',
      language: 'vi',
      theme: 'light',
      notifications: true
    });
  }

  openEditDialog(user: User) {
    this.selectedUser.set(user);
    this.userForm.patchValue({
      email: user.email,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone || '',
      role: user.role,
      status: user.status,
      location: user.location || '',
      timezone: user.timezone || 'Asia/Ho_Chi_Minh',
      language: user.preferences.language,
      theme: user.preferences.theme,
      notifications: user.preferences.notifications
    });
  }

  saveUser() {
    if (this.userForm.valid) {
      this.isLoading.set(true);

      const formData: UserFormData = this.userForm.value;

      if (this.selectedUser()) {
        this.updateUser(this.selectedUser()!.id, formData);
      } else {
        this.createUser(formData);
      }
    } else {
      this.snackBar.open('Vui lòng kiểm tra lại thông tin!', 'Đóng', {
        duration: 3000
      });
    }
  }

  private createUser(formData: UserFormData) {
    setTimeout(() => {
      const newUser: User = {
        id: Date.now().toString(),
        email: formData.email,
        username: formData.username,
        firstName: formData.firstName,
        lastName: formData.lastName,
        fullName: `${formData.firstName} ${formData.lastName}`,
        avatar: '',
        phone: formData.phone,
        role: formData.role,
        status: formData.status,
        emailVerified: false,
        phoneVerified: false,
        lastLogin: null,
        loginCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        lastActiveAt: new Date(),
        location: formData.location,
        timezone: formData.timezone,
        preferences: {
          language: formData.language,
          theme: formData.theme,
          notifications: formData.notifications
        }
      };

      this.users.update(users => [...users, newUser]);
      this.loadUsers();
      this.isLoading.set(false);
      this.selectedUser.set(null);

      this.snackBar.open('Đã thêm người dùng mới!', 'Đóng', {
        duration: 3000
      });
    }, 1500);
  }

  private updateUser(id: string, formData: UserFormData) {
    setTimeout(() => {
      this.users.update(users =>
        users.map(user =>
          user.id === id
            ? {
              ...user,
              email: formData.email,
              username: formData.username,
              firstName: formData.firstName,
              lastName: formData.lastName,
              fullName: `${formData.firstName} ${formData.lastName}`,
              phone: formData.phone,
              role: formData.role,
              status: formData.status,
              location: formData.location,
              timezone: formData.timezone,
              preferences: {
                language: formData.language,
                theme: formData.theme,
                notifications: formData.notifications
              },
              updatedAt: new Date()
            }
            : user
        )
      );

      this.loadUsers();
      this.isLoading.set(false);
      this.selectedUser.set(null);

      this.snackBar.open('Đã cập nhật thông tin người dùng!', 'Đóng', {
        duration: 3000
      });
    }, 1500);
  }

  deleteUser(user: User) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Xác nhận xóa người dùng',
        message: `Bạn có chắc chắn muốn xóa người dùng "${user.fullName}"? Hành động này không thể hoàn tác.`,
        confirmText: 'Xóa',
        cancelText: 'Hủy'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.performDelete(user.id);
      }
    });
  }

  private performDelete(id: string) {
    this.isLoading.set(true);

    setTimeout(() => {
      const deletedUser = this.users().find(u => u.id === id);
      this.users.update(users => users.filter(user => user.id !== id));
      this.loadUsers();
      this.isLoading.set(false);

      this.snackBar.open(`Đã xóa người dùng "${deletedUser?.fullName}"`, 'Hoàn tác', {
        duration: 5000
      }).onAction().subscribe(() => {
        if (deletedUser) {
          this.users.update(users => [...users, deletedUser]);
          this.loadUsers();
        }
      });
    }, 1000);
  }

  // User status management
  toggleUserStatus(user: User) {
    const newStatus = user.status === 'active' ? 'inactive' : 'active';
    this.updateUserStatus(user.id, newStatus);
  }

  suspendUser(user: User) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Xác nhận tạm khóa',
        message: `Bạn có muốn tạm khóa tài khoản "${user.fullName}"?`,
        confirmText: 'Tạm khóa',
        cancelText: 'Hủy'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.updateUserStatus(user.id, 'suspended');
      }
    });
  }

  activateUser(user: User) {
    this.updateUserStatus(user.id, 'active');
  }

  private updateUserStatus(userId: string, status: User['status']) {
    this.users.update(users =>
      users.map(user =>
        user.id === userId
          ? { ...user, status, updatedAt: new Date() }
          : user
      )
    );

    this.loadUsers();

    const statusText = {
      'active': 'kích hoạt',
      'inactive': 'vô hiệu hóa',
      'suspended': 'tạm khóa',
      'pending': 'chờ duyệt'
    }[status];

    this.snackBar.open(`Đã ${statusText} tài khoản!`, 'Đóng', {
      duration: 3000
    });
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
        title: 'Xác nhận xóa nhiều người dùng',
        message: `Bạn có chắc chắn muốn xóa ${this.selection.selected.length} người dùng đã chọn?`,
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
    const idsToDelete = this.selection.selected.map(user => user.id);
    this.isLoading.set(true);

    setTimeout(() => {
      this.users.update(users =>
        users.filter(user => !idsToDelete.includes(user.id))
      );
      this.loadUsers();
      this.selection.clear();
      this.isLoading.set(false);

      this.snackBar.open(`Đã xóa ${idsToDelete.length} người dùng`, 'Đóng', {
        duration: 3000
      });
    }, 1500);
  }

  bulkChangeStatus(status: User['status']) {
    if (this.selection.selected.length === 0) return;

    const statusText = {
      'active': 'kích hoạt',
      'inactive': 'vô hiệu hóa',
      'suspended': 'tạm khóa',
      'pending': 'chờ duyệt'
    }[status];

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: `Xác nhận ${statusText}`,
        message: `Bạn có muốn ${statusText} ${this.selection.selected.length} người dùng đã chọn?`,
        confirmText: 'Xác nhận',
        cancelText: 'Hủy'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.performBulkStatusChange(status);
      }
    });
  }

  private performBulkStatusChange(status: User['status']) {
    const idsToUpdate = this.selection.selected.map(user => user.id);

    this.users.update(users =>
      users.map(user =>
        idsToUpdate.includes(user.id)
          ? { ...user, status, updatedAt: new Date() }
          : user
      )
    );

    this.loadUsers();
    this.selection.clear();

    const statusText = {
      'active': 'kích hoạt',
      'inactive': 'vô hiệu hóa',
      'suspended': 'tạm khóa',
      'pending': 'chờ duyệt'
    }[status];

    this.snackBar.open(`Đã ${statusText} ${idsToUpdate.length} người dùng`, 'Đóng', {
      duration: 3000
    });
  }

  // User details
  viewUserDetails(user: User) {
    this.selectedUser.set(user);
    this.showUserDetails.set(true);
  }

  closeUserDetails() {
    this.showUserDetails.set(false);
    this.selectedUser.set(null);
  }

  private updateStats() {
    const users = this.users();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const newUsersToday = users.filter(u => {
      const userDate = new Date(u.createdAt);
      userDate.setHours(0, 0, 0, 0);
      return userDate.getTime() === today.getTime();
    }).length;

    const newUsersThisWeek = users.filter(u =>
      new Date(u.createdAt) >= weekAgo
    ).length;

    // Update role distribution
    const roleCounts = users.reduce((acc, user) => {
      const roleDisplay = this.getRoleDisplayName(user.role);
      acc[roleDisplay] = (acc[roleDisplay] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const roleDistribution = Object.entries(roleCounts).map(([role, count]) => ({
      role,
      count,
      percentage: (count / users.length) * 100
    }));

    this.userStats.update(stats => ({
      ...stats,
      totalUsers: users.length,
      activeUsers: users.filter(u => u.status === 'active').length,
      newUsersToday,
      newUsersThisWeek,
      suspendedUsers: users.filter(u => u.status === 'suspended').length,
      pendingUsers: users.filter(u => u.status === 'pending').length,
      roleDistribution
    }));
  }

  // Utility methods
  getRoleDisplayName(role: string): string {
    const roleObj = this.roles().find(r => r.name === role);
    return roleObj?.displayName || role;
  }

  getRoleColor(role: string): string {
    const roleObj = this.roles().find(r => r.name === role);
    return roleObj?.color || '#666';
  }

  getStatusIcon(status: string): string {
    const statusIcons = {
      'active': 'check_circle',
      'inactive': 'cancel',
      'suspended': 'block',
      'pending': 'schedule'
    };
    return statusIcons[status as keyof typeof statusIcons] || 'help';
  }

  getStatusColor(status: string): string {
    const statusColors = {
      'active': '#4caf50',
      'inactive': '#9e9e9e',
      'suspended': '#f44336',
      'pending': '#ff9800'
    };
    return statusColors[status as keyof typeof statusColors] || '#666';
  }

  formatLastLogin(lastLogin: Date | null): string {
    if (!lastLogin) return 'Chưa đăng nhập';

    const now = new Date();
    const diff = now.getTime() - lastLogin.getTime();
    const minutes = Math.floor(diff / 60000);

    if (minutes < 1) return 'Vừa xong';
    if (minutes < 60) return `${minutes} phút trước`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} giờ trước`;

    const days = Math.floor(hours / 24);
    if (days < 30) return `${days} ngày trước`;

    return lastLogin.toLocaleDateString('vi-VN');
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString('vi-VN');
  }

  getInitials(firstName: string, lastName: string): string {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  }

  getFormError(fieldName: string): string {
    const field = this.userForm.get(fieldName);

    if (field?.errors && field.touched) {
      if (field.errors['required']) return 'Trường này là bắt buộc';
      if (field.errors['email']) return 'Email không hợp lệ';
      if (field.errors['minlength']) return `Tối thiểu ${field.errors['minlength'].requiredLength} ký tự`;
      if (field.errors['maxlength']) return `Tối đa ${field.errors['maxlength'].requiredLength} ký tự`;
    }
    return '';
  }

  exportData() {
    const dataToExport = this.dataSource.filteredData.map(user => ({
      'ID': user.id,
      'Email': user.email,
      'Tên đăng nhập': user.username,
      'Họ và tên': user.fullName,
      'Số điện thoại': user.phone || '',
      'Vai trò': this.getRoleDisplayName(user.role),
      'Trạng thái': user.status,
      'Email xác thực': user.emailVerified ? 'Có' : 'Không',
      'SĐT xác thực': user.phoneVerified ? 'Có' : 'Không',
      'Đăng nhập cuối': this.formatLastLogin(user.lastLogin),
      'Số lần đăng nhập': user.loginCount,
      'Địa điểm': user.location || '',
      'Múi giờ': user.timezone || '',
      'Ngôn ngữ': user.preferences.language,
      'Giao diện': user.preferences.theme,
      'Thông báo': user.preferences.notifications ? 'Có' : 'Không',
      'Ngày tạo': this.formatDate(user.createdAt),
      'Cập nhật cuối': this.formatDate(user.updatedAt)
    }));

    const csvContent = this.convertToCSV(dataToExport);
    this.downloadCSV(csvContent, 'users-export.csv');

    this.snackBar.open('Đã xuất dữ liệu người dùng thành công!', 'Đóng', {
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
    this.selectedUser.set(null);
    this.userForm.reset();
  }
}

// Reuse ConfirmDialog component
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
