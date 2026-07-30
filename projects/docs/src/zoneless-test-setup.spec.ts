import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';

// This project runs without zone.js. Angular 20 does not default TestBed to
// zoneless change detection on its own (that only became the default in
// Angular 21), so we register the zoneless provider once here, globally,
// instead of adding it to every individual *.spec.ts file.
//
// A top-level `beforeEach` (outside any `describe`) registers on Jasmine's
// root suite and runs before every spec in every file loaded by Karma, ahead
// of each spec's own `TestBed.configureTestingModule` call. TestBed merges
// multiple `configureTestingModule` calls made before the module is compiled,
// so this provider ends up included in every test's testing module.
beforeEach(() => {
    TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection()],
    });
});
