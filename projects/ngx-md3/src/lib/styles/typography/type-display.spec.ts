import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TypeDisplay } from './type-display';

@Component({
    imports: [TypeDisplay],
    template: `<md3-type-display></md3-type-display>`,
})
class HostComponent { }

describe('TypeDisplay', () => {
    let fixture: ComponentFixture<HostComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HostComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(HostComponent);
        fixture.detectChanges();
    });

    it('should create an instance', () => {
        const directive = fixture.debugElement.query(By.directive(TypeDisplay)).injector.get(TypeDisplay);
        expect(directive).toBeTruthy();
    });
});
