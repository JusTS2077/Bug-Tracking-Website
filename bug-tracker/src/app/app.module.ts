import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule} from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { UserServices } from './components/manage/services/user-data';
import { AuthInterceptor } from './components/auth/auth.interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

@NgModule({
    declarations:[],
    imports:[
        AppComponent,
        BrowserModule,
        RouterModule,
        FormsModule,
        ],
    providers:[UserServices,
        {
            provide:HTTP_INTERCEPTORS,
            useClass:AuthInterceptor,
            multi:true
        }
]
})
export class AppModule{}