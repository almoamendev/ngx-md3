import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { StateComponent } from './state-component';

@Component({
    imports: [StateComponent],
    template: `<div md3-state-component></div>`,
})
class HostComponent { }

describe('StateComponent', () => {
    let fixture: ComponentFixture<HostComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HostComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(HostComponent);
        fixture.detectChanges();
    });

    it('should create an instance', () => {
        const directive = fixture.debugElement.query(By.directive(StateComponent)).injector.get(StateComponent);
        expect(directive).toBeTruthy();
    });
});
