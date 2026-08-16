import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ChartModule } from 'primeng/chart';

import { Animal } from '../models/animal';
import { AnimalData } from '../services/animal-data';

@Component({
  selector: 'app-bar-chart',
  imports: [ChartModule],
  templateUrl: './bar-chart.html',
  styleUrl: './bar-chart.css',
})
export class BarChart implements OnInit {
  constructor(
    private animalData: AnimalData,
    private changeDetector: ChangeDetectorRef
  ) {
    console.log('bar-chart constructor');
  }

  private dataSource!: Animal[]; // Stores current animal documents 

  chartData = {
      labels: [''],
      datasets: [
        {
          data: [0]
        }
      ]
    };

  chartOptions = {
      indexAxis: 'x',
      plugins: {
          legend: {
              display: false
          }
      },
      scales: {
          x: {
              stacked: true,
              ticks: {
                  color: 'black'
              },
              grid: {
                  color: 'rgba(255,255,255,0.2)'
              }
          },
          y: {
              stacked: true,
              ticks: {
                  color: 'black'
              },
              grid: {
                  color: 'rgba(255,255,255,0.2)'
              }
          }
      }
  };

  // Updates chart whenever subscribe event occurs
  private populateChart(): void { 
    let { breedsAndCount } = this.populateLabelsAndCount();

    this.chartData = {
      labels: Array.from(breedsAndCount.keys()),
      datasets: [
        {
          data: Array.from(breedsAndCount.values())
        }
      ]
    }

    this.changeDetector.detectChanges(); // Informs Angular that UI needs updated
  }

  private populateLabelsAndCount(): { breedsAndCount: Map<string, number>; } {
    const breedsAndCount = new Map<string, number>();

    this.dataSource.forEach(animal => {
      let breed = breedsAndCount.get(animal.breed);

      if (!breed) { // If breed not found add it to the map
        breedsAndCount.set(animal.breed, 0);
        breed = breedsAndCount.get(animal.breed);
      } 

      let count = (breed ?? 0) + 1; // If the count for that breed is undefined, set to 0; otherwise increment
      breedsAndCount.set(animal.breed, count);
    });

    return { breedsAndCount };
  }

  ngOnInit(): void {
    console.log('ngOnInit');

    // Subscribe to data contained in animalData service
    this.animalData.animalData$.subscribe(animals => {
      this.dataSource = animals;
      this.populateChart();
    });
  }
}
