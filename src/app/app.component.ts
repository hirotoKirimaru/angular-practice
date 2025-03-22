import {CommonModule} from "@angular/common";
import {Component, Input, type OnInit} from "@angular/core";
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import {RouterOutlet} from "@angular/router";
import {
  BehaviorSubject,
  debounceTime,
  delay,
  distinctUntilChanged,
  firstValueFrom,
  lastValueFrom,
  of,
  switchMap,
  tap
} from "rxjs";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [CommonModule, RouterOutlet, FormsModule, ReactiveFormsModule],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.scss",
})
export class AppComponent implements OnInit {
  title = "front";
  public emailControl: FormControl = new FormControl("", [
    Validators.required,
    Validators.email,
    this.domainValidator,
  ]);
  public nameOrEmailControl: FormControl = new FormControl("", [
    Validators.required,
  ]);


  ngOnInit() {
    this.emailControl.statusChanges.subscribe((status) => {
      if (status === "VALID") {
        console.log("Form changed:", this.emailControl.value);
      }
    });

    this.nameOrEmailControl.valueChanges
      .pipe(
        debounceTime(1000), // 1秒間の待機
        distinctUntilChanged(), // 値が実際に変更された場合のみ発火
      )
      .subscribe((value) => {
        if (true) {
          console.log("value:", value);
          console.log(this.nameOrEmailControl.valid);
          // 後からValidatorsを変更する場合は、updateValueAndValidityを呼ぶ必要がある
          // 初回だけTRUE, FALSEとなっている
          this.nameOrEmailControl.setValidators([
            Validators.required,
            Validators.email,
          ]);
          // this.nameOrEmailControl.updateValueAndValidity()
          this.nameOrEmailControl.updateValueAndValidity({emitEvent: false});

          console.log(this.nameOrEmailControl.valid);
        }
      });
  }

  domainValidator(control: FormControl): { [key: string]: any } | null {
    const email = control.value;
    if (email && email.indexOf("@") !== -1) {
      const domain = email.split("@")[1];
      if (domain !== "example.com") {
        // 特定のドメインをチェック
        return {invalidDomain: true};
      }
    }
    return null;
  }

 // 一回だけ動く機構を作りたかった、できなかった
  private buttonStateSubject = new BehaviorSubject<boolean>(false); // 初期状態はfalse
  buttonState$ = this.buttonStateSubject.asObservable();

  atoggleButtonState() {
    this.buttonStateSubject.next(!this.buttonStateSubject.value);
  }

  async startProcess() {
    // 開始処理
    console.log('Starting process...');
    await new Promise(resolve => setTimeout(resolve, 5000)); // 5秒かかる処理
    console.log('Start process completed.');
  }

  async stopProcess() {
    // 停止処理
    console.log('Stopping process...');
    await new Promise(resolve => setTimeout(resolve, 5000)); // 5秒かかる処理
    console.log('Stop process completed.');
  }

  isDisabled = false;

  async toggleButtonState() {
    // if (this.isDisabled) return; // 処理中は無効化
    //
    // this.isDisabled = true;

    try {
      // if (await lastValueFrom(this.buttonState$)) {
      // if (await lastValueFrom(this.buttonState$)) {
      const state = await firstValueFrom(this.buttonState$);
      if (state) {
        console.log("STOP")
        await this.stopProcess();
      } else {
        console.log("START")
        await this.startProcess();
      }

      // console.log(state2);
      //   await this.buttonState$.subscribe(async state => {
      //     if (state) {
      //     console.log("STOP")
      //     await this.stopProcess();
      //   } else {
      //     console.log("START")
      //     await this.startProcess();
      // }
      //   });

    } catch (error) {
      console.error('Error:', error);
    } finally {
      this.isDisabled = false;
      this.atoggleButtonState(); // UI上のボタン状態を切り替える
    }
  }
}
