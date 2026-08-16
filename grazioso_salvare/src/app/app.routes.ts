import { Routes } from '@angular/router';
import { DataTable } from './data-table/data-table';

export const routes: Routes = [
    { path: 'filtered-animals', component: DataTable },
    { path: '', component: DataTable }
];
