import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

import { Animal } from '../models/animal';

@Injectable({
    providedIn: 'root'
})
export class AnimalData {
    constructor(private http: HttpClient) {}

    private params = new HttpParams()
    private animalDataSubject = new BehaviorSubject<Animal[]>([]); // BehaviorSubject allows this data to update dependent components and variables when it is changed
    public animalData$ = this.animalDataSubject.asObservable();

    // Fetches all animals from the DB
    getAnimals(): void {
        let url = "http://localhost:3000/api/animals";
        this.params = this.params
                .set('age_upon_outcome', '') // Used to determine empty queries; this has potential as a design flaw 
                                            // if a query was made trying to search for nameless animals as it would return all animal names instead
                .set ('animal_id', '')
                .set ('animal_type', '')
                .set('color', '')
                .set('date_of_birth', '')
                .set('datetime', '')
                .set('monthyear', '')
                .set('name', '')
                .set('outcome_subtype', '')
                .set('outcome_type', '')
                .set('sex_upon_outcome', '')
                .set('breed', '');

        this.http.get<Animal[]>(url, { params: this.params }) // Update the BehaviorSubject which in turn updates the read-only animalData$ observable
            .subscribe(animals => {
                this.animalDataSubject.next(animals);
            });
    }
    
    // Queries database using filters; array queries are taken apart and treated as unique keys
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
        sex_upon_outcome: string,
    ): void {
        let url = "http://localhost:3000/api/filtered_animals";
        
        if (Array.isArray(breed)) {
            this.params = new HttpParams(); // Create new params so that appended breeds aren't appended to the pre-existing params
            breed.forEach(type => {
                this.params = this.params.append('breed', type);
            });
        } else {
            this.params = this.params.set('breed', breed);
        }

        this.params = this.params
            .set('age_upon_outcome', age_upon_outcome)
            .set ('animal_id', animal_id)
            .set ('animal_type', animal_type)
            .set('color', color)
            .set('date_of_birth', date_of_birth)
            .set('datetime', datetime)
            .set('monthyear', monthyear)
            .set('name', name)
            .set('outcome_subtype', outcome_subtype)
            .set('outcome_type', outcome_type)
            .set('sex_upon_outcome', sex_upon_outcome);


        this.http.get<Animal[]>(url, { params: this.params }) // Update the BehaviorSubject which in turn updates the read-only animalData$ observable
            .subscribe({
                next: (animals) => {
                this.animalDataSubject.next(animals);
                },
                error: (err) => {
                    if (err.status === 400) {
                        console.log('Invalid parameters entered.');
                        return;
                    }
                }
            });
    } 
}
