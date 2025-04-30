import { Component,OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { jwtDecode } from "jwt-decode";
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-manage',
  imports: [RouterModule,MatTabsModule,FormsModule,CommonModule],
  standalone:true,
  templateUrl: './manage.component.html',
  styleUrls: ['../../../app/styles/manage.component.scss']
})
export class ManageComponent implements OnInit{
  tabPanel!:any  
  selectedTabIndex=0;
  activeTab = "";
  token!:any;
  decodedToken!:any;

  constructor(private auth:AuthService){}

  ngOnInit(): void {
    this.token = this.auth.getToken();
    this.decodedToken = jwtDecode(this.token);
  }
}
