import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserGroupServices } from './user-group.service';
import { OnInit } from '@angular/core';

@Component({
  selector: 'app-user-groups',
  imports: [FormsModule,CommonModule],
  templateUrl: './user-groups.component.html',
  styleUrl: '../../../../app/styles/user-groups.component.scss',
})
export class UserGroupsComponent implements OnInit{

  constructor(private usergrp:UserGroupServices){}

  isChecked=false;
  showForm="";
  usergroupnm="";
  permlist:number[] = [];
  perms!:any;

  ngOnInit():void{
    this.usergrp.getPerms().subscribe(data=>{
      console.log(data);
      this.perms = data;
    })
  }

  hasChecked(event: any, permid: number) {
    if (event.target.checked) {
      if (!this.permlist.includes(permid)) {
        this.permlist.push(permid);
      }
    } else {
      this.permlist = this.permlist.filter(p => p !== permid);
    }
    console.log(this.permlist);
  }

  addGroup(){
    this.usergrp.addGroup(this.usergroupnm,this.permlist).subscribe(()=>{
      this.showForm="";
    });
  }

}
