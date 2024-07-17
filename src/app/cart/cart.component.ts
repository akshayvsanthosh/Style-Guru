import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit{

  couponStatus:boolean=false
  allProduct:any =[]
  cartTotal:number=0
  couponClickedStatus:boolean=false

  constructor(private api:ApiService, private router:Router){}

  ngOnInit(): void {
    if (sessionStorage.getItem("token")) {
      this.getCartItems()
    }
  }

  getCoupon(){
    this.couponStatus=true
  }

  backToOffers(){
    this.couponStatus=false
  }

  coupon5percent(){
    this.couponClickedStatus=true
    let discount = Math.ceil(this.cartTotal*.05)
    this.cartTotal-=discount
  }

  coupon20percent(){
    this.couponClickedStatus=true
    let discount = Math.ceil(this.cartTotal*.2)
    this.cartTotal-=discount
  }

  coupon50percent(){
    this.couponClickedStatus=true
    let discount = Math.ceil(this.cartTotal*.5)
    this.cartTotal-=discount
  }

  checkout(){
    sessionStorage.setItem("total",JSON.stringify(this.cartTotal))
    this.router.navigateByUrl("/checkout")
  }

  getCartItems(){
    this.api.getCartAPI().subscribe((result:any)=>{      
      this.allProduct=result
      this.getCartTotalPrice()
    })
   }

   removeCartItem(id:any){
    this.api.removeCartAPI(id).subscribe((res:any)=>{
      this.getCartItems()
      this.api.getCartCount()
    })
   }

   getCartTotalPrice(){
    this.cartTotal=Math.ceil(this.allProduct.map((item:any)=>item.totalPrice).reduce((p1:any,p2:any)=>p1+p2))
   }

   incrementQuantity(id:any){
    this.api.incrementCartAPI(id).subscribe((res:any)=>{
      this.getCartItems()

    })
   }

   decrementQuantity(id:any){
    this.api.decrementCartAPI(id).subscribe((res:any)=>{
      this.getCartItems()
      this.api.getCartCount()
    })
   }

   emptyCart(){
    this.api.emptyCartAPI().subscribe((res:any)=>{
      this.getCartItems()
      this.api.getCartCount()
    })
   }
}
