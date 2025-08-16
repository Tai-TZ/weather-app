import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../../shared/Modules/material.module';

@Component({
    selector: 'app-auth-layout',
    standalone: true,
    imports: [CommonModule, RouterModule, MaterialModule],
    templateUrl: './auth-layout.component.html',
    styleUrls: ['./auth-layout.component.scss']
})
export class AuthLayoutComponent { } 