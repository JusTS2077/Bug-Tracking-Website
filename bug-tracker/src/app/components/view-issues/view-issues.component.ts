import { Component,OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ViewIssuesService } from './view-issues.service';
import { Router,ActivatedRoute } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { AuthService } from '../auth/auth.service';
import { UserServices } from '../manage/services/user-data';
import { MatSelectModule } from '@angular/material/select';
import { MatOption } from '@angular/material/select';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-view-issues',
  imports: [FormsModule,CommonModule,MatSelectModule,MatOption,MatProgressBarModule],
  standalone:true,
  templateUrl: './view-issues.component.html',
  styleUrl: '../../../app/styles/view-issues.component.scss'
})

export class ViewIssuesComponent implements OnInit{

  issues:{issue_no:number,project:string,tag:string,status:string,priority:string,assigned_to:string,title:string,description:string,file_name:string,file_type:string,file_content:string,issue_status:string}[] = [];
  project_filter="All";
  tag_filter="All";
  status_filter="All";
  priority_filter="All";
  assignedto_filter="All"; 
  showForm=false;
  selectedIssue!:any;

  isLoading=false;
  
  private cleanFilter(val:string):string{
    return val === "All"?'':val;
  }

  constructor(
    private apiservice:UserServices,
    private viewservice:ViewIssuesService,
    private router:Router,
    private activated_route:ActivatedRoute,
    private authservice:AuthService
  ){}

  token!:any;
  decodedToken!:any;

  project_list:string[] = [];

  ngOnInit(): void {

    this.token = this.authservice.getToken();
    this.decodedToken = jwtDecode(this.token);
    this.assignedto_filter = this.decodedToken.user;
    console.log("User: ",this.assignedto_filter);

    console.log("Token det",this.decodedToken);

    this.filterby();
}

  filterby(){
    var filter = {project:this.cleanFilter(this.project_filter),
    tag:this.cleanFilter(this.tag_filter),
    status:this.cleanFilter(this.status_filter),
    priority:this.cleanFilter(this.priority_filter),
    assigned_to:this.cleanFilter(this.assignedto_filter)
  };

  let filtering = false;

  if(this.project_filter || this.tag_filter || this.status_filter || this.priority_filter){
    filtering = true;
  }
  else{
    filtering = false;
  }

  if(filtering){
    this.router.navigate([],{
      relativeTo:this.activated_route,
      queryParams:filter,
      queryParamsHandling:"merge",
    })
    this.viewservice.getIssues(filter).subscribe((data)=>{
      this.project_list = [];
      this.project_list.push(...data.map((ele:any)=>ele.project));
      console.log(data);
      this.issues=data;
    });
  }
    
  else{
    this.router.navigate([],{
      relativeTo:this.activated_route,
      queryParams:{},
      queryParamsHandling:'merge'
    })
  }

  }

  downloadFile(issueId: number): void {
    const url = `http://localhost:5000/download-file/${issueId}`;
    window.open(url, '_blank');
  }
}
