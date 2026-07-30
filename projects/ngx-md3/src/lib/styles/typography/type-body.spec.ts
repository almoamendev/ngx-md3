import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TypeBody } from './type-body';

@Component({
    imports: [TypeBody],
    template: `<md3-type-body></md3-type-body>`,
})
class HostComponent { }

describe('TypeBody', () => {
    let fixture: ComponentFixture<HostComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HostComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(HostComponent);
        fixture.detectChanges();
    });

    it('should create an instance', () => {
        const directive = fixture.debugElement.query(By.directive(TypeBody)).injector.get(TypeBody);
        expect(directive).toBeTruthy();
    });
});
