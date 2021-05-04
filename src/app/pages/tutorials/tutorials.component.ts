import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzModalService } from 'ng-zorro-antd/modal';
import { TutorialsService } from 'src/app/shared/services/tutorials.service';

@Component({
  selector: 'app-tutorials',
  templateUrl: './tutorials.component.html',
  styleUrls: ['./tutorials.component.scss'],
})
export class TutorialsComponent implements OnInit {
  public listOfData = [];
  public validateForm!: FormGroup;
  public isVisible = false;
  public isEdit = false;
  public tutorialId: string;

  constructor(
    private fb: FormBuilder,
    private tutorialsService: TutorialsService,
    private modal: NzModalService,
    private notification: NzNotificationService
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.getTutorials();
  }

  createForm(): void {
    this.validateForm = this.fb.group({
      id: [null, [Validators.required]],
      name: [null, [Validators.required]],
      text: [null],
      next: [null],
      trigger: this.fb.group({
        type: ['none', [Validators.required]],
        value: [null],
      }),
      pointerType: ['hand', [Validators.required]],
      type: ['ui'],
      positionPath: [null],
      position: this.fb.group({ x: [null], y: [null] }),
      offset: this.fb.group({ x: [null], y: [null] }),
      size: this.fb.group({ width: [null], height: [null] }),
      orientation: [null],
    });
  }

  getTutorials(): void {
    this.tutorialsService.getTutorials().subscribe((res: any) => {
      this.listOfData = res.data;
    });
  }

  editTutorials(data): void {
    this.isEdit = true;
    this.tutorialId = data._id;
    var pointerdata = data.pointerType === 'hand' ? data?.hand : data?.arrow;
    this.validateForm.patchValue({
      id: data.id,
      name: data.name,
      text: data.text,
      next: data.next,
      pointerType: data.pointerType,
      trigger: { type: data?.trigger?.type, value: data?.trigger?.value },
      type: pointerdata.type,
      positionPath: pointerdata?.positionPath,
      position: { x: pointerdata?.position?.x, y: pointerdata?.position?.y },
      offset: { x: pointerdata?.offset?.x, y: pointerdata?.offset?.y },
      size: {
        width: pointerdata?.size?.width,
        height: pointerdata?.size?.height,
      },
      orientation: pointerdata?.orientation,
    });
    this.showModal();
  }

  submitForm(): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    if (this.validateForm.valid) {
      let ValidateForm = this.validateForm.value;
      let body = {
        id: ValidateForm.id,
        name: ValidateForm.name,
        text: ValidateForm.text,
        next: ValidateForm.next,
        trigger: {
          type: ValidateForm.trigger.type,
          value:
            ValidateForm.trigger.type !== 'none'
              ? ValidateForm.trigger.value
              : null,
        },
        pointerType: ValidateForm.pointerType,
        [ValidateForm.pointerType]: {
          type: ValidateForm.type,
          positionPath:
            ValidateForm.type === 'ui' ? ValidateForm.positionPath : null,
          position:
            ValidateForm.type !== 'ui'
              ? { x: ValidateForm.position.x, y: ValidateForm.position.y }
              : { x: null, y: null },
          offset: { x: ValidateForm.offset.x, y: ValidateForm.offset.y },
          size: {
            width: ValidateForm.size.width,
            height: ValidateForm.size.height,
          },
          orientation: ValidateForm.orientation,
        },
      };
      if (!this.isEdit) {
        this.tutorialsService.addTutorials(body).subscribe((res: any) => {
          if (res?.data) {
            this.getTutorials();
            this.handleCancel();
            this.notification.create('success', 'Success', 'Save Successfully');
          }
        });
      } else {
        this.tutorialsService
          .updateTutorials(this.tutorialId, body)
          .subscribe((res: any) => {
            if (res?.data) {
              this.handleCancel();
              this.getTutorials();
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
    this.validateForm.reset({
      trigger: { type: 'none' },
      pointerType: 'hand',
      type: 'ui',
    });
  }

  deleteTutorials(tutorialId: string): void {
    this.modal.confirm({
      nzTitle: 'Are you sure delete?',
      nzOkText: 'Yes',
      nzOkType: 'danger',
      nzOnOk: () => {
        this.tutorialsService
          .deleteTutorials(tutorialId)
          .subscribe((res: any) => {
            this.notification.create(
              'success',
              'Success',
              'Delete Successfully'
            );
            this.getTutorials();
          });
      },
      nzCancelText: 'No',
    });
  }
}
