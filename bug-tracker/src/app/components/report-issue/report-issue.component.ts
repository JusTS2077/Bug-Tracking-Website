import { Component,OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReportIssueService } from './report-issue.service';
import { jwtDecode } from 'jwt-decode';
import { AuthService } from '../auth/auth.service';
@Component({
  selector: 'app-report-issue',
  imports: [CommonModule,FormsModule],
  standalone:true,
  templateUrl: './report-issue.component.html',
  styleUrl: '../../../app/styles/report-issue.component.scss'
})
export class ReportIssueComponent implements OnInit{

  users:{user_id:number;usernm:string;password:string;email:string;firstname:string;lastname:string;projects:string[];department:string}[] = [];
  tags:{id:number;name:string;remarks:string}[] = [];
  status:{id:number;name:string;remarks:string}[] = [];
  projects:string[] = [];
  priority:{id:number;name:string;remarks:string}[] = [];

  selectedUser!:string;
  selectedTag!:string;
  selectedStatus!:string;
  selectedProject!:string;
  selectedPriority!:string;
  selectedFile!:File[];
  assignedTo!:string;
  title!:string;
  description!:string;

  token!:any;
  decodedToken!:any;


  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.selectedFile = Array.from(input.files);
      console.log('Selected files:', this.selectedFile);
    }
  }

  removeFile(index: number): void {
    this.selectedFile.splice(index, 1);
  }
  
  clearFile(fileInput: HTMLInputElement): void {
    fileInput.value = '';
    this.selectedFile = [];
    console.log('File input cleared');
  }

  constructor(private reportservice:ReportIssueService,private authservice:AuthService){}
  
  ngOnInit(): void {
    //getUsers
    this.token = this.authservice.getToken();
    this.decodedToken = jwtDecode(this.token);
    this.selectedUser = this.decodedToken.user;

    this.reportservice.getUsers().subscribe(data=>{
      this.users = data.filter((e:any)=>e.status_id===1);
      console.log(this.users);
      for(let user of this.users){
        if(user.usernm === this.selectedUser){
          console.log(user);
          this.projects.push(...user.projects);
        }
      }
      this.projects = this.projects.flat();
      console.log(this.projects);
    })
    //getTags
    this.reportservice.getTags().subscribe(data=>{
      this.tags = data.filter((e:any)=>e.status_id===1);
    })
    //getstatus
    this.reportservice.getStatus().subscribe(data=>{
      this.status = data.filter((e:any)=>e.status_id===1);
    })
    //getPriority
    this.reportservice.getPriorities().subscribe(data=>{
      this.priority = data.filter((e:any)=>e.status_id===1);
    })
  }
  
  addIssue(){
    const issueForm = new FormData();
    issueForm.append('project',this.selectedProject || '');
    issueForm.append('tag',this.selectedTag || '');
    issueForm.append('status',this.selectedStatus || '');
    issueForm.append('priority',this.selectedPriority || '');
    issueForm.append('assigned_to',this.assignedTo || '');
    issueForm.append('title',this.title || '');
    issueForm.append('description',this.description || '');
    this.selectedFile.forEach(file => {
      issueForm.append('files', file);
    });    
    issueForm.append('reported_by',this.selectedUser || '');
    this.reportservice.addIssue(issueForm).subscribe(()=>{});
    alert("Issue added successfully!");
  }
}
