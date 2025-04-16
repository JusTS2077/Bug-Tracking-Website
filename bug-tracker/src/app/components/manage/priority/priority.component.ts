import { CommonModule } from '@angular/common';
import { Component,OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PriorityService } from '../services/priority-data';

@Component({
  selector: 'app-priority',
  templateUrl: './priority.component.html',
  styleUrl: '../../../../app/styles/priority.component.scss',
  standalone:true,
  imports:[FormsModule,CommonModule]
})
export class PriorityComponent implements OnInit{

  priority:{id:number;name:string;remarks:string}[] = [];
  priority_nm = "";
  priority_remarks = "";

  update_nm="";
  updateid=0;
  update_remarks="";

  showForm='';

  constructor(private priorityService:PriorityService) {}

  ngOnInit(): void {
    this.priorityService.getPriorities().subscribe(data => {
      this.priority = data;
    });
  }

  validate=true;

  addPriority(){
    if(!!this.priority_nm || !this.priority_remarks){
      this.validate=false;
      return;
    }
    const priority = {priorityname:this.priority_nm,priorityremarks:this.priority_remarks};
    this.priorityService.addPriority(priority).subscribe(()=>{
      this.ngOnInit();
    })
  }

  showDelete=false;
  deleteid=0;

  returnId(user:any){
    this.deleteid = user.id;
    this.showDelete=true;
  }

  deletePriority(id:number){
    this.priorityService.deletePriority(id).subscribe(()=>{
      this.ngOnInit();
      this.showDelete=false;
    })
  } 

  selectedUser:any = null;

  displayUpdateForm(selectedUser:any){
    this.selectedUser = {...selectedUser};
    this.showForm = "form2";
  } 


  updatePriority(){
    const arr = {name:this.selectedUser.name,remarks:this.selectedUser.remarks};
    this.priorityService.updatePriority(this.selectedUser.id,arr).subscribe(()=>{
      this.ngOnInit();
    })
  }
}
