import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NotificationsService } from 'src/app/shared/services/notifications.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
})
export class NotificationsComponent implements OnInit {
  public listOfData = [];
  public validateForm!: FormGroup;
  public isVisible = false;
  public isEdit = false;
  public notificationId: string;

  constructor(
    private fb: FormBuilder,
    private notificationsService: NotificationsService,
    private modal: NzModalService,
    private notification: NzNotificationService
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.getNotifications();
    // this.frequencychange();
  }

  createForm(): void {
    this.validateForm = this.fb.group({
      name: [null, [Validators.required]],
      data: this.fb.group({
        message: [null, [Validators.required]],
      }),
      type: ['inapp', [Validators.required]],
      deliveryDate: [null, [Validators.required]],
      enabled: [true, [Validators.required]],
      isRepeat: ['false'],
      frequency: ['once'],
    });
  }

  getNotifications(): void {
    this.notificationsService.getNotifications().subscribe((res: any) => {
      this.listOfData = res.data;
    });
  }

  editNotifications(data): void {
    this.isEdit = true;
    this.notificationId = data._id;
    this.validateForm.patchValue({
      name: data.name,
      data: { message: data?.data?.message },
      type: data.type,
      deliveryDate: data.deliveryDate,
      enabled: data.enabled,
      isRepeat: data.isRepeat ? 'true' : 'false',
      frequency: data.frequency,
    });
    this.showModal();
  }

  onChangeRepeat(val) {
    if (val === 'false') this.validateForm.get('frequency').setValue('once');
    else if (
      val === 'true' &&
      this.validateForm.get('frequency').value == 'once'
    )
      this.validateForm.get('frequency').setValue('daily');
    else if (
      val === 'true' &&
      this.validateForm.get('isRepeat').value == 'daily'
    )
      this.validateForm.get('frequency').setValue('daily');
    else if (
      val === 'true' &&
      this.validateForm.get('isRepeat').value == 'weekly'
    )
      this.validateForm.get('frequency').setValue('weekly');
    else if (
      val === 'true' &&
      this.validateForm.get('isRepeat').value == 'monthly'
    )
      this.validateForm.get('frequency').setValue('monthly');
  }

  onChangeFrequency(val) {
    this.validateForm
      .get('isRepeat')
      .setValue(val === 'once' ? 'false' : 'true');
  }

  submitForm(): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    if (this.validateForm.valid) {
      if (!this.isEdit) {
        this.notificationsService
          .addNotifications(this.validateForm.value)
          .subscribe((res: any) => {
            this.handleCancel();
            this.getNotifications();
            this.notification.create('success', 'Success', 'Save Successfully');
          });
      } else {
        this.notificationsService
          .updateNotifications(this.notificationId, this.validateForm.value)
          .subscribe((res: any) => {
            this.handleCancel();
            this.getNotifications();
            this.notification.create(
              'success',
              'Success',
              'Upadate Successfully'
            );
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
    this.validateForm.reset({
      type: 'inapp',
      enabled: true,
      isRepeat: 'false',
      frequency: 'once',
    });
  }

  deleteNotifications(NotificationId: string): void {
    this.modal.confirm({
      nzTitle: 'Are you sure delete?',
      nzOkText: 'Yes',
      nzOkType: 'danger',
      nzOnOk: () => {
        this.notificationsService
          .deleteNotifications(NotificationId)
          .subscribe((res: any) => {
            this.notification.create(
              'success',
              'Success',
              'Delete Successfully'
            );
            this.getNotifications();
          });
      },
      nzCancelText: 'No',
    });
  }
}
