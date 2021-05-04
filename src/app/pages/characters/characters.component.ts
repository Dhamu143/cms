import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { CharactersService } from 'src/app/shared/services/characters.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-characters',
  templateUrl: './characters.component.html',
  styleUrls: ['./characters.component.scss'],
})
export class CharactersComponent implements OnInit {
  public listOfData = [];
  public validateForm!: FormGroup;
  public isVisible = false;
  public isEdit = false;
  public characterId: string;
  public listOfControl: Array<{ id: number; controlInstance: string }> = [];
  public utilitiesData = [];

  constructor(
    private fb: FormBuilder,
    private charactersService: CharactersService,
    private modal: NzModalService,
    private notification: NzNotificationService
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.getCharacter();
    this.geUtilities();
  }

  createForm(): void {
    this.validateForm = this.fb.group({
      name: [null, [Validators.required]],
      type: [null, [Validators.required]],
      maxCoins: [null, [Validators.required]],
      unlockLevel: [null, [Validators.required]],
      animationFile: [null],
      imageUrl: [null],
      gender: [null, [Validators.required]],
      category: ['normal'],
      cost: [0],
      generic: this.fb.array([]),
      inShop: this.fb.array([]),
      afterShop: this.fb.array([]),
      frontDesk: this.fb.array([]),
      nearDecor: this.fb.array([]),
      excludedUtilities: [[]],
    });
  }

  getCharacter(): void {
    this.charactersService.getCharacters().subscribe((res: any) => {
      this.listOfData = res.data;
    });
  }

  geUtilities(): void {
    this.charactersService.getUtilities().subscribe((res: any) => {
      this.utilitiesData = res.data;
    });
  }

  isNotSelected(value: string): boolean {
    return (
      this.validateForm.get('excludedUtilities')?.value?.indexOf(value) === -1
    );
  }

  editCharacter(data): void {
    this.isEdit = true;
    this.characterId = data._id;
    if (data && data.dialogues) {
      const dialoguesdata = data?.dialogues;
      for (let index = 0; index < dialoguesdata?.generic.length; index++) {
        this.generic().push(
          this.fb.group({ name: dialoguesdata.generic[index] })
        );
      }
      for (let index = 0; index < dialoguesdata?.inShop.length; index++) {
        this.inShop().push(
          this.fb.group({ name: dialoguesdata.inShop[index] })
        );
      }
      for (let index = 0; index < dialoguesdata?.afterShop.length; index++) {
        this.afterShop().push(
          this.fb.group({ name: dialoguesdata.afterShop[index] })
        );
      }
      for (let index = 0; index < dialoguesdata?.frontDesk.length; index++) {
        this.frontDesk().push(
          this.fb.group({ name: dialoguesdata.frontDesk[index] })
        );
      }
      for (let index = 0; index < dialoguesdata?.nearDecor.length; index++) {
        this.nearDecor().push(
          this.fb.group({ name: dialoguesdata.nearDecor[index] })
        );
      }
    }
    this.validateForm.patchValue({
      name: data.name,
      type: data.type,
      unlockLevel: data.unlockLevel,
      maxCoins: data.maxCoins,
      category: data.category,
      gender: data.gender,
      animationFile: data.animationFile,
      imageUrl: data.imageUrl,
      excludedUtilities: data.excludedUtilities,
      cost: data.cost,
    });
    this.showModal();
  }
  getDialogue(type) {
    let dialogues = [];
    const dialoguesdata = this.validateForm.get(type).value;
    for (let index = 0; index < dialoguesdata.length; index++) {
      dialogues.push(dialoguesdata[index]?.name);
    }
    return dialogues;
  }

  submitForm(): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    if (this.validateForm.valid) {
      let body: any = {
        name: this.validateForm.get('name').value,
        type: this.validateForm.get('type').value,
        maxCoins: this.validateForm.get('maxCoins').value,
        unlockLevel: this.validateForm.get('unlockLevel').value,
        animationFile: this.validateForm.get('animationFile').value,
        imageUrl: this.validateForm.get('imageUrl').value,
        gender: this.validateForm.get('gender').value,
        category: this.validateForm.get('category').value,
        excludedUtilities: this.validateForm.get('excludedUtilities').value,
        cost: this.validateForm.get('cost').value,
        dialogues: {
          generic: this.getDialogue('generic'),
          inShop: this.getDialogue('inShop'),
          afterShop: this.getDialogue('afterShop'),
          frontDesk: this.getDialogue('frontDesk'),
          nearDecor: this.getDialogue('nearDecor'),
        },
      };
      if (!this.isEdit) {
        this.charactersService.addCharacters(body).subscribe((res: any) => {
          this.getCharacter();
          this.handleCancel();
          this.notification.create('success', 'Success', 'Save Successfully');
        });
      } else {
        this.charactersService
          .updateCharacters(this.characterId, body)
          .subscribe((res: any) => {
            this.getCharacter();
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

  deleteCharacter(characterId: string): void {
    this.modal.confirm({
      nzTitle: 'Are you sure delete?',
      nzOkText: 'Yes',
      nzOkType: 'danger',
      nzOnOk: () => {
        this.charactersService
          .deleteCharacters(characterId)
          .subscribe((res: any) => {
            // if(res.status) {
            this.getCharacter();
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

  showModal(): void {
    this.isVisible = true;
  }

  handleCancel(): void {
    this.isVisible = false;
    this.isEdit = false;
    this.validateForm.reset({
      category: 'normal',
      cost: 0,
    });
    this.validateForm.setControl('generic', new FormArray([]));
    this.validateForm.setControl('inShop', new FormArray([]));
    this.validateForm.setControl('afterShop', new FormArray([]));
    this.validateForm.setControl('frontDesk', new FormArray([]));
    this.validateForm.setControl('nearDecor', new FormArray([]));
    (<HTMLInputElement>document.getElementById('imagefile')).value = '';
  }

  generic(): FormArray {
    return this.validateForm.get('generic') as FormArray;
  }

  inShop(): FormArray {
    return this.validateForm.get('inShop') as FormArray;
  }
  afterShop(): FormArray {
    return this.validateForm.get('afterShop') as FormArray;
  }
  frontDesk(): FormArray {
    return this.validateForm.get('frontDesk') as FormArray;
  }
  nearDecor(): FormArray {
    return this.validateForm.get('nearDecor') as FormArray;
  }

  addDialogue(type): void {
    if (type === 'generic') this.generic().push(this.fb.group({ name: [''] }));
    else if (type === 'inShop')
      this.inShop().push(this.fb.group({ name: [''] }));
    else if (type === 'afterShop')
      this.afterShop().push(this.fb.group({ name: [''] }));
    else if (type === 'frontDesk')
      this.frontDesk().push(this.fb.group({ name: [''] }));
    else if (type === 'nearDecor')
      this.nearDecor().push(this.fb.group({ name: [''] }));
  }

  removeDialogue(id: number, type: string): void {
    if (type === 'generic') this.generic().removeAt(id);
    else if (type === 'inShop') this.inShop().removeAt(id);
    else if (type === 'afterShop') this.afterShop().removeAt(id);
    else if (type === 'frontDesk') this.frontDesk().removeAt(id);
    else if (type === 'nearDecor') this.nearDecor().removeAt(id);
  }
}
