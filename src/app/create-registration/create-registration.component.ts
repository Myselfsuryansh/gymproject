import { Component, OnInit } from '@angular/core';
import {FormGroup, FormBuilder} from '@angular/forms'
import { ApiService } from '../services/api.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../models/user.model';
@Component({
  selector: 'app-create-registration',
  templateUrl: './create-registration.component.html',
  styleUrls: ['./create-registration.component.scss']
})
export class CreateRegistrationComponent implements OnInit {
  public userIdToUpdate:any;
  public isUpdateActive: boolean=false;
  public registerForm!:FormGroup
  public packages =["Monthly","Quarterly","Yearly"];
  public gender =["Male","Female"];
  public importantList: string[]=[
    "Toxic Fat Reduction",
    "Energy and Endurance",
    "Building Lean Muscle",
    "Healthier Digestive System",
    "Sugar Craving Body",
    "Fitness"
  ]

  constructor(private fb:FormBuilder, private api:ApiService,private router:Router, private activatedroute:ActivatedRoute, private toast:ToastrService){}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      firstName:[''],
      lastName:[''],
      email:[''],
      mobile:[''],
      weight:[''],
      height:[''],
      bmi:[''],
      bmiResult:[''],
      gender:[''],
      requireTrainer:[''],
      package:[''],
      important:[''],
      haveGymBefore:[''],
      enquiryDate:[''],
    });
    this.registerForm.controls['height'].valueChanges.subscribe(res=>{
      this.calculateBmi(res)
    });
    this.activatedroute.params.subscribe(val=>{
      this.userIdToUpdate = val['id'];
      this.api.getRegisteredUserId(this.userIdToUpdate).subscribe(res=>{
        this.isUpdateActive = true;
        this.fillFormToUpdate(res);

      })
    })
  }

  submit(){
    console.log(this.registerForm.value);
    if(this.registerForm.invalid){
      return;
    }
    let data={
      ...this.registerForm.value
    }
    this.api.postRegistration(data).subscribe(res=>{
      if(res){
      this.toast.success("Data Added Successfully")
      this.registerForm.reset()
  }else{
    this.toast.error("Something went wrong...")
  }
})
    
    
  }
  update(){
    console.log(this.registerForm.value, this.userIdToUpdate);
    if(this.registerForm.invalid)return;
    let data={
      ...this.registerForm.value
    }
    this.api.updateRegisterUser(data, this.userIdToUpdate).subscribe(res=>{
      if(res){
      this.toast.success("Data Updated Successfully")
      this.registerForm.reset();
      this.router.navigate(['list'])
  }else{
    this.toast.error("Something went wrong...")
  }
})

  }

  calculateBmi(heightValue:number){
    const weight = this.registerForm.value.weight;
    const height = heightValue;
    const bmi = weight/(height*height);
    this.registerForm.controls['bmi'].patchValue(bmi);

    switch(true){
      case bmi <18.5:
        this.registerForm.controls['bmiResult'].patchValue("UnderWeight");
        break;
        case (bmi>=18.5 && bmi<25):
        this.registerForm.controls['bmiResult'].patchValue("Normal");
        break;
        case (bmi>=25 && bmi <30):
        this.registerForm.controls['bmiResult'].patchValue("Overweight");
        break;
        default:
          this.registerForm.controls['bmiResult'].patchValue("Observe")
    }

  }
  fillFormToUpdate(user:User){
    this.registerForm.patchValue({
      firstName:user.firstName,
      lastName: user.lastName,
      email:user.email,
      mobile:user.mobile,
      weight: user.weight,
      height:user.height,
      bmi : user.bmi,
      bmiResult: user.bmiResult,
      gender: user.gender,
      requireTrainer: user.requireTrainer,
      package: user.package,
      important: user.important,
      haveGymBefore:user.haveGymBefore,
      enquiryDate:user.enquiryDate

    })
  }

}
