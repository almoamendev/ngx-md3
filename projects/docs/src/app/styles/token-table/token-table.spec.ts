import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TokenTable } from './token-table';
import { TokenSection } from '../tokens.catalog';

describe('TokenTable', () => {
  let fixture: ComponentFixture<TokenTable>;

  const sections: TokenSection[] = [
    {
      label: 'Test',
      entries: [
        { name: '--md-scheme-primary', description: 'Primary role.' },
      ],
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TokenTable],
    })
    .compileComponents();

    fixture = TestBed.createComponent(TokenTable);
    fixture.componentRef.setInput('sections', sections);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should resolve a value for every catalogued token', () => {
    const resolved = fixture.componentInstance.resolved();

    expect(resolved.length).toBe(1);
    expect(resolved[0].entries.length).toBe(1);
    expect(resolved[0].entries[0].name).toBe('--md-scheme-primary');
  });

  it('should wrap color channels in rgb()', () => {
    expect(fixture.componentInstance.swatch('92, 77, 212')).toBe('rgb(92, 77, 212)');
    expect(fixture.componentInstance.swatch('')).toBe('transparent');
  });
});
