import { TestBed } from '@angular/core/testing';

import { ImageGenerateService } from './image-generate.service';

describe('ImageGenerateService', () => {
  let service: ImageGenerateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImageGenerateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
