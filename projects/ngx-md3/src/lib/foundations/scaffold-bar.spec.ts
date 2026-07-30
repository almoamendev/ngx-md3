import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ScaffoldBar } from './scaffold-bar';

@Component({
    imports: [ScaffoldBar],
    template: `<div md3-scaffold-bar="top"></div>`,
})
class HostComponent { }

describe('ScaffoldBar', () => {
    let fixture: ComponentFixture<HostComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HostComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(HostComponent);
        fixture.detectChanges();
    });

    it('should create an instance', () => {
        const directive = fixture.debugElement.query(By.directive(ScaffoldBar)).injector.get(ScaffoldBar);
        expect(directive).toBeTruthy();
    });
});
