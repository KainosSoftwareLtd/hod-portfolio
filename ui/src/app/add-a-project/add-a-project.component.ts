import { Component, OnInit, Input } from '@angular/core';
import { Project } from '../project';
import { ProjectService } from '../project.service';

@Component({
  selector: 'app-add-a-project',
  templateUrl: './add-a-project.component.html',
  styleUrls: ['./add-a-project.component.css']
})
export class AddAProjectComponent implements OnInit {


  constructor(private projectService: ProjectService) { }

  addProject(project: Project) {
    if(project)
    {
      this.projectService.addProject(project);
    }
  };

  ngOnInit() {
  }
  

}
