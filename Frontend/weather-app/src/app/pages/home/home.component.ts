import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../shared/Modules/material.module';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  popularCities = [
    {
      name: 'Hà Nội',
      country: 'Việt Nam',
      temperature: 28,
      icon: 'wb_sunny',
      humidity: 65,
      windSpeed: 12
    },
    {
      name: 'Hồ Chí Minh',
      country: 'Việt Nam',
      temperature: 32,
      icon: 'wb_cloudy',
      humidity: 78,
      windSpeed: 8
    },
    {
      name: 'Đà Nẵng',
      country: 'Việt Nam',
      temperature: 30,
      icon: 'wb_sunny',
      humidity: 70,
      windSpeed: 15
    }
  ];

  features = [
    {
      icon: 'location_on',
      title: 'Định vị chính xác',
      description: 'Tự động phát hiện vị trí của bạn để cung cấp thông tin thời tiết chính xác nhất'
    },
    {
      icon: 'schedule',
      title: 'Dự báo 7 ngày',
      description: 'Xem dự báo thời tiết chi tiết cho 7 ngày tới để lên kế hoạch tốt hơn'
    },
    {
      icon: 'notifications',
      title: 'Cảnh báo thời tiết',
      description: 'Nhận thông báo về các hiện tượng thời tiết bất thường và nguy hiểm'
    },
    {
      icon: 'favorite',
      title: 'Danh sách yêu thích',
      description: 'Lưu các địa điểm yêu thích để theo dõi thời tiết nhanh chóng'
    }
  ];
}
