import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-task-tutorials',
  templateUrl: './task-tutorials.component.html',
  styleUrls: ['./task-tutorials.component.scss'],
})
export class TaskTutorialsComponent implements OnInit {
  public tutorialValidateForm!: FormGroup;
  @Input('tutorialVisible') isVisible: any; //  @Input(alias)
  @Output('tutorialEvent') outputEvent2 = new EventEmitter<any>();
  @Input('editTutorialData') editTutorialdata: any; //  @Input(alias)
  @Output('tutorialClose') tutorialModalClose = new EventEmitter<any>();
  @Input('IseditTutorial') isTutorialEdit: boolean = false;

  constructor(private fb: FormBuilder) {
    this.tutorialValidateForm = this.fb.group({
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

  ngOnChanges(changes: SimpleChanges) {
    // if (changes.data) {
    if (this.isTutorialEdit) {
      this.editTutorials(this.editTutorialdata);
    }
    // }
  }
  ngOnInit(): void {}

  handleTutorialCancel(): void {
    this.isVisible = false;
    this.isTutorialEdit = false;
    this.tutorialValidateForm.reset({
      trigger: { type: 'none' },
      pointerType: 'hand',
      type: 'ui',
    });
    this.tutorialModalClose.emit(false);
  }

  addTutorial(): void {
    for (const i in this.tutorialValidateForm.controls) {
      this.tutorialValidateForm.controls[i].markAsDirty();
      this.tutorialValidateForm.controls[i].updateValueAndValidity();
    }
    if (this.tutorialValidateForm.valid) {
      let tutorialValidateForm = this.tutorialValidateForm.value;
      let body = {
        id: tutorialValidateForm.id,
        name: tutorialValidateForm.name,
        text: tutorialValidateForm.text,
        next: tutorialValidateForm.next,
        trigger: {
          type: tutorialValidateForm.trigger.type,
          value:
            tutorialValidateForm.trigger.type !== 'none'
              ? tutorialValidateForm.trigger.value
              : null,
        },
        pointerType: tutorialValidateForm.pointerType,
        [tutorialValidateForm.pointerType]: {
          type: tutorialValidateForm.type,
          positionPath:
            tutorialValidateForm.type === 'ui'
              ? tutorialValidateForm.positionPath
              : null,
          position:
            tutorialValidateForm.type !== 'ui'
              ? {
                  x: tutorialValidateForm.position.x,
                  y: tutorialValidateForm.position.y,
                }
              : { x: null, y: null },
          offset: {
            x: tutorialValidateForm.offset.x,
            y: tutorialValidateForm.offset.y,
          },
          size: {
            width: tutorialValidateForm.size.width,
            height: tutorialValidateForm.size.height,
          },
          orientation: tutorialValidateForm.orientation,
        },
      };
      this.outputEvent2.emit(body);
      this.handleTutorialCancel();
    }
  }

  editTutorials(data): void {
    var pointerdata = data.pointerType === 'hand' ? data?.hand : data?.arrow;
    this.tutorialValidateForm.patchValue({
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
  }
}
