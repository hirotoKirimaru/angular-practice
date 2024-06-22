import { Component, Input, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterOutlet } from "@angular/router";
import {
	FormControl,
	FormGroup,
	FormsModule,
	ReactiveFormsModule,
	Validators,
} from "@angular/forms";
import { debounceTime, distinctUntilChanged } from "rxjs";

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
					this.nameOrEmailControl.updateValueAndValidity({ emitEvent: false });

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
				return { invalidDomain: true };
			}
		}
		return null;
	}
}
