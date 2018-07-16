import { Component, OnInit } from '@angular/core';

import { ProjectListView } from './project-list-view';

@Component({
  selector: 'app-project-list-views',
  templateUrl: './project-list-views.component.html',
  styleUrls: ['./project-list-views.component.css']
})
export class ProjectListViewsComponent implements OnInit {

  ProjectListView = ProjectListView;

  selectedView: ProjectListView;

  constructor() { }

  ngOnInit() {
    this.selectedView = ProjectListView.default;
  }

  setSelectedView(selectedView: ProjectListView) {
    this.selectedView = selectedView;
  }

}
