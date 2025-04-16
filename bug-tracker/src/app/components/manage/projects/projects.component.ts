import { CommonModule } from '@angular/common';
import { Component,OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProjectService } from '../services/project-data';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['../../../../app/styles/projects.component.scss'],
  standalone:true,
  imports:[FormsModule,CommonModule]
})
export class ProjectsComponent implements OnInit{ 

  data:{id:number;name:string;remarks:string}[] = [];
  proj_name = "";
  proj_remarks = "";

  showForm="";

  constructor(private projectService:ProjectService){}

  ngOnInit(): void {
    this.projectService.getProjects().subscribe(data=>{
      this.data = data;
    })
  }

  validate=true;

  addProject(){
    if(!this.proj_name  || !this.proj_remarks){
      this.validate=false;
      return;
    }
    const newProject = {projectname:this.proj_name,projectremarks:this.proj_remarks};
    this.projectService.addProject(newProject).subscribe(()=>{
      this.ngOnInit();
    })
  }

  
  selectedUser:any = null;

  showDelete=false;
  deleteid=0;

  returnId(user:any){
    this.deleteid = user.id;
    this.showDelete=true;
  }

  deleteProject(id:number){
    this.projectService.deleteProject(id).subscribe(()=>{
      this.ngOnInit();
      this.showDelete=false;
    })

  }

  displayUpdateForm(selectedUser:any){
    this.selectedUser = {...selectedUser};
    this.showForm = "form2";
  } 

  updateProject(){
    const arr = {name:this.selectedUser.name,remarks:this.selectedUser.remarks};
    this.projectService.updateProject(this.selectedUser.id,arr).subscribe(()=>{
      this.ngOnInit();
    })
  }
}
