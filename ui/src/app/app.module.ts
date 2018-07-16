import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ProjectListViewComponent } from './project-list-view/project-list-view.component';
import { ProjectListDetailedViewComponent } from './project-list-detailed-view/project-list-detailed-view.component';
import { ProjectsOverviewComponent } from './projects-overview/projects-overview.component';
import { ProjectListViewsComponent } from './project-list-views/project-list-views.component';
import { PageHeaderComponent } from './page-header/page-header.component';

@NgModule({
  declarations: [
    AppComponent,
    ProjectListViewComponent,
    ProjectListDetailedViewComponent,
    ProjectsOverviewComponent,
    ProjectListViewsComponent,
    PageHeaderComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
