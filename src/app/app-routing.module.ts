import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ValidationFormComponent } from './components/validation-form/validation-form.component';

const routes: Routes = [
    { path: '',   redirectTo: '/verify', pathMatch: 'full' },
    { path: 'verify', component: ValidationFormComponent },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
