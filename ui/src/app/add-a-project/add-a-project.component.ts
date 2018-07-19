import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { prepareProfile } from 'selenium-webdriver/firefox';

@Component({
  selector: 'app-add-a-project',
  templateUrl: './add-a-project.component.html',
  styleUrls: ['./add-a-project.component.css']
})
export class AddAProjectComponent implements OnInit {

  myForm: FormGroup;

  constructor(private fb: FormBuilder) { }

  ngOnInit() {

    const phase = {
      startDate: '',
      endDate: ''
    };

    this.myForm = this.fb.group({
      account: '',
      project: '',
      description: '',
      manager: '',
      phases: this.fb.group({
        alpha: this.fb.group(phase),
        beta: this.fb.group(phase),
        betaToLive: this.fb.group(phase),
        live: this.fb.group(phase)
      }),
      people: this.fb.array([]),
    });


    this.myForm.valueChanges.subscribe(console.log);
  }

  
  get projectPeople() {
    return this.myForm.get('people') as FormArray
  }

  addPerson() {
    const person = this.fb.group({
      forename: '',
      surname: '',
    })

    this.projectPeople.push(person);
  }

  deletePerson(i) {
    this.projectPeople.removeAt(i);
  }
}
