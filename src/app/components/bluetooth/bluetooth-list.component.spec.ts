import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BluetoothListComponent } from './bluetooth-list.component';

describe('BluetoothComponent', () => {
  let component: BluetoothListComponent;
  let fixture: ComponentFixture<BluetoothListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BluetoothListComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BluetoothListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
