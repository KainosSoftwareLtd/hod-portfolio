import { Injectable } from '@angular/core';

import { Project } from './project';
import { PROJECTS } from './project-data';
import * as AWS from 'aws-sdk/global';
import * as S3 from 'aws-sdk/clients/s3';

const bucket = new S3(
  {
    accessKeyId: 'AKIAI5GLSVP7MIIJMFFQ',
    secretAccessKey: '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',
    region: 'eu-west-1'
  }
);
 
const params = {
  Bucket: 'gov-project-dashboard-dev',
  Key: 'gov-project-dashboard-dev/',
};
 
this.getS3Bucket().listObjects(params, function (err, data) {
  if (err) {
    console.log('There was an error getting your files: ' + err);
    return;
  }

  data.contents;
});

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
