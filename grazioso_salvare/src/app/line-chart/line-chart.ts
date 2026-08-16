import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ChartModule } from 'primeng/chart';

import { Animal } from '../models/animal';
import { AnimalData } from '../services/animal-data';

@Component({
  selector: 'app-line-chart',
  imports: [ChartModule],
  templateUrl: './line-chart.html',
  styleUrl: './line-chart.css',
})
export class LineChart implements OnInit {
  constructor(
    private animalData: AnimalData,
    private changeDetector: ChangeDetectorRef
  ) {
    console.log('line-chart constructor');
  }

  private dataSource!: Animal[]; // Stores current animal documents 

  chartData = {
      labels: [''],
      datasets: [
        {
          label: '',
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
              ticks: {
                  color: 'black'
              },
              grid: {
                  color: 'rgba(255,255,255,0.2)'
              }
          },
          y: {
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
    let { breedsAndCount, yearLabels } = this.populateLabelsAndCount();

    this.chartData = {
      labels: yearLabels,
      datasets: Array.from(breedsAndCount.entries()).map(([breed, count]) => ({ // Converts map to an array where breed corresponds to a label and count corresponds to data
        label: breed,
        data: yearLabels.map(year => count.get(year) ?? 0) // If the count for that year is undefined, set to 0
      }))
    }

    this.changeDetector.detectChanges(); // Informs Angular that UI needs updated
  }

  private populateLabelsAndCount(): { breedsAndCount: Map<string, Map<string, number>>; yearLabels: string[];} {
    
    const breedsAndCount = new Map<string, Map<string, number>>();
    const yearLabels: string[] = []; 

    this.dataSource.forEach(animal => {
      const currentYear = animal.datetime.substring(0, 4)
      let breed = breedsAndCount.get(animal.breed);

      if (yearLabels.indexOf(currentYear) === -1) { // Inserts new year into years array and resets year index
        yearLabels.push(currentYear);
      }

      if (!breed) { // If breed not found add it to the map
        breedsAndCount.set(animal.breed, new Map<string, number>());
        breed = breedsAndCount.get(animal.breed);
      } 

      if (breed) {
        let count = (breed.get(currentYear) ?? 0) + 1; // If the count for that year is undefined, set to 0; otherwise increment
        breed.set(currentYear, count);
      }
    });

    yearLabels.sort();
    return { breedsAndCount, yearLabels };
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
