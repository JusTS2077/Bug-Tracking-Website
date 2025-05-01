import { Component, OnInit } from '@angular/core';
import { UserServices } from '../services/user-data';
import { ProjectService } from '../services/project-data';
import { UserGroupServices } from '../user-groups/user-group.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import {MatSelectModule} from '@angular/material/select';
import { MatOption } from '@angular/material/select';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrl: '../../../../app/styles/user.component.scss',
  imports:[FormsModule,CommonModule,MatSelectModule,MatOption],
  standalone:true
})

export class UserComponent implements OnInit{


  //for the input form
  departments: string[] = ['HR','IT','Finance'];
  usernm="";
  passwd="";
  email="";
  firstnm="";
  lastnm="";
  selectedDept = "";
  selectedItems:any[] = [];

  //show forms
  showForm="";

  userform=false;
  updateform=false;

  users!:any;
  
  dropdownList:string[] = [];
  dropdownready=false;

  usergrouplist!:any;
  selectedGroup="";

  constructor(private apiservice:UserServices,
    private cd:ChangeDetectorRef,
    private projectservice:ProjectService,
    private usergrpservice:UserGroupServices) {}

  ngOnInit(): void {
  
    this.apiservice.getUsers().subscribe((data) => {
      console.log("Users data", data);
      this.users = data;
      data.forEach((element:any) => {
        console.log("Users",element);
        if(element.projects){
          element.projects.forEach((ele:any) => {
            this.dropdownList.push(ele)
          });
        }
      });
    });
  
    this.projectservice.getProjects().subscribe((data) => {
      console.log("Raw projects data:", data);

      const proj_names = data.map((proj:any)=>proj.name);
      console.log("Project names:", proj_names);

      this.dropdownList.push(...proj_names);
    });
      this.dropdownready=true;

    this.usergrpservice.getGroup().subscribe(data=>{
      this.usergrouplist = data;
    })

      console.log("Dropdown List (mapped):", this.dropdownList);
      this.cd.detectChanges();
  }
  

  closeForm(){
    this.showForm="";
    this.validate=true;
  }

  validate=true;
  addUser(){

    console.log("Selected projects",this.selectedItems);
    if (!this.usernm || !this.passwd || !this.email || !this.firstnm || !this.lastnm || !this.selectedDept || !this.selectedItems || !this.selectedGroup) {
      this.validate = false;
      return;
    }

    const newUser = {usernm:this.usernm,password:this.passwd,email:this.email,firstname:this.firstnm,lastname:this.lastnm,projects:this.selectedItems,role:this.selectedGroup,department:this.selectedDept};
    this.apiservice.addUser(newUser).subscribe(()=>{
      this.closeForm();
      this.ngOnInit();  
    });
  }

  showDelete=false;
  deleteid=0;

  returnId(user:any){
    this.deleteid = user.user_id;
    this.showDelete=true;
  }

  deleteUser(id:number){
    this.apiservice.deleteUser(id).subscribe(response=>{
      console.log(response);
      this.ngOnInit();
      this.showDelete=false;
    });
  }

  //UPDATE USER
  selectedUser:any = null;

  displayUpdateForm(selectedUser:any){
    this.selectedUser = {...selectedUser};
    console.log(this.selectedUser);
    this.showForm = "form2";
    this.cd.detectChanges();
  } 

  updateUser() {

    if (!this.selectedUser.usernm||!this.selectedUser.email || !this.selectedUser.firstname || !this.selectedUser.lastname || !this.selectedUser.department) {
      alert('Please fill in all fields!');
      return;
    }

    const updateuser = {usernm:this.selectedUser.usernm,password:this.selectedUser.password,email:this.selectedUser.email,firstname:this.selectedUser.firstname,lastname:this.selectedUser.lastname,projects:this.selectedUser.projects, role:this.selectedUser.role,department:this.selectedUser.department}

    this.apiservice.updateUser(this.selectedUser.user_id,this.selectedUser).subscribe(()=>{
      this.ngOnInit();
    })
  }

  toggleUser(id:number){
    this.apiservice.toggleUser(id).subscribe(()=>{
      this.ngOnInit();
    })
  }

}


