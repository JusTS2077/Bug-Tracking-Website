import { Component,OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TagService } from '../services/tag-data';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-tag',
  templateUrl: './tag.component.html',
  styleUrl: '../../../../app/styles/tag.component.scss',
  standalone:true,
  imports:[FormsModule,CommonModule]
})
export class TagComponent implements OnInit{

  showForm="";

  tags!:any;
  tag_name = "";
  tag_remarks = "";

  constructor(private tagservice:TagService,private cd:ChangeDetectorRef) { }

  ngOnInit(): void {
    this.tagservice.getTags().subscribe(data => {
      this.tags = data;}
  )}

  validate=true;

  closeForm(){
    console.log("Form closed.");
    this.showForm='';
    this.validate=true;
  }

  addTag(){
    if(!this.tag_name || !this.tag_remarks){
      this.validate=false;
      return;
    }
    const newTag = {tagname:this.tag_name,tagremarks:this.tag_remarks};
    this.tagservice.addTags(newTag).subscribe(()=>{
      this.closeForm();
      this.ngOnInit();
      this.cd.detectChanges();
    });
  }

  showDelete=false;
  deleteid=0;

  returnId(user:any){
    this.deleteid = user.id;
    this.showDelete=true;
  }

  deleteTag(id:number){
    this.tagservice.deleteTag(id).subscribe(()=>{
      this.showDelete=false;
      this.ngOnInit();
    })
  }

  selectedUser:any = null;

  displayUpdateForm(selectedUser:any){
    this.selectedUser = {...selectedUser};
    this.showForm = "form2";
  } 

  updateTag(){
    const arr = {name:this.selectedUser.name,remarks:this.selectedUser.remarks};
    this.tagservice.updateTag(this.selectedUser.id,arr).subscribe(()=>{
      this.ngOnInit();
      this.showForm="";
    })
  }

  toggleTag(id:number){
    this.tagservice.toggleTag(id).subscribe(()=>{
      this.ngOnInit();
    })
  }
}
