import { Component, signal,OnChanges,SimpleChange, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserGroupServices } from './user-group.service';
import { OnInit } from '@angular/core';
import { MatSelect, MatOption, MatLabel, MatFormField } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-user-groups',
  imports: [FormsModule, CommonModule, MatSelect, MatOption, MatLabel, MatFormField, MatCheckboxModule],
  templateUrl: './user-groups.component.html',
  styleUrl: '../../../../app/styles/user-groups.component.scss',
})
export class UserGroupsComponent implements OnInit{

  constructor(private usergrp: UserGroupServices) {}

  isChecked = false;
  showForm = "";
  usergroupnm = "";
  selectedGroup:number|null = null;
  permlist = signal<number[]>([]);
  grp_permlist = signal<any[]>([]);
  grouplist!: any;
  perms!: any;
  count = 0;

  ngOnInit(): void {
    this.usergrp.getPerms().subscribe(data => {
      this.perms = data;
    });

    this.usergrp.getGroup().subscribe(data => {
      this.grouplist = data;
    });
  }
  hasChecked(event: any, permid: number) {
    if (event.checked) {
      if (!this.permlist().includes(permid)) {
        this.permlist.update(list => [...list, permid]);
      }
    } else {
      this.permlist.update(list => list.filter(p => p !== permid));
    }
    console.log("hasChecked called:", this.permlist());
  }

  addGroup() {
    this.usergrp.addGroup(this.usergroupnm, this.permlist()).subscribe(() => {
      this.permlist.set([]);
      this.closeForm();
      this.ngOnInit();
    });
  }

  showPerms() {
    if(!this.selectedGroup){
      this.permlist.set([]);
    }

    if(this.selectedGroup !== null){
      this.usergrp.getGroupPerms(this.selectedGroup).subscribe(data => {
        this.permlist.set(data.map((obj: any) => obj.perms_id));
        console.log(this.permlist());
      });
    }

  }

  closeForm(){
    this.showForm='';
    this.usergroupnm = '';
    this.selectedGroup = null;
    this.permlist.set([]);
  }
  
  isPermissionSelected(permid: number): boolean {
    const isSelected = this.permlist().includes(permid);
    return isSelected;
  }
  checkedBox(event: any, permid: number) {
    if (event.checked) {
      if (!this.permlist().includes(permid)) {
        this.permlist.update(list => [...list, permid]);
      }
    } else {
      this.permlist.update(list => list.filter(p => p !== permid));
    }
    console.log("Permissions list during updation",this.permlist());
  }

  updatePerms(){
    if(this.selectedGroup!==null){
      this.usergrp.updateGroupPerms(this.selectedGroup,this.permlist()).subscribe(()=>{
        this.closeForm();
        this.ngOnInit();
      })

    }
  }
}
