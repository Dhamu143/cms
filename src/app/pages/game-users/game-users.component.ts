import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import { GameUsersService } from '../../shared/services/game-users.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-game-users',
  templateUrl: './game-users.component.html',
  styleUrls: ['./game-users.component.scss'],
})
export class GameUsersComponent implements OnInit {
  public listOfData = [];
  public validateForm!: FormGroup;
  public isVisible = false;
  public UserId: string;
  public dataparam = {
    deviceFilter: '',
    userFilter: '',
    searchOn: '',
    search: '',
  };
  expandSet = new Set<number>();

  onExpandChange(id: number, checked: boolean): void {
    if (checked) {
      this.expandSet.add(id);
    } else {
      this.expandSet.delete(id);
    }
  }

  constructor(
    private fb: FormBuilder,
    private gameUsersService: GameUsersService,
    private modal: NzModalService,
    private notification: NzNotificationService
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.getGameUsers();
  }

  createForm(): void {
    this.validateForm = this.fb.group({
      name: [null],
      deviceId: [null, [Validators.required]],
      device: [null, [Validators.required]],
      coins: [null, [Validators.required]],
      diamonds: [null, [Validators.required]],
      fbId: [null],
      level: [null, [Validators.required]],
      pushToken: [null],
      xp: [null],
    });
  }

  getGameUsers(): void {
    this.gameUsersService.getGameUsers(this.dataparam).subscribe((res: any) => {
      this.listOfData = res.data;
    });
  }

  editUsers(data): void {
    this.UserId = data._id;
    this.validateForm.patchValue({
      name: data.name,
      device: data.device,
      coins: data.coins,
      deviceId: data.deviceId,
      level: data.level,
      xp: data.xp,
      diamonds: data.diamonds,
      pushToken: data.pushToken,
      fbId: data.fbId,
    });
    this.showModal();
  }

  submitForm(): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    if (this.validateForm.valid) {
      this.gameUsersService
        .updateGameUsers(this.UserId, this.validateForm.value)
        .subscribe((res: any) => {
          this.handleCancel();
          this.getGameUsers();
          this.notification.create(
            'success',
            'Success',
            'Upadate Successfully'
          );
        });
    }
  }

  showModal(): void {
    this.isVisible = true;
  }

  handleCancel(): void {
    this.isVisible = false;
    this.validateForm.reset();
  }

  deleteUsers(UserId: string): void {
    this.modal.confirm({
      nzTitle: 'Are you sure delete?',
      nzOkText: 'Yes',
      nzOkType: 'danger',
      nzOnOk: () => {
        this.gameUsersService.deleteGameUsers(UserId).subscribe((res: any) => {
          if (res.status) {
            this.getGameUsers();
            this.notification.create('success', 'Success', res.message);
          }
        });
      },
      nzCancelText: 'No',
    });
  }
  onChangeUser(data, type): void {
    if (type === 'devicetype') this.dataparam.deviceFilter = data;
    else if (type === 'userfilter') this.dataparam.userFilter = data;
    else if (type === 'searchOn') this.dataparam.searchOn = data;
    // else if (type === 'searchOn' && !data)
    //   this.dataparam.search = '';
    if (type !== 'searchOn') this.getGameUsers();
  }

  searchUser(): void {
    this.getGameUsers();
  }
}
