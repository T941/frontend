import {Component, OnInit} from '@angular/core';
import {House} from '../../../../../model/House';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Room} from '../../../../../model/room';
import {Subscription} from 'rxjs';
import {CategoryHouse} from '../../../../../model/categoryHouse';
import {HouseService} from '../../../../../Services/house.service';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {AngularFireDatabase} from '@angular/fire/database';
import {CategoryHouseService} from '../../../../../Services/category-house.service';
import {AuthenticationService} from '../../../../../Services/authentication.service';
import {UserService} from '../../../../../Services/user.service';
import {RoomService} from '../../../../../Services/room.service';
import * as firebase from 'firebase';
import {Order} from '../../../../../model/order';
import {OrderService} from '../../../../../Services/order.service';

@Component({
  selector: 'app-create-order',
  templateUrl: './create-order.component.html',
  styleUrls: ['./create-order.component.scss']
})
export class CreateOrderComponent implements OnInit {


  house: House;
  arrayPicture = '';
  createForm: FormGroup;
  room: Room;
  sub: Subscription;
  order: Order;

  constructor(private houseService: HouseService,
              private  router: Router,
              private db: AngularFireDatabase,
              private fb: FormBuilder,
              private categoryHouse: CategoryHouseService,
              private authenticationService: AuthenticationService,
              private userService: UserService,
              private activateRoute: ActivatedRoute,
              private roomService: RoomService,
              private orderService: OrderService
  ) {
  }

  ngOnInit() {
    this.sub = this.activateRoute.paramMap.subscribe((paraMap: ParamMap) => {
      const id = paraMap.get('id');
      this.roomService.detail(id).subscribe(next => {
        this.room = next;
      }, error1 => {
        console.log(error1);
      });
    });
    this.createForm = this.fb.group({
      nameGuest: ['', [Validators.required]],
      phoneNumber: ['', [Validators.required]],
      formDate: ['', [Validators.required]],
      toDate: ['', [Validators.required]]
    });
  }


  createOrder() {
    this.authenticationService.currentUser.subscribe(value => {
      this.order = {
        nameGuest: this.createForm.get('nameGuest').value,
        phoneNumber: this.createForm.get('phoneNumber').value,
        formDate: this.createForm.get('formDate').value,
        toDate: this.createForm.get('toDate').value,
        timeOrder: '',
        total: '',
      };
      console.log(this.order);
      this.userService.userDetail(value.id + '').subscribe(result => {
        this.roomService.createOrder(this.room.id, result.id, this.order).subscribe(() => {
          alert('Thêm order thành công!');
          this.router.navigate(['/user/room/detail-room/' + this.room.id + '']);
          console.log(this.order);
        }, error1 => {
          console.log('Lỗi ' + error1);
        });
      });
    });
  }

}
