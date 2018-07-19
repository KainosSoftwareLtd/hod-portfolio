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

  constructor(private projectService: ProjectService, private fb: FormBuilder) { }

  addProject(myForm: FormGroup) {
    try{
    
      this.project.accountName = this.myForm.value('accountName');
    

      if(this.project)
    {
      this.projectService.addProject(this.project);
    }
  }catch(err)
  {

  }
  };

  ngOnInit() {
    this.myForm = this.fb.group({
      accountName: ''
    });

    this.myForm.valueChanges.subscribe(console.log);
  }


}
