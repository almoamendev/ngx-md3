import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TypeLabel } from './type-label';

@Component({
    imports: [TypeLabel],
    template: `<md3-type-label></md3-type-label>`,
})
class HostComponent { }

describe('TypeLabel', () => {
    let fixture: ComponentFixture<HostComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HostComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(HostComponent);
        fixture.detectChanges();
    });

    it('should create an instance', () => {
        const directive = fixture.debugElement.query(By.directive(TypeLabel)).injector.get(TypeLabel);
        expect(directive).toBeTruthy();
    });
});
