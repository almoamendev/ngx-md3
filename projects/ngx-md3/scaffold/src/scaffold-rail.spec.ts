import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ScaffoldRail } from './scaffold-rail';

@Component({
    imports: [ScaffoldRail],
    template: `<div md3-scaffold-rail="leading"></div>`,
})
class HostComponent { }

describe('ScaffoldRail', () => {
    let fixture: ComponentFixture<HostComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HostComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(HostComponent);
        fixture.detectChanges();
    });

    it('should create an instance', () => {
        const directive = fixture.debugElement.query(By.directive(ScaffoldRail)).injector.get(ScaffoldRail);
        expect(directive).toBeTruthy();
    });
});
