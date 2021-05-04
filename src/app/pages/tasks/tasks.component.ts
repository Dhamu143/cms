import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { TasksService } from 'src/app/shared/services/tasks.service';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss'],
})
export class TasksComponent implements OnInit {
  public listOfData = [];
  public shopsData = [];
  public utilitiesData = [];
  public charactersData = [];
  public validateForm!: FormGroup;
  public isVisible = false;
  public isTutorialVisible = false;
  public isEdit = false;
  public isTutorialEdit = false;
  public taskId: string;
  public levelFilterTypes = [];
  public socialTypes = [
    { name: 'Google', value: 0 },
    { name: 'Facebook', value: 1 },
  ];
  public tutorialData: any;
  public tutorials: any = [];
  public tutorialIndex: number = 0;
  public listOfFilterData = [];

  constructor(
    private fb: FormBuilder,
    private tasksService: TasksService,
    private modal: NzModalService,
    private notification: NzNotificationService
  ) {}

  ngOnInit(): void {
    this.levelFilterTypes = this.getLevelFilterTypes();
    this.createForm();
    this.getTasks();
    this.loadShops();
    this.loadUtilities();
    this.loadCharacters();
  }

  createForm(): void {
    this.validateForm = this.fb.group({
      orderId: [null, [Validators.required]],
      name: [null, [Validators.required]],
      level: [null, [Validators.required]],
      type: ['shop', [Validators.required]],
      reward: [null],
      enabled: [false, [Validators.required]],
      typeId: [null],
    });
  }

  getLevelFilterTypes() {
    var levels: any = [{ name: 'All', value: '' }];
    for (var i = 1; i <= 20; i++) {
      levels.push({ name: i, value: i });
    }
    return levels;
  }

  getTasks(): void {
    this.tasksService.getTasks().subscribe((res: any) => {
      this.listOfData = res.data;
      this.listOfFilterData = [...res?.data];
    });
  }

  loadShops(): void {
    this.tasksService.getShops().subscribe((res: any) => {
      if (res?.data?.length) this.shopsData = res.data;
    });
  }

  loadUtilities(): void {
    this.tasksService.getUtilities().subscribe((res: any) => {
      if (res?.data?.length) this.utilitiesData = res.data;
    });
  }

  loadCharacters(): void {
    this.tasksService.getCharacters().subscribe((res: any) => {
      if (res?.data?.length) this.charactersData = res.data;
    });
  }

  editTasks(data): void {
    this.isEdit = true;
    this.taskId = data._id;
    this.validateForm.patchValue({
      orderId: data.orderId,
      name: data.name,
      level: data.level,
      type: data.type,
      reward: data.reward,
      enabled: data.enabled,
      typeId: data.typeId,
    });
    this.tutorials = data?.tutorials;
    this.showModal();
  }

  submitForm(): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    if (this.validateForm.valid) {
      if (!this.isEdit) {
        this.tasksService
          .addTasks(
            Object.assign(this.validateForm.value, {
              tutorials: this.tutorials,
            })
          )
          .subscribe((res: any) => {
            if (res?.data) {
              this.getTasks();
              this.handleCancel();
              this.notification.create(
                'success',
                'Success',
                'Save Successfully'
              );
            }
          });
      } else {
        this.tasksService
          .updateTasks(
            this.taskId,
            Object.assign(this.validateForm.value, {
              tutorials: this.tutorials,
            })
          )
          .subscribe((res: any) => {
            if (res?.data) {
              this.getTasks();
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

  taskTypeChange(event): void {
    if (event == 'social') this.validateForm.get('typeId').setValue(0);
    else if (event == 'levelup') this.validateForm.get('typeId').setValue(1);
    else this.validateForm.get('typeId').setValue('');
  }

  showModal(): void {
    this.isVisible = true;
  }

  handleCancel(): void {
    this.isVisible = false;
    this.isEdit = false;
    this.validateForm.reset({
      type: 'shop',
      enabled: false,
    });
  }

  deleteTasks(taskId: string): void {
    this.modal.confirm({
      nzTitle: 'Are you sure delete?',
      nzOkText: 'Yes',
      nzOkType: 'danger',
      nzOnOk: () => {
        this.tasksService.deleteTasks(taskId).subscribe((res: any) => {
          if (res.status) {
            this.getTasks();
            this.notification.create('success', 'Success', res.message);
          }
        });
      },
      nzCancelText: 'No',
    });
  }

  showTutorialModal(): void {
    this.isTutorialVisible = true;
  }

  handleTutorialCancel(event?): void {
    this.isTutorialVisible = false;
    this.isTutorialEdit = false;
    this.tutorialIndex = 0;
  }

  addTutorial(data): void {
    if (!this.isTutorialEdit) this.tutorials.push(data);
    else {
      this.tutorials[this.tutorialIndex] = data;
    }
    this.handleTutorialCancel();
  }

  editTutorials(data, indx): void {
    this.tutorialIndex = indx;
    this.tutorialData = data;
    this.isTutorialEdit = true;
    this.showTutorialModal();
  }

  deleteTutorials(index): void {
    this.tutorials.splice(index, 1);
  }

  changeTask(val): void {
    const taskFilter = [...this.listOfFilterData].filter(
      (resp) => resp.level == val
    );
    this.listOfData = val ? taskFilter : [...this.listOfFilterData];
  }
}
