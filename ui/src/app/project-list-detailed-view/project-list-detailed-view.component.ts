import { Component, OnInit } from '@angular/core';

import { Project } from '../project';
import { ProjectService } from '../project.service'

@Component({
  selector: 'app-project-list-detailed-view',
  templateUrl: './project-list-detailed-view.component.html',
  styleUrls: ['./project-list-detailed-view.component.css']
})
export class ProjectListDetailedViewComponent implements OnInit {

  projects: Project[];

  constructor(private projectService: ProjectService) { }

  ngOnInit() {
    this.projects = this.projectService.getProjects();
  }

}
