import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { ComponentsComponent } from './components.component';

describe('ComponentsComponent', () => {
  let component: ComponentsComponent;
  let fixture: ComponentFixture<ComponentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComponentsComponent],
      providers: [provideRouter([])],
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComponentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should list every catalog entry exactly once', () => {
    const listed = component.sections.flatMap((section) => section.entries);
    expect(listed.length).toBe(component.total);
    expect(new Set(listed.map((entry) => entry.link)).size).toBe(component.total);
  });

  it('should show everything when the query has nothing to match on', () => {
    expect(component.matchCount()).toBe(component.total);

    component.query.set('   ');
    expect(component.isFiltering()).toBeFalse();
    expect(component.matchCount()).toBe(component.total);

    component.query.set('---');
    expect(component.isFiltering()).toBeFalse();
    expect(component.matchCount()).toBe(component.total);
  });

  it('should ignore spacing and punctuation in the query', () => {
    const links = () => component.filteredSections()
      .flatMap((section) => section.entries)
      .map((entry) => entry.link);

    for (const query of ['navigation bar', 'navigationbar', 'Navigation-Bar', ' navigation   bar ']) {
      component.query.set(query);
      expect(links()).withContext(query).toContain('/components/navigations/navigation-bar');
    }

    component.query.set('text-fields');
    expect(links()).toContain('/components/text-fields');

    component.query.set('loading&progress');
    expect(links()).toContain('/components/loading-and-progress/loading-indicators');
  });

  it('should not match across field boundaries', () => {
    // "Badges" is immediately followed by its description in the searchable
    // text; a query spanning the two must not match.
    component.query.set('badgesnotification');

    expect(component.matchCount()).toBe(0);
  });

  it('should filter by label, case insensitively', () => {
    component.query.set('BADGE');

    const links = component.filteredSections().flatMap((section) => section.entries).map((entry) => entry.link);
    expect(links).toContain('/components/badges');
    expect(component.matchCount()).toBe(1);
  });

  it('should filter by group so group terms surface their members', () => {
    component.query.set('selection');

    const links = component.filteredSections().flatMap((section) => section.entries).map((entry) => entry.link);
    expect(links).toContain('/components/selection-controls/checkboxes');
    expect(links).toContain('/components/selection-controls/switches');
    expect(links).toContain('/components/selection-controls/radio-buttons');
  });

  it('should drop sections that have no matching entries', () => {
    component.query.set('badge');

    expect(component.filteredSections().length).toBe(1);
  });

  it('should return no sections for a query that matches nothing', () => {
    component.query.set('definitely-not-a-component');

    expect(component.filteredSections()).toEqual([]);
    expect(component.matchCount()).toBe(0);
  });

  it('should restore the full list when the search is cleared', () => {
    component.query.set('badge');
    component.clearSearch();

    expect(component.query()).toBe('');
    expect(component.matchCount()).toBe(component.total);
  });
});
