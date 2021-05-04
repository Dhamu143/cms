import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzModalService } from 'ng-zorro-antd/modal';
import { LevelsService } from '../../shared/services/levels.service';

@Component({
  selector: 'app-levels',
  templateUrl: './levels.component.html',
  styleUrls: ['./levels.component.scss'],
})
export class LevelsComponent implements OnInit {
  public listOfData = [];
  public validateForm!: FormGroup;
  public isVisible = false;
  public isEdit = false;
  public levelId: string;

  constructor(
    private fb: FormBuilder,
    private levelsService: LevelsService,
    private modal: NzModalService,
    private notification: NzNotificationService
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.getLevels();
  }

  createForm(): void {
    this.validateForm = this.fb.group({
      level: [null, [Validators.required]],
      maxCoins: [null, [Validators.required]],
      upgradeCost: [null, [Validators.required]],
      maxShoppers: [null, [Validators.required]],
      maxFloors: [null, [Validators.required]],
      landSize: this.fb.group({
        width: [null],
        height: [null],
      }),
    });
  }

  getLevels(): void {
    this.levelsService.getLevels().subscribe((res: any) => {
      this.listOfData = res.data;
    });
  }

  editLevels(data): void {
    this.isEdit = true;
    this.levelId = data._id;
    this.validateForm.patchValue({
      level: data.level,
      maxCoins: data.maxCoins,
      upgradeCost: data.upgradeCost,
      maxShoppers: data.maxShoppers,
      maxFloors: data.maxFloors,
      landSize: {
        width: data?.landSize?.width,
        height: data?.landSize?.height,
      },
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
        this.levelsService
          .addLevels(this.validateForm.value)
          .subscribe((res: any) => {
            this.getLevels();
            this.handleCancel();
            this.notification.create('success', 'Success', 'Save Successfully');
          });
      } else {
        this.levelsService
          .updateLevels(this.levelId, this.validateForm.value)
          .subscribe((res: any) => {
            this.getLevels();
            this.handleCancel();
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
    this.validateForm.reset();
  }

  deleteLevels(levelId: string): void {
    this.modal.confirm({
      nzTitle: 'Are you sure delete?',
      nzOkText: 'Yes',
      nzOkType: 'danger',
      nzOnOk: () => {
        this.levelsService.deleteLevels(levelId).subscribe((res: any) => {
          this.notification.create('success', 'Success', 'Delete Successfully');
          this.getLevels();
        });
      },
      nzCancelText: 'No',
    });
  }
}
