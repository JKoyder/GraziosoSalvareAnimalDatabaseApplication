// This file comprises all of the Data Table logic including filtering, sorting, and pagination. A majority of this code was sampled from the Angular documentation 
// provided at https://material.angular.dev/components/table/overview
import { AfterViewInit, Component, OnInit, ViewChild, inject} from '@angular/core';

import {  MatPaginator } from "@angular/material/paginator";
import { MatSort, MatSortModule } from "@angular/material/sort";
import {  MatTableModule } from "@angular/material/table";
import { MatTableDataSource } from '@angular/material/table';

import { Animal } from '../models/animal';
import { AnimalData } from '../services/animal-data';

@Component({
  selector: 'app-data-table',
  imports: [
            MatPaginator,
            MatSortModule,
            MatTableModule
          ],
  templateUrl: './data-table.html',
  styleUrl: './data-table.css',
})
export class DataTable implements OnInit, AfterViewInit {

  constructor(private animalData: AnimalData) {
    console.log('data-table constructor')
  }

  private message: string = '';

  dataSource = new MatTableDataSource<Animal>(); // Stores displayed documents
  clickedRow: any = null;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  displayedColumns: string[] = [
    'age_upon_outcome', 
    'animal_id', 
    'animal_type', 
    'breed', 
    'color', 
    'date_of_birth', 
    'datetime', 
    'monthyear', 
    'name', 
    'outcome_subtype', 
    'outcome_type', 
    'sex_upon_outcome'
  ];

  // Updates the animal data service so that all animals in the database are returned
  getAnimals(): void {
    this.animalData.getAnimals();
  }

  // Filters the animal data service using the provided parameters
  getAnimalsByFilter(
          age_upon_outcome: string, 
          animal_id: string,
          animal_type: string,
          breed: string | string[],
          color: string,
          date_of_birth: string,
          datetime: string,
          monthyear: string,
          name: string,
          outcome_subtype: string,
          outcome_type: string,
          sex_upon_outcome: string): void {
            this.animalData.getAnimalsByFilter(
              age_upon_outcome, 
              animal_id, 
              animal_type, 
              breed, 
              color, 
              date_of_birth, 
              datetime, 
              monthyear, 
              name, 
              outcome_subtype, 
              outcome_type, 
              sex_upon_outcome)
  }

  // Provides pagination and sorting features
  ngAfterViewInit(): void {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
  }

  ngOnInit(): void {
    console.log('ngOnInit');
    
    // This subscription is responsible for updating the data source when the animal data service updates 
    this.animalData.animalData$.subscribe(animals => {
      this.dataSource.data = animals;
    });

    this.getAnimals();
  }
}
