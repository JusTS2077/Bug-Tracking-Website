import { Routes } from "@angular/router";
import { authGuard } from "./components/auth/auth.guard";

export const routes: Routes = [
    
    {
        path:"login",
            loadComponent:()=>import("./components/login/login.component").then(m=>m.LoginComponent)
    },
    {path: "manage",
        loadChildren:()=>import("./components/manage/manage.module").then(m=>m.ManageModule),
        canActivate:[authGuard]
    },
    {path:"report-issue",
        loadComponent:()=>import("./components/report-issue/report-issue.component").then(m=>m.ReportIssueComponent),
        canActivate:[authGuard]
    },
    {path:"view-issues",
        loadComponent:()=>import("./components/view-issues/view-issues.component").then(m=>m.ViewIssuesComponent),
        canActivate:[authGuard]
    },
    {path:"",redirectTo:"/login",pathMatch:"full"}
];

export class AppRoutingModule{}

