import { CommonModule } from '@angular/common';
import { Component,OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { StatusService } from '../services/status-data';

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrl: '../../../../app/styles/status.component.scss',
  standalone:true,
  imports:[FormsModule,CommonModule]
})
export class StatusComponent implements OnInit {

  status!:any;
  
  status_nm = "";
  status_remarks="";
  update_nm="";
  update_remarks = "";
  updateid = 0;
  showForm="";

  constructor(private statusService:StatusService){}

  ngOnInit(): void {
    this.statusService.getStatus().subscribe(data => {
      this.status = data;

  })}

  validate=true;

  addStatus(){
    if(!this.status_nm || !this.status_remarks){
      this.validate=false;
      return;
    }
    const newTag = {statusname:this.status_nm,statusremarks:this.status_remarks};
    this.statusService.addStatus(newTag).subscribe(()=>{
      this.ngOnInit();
    })
  }

  showDelete=false;
  deleteid=0;

  returnId(user:any){
    this.deleteid = user.id;
    this.showDelete=true;
  }

  deleteStatus(id:number){
    this.statusService.deleteStatus(id).subscribe(()=>{
      this.showDelete=false;
      this.ngOnInit();
    })
  }

  selectedUser:any = null;

  displayUpdateForm(selectedUser:any){
    this.selectedUser = {...selectedUser};
    this.showForm = "form2";
  } 

  updateStatus(){
    const arr = {name:this.selectedUser.name,remarks:this.selectedUser.remarks};
    this.statusService.updateStatus(this.selectedUser.id,arr).subscribe(()=>{
      this.ngOnInit();
    })
  }

  toggleStatus(id:number){
    this.statusService.toggleStatus(id).subscribe(()=>{
      this.ngOnInit();
    })
  }
}
