import { Component, OnInit } from '@angular/core';

import { SelectedView } from './selectedView';

@Component({
  selector: 'app-project-list-views',
  templateUrl: './project-list-views.component.html',
  styleUrls: ['./project-list-views.component.css']
})
export class ProjectListViewsComponent implements OnInit {

  SelectedView = SelectedView;

  selectedView: SelectedView;

  constructor() { }

  ngOnInit() {
    this.selectedView = SelectedView.default;
  }

  setSelectedView(selectedView: SelectedView) {
    this.selectedView = selectedView;
  }

}
