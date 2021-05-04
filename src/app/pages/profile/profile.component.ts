import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsersService } from '../../shared/services';
import { NzNotificationService } from 'ng-zorro-antd/notification';
declare var JSONEditor: any;

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  public validateForm!: FormGroup;
  public listOfData = [];
  public shopsData = [];
  public decorativeData = [];
  public utilitiesData = [];
  public defaultProfile: any = {};
  public editor: any;
  public editProfileCache: { [key: string]: { edit: boolean; data: [] } } = {};
  public visible: boolean = false;

  constructor(
    private usersService: UsersService,
    private fb: FormBuilder,
    private notification: NzNotificationService
  ) {}

  ngOnInit(): void {
    this.usersService.defaultProfile().subscribe((res: any) => {
      this.listOfData = res?.data?.buildings;
      this.updateEditProfile();
      var container = document.getElementById('jsoneditor');
      var options = {
        mode: 'tree',
        filter: false,
      };
      this.editor = new JSONEditor(container, options);
      this.defaultProfile = res.data;
      this.editor.set(this.defaultProfile);
      //  json = editor.get();
    });
    this.createForm();
    this.loadShops();
    this.loadDecorative();
    this.loadUtilities();
  }

  updateEditProfile(): void {
    this.listOfData.forEach((item) => {
      this.editProfileCache[item.buildingId] = {
        edit: false,
        data: { ...item },
      };
    });
  }

  startEditProfile(id: string): void {
    this.editProfileCache[id].edit = true;
  }

  cancelEditProfile(id: string): void {
    const index = this.listOfData.findIndex((item) => item.buildingId === id);
    this.editProfileCache[id] = {
      data: { ...this.listOfData[index] },
      edit: false,
    };
  }

  saveEditProfile(id: string): void {
    const index = this.listOfData.findIndex((item) => item.buildingId === id);
    Object.assign(this.listOfData[index], this.editProfileCache[id].data);
    this.editProfileCache[id].edit = false;
    this.editor.set(this.defaultProfile);
  }

  createForm(): void {
    this.validateForm = this.fb.group({
      type: ['shop'],
      typeId: [null, [Validators.required]],
      positionx: [null],
      positiony: [null],
    });
  }

  loadShops(): void {
    this.usersService.getShops().subscribe((res: any) => {
      if (res?.data?.length) this.shopsData = res.data;
    });
  }

  loadDecorative(): void {
    this.usersService.getDecorative().subscribe((res: any) => {
      if (res?.data?.length) this.decorativeData = res.data;
    });
  }

  loadUtilities(): void {
    this.usersService.getUtilities().subscribe((res: any) => {
      if (res?.data?.length) this.utilitiesData = res.data;
    });
  }

  open(): void {
    this.visible = true;
  }

  close(): void {
    this.visible = false;
    this.validateForm.reset({
      type: 'shop',
    });
  }

  taskTypeChange(event): void {
    this.validateForm.get('typeId').setValue('');
  }

  saveBuilder(): void {
    this.usersService
      .updateDefaultProfile(this.editor.get())
      .subscribe((res: any) => {
        if (res?.data) {
          this.notification.create('success', 'Success', res?.data?.message);
        }
      });
  }

  submitForm(): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    if (this.validateForm.valid) {
      let buildingdata: any = [];
      if (this.validateForm.get('type').value === 'shop')
        buildingdata = this.shopsData.filter(
          (resp) => resp.subType === this.validateForm.get('typeId').value
        );
      else if (this.validateForm.get('type').value === 'decorative')
        buildingdata = this.decorativeData.filter(
          (resp) => resp.subType === this.validateForm.get('typeId').value
        );
      else if (this.validateForm.get('type').value === 'utility')
        buildingdata = this.utilitiesData.filter(
          (resp) => resp.subType === this.validateForm.get('typeId').value
        );

      if (buildingdata?.length) {
        this.defaultProfile.buildings.push({
          appeal: buildingdata[0]?.upgradeInfo[0]?.appeal,
          buildingId: this.listOfData?.length + 1,
          currentCoins: 0,
          level: 1,
          maxCoins: buildingdata[0]?.upgradeInfo[0]?.maxCoins,
          name: buildingdata[0]?.name,
          position: {
            xPosition: this.validateForm.get('positionx').value,
            yPosition: this.validateForm.get('positiony').value,
          },
          rotated: false,
          state: 3,
          stored: false,
          subType: this.validateForm.get('typeId').value,
          type: this.validateForm.get('type').value,
          usageFee: buildingdata[0]?.upgradeInfo[0]?.usageFee,
        });
        this.editor.set(this.defaultProfile);
        this.listOfData = this.defaultProfile?.buildings;
        this.updateEditProfile();
        this.close();
      }
    }
  }

  deleteBuilding(index): void {
    if (index > -1) {
      this.defaultProfile.buildings.splice(index, 1);
      this.editor.set(this.defaultProfile);
    }
  }
}
