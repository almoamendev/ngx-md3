import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TypeHeadline } from './type-headline';

@Component({
    imports: [TypeHeadline],
    template: `<md3-type-headline></md3-type-headline>`,
})
class HostComponent { }

describe('TypeHeadline', () => {
    let fixture: ComponentFixture<HostComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HostComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(HostComponent);
        fixture.detectChanges();
    });

    it('should create an instance', () => {
        const directive = fixture.debugElement.query(By.directive(TypeHeadline)).injector.get(TypeHeadline);
        expect(directive).toBeTruthy();
    });
});
