import { TestBed } from '@angular/core/testing';
import { Grid } from './grid';

describe('Grid', () => {
  it('should create an instance', () => {
    TestBed.configureTestingModule({});
    const directive = TestBed.runInInjectionContext(() => new Grid());
    expect(directive).toBeTruthy();
  });
});
