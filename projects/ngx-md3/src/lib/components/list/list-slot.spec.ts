import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ListSlot } from './list-slot';

@Component({
    imports: [ListSlot],
    template: `<div md3-list-slot="content"></div>`,
})
class HostComponent { }

describe('ListSlot', () => {
    let fixture: ComponentFixture<HostComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HostComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(HostComponent);
        fixture.detectChanges();
    });

    it('should create an instance', () => {
        const directive = fixture.debugElement.query(By.directive(ListSlot)).injector.get(ListSlot);
        expect(directive).toBeTruthy();
    });
});
