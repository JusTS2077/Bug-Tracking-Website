import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserGroupServices } from './user-group.service';
import { OnInit } from '@angular/core';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/select';
import { MatLabel } from '@angular/material/select';
import { MatFormField } from '@angular/material/select';
import {MatCheckboxModule} from '@angular/material/checkbox';

@Component({
  selector: 'app-user-groups',
  imports: [FormsModule,CommonModule,MatSelect,MatOption,MatLabel,MatFormField,MatCheckboxModule],
  templateUrl: './user-groups.component.html',
  styleUrl: '../../../../app/styles/user-groups.component.scss',
})
export class UserGroupsComponent implements OnInit{

  constructor(private usergrp:UserGroupServices){}


  isChecked=false;
  showForm="";
  usergroupnm="";
  selectedGroup=0;
  permlist:number[] = [];
  grp_permlist!:any;
  grouplist!:any;
  perms!:any;
  commonperms!:any;
  count = 0;


  ngOnInit():void{
    this.usergrp.getPerms().subscribe(data=>{
      console.log(data);
      this.perms = data;
    })
    
    this.usergrp.getGroup().subscribe(data=>{
      console.log(data);
      this.grouplist = data;
    });
  }

  //This is for adding permissions during group creation
  hasChecked(event: any, permid: number) {

    if (event.checked) {
      if (!this.permlist.includes(permid)) {
        this.permlist.push(permid);
      }
    } else {
      this.permlist = this.permlist.filter(p => p !== permid);
    }
    console.log("hasChecked function called...");
    console.log(this.permlist);
  }
  addGroup(){
    this.usergrp.addGroup(this.usergroupnm,this.permlist).subscribe(()=>{
      this.showForm="";
      this.permlist=[];
      this.ngOnInit();
    });
  }

  showPerms(){
    console.log("This function was called....");
    this.usergrp.getGroupPerms(this.selectedGroup).subscribe(data=>{
      console.log(data);
      this.grp_permlist = data;
      console.log("Group perms:",this.grp_permlist);
      console.log("Permissions list: ",this.perms);
      
    });
  }

  checkedBox(event:any,id:number){
    if(id === this.grp_permlist.some((obj:any)=>{obj.group_id})){
      event.checked = true;
    }
  }
}
