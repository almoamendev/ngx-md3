import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { LayoutService } from '../../foundations/layout.service';
import { ScaffoldBar } from '../../foundations/scaffold-bar';
import { ScaffoldRail } from '../../foundations/scaffold-rail';
import { FloatingActionButton } from '../buttons/floating-action-button/floating-action-button';
import { IconButton } from '../buttons/icon-button/icon-button';
import { Toolbar } from './toolbar';

@Component({
    selector: 'md3-test-host',
    imports: [Toolbar, ScaffoldBar, ScaffoldRail, IconButton, FloatingActionButton],
    template: `
        <md3-toolbar md3-scaffold-bar="bottom">
            <button md3-icon-button type="button">a</button>
        </md3-toolbar>

        <md3-toolbar md3-scaffold-rail="trailing">
            <button md3-icon-button type="button">b</button>
        </md3-toolbar>

        <md3-toolbar scroll-action="collapse">
            <button md3-icon-button type="button">c</button>
            <button md3-fab type="button">d</button>
        </md3-toolbar>
    `,
})
class TestHost { }

describe('Toolbar', () => {
    let fixture: ComponentFixture<Toolbar>;
    let component: Toolbar;
    let layout: LayoutService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [Toolbar, TestHost],
        }).compileComponents();

        layout = TestBed.inject(LayoutService);
        layout.mainScrollTop.set(0);

        fixture = TestBed.createComponent(Toolbar);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should default to a floating horizontal toolbar outside a scaffold', () => {
        expect(component.isFloating()).toBeTrue();
        expect(component.effectiveOrientation()).toBe('horizontal');
        expect(component.region()).toBeNull();
    });

    it('should let an explicit orientation win', () => {
        fixture.componentRef.setInput('orientation', 'vertical');
        fixture.detectChanges();

        expect(component.effectiveOrientation()).toBe('vertical');
    });

    it('should ignore scroll-action on a vertical toolbar', () => {
        fixture.componentRef.setInput('orientation', 'vertical');
        fixture.componentRef.setInput('scroll-action', 'hide');
        fixture.detectChanges();

        expect(component.resolvedScrollAction()).toBe('none');
    });

    it('should fall back to hide when a collapse has nothing to keep', () => {
        fixture.componentRef.setInput('scroll-action', 'collapse');
        fixture.detectChanges();

        expect(component.resolvedScrollAction()).toBe('hide');
    });

    it('should fall back to hide when a docked toolbar asks to collapse', () => {
        fixture.componentRef.setInput('toolbar-type', 'docked');
        fixture.componentRef.setInput('scroll-action', 'collapse');
        fixture.detectChanges();

        expect(component.resolvedScrollAction()).toBe('hide');
    });

    it('should hide on scroll down and show again on scroll up', () => {
        fixture.componentRef.setInput('scroll-action', 'hide');
        fixture.detectChanges();

        layout.mainScrollTop.set(400);
        fixture.detectChanges();
        expect(component.isHidden()).toBeTrue();

        layout.mainScrollTop.set(40);
        fixture.detectChanges();
        expect(component.isHidden()).toBeFalse();
    });

    it('should stay visible at the top of the pane', () => {
        fixture.componentRef.setInput('scroll-action', 'hide');
        fixture.detectChanges();

        layout.mainScrollTop.set(0);
        fixture.detectChanges();

        expect(component.isHidden()).toBeFalse();
    });

    it('should never hide while it holds the focus', () => {
        fixture.componentRef.setInput('scroll-action', 'hide');
        fixture.detectChanges();

        fixture.nativeElement.dispatchEvent(new FocusEvent('focusin'));
        layout.mainScrollTop.set(400);
        fixture.detectChanges();

        expect(component.isHidden()).toBeFalse();
    });
});

describe('Toolbar in a scaffold region', () => {
    let fixture: ComponentFixture<TestHost>;
    let toolbars: Toolbar[];

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TestHost],
        }).compileComponents();

        fixture = TestBed.createComponent(TestHost);
        fixture.detectChanges();

        toolbars = fixture.debugElement
            .queryAll(By.directive(Toolbar))
            .map((node) => node.componentInstance as Toolbar);
    });

    it('should read its side from the scaffold region', () => {
        expect(toolbars[0].region()).toBe('blockEnd');
        expect(toolbars[1].region()).toBe('inlineEnd');
        expect(toolbars[2].region()).toBeNull();
    });

    it('should turn vertical inside a rail region', () => {
        expect(toolbars[0].effectiveOrientation()).toBe('horizontal');
        expect(toolbars[1].effectiveOrientation()).toBe('vertical');
    });

    it('should keep a collapse when a FAB is present', () => {
        expect(toolbars[2].resolvedScrollAction()).toBe('collapse');
    });

    it('should report a floating bottom bar to the layout service', () => {
        const layout = TestBed.inject(LayoutService);

        expect(layout.floatingInset().blockEnd).toBeGreaterThanOrEqual(0);
        expect(layout.bottomSafeInset()).toBe(layout.bottomInset() + layout.floatingInset().blockEnd);
    });
});
