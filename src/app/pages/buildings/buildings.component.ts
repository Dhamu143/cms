import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzModalService } from 'ng-zorro-antd/modal';
import { BuildingsService } from 'src/app/shared/services/buildings.service';

@Component({
  selector: 'app-buildings',
  templateUrl: './buildings.component.html',
  styleUrls: ['./buildings.component.scss'],
})
export class BuildingsComponent implements OnInit {
  public listOfData = [];
  public validateForm!: FormGroup;
  public isVisible = false;
  public isEdit = false;
  public buildingId: string;
  public listOfControl: Array<{ id: number; controlInstance: string }> = [];
  public upgradeInfo: any = [];
  public editUpgradeInfo: { [key: string]: { edit: boolean; data: any } } = {};
  public sortName = null;
  public sortValue = null;
  public searchAddress = [];
  public searchValue = '';
  public listOfFilterData = [];
  constructor(
    private fb: FormBuilder,
    private buildingsService: BuildingsService,
    private modal: NzModalService,
    private notification: NzNotificationService
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.getBuildings();
  }

  createForm(): void {
    this.validateForm = this.fb.group({
      name: [null, [Validators.required]],
      unlockLevel: [null, [Validators.required]],
      type: ['shop', [Validators.required]],
      subType: [null, [Validators.required]],
      imageUrl: [null],
      imageInfo: this.fb.group({
        type: ['normal', [Validators.required]],
        name: [null],
        file: ['Components/building_img.csb'],
      }),
      enabled: [true],
      dialogues: this.fb.array([]),
    });
  }

  getBuildings(): void {
    this.buildingsService.getBuildings().subscribe((res: any) => {
      this.listOfData = res?.data;
      this.listOfFilterData = [...res?.data];
      this.changeBuilding('shop');
    });
  }

  editBuildings(data): void {
    this.isEdit = true;
    this.buildingId = data._id;
    if (
      data &&
      data.dialogues &&
      data.dialogues[0] &&
      data.dialogues[0].indexOf(',') != -1
    ) {
      const dialoguesdata = data?.dialogues[0]?.split(',');
      for (let index = 0; index < dialoguesdata.length; index++) {
        this.dialogues().push(this.fb.group({ name: dialoguesdata[index] }));
      }
    } else if (data && data.dialogues && data.dialogues.length) {
      for (let index = 0; index < data.dialogues.length; index++) {
        this.dialogues().push(this.fb.group({ name: data.dialogues[index] }));
      }
    }
    this.validateForm.patchValue({
      name: data.name,
      unlockLevel: data.unlockLevel,
      type: data.type,
      subType: data.subType,
      imageUrl: data.imageUrl,
      imageInfo: {
        type: data?.imageInfo?.type,
        name: data?.imageInfo?.name,
        file: data?.imageInfo?.file,
      },
      enabled: data.enabled,
    });
    this.upgradeInfo = data?.upgradeInfo;
    this.updateUpgradeInfo();
    this.showModal();
  }

  addUpgradeInfo() {
    return [
      {
        level: 0,
        maxCoins: 0,
        usageFee: 0,
        cost: 0,
        speedUpCost: 0,
        appeal: 0,
        time: 0,
        initialCoins: 0,
        coinRate: 0,
      },
    ];
  }

  submitForm(): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }

    if (this.validateForm.valid) {
      let dialogues = [];
      const dialoguesdata = this.validateForm.get('dialogues').value;
      for (let index = 0; index < dialoguesdata.length; index++) {
        dialogues.push(dialoguesdata[index]?.name);
      }
      if (!this.isEdit) {
        this.buildingsService
          .addBuildings(
            Object.assign(this.validateForm.value, {
              upgradeInfo: this.addUpgradeInfo(),
              dialogues: dialogues,
              folderName: this.validateForm.get('type').value,
            })
          )
          .subscribe((res: any) => {
            this.getBuildings();
            this.handleCancel();
            this.notification.create('success', 'Success', 'Save Successfully');
          });
      } else {
        this.buildingsService
          .updateBuildings(
            this.buildingId,
            Object.assign(this.validateForm.value, {
              upgradeInfo: this.upgradeInfo,
              dialogues: dialogues,
              folderName: this.validateForm.get('type').value,
            })
          )
          .subscribe((res: any) => {
            this.getBuildings();
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
    this.validateForm.reset({
      type: 'shop',
      imageInfo: {
        type: 'normal',
        name: null,
        file: 'Components/building_img.csb',
      },
    });
    this.validateForm.setControl('dialogues', new FormArray([]));
    (<HTMLInputElement>document.getElementById('imagefile')).value = '';
  }

  deleteBuildings(buildingId: string): void {
    this.modal.confirm({
      nzTitle: 'Are you sure delete?',
      nzOkText: 'Yes',
      nzOkType: 'danger',
      nzOnOk: () => {
        this.buildingsService
          .deleteBuildings(buildingId)
          .subscribe((res: any) => {
            // if(res.status) {
            this.getBuildings();
            this.notification.create(
              'success',
              'Success',
              'Delete Successfully'
            );
            // }
          });
      },
      nzCancelText: 'No',
    });
  }

  dialogues(): FormArray {
    return this.validateForm.get('dialogues') as FormArray;
  }

  addDialogue(): void {
    this.dialogues().push(this.fb.group({ name: [''] }));
  }

  removeDialogue(id: number): void {
    this.dialogues().removeAt(id);
  }

  addRow(): void {
    this.upgradeInfo = [
      ...this.upgradeInfo,
      {
        level: 0,
        maxCoins: 50,
        initialCoins: 0,
        usageFee: 5,
        cost: 100,
        speedUpCost: 3,
        appeal: 5,
        time: 60,
        coinRate: 0,
      },
    ];
    this.updateUpgradeInfo();
  }

  updateUpgradeInfo(): void {
    this.upgradeInfo.forEach((item, index) => {
      this.editUpgradeInfo[index] = {
        edit: false,
        data: { ...item },
      };
    });
  }

  startUpgradeInfo(id: number): void {
    this.editUpgradeInfo[id].edit = true;
  }

  saveUpgradeInfo(id: number): void {
    Object.assign(this.upgradeInfo[id], this.editUpgradeInfo[id].data);
    this.editUpgradeInfo[id].edit = false;
  }

  sort(sort: { key: string; value: string }): void {
    this.sortName = sort.key;
    this.sortValue = sort.value;
    this.search();
  }

  search(): void {
    const filterFunc = (item) => {
      return (
        (this.searchAddress.length
          ? this.searchAddress.some(
              (address) => item.address.indexOf(address) !== -1
            )
          : true) && item.name.indexOf(this.searchValue) !== -1
      );
    };
    const data = this.listOfData.filter((item) => filterFunc(item));
    this.listOfData = data.sort((a, b) =>
      this.sortValue === 'ascend'
        ? a[this.sortName] > b[this.sortName]
          ? 1
          : -1
        : b[this.sortName] > a[this.sortName]
        ? 1
        : -1
    );
  }

  changeBuilding(val): void {
    const buildingFilter = [...this.listOfFilterData].filter(
      (resp) => resp.type === val
    );
    this.listOfData =
      val === 'all' ? [...this.listOfFilterData] : buildingFilter;
  }
}
