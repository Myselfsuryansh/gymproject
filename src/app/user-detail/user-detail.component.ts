import { Component, OnInit } from '@angular/core';
import { User } from '../models/user.model';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent implements OnInit {
  public userId!:number;
  userDetails!:User

  constructor(private activateRoute:ActivatedRoute, private api :ApiService){

  }

  ngOnInit(): void {
    this.activateRoute.params.subscribe(res=>{
      this.userId=res['id'];
      this.fetchUserDetails(this.userId)
    })
    
  }

  fetchUserDetails(userId:number){
    this.api.getRegisteredUserId(userId).subscribe(res=>{
      this.userDetails=res;

    })
  }

}
