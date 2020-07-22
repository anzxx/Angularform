import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { interval } from 'rxjs';
import { OtpService } from './../../otp.service';

const defaultWaitTime = 180;

@Component({
    selector: 'app-validation-form',
    templateUrl: './validation-form.component.html',
    styleUrls: ['./validation-form.component.css'],
})
export class ValidationFormComponent implements OnInit {

    constructor(private fb: FormBuilder, private http: HttpClient, private _OtpService: OtpService) { }
    myForm: FormGroup;
    otpSendStatus: number;  // undefined, 0 = invalid info provided, 1 = sent sucess, -1 = network error, 1 = sending otp.
    waitingTimer: number = defaultWaitTime;
    retryAttempt: number = 0;
    source: any;
    timersub: any;
    OTPVerifySucess: Boolean = false;

    ngOnInit(): void {

        this.myForm = this.fb.group({
            email: ['', [Validators.required, Validators.email, Validators.maxLength(255)]],
            OTP: ['', [Validators.required, Validators.maxLength(4), Validators.minLength(4), Validators.pattern('[0-9]{4}')]],
            mobile: ['', [Validators.required, Validators.maxLength(10), Validators.minLength(10), Validators.pattern('[0-9]{10}')]],  // The min length is added extra so that while calling getOTP it is only true if number is 10 digite long
            fullname: ['', [Validators.required, Validators.maxLength(140)]],
            PAN: ['', [Validators.required, Validators.pattern('[A-Z]{5}[0-9]{4}[A-Z]{1}')]],
            city: ['', [Validators.required]]
        })

        this.source = interval(1000);
        this.myForm.valueChanges.subscribe(val => console.log(val))
    }

    get email() { return this.myForm.get('email') }
    get OTP() { return this.myForm.get('OTP') }
    get mobile() { return this.myForm.get('mobile') }
    get fullname() { return this.myForm.get('fullname') }
    get PAN() { return this.myForm.get('PAN') }
    get city() { return this.myForm.get('city') }

    getFormData() {
        return {
            panNumber: this.PAN.value,
            city: this.city.value,
            fullname: this.fullname.value,
            email: this.email.value,
            mobile: parseInt(this.mobile.value)
        }
    }

    disableAllFields() {
        this.PAN.disable()
        this.OTP.disable()
        this.city.disable()
        this.fullname.disable()
        this.email.disable()
        this.mobile.disable()
    }

    startTimer = () => {
        if (this.timersub) this.timersub.unsubscribe();
        this.waitingTimer = defaultWaitTime - 1;
        this.timersub = this.source.subscribe(val => {
            if (val + 1 === defaultWaitTime) {
                this.waitingTimer = defaultWaitTime;
                console.log("UnSubbing", this.waitingTimer);
                this.timersub.unsubscribe();
            }
            else this.waitingTimer -= 1;
            console.log("Timer", this.waitingTimer);
        }
        )
    }

    getOTP() {
        this.otpSendStatus = undefined;
        this.waitingTimer = defaultWaitTime;
        if (this.timersub) this.timersub.unsubscribe()

        if (this.mobile.valid) {  // Check if Mobile no is of 10 digit.
            this.otpSendStatus = undefined;
            if (this.waitingTimer === defaultWaitTime) {
                this.makeRequest();
            }
        }
    }

    resendOTP = () => {
        this.retryAttempt += 1;
        if (this.retryAttempt < 3) this.getOTP()
    }

    verifyOTP = () => {
        if (this.OTP.invalid) return;
        this.waitingTimer = defaultWaitTime;
        this.timersub.unsubscribe();
        this.disableAllFields();
        this._OtpService.verifyOTP({ mobile: this.mobile.value, otp: this.OTP.value })
            .subscribe((data: any) => {
                if (data.statusCode === 200) {
                    this.OTPVerifySucess = true;
                }
                else {
                    this.OTPVerifySucess = false;
                }
            })
    }

    makeRequest() {
        this.otpSendStatus = 2;
        this._OtpService.getOTP(this.getFormData())
            .subscribe((data: any) => {
                if (data.statusCode === 200) {
                    this.otpSendStatus = 1;
                    this.startTimer();
                }
                else {
                    this.otpSendStatus = 0;
                    this.waitingTimer = defaultWaitTime;
                }
            }, err => {
                this.otpSendStatus = -1;
                this.waitingTimer = defaultWaitTime;
                this.timersub.unsubscribe();
        })
    }
}