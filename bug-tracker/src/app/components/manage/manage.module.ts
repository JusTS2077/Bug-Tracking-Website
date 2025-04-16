import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ManageRoutingModule } from './manage.routes';
import { ManageComponent } from "./manage.component";
import { PriorityComponent } from "./priority/priority.component";
import { ProjectsComponent } from "./projects/projects.component";
import { StatusComponent } from "./status/status.component";
import { TagComponent } from "./tag/tag.component";
import { UserComponent } from "./user/user.component";
import { MatSelectModule } from '@angular/material/select';

@NgModule({
    declarations:[],
    imports:[ManageComponent,
        PriorityComponent,
        ProjectsComponent,
        StatusComponent,
        TagComponent,
        UserComponent,RouterModule,
        MatSelectModule,
        ManageRoutingModule],
})

export class ManageModule{

}
