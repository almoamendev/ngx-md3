import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Divider } from './divider';

@Component({
    imports: [Divider],
    template: `<md3-divider></md3-divider>`,
})
class HostComponent { }

describe('Divider', () => {
    let fixture: ComponentFixture<HostComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HostComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(HostComponent);
        fixture.detectChanges();
    });

    it('should create an instance', () => {
        const directive = fixture.debugElement.query(By.directive(Divider)).injector.get(Divider);
        expect(directive).toBeTruthy();
    });
});
