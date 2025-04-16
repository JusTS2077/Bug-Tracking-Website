import { Component,OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReportIssueService } from './report-issue.service';
@Component({
  selector: 'app-report-issue',
  imports: [CommonModule,FormsModule],
  standalone:true,
  templateUrl: './report-issue.component.html',
  styleUrl: '../../../app/styles/report-issue.component.scss'
})
export class ReportIssueComponent implements OnInit{

  users:{user_id:number;usernm:string;password:string;email:string;firstname:string;lastname:string;department:string}[] = [];
  tags:{id:number;name:string;remarks:string}[] = [];
  status:{id:number;name:string;remarks:string}[] = [];
  projects:{id:number;name:string;remarks:string}[] = [];
  priority:{id:number;name:string;remarks:string}[] = [];

  selectedUser!:string;
  selectedTag!:string;
  selectedStatus!:string;
  selectedProject!:string;
  selectedPriority!:string;
  selectedFile!:File;
  title!:string;
  description!:string;

  onFileSelected(event:any){
    this.selectedFile = event.target.files[0];
  }

  clearFile(fileInput:HTMLInputElement){
    fileInput.value = '';
  }

  constructor(private reportservice:ReportIssueService){}
  
  ngOnInit(): void {
    //getUsers
    this.reportservice.getUsers().subscribe(data=>{
      this.users = data;
    })
    //getTags
    this.reportservice.getTags().subscribe(data=>{
      this.tags = data;
    })
    //getstatus
    this.reportservice.getStatus().subscribe(data=>{
      this.status = data;
    })
    //getProjects
    this.reportservice.getProjects().subscribe(data=>{
      this.projects = data;
    })
    //getPriority
    this.reportservice.getPriorities().subscribe(data=>{
      this.priority = data;
    })
  }
  
  addIssue(){
    const issueForm = new FormData();
    issueForm.append('project',this.selectedProject || '');
    issueForm.append('tag',this.selectedTag || '');
    issueForm.append('status',this.selectedStatus || '');
    issueForm.append('priority',this.selectedPriority || '');
    issueForm.append('assigned_to',this.selectedUser || '');
    issueForm.append('title',this.title || '');
    issueForm.append('description',this.description || '');
    issueForm.append('file',this.selectedFile || '');
    this.reportservice.addIssue(issueForm).subscribe(()=>{});
    alert("Issue added successfully!");
  }
}
