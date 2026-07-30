import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TypeTitle } from './type-title';

@Component({
    imports: [TypeTitle],
    template: `<md3-type-title></md3-type-title>`,
})
class HostComponent { }

describe('TypeTitle', () => {
    let fixture: ComponentFixture<HostComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HostComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(HostComponent);
        fixture.detectChanges();
    });

    it('should create an instance', () => {
        const directive = fixture.debugElement.query(By.directive(TypeTitle)).injector.get(TypeTitle);
        expect(directive).toBeTruthy();
    });
});
