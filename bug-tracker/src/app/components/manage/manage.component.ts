import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-manage',
  imports: [RouterModule,MatTabsModule,FormsModule,CommonModule],
  standalone:true,
  templateUrl: './manage.component.html',
  styleUrls: ['../../../app/styles/manage.component.scss']
})
export class ManageComponent {
  tabPanel!:any  
  selectedTabIndex=0;
  activeTab = "";
}
