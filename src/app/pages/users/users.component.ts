import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import { StorageService,UsersService } from '../../shared/services';
import { NzNotificationService } from 'ng-zorro-antd/notification';


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
  public listOfData = [];
  public validateForm!: FormGroup;
  public isVisible = false;
  public isEdit = false;
  public userId: string;
  public loginUser: string;

  constructor(
    private fb: FormBuilder,
    private usersService: UsersService,
    private storageService: StorageService,
    private modal: NzModalService,
    private notification: NzNotificationService
  ) {
    this.loginUser = this.storageService.get('token');
  }

  ngOnInit(): void {
    this.createForm();
    this.getUsers();
  }

  createForm(): void {
    this.validateForm = this.fb.group({
      email: ['', [Validators.email, Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  getUsers(): void {
    this.usersService.getUsers().subscribe((res: any) => {
      this.listOfData = res.data;
    });
  }

  editUsers(data): void {
    this.isEdit = true;
    this.userId = data._id;
    this.validateForm.patchValue({
      email: data.email,
      password: data.password,
    });
    this.showModal();
  }

  submitForm(): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    if (this.validateForm.valid) {
      if (!this.isEdit) {
        this.usersService
          .addUsers(this.validateForm.value)
          .subscribe((res: any) => {
            if (res.status) {
              this.getUsers();
              this.handleCancel();
              this.notification.create('success', 'Success', res.message);
            } else {
              this.notification.create('error', 'Error', res.message);
            }
          });
      } else {
        this.usersService
          .updateUsers(this.userId, this.validateForm.value)
          .subscribe((res: any) => {
            if (res?.data) {
              this.getUsers();
              this.handleCancel();
              this.notification.create(
                'success',
                'Success',
                'Upadate Successfully'
              );
            }
          });
      }
    }
  }

  showModal(): void {
    this.isVisible = true;
  }

  handleCancel(): void {
    this.isVisible = false;
    this.isEdit = false;
    this.validateForm.reset();
  }

  deleteUsers(UserId: string): void {
    this.modal.confirm({
      nzTitle: 'Are you sure delete?',
      nzOkText: 'Yes',
      nzOkType: 'danger',
      nzOnOk: () => {
        this.usersService.deleteUsers(UserId).subscribe((res: any) => {
          if (res.status) {
            this.getUsers();
            this.notification.create('success', 'Success', res.message);
          }
        });
      },
      nzCancelText: 'No',
    });
  }
}
