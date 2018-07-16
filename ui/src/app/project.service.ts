import { Injectable } from '@angular/core';

import { Project } from './project';
import { PROJECTS } from './project-data';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  projectArray: Project[] = PROJECTS;

  constructor() { }

  getProjects(): Project[] {
    return this.projectArray;
  }

  addProject(project: Project) {
    this.projectArray.push(project);
  }
}
