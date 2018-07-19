import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { prepareProfile } from 'selenium-webdriver/firefox';

import { Project } from '../project';
import { ProjectService } from '../project.service';

@Component({
  selector: 'app-add-a-project',
  templateUrl: './add-a-project.component.html',
  styleUrls: ['./add-a-project.component.css']
})
export class AddAProjectComponent implements OnInit {

  projectPhases: string[] = ['Discovery', 'Alpha', 'Beta', 'Beta To Live', 'Live'];

  riskLevels: string[] = ['High', 'Medium'];

  sectors: string[] = ['Public', 'Private'];

  myForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router, private projectService: ProjectService) { }

  ngOnInit() {

    const phase = {
      startDate: '',
      endDate: ''
    };

    this.myForm = this.fb.group({
      accountName: '',
      projectName: '',
      description: '',
      manager: '',
      phases: this.fb.array([]),
      riskLevel: '',
      location: '',
      sector: '',
      department: '',
      agency: '',
      usefulLinks: this.fb.array([]),
      kainosPeople: this.fb.array([]),
      clientPeople: this.fb.array([]),
    });

    this.projectPhases.forEach(p => this.addPhase(p));
  }

  onSave() {
    const project: Project = this.myForm.value as Project;
    this.projectService.addProject(project);
    this.router.navigateByUrl('/home');
  }

  get getPhases() {
    return this.myForm.get('phases') as FormArray;
  }

  get getKainosPeople() {
    return this.myForm.get('kainosPeople') as FormArray;
  }

  get getClientPeople() {
    return this.myForm.get('clientPeople') as FormArray;
  }

  get getUsefulLinks() {
    return this.myForm.get('usefulLinks') as FormArray;
  }

  addPhase(phaseName) {
    const phase = this.fb.group({
      name: phaseName,
      startDate: '',
      endDate: ''
    });
    this.getPhases.push(phase);
  }

  addKainosPerson() {
    const person = this.fb.group({
      name: '',
      role: '',
    });
    this.getKainosPeople.push(person);
  }

  deleteKainosPerson(i) {
    this.getKainosPeople.removeAt(i);
  }

  addClientPerson() {
    const person = this.fb.group({
      name: '',
      role: '',
    });
    this.getClientPeople.push(person);
  }

  deleteClientPerson(i) {
    this.getClientPeople.removeAt(i);
  }

  addUsefulLink() {
    const usefulLink = this.fb.group({
      link: ''
    });
    this.getUsefulLinks.push(usefulLink);
  }

  deleteUsefulLink(i) {
    this.getUsefulLinks.removeAt(i);
  }
}
