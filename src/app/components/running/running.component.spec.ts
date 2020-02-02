import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RunningComponent } from './running.component';

describe('RunningComponent', () => {
  let component: RunningComponent;
  let fixture: ComponentFixture<RunningComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RunningComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RunningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
