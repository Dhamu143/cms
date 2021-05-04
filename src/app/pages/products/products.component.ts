import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ProductsService } from 'src/app/shared/services/products.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit {
  public listOfData = [];
  public validateForm!: FormGroup;
  public isVisible = false;
  public isEdit = false;
  public productId: string;

  constructor(
    private fb: FormBuilder,
    private productsService: ProductsService,
    private modal: NzModalService,
    private notification: NzNotificationService
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.getProducts();
  }

  createForm(): void {
    this.validateForm = this.fb.group({
      name: [null, [Validators.required]],
      productId: [null, [Validators.required]],
      type: ['android', [Validators.required]],
      price: [1, [Validators.required]],
      quantity: [0, [Validators.required]],
      enabled: [false, [Validators.required]],
      imageUrl: ['null'],
    });
  }

  getProducts(): void {
    this.productsService.getProducts().subscribe((res: any) => {
      this.listOfData = res.data;
    });
  }

  editProducts(data): void {
    this.isEdit = true;
    this.productId = data._id;
    this.validateForm.patchValue({
      name: data.name,
      productId: data.productId,
      type: data.type,
      price: data.price,
      quantity: data.quantity,
      enabled: data.enabled,
      imageUrl: data.imageUrl,
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
        this.productsService
          .addProducts(this.validateForm.value)
          .subscribe((res: any) => {
            if (res?.data) {
              this.getProducts();
              this.handleCancel();
              this.notification.create(
                'success',
                'Success',
                'Save Successfully'
              );
            }
          });
      } else {
        this.productsService
          .updateProducts(this.productId, this.validateForm.value)
          .subscribe((res: any) => {
            if (res?.data) {
              this.getProducts();
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
    this.validateForm.reset({
      type: 'android',
      price: 1,
      quantity: 0,
      enabled: false,
    });
    (<HTMLInputElement>document.getElementById('imagefile')).value = '';
  }

  deleteProducts(ProductId: string): void {
    this.modal.confirm({
      nzTitle: 'Are you sure delete?',
      nzOkText: 'Yes',
      nzOkType: 'danger',
      nzOnOk: () => {
        this.productsService.deleteProducts(ProductId).subscribe((res: any) => {
          if (res.status) {
            this.getProducts();
            this.notification.create('success', 'Success', res.message);
          }
        });
      },
      nzCancelText: 'No',
    });
  }
}
