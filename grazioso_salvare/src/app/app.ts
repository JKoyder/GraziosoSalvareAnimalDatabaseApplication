import { Component } from '@angular/core';

import { Logo } from "./logo/logo";
import { DataTable } from "./data-table/data-table";
import { BarChart } from "./bar-chart/bar-chart";
import { LineChart } from "./line-chart/line-chart";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    Logo, 
    DataTable,
    BarChart,
    LineChart
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})

export class App {
  protected readonly title = 'Austin Animal Center Database';
}
