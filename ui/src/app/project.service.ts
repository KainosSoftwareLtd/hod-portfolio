import { Injectable } from '@angular/core';

import { Project } from './project';
import { PROJECTS } from './project-data';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  projects: Project[] = PROJECTS;

  constructor() { }

  getProjects(): Project[] {
    return this.projects;
  }

  addProject(project: Project) {
    this.projects.push(project);
  }
}
