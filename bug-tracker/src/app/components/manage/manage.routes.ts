import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ManageComponent } from "./manage.component";
import { PriorityComponent } from "./priority/priority.component";
import { ProjectsComponent } from "./projects/projects.component";
import { StatusComponent } from "./status/status.component";
import { TagComponent } from "./tag/tag.component";
import { UserComponent } from "./user/user.component";
import { UserGroupsComponent } from "./user-groups/user-groups.component";

export const manageRoutes:Routes = [
    {
        path:"",
        component:ManageComponent,
        children: [
            {path:"projects",component:ProjectsComponent},
            {path:"user",component:UserComponent},
            {path:"tag",component:TagComponent},
            {path:"status",component:StatusComponent},
            {path:"priority",component:PriorityComponent},
            {path:"user-groups",component:UserGroupsComponent},
            {path:"",redirectTo:"projects",pathMatch:"full"}
        ]
    }
]

@NgModule({
    imports:[RouterModule.forChild(manageRoutes)],
    exports:[RouterModule]
})
export class ManageRoutingModule{}