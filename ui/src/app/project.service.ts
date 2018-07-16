import { Injectable } from '@angular/core';

import { Project } from './project';
import { PROJECTS } from './project-data';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

 projects: Project[];

 projects.Add(PROJECTS);
 
  constructor() { }

  getProjects(): Project[] {
    return PROJECTS;
  }

  addProject(project: Project) {
    this.projects.push(project);
  }
}
