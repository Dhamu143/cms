import { BrowserModule } from '@angular/platform-browser';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { en_US } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { LayoutComponent } from './layout/layout.component';
import { PageModule } from './pages/page.module';
import { SharedModule } from './shared/shared.module';
import { ProgressInterceptor } from './shared/interceptor/progress.interceptor';
import { TokenInterceptor } from './shared/interceptor/token.interceptor';
registerLocaleData(en);

@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    PageModule,
    SharedModule.forRoot(),
  ],
  providers: [
    { provide: NZ_I18N,
       useValue: en_US 
      },
    {
    provide: HTTP_INTERCEPTORS,
    useClass: ProgressInterceptor,
    multi: true
  },
  {
    provide: HTTP_INTERCEPTORS,
    useClass: TokenInterceptor,
    multi: true
  },
  ],
  bootstrap: [AppComponent],
  schemas: [NO_ERRORS_SCHEMA]
})
export class AppModule { }
