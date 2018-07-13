import { Component, OnInit } from '@angular/core';

import { Overview } from './overview';
import { Project } from '../project';
import { ProjectService } from '../project.service';

@Component({
  selector: 'app-projects-overview',
  templateUrl: './projects-overview.component.html',
  styleUrls: ['./projects-overview.component.css']
})
export class ProjectsOverviewComponent implements OnInit {

  overview: Overview;

  constructor(private projectService: ProjectService) { }

  ngOnInit() {
    let projects = this.projectService.getProjects();
    this.overview = this.getOverview(projects);
  }

  getOverview(projects: Project[]): Overview {
    return {
      pipeline: projects.filter(project => project.phase === 'Pipeline').length,
      discovery: projects.filter(project => project.phase === 'Discovery').length,
      alpha: projects.filter(project => project.phase === 'Alpha').length,
      beta: projects.filter(project => project.phase === 'Beta').length,
      betaToLive: projects.filter(project => project.phase === 'BetaToLive').length,
      live: projects.filter(project => project.phase === 'Live').length
    }
  }

}
