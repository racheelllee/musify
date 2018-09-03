import { Component, OnInit  } from '@angular/core';
import { User } from './models/User';
import { UserService } from './services/user.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers: [UserService]
})
export class AppComponent implements OnInit  {
  public title = 'MUSIFY';
  public user: User;
  public identity;
  public token;
  public errorMessage;
  constructor(private _userService:UserService){
  	this.user = new User('','','','','','ROLE_USER','');
  }
  ngOnInit(){
  }

  onSubmit(){
  	this._userService.singup(this.user).subscribe(
  			response=>{
  				console.log(response);
  				if(!response._id){
  					alert('The user has not been correctly identified');
  				}else{
  					//crear un elemento en el localStorage
  					//conseguir el token para enviarselo a cada peticion
  					this._userService.singup(this.user, 'true').subscribe(
						response=>{
							console.log(response);
							if(!response._id){
								alert('The user has not been correctly identified');
						 	}else{
								//crear un elemento en el localStorage
								//conseguir el token para enviarselo a cada peticion
							}
						},
						error=>{
							var errorMessage = <any>error;
							if(errorMessage != null){
								var body = JSON.parse(error._body);
								this.errorMessage = body.message;
							}
						}
					); 
  				}
  			},
  			error=>{
  				var errorMessage = <any>error;
  				if(errorMessage != null){
  					var body = JSON.parse(error._body);
  					this.errorMessage = body.message;
  				}
  			}
  		); 
  }
}
