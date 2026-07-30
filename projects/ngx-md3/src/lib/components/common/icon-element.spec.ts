import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IconElement } from './icon-element';

@Component({
    imports: [IconElement],
    template: `<div md3-icon-element></div>`,
})
class HostComponent { }

describe('IconElement', () => {
    let fixture: ComponentFixture<HostComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HostComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(HostComponent);
        fixture.detectChanges();
    });

    it('should create an instance', () => {
        const directive = fixture.debugElement.query(By.directive(IconElement)).injector.get(IconElement);
        expect(directive).toBeTruthy();
    });
});
