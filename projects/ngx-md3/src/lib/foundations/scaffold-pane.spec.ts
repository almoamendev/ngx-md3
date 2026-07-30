import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ScaffoldPane } from './scaffold-pane';

@Component({
    imports: [ScaffoldPane],
    template: `<div md3-scaffold-pane="main"></div>`,
})
class HostComponent { }

describe('ScaffoldPane', () => {
    let fixture: ComponentFixture<HostComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HostComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(HostComponent);
        fixture.detectChanges();
    });

    it('should create an instance', () => {
        const directive = fixture.debugElement.query(By.directive(ScaffoldPane)).injector.get(ScaffoldPane);
        expect(directive).toBeTruthy();
    });
});
