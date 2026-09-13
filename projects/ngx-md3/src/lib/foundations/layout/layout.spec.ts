import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { LayoutService } from '../layout.service';
import { Layout } from './layout';

@Component({
    selector: 'md3-test-host',
    imports: [Layout],
    template: `<md3-layout></md3-layout>`,
})
class TestHost { }

describe('Layout', () => {
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TestHost],
        }).compileComponents();
    });

    it('should create', () => {
        const fixture = TestBed.createComponent(TestHost);
        fixture.detectChanges();

        expect(fixture.debugElement.query(By.directive(Layout))).toBeTruthy();
    });

    it('should keep its own container state, so a toolbar inside it never reads the page', () => {
        const fixture = TestBed.createComponent(TestHost);
        fixture.detectChanges();

        const scoped = fixture.debugElement.query(By.directive(Layout)).injector.get(LayoutService);

        expect(scoped).toBeTruthy();
        expect(scoped).not.toBe(TestBed.inject(LayoutService));
    });

    it('should share the window state with the application', () => {
        const fixture = TestBed.createComponent(TestHost);
        fixture.detectChanges();

        const scoped = fixture.debugElement.query(By.directive(Layout)).injector.get(LayoutService);
        const root = TestBed.inject(LayoutService);

        // The same signal instances, so a breakpoint or a scheme change is never out of step.
        expect(scoped.viewport).toBe(root.viewport);
        expect(scoped.widthClass).toBe(root.widthClass);
        expect(scoped.darkMode).toBe(root.darkMode);
    });
});
