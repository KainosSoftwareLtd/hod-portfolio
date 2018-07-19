import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { Project } from '../project';
import { ProjectService } from '../project.service';

@Component({
  selector: 'app-add-a-project',
  templateUrl: './add-a-project.component.html',
  styleUrls: ['./add-a-project.component.css']
})
export class AddAProjectComponent implements OnInit {

  project: Project = <Project>{}
  myForm: FormGroup;

  constructor(private projectService: ProjectService) { }

  addProject(project: Project) {
    if(project)
    {
      this.projectService.addProject(project);
    }
  };

  ngOnInit() {
    this.myForm = this.fb.group({
      name: ''
    });

    this.myForm.valueChanges.subscribe(console.log);
  }


}
