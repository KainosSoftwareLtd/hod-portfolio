import { Injectable } from '@angular/core';

import { Project } from './project';
import { PROJECTS } from './project-data';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

 projectArray: Project[] = [];

 // this doesn't work
 /*PROJECTS.foreach(function(project)
  {
    projectArray.push(project);
  });*/

  // this doesn't work
  /*for(var i = 0; i < PROJECTS.length; i++)
  {
    this.projectArray.Add(PROJECTS[i]);
  }*/

    constructor() { }

  getProjects(): Project[] {
    return this.projectArray;
  }

  // should I be calling this from component to populate? and if so whats the point in a service because then
  // I'm still accessing PROJECTS from component instead of seperating everything out
  /*addProjects(project)
  {
    this.projectsArray.push(project);
  }*/

  addProject(project: Project) {
    this.projectArray.push(project);
  }
}
