import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { CheckboxModule } from 'primeng/checkbox';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { AutoFocusModule } from 'primeng/autofocus';
import { FocusTrapModule } from 'primeng/focustrap';
import { MessageModule } from 'primeng/message';
import * as AuthActions from '../../store/auth/auth-actions';
import { selectAuthLoading, selectAuthError } from '../../store/auth/auth-selectors';

@Component({
    selector: 'app-login',
    templateUrl: './login.html',
    standalone: true,
    imports: [CheckboxModule, IconFieldModule, InputIconModule, ButtonModule, InputTextModule, AutoFocusModule, FocusTrapModule, FormsModule, MessageModule, RouterLink, AsyncPipe]
})
export class LoginComponent {
    private readonly store = inject(Store);

    readonly loading$ = this.store.select(selectAuthLoading);
    readonly error$ = this.store.select(selectAuthError);

    username: string = '';
    password: string = '';
    accept: boolean = false;

    submit(): void {
        if (!this.username || !this.password) return;

        this.store.dispatch(AuthActions.login({ username: this.username, password: this.password }));
    }
}