import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { AutoFocusModule } from 'primeng/autofocus';
import { FocusTrapModule } from 'primeng/focustrap';
import { MessageModule } from 'primeng/message';
import { RouterLink } from '@angular/router';

interface RegisteredUser {
    username: string;
    password: string;
    email: string;
    phoneNumber: string;
}

@Component({
    selector: 'app-register',
    templateUrl: './register.html',
    standalone: true,
    imports: [IconFieldModule, InputIconModule, ButtonModule, InputTextModule, AutoFocusModule, FocusTrapModule, FormsModule, MessageModule, RouterLink]
})
export class RegisterComponent {
    username: string = '';
    email: string = '';
    phoneNumber: string = '';
    password: string = '';
    confirmPassword: string = '';

    errorMessage: string = '';
    successMessage: string = '';

    submit(): void {
        this.errorMessage = '';
        this.successMessage = '';

        if (!this.username || !this.email || !this.phoneNumber || !this.password || !this.confirmPassword) {
            this.errorMessage = 'Please fill in all fields.';
            return;
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(this.email)) {
            this.errorMessage = 'Invalid email format.';
            return;
        }

        if (this.password !== this.confirmPassword) {
            this.errorMessage = 'Passwords do not match.';
            return;
        }

        const existingUsers: RegisteredUser[] = JSON.parse(localStorage.getItem('registered_users') || '[]');

        const alreadyExists = existingUsers.some((u) => u.username === this.username || u.email === this.email);
        if (alreadyExists) {
            this.errorMessage = 'Username or email already exists.';
            return;
        }

        const newUser: RegisteredUser = {
            username: this.username,
            password: this.password,
            email: this.email,
            phoneNumber: this.phoneNumber
        };
        existingUsers.push(newUser);
        localStorage.setItem('registered_users', JSON.stringify(existingUsers));

        this.successMessage = 'Register Successfully! Please Login.';
        this.username = '';
        this.email = '';
        this.phoneNumber = '';
        this.password = '';
        this.confirmPassword = '';
    }
}