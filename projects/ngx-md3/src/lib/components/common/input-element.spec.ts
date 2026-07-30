import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { InputElement } from './input-element';

@Component({
    imports: [InputElement],
    template: `<input md3-input-element>`,
})
class HostComponent { }

describe('InputElement', () => {
    let fixture: ComponentFixture<HostComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HostComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(HostComponent);
        fixture.detectChanges();
    });

    it('should create an instance', () => {
        const directive = fixture.debugElement.query(By.directive(InputElement)).injector.get(InputElement);
        expect(directive).toBeTruthy();
    });
});
