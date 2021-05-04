import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  AuthService,
  HttpService,
  ImageGenerateService,
  LoaderService,
  StorageService,
  UsersService
} from './services/index';
import { LoadingComponent } from './component/loading/loading.component';
// import { NgZorroAntdModule } from 'ng-zorro-antd';
import { IconsProviderModule } from '../icons-provider.module';
import { AuthGuard } from './guards/auth.guard';
import { SHARED_ZORRO_MODULES } from './shared-zorro.module';

@NgModule({
  declarations: [LoadingComponent],
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule],
  providers: [AuthGuard],
  exports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    LoadingComponent,
    RouterModule,
    ...SHARED_ZORRO_MODULES,
    IconsProviderModule,
  ],
})
export class SharedModule {
  static forRoot(): ModuleWithProviders<SharedModule> {
    return {
      ngModule: SharedModule,
      providers: [
        StorageService,
        HttpService,
        AuthService,
        LoaderService,
        ImageGenerateService,
        UsersService
      ],
    };
  }
}
