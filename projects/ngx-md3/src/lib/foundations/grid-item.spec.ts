import { TestBed } from '@angular/core/testing';
import { GridItem } from './grid-item';

describe('GridItem', () => {
  it('should create an instance', () => {
    TestBed.configureTestingModule({});
    const directive = TestBed.runInInjectionContext(() => new GridItem());
    expect(directive).toBeTruthy();
  });
});
