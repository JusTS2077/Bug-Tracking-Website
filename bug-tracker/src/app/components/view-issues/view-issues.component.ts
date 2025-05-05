import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ViewIssuesService } from './view-issues.service';
import { Router, ActivatedRoute } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { AuthService } from '../auth/auth.service';
import { UserServices } from '../manage/services/user-data';
import { MatSelectModule } from '@angular/material/select';
import { MatOption } from '@angular/material/select';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { DomSanitizer, SafeUrl, SafeResourceUrl } from '@angular/platform-browser';  // For sanitizing URLs

@Component({
  selector: 'app-view-issues',
  imports: [FormsModule, CommonModule, MatSelectModule, MatOption, MatProgressBarModule],
  standalone: true,
  templateUrl: './view-issues.component.html',
  styleUrls: ['../../../app/styles/view-issues.component.scss'],
})
export class ViewIssuesComponent implements OnInit {
  issues: any[] = [];
  project_filter = 'All';
  tag_filter = 'All';
  status_filter = 'All';
  priority_filter = 'All';
  assignedto_filter = 'All';
  startDate = 'All';
  endDate = 'All';
  showForm = false;
  selectedIssue: any;
  isLoading = false;
  showPopup = false; 
  fileUrl: SafeUrl | null = null;  
  fileType: string = '';
  previewFileUrl: SafeResourceUrl | null = null;
  showPreview = false;
  showEdit = false;
  selectedFile:File | null = null;
  showComments = false;
  comment = "";
  showAddComment = false;
  commentId!:number;
  commentlist!:any;
  
  token!:any;
  decodedToken!:any;

  private cleanFilter(val: string): string {
    return val === 'All' ? '' : val;
  }

  constructor(
    private apiservice: UserServices,
    private viewservice: ViewIssuesService,
    private router: Router,
    private activated_route: ActivatedRoute,
    private authservice: AuthService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.token = this.authservice.getToken();
    this.decodedToken = jwtDecode(this.token);
    this.filterby();
  }

  filterby() {
    const filter = {
      project: this.cleanFilter(this.project_filter),
      tag: this.cleanFilter(this.tag_filter),
      status: this.cleanFilter(this.status_filter),
      priority: this.cleanFilter(this.priority_filter),
      assigned_to: this.cleanFilter(this.assignedto_filter),
      startDate: this.cleanFilter(this.startDate),
      endDate: this.cleanFilter(this.endDate),
    };

    let filtering = false;

    if (
      this.project_filter ||
      this.tag_filter ||
      this.status_filter ||
      this.priority_filter ||
      this.assignedto_filter ||
      this.startDate ||
      this.endDate
    ) {
      filtering = true;
    } else {
      filtering = false;
    }

    if (filtering) {
      this.router.navigate([], {
        relativeTo: this.activated_route,
        queryParams: filter,
        queryParamsHandling: 'merge',
      });
      this.isLoading = true;
      this.viewservice.getIssues(filter).subscribe(
        (data) => {
          this.issues = this.groupIssuesWithAttachments(data);
          console.log(this.issues);
          this.isLoading = false;
        },
        (error) => {
          this.isLoading = false;
          console.error('Error fetching issues:', error);
        }
      );
    } else {
      this.router.navigate([], {
        relativeTo: this.activated_route,
        queryParams: {},
        queryParamsHandling: 'merge',
      });
    }
  }

  groupIssuesWithAttachments(data: any[]) {
    const issuesMap = new Map();

    data.forEach((issue: any) => {
      const existingIssue = issuesMap.get(issue.issue_no);
      if (existingIssue) {
        existingIssue.attachments.push(issue);
      } else {
        issuesMap.set(issue.issue_no, { ...issue, attachments: [issue] });
      }
    });

    return Array.from(issuesMap.values());
  }

  viewFile(issueNo: number, attachmentId: number) {
    this.viewservice.getFile(issueNo, attachmentId).subscribe(
      (blob: Blob) => {
        console.log('API Response (Blob):', blob);
  
        const fileType = blob.type || 'application/octet-stream';
        console.log(fileType);
        const url = URL.createObjectURL(blob);
  
        let guessedExtension = '';
        if (fileType.includes('pdf')) guessedExtension = 'pdf';
        else if (fileType.includes('wordprocessingml')) guessedExtension = 'docx';
        else if (fileType.includes('spreadsheetml')) guessedExtension = 'xlsx';
        else guessedExtension = 'bin';
  
        const fileName = `downloaded_file.${guessedExtension}`;
        console.log('File Details:', { fileName, fileType, url });
  
        // Handle PDF in browser
        if (fileType === 'application/pdf') {
          this.previewFileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
          this.showPreview = true;
        }
  
        // Handle Word and Excel with online viewers
        else if (
          fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 'docx'
        ) {
          const googleDocsUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(url)}`;
          this.previewFileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(googleDocsUrl);
          this.showPreview = true;
        }  
        // For unknown types: fallback to inline display
        else {
          this.previewFileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
          this.showPreview = true;
        }
      },
      (err) => {
        console.error('Error loading file:', err);
      }
    );
  }
  
  closePopup(): void {
    this.showPreview = false;
    this.fileUrl = null;
  }

  downloadFile(issueId: number, attachmentId: number): void {
    const url = `http://localhost:5000/download-file/${issueId}/${attachmentId}`;
    window.open(url, '_blank');
  } 

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  updateIssue() {
    console.log("Updating data...");
    const formData = new FormData();
    formData.append('project', this.selectedIssue.project);
    formData.append('tag',this.selectedIssue.tag);
    formData.append('status', this.selectedIssue.status);
    formData.append('priority', this.selectedIssue.priority);
    formData.append('assigned_to', this.selectedIssue.assigned_to);
    formData.append('title', this.selectedIssue.title);
    formData.append('description', this.selectedIssue.description);
    if(this.selectedFile!==null){
      formData.append('file', this.selectedFile);

    }
    
    // Send the request using HttpClient or XMLHttpRequest
    this.viewservice.updateIssues(this.selectedIssue.issue_no,formData).subscribe((res)=>{
      console.log("Success: ",res);
    })
  }

  addComment(){
    const data = {user:this.decodedToken.user,comment:this.comment,issue_id:this.commentId};
    this.viewservice.addComment(data).subscribe(()=>{
      this.getComment();
    });
  }

  commentFunc(issue_no:number){
    this.showComments=true;
    this.commentId=issue_no;
    this.getComment();
  }

  getComment(){
    this.viewservice.getComments(this.commentId).subscribe((data:any)=>{
      this.commentlist = data;
      console.log(data);
    })
  }
  toggleStatus(id:number){
    this.viewservice.toggleStatus(id).subscribe(()=>{
      this.ngOnInit();
    })
  }
}
