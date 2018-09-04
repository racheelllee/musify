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
  public user_register: User;
  public identity;
  public token;
  public errorMessage;
  public alertRegister;

  constructor(private _userService:UserService){
    this.user = new User('','','','','','ROLE_USER','');
  	this.user_register = new User('','','','','','ROLE_USER','');
  }
  ngOnInit(){
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    console.log(this.identity, this.token);
  }

  public onSubmit(){
    this._userService.singup(this.user).subscribe(
        response=>{
          this.identity = response;
          if(!this.identity._id){
            alert('El usuario no ha sido correctamente identificado');
          }else{
            // crear un elemento en el localStorage
            localStorage.setItem('identity', JSON.stringify(this.identity));
            // conseguir el token para enviarselo a cada peticion
            this._userService.singup(this.user, 'true').subscribe(
            response=>{
              let token = response.token;
              this.token = token;
              if(this.token.length < 1){
                alert('El usuario no ha sido correctamente identificado');
              }else{
                //crear un elemento en el localStorage para tener el token disponible
                localStorage.setItem('token', this.token);
                this.user = new User('','','','','','ROLE_USER','');
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

  logOut(){
    localStorage.removeItem('identity');
    localStorage.removeItem('token');
    localStorage.clear();
    this.identity = null;
    this.token = null;
  }

  onSubmitRegister(){
    console.log(this.user_register);
    this._userService.register(this.user_register).subscribe(
      response=>{
        let user  = response.user;
        this.user_register = user;
        if(!user._id){
          this.alertRegister =  'Error el registrarse';
        }else{
          this.alertRegister = 'El registro se realizo correctamente, identificate con'+this.user_register.email;
          this.user_register = new User('','','','','','ROLE_USER','');
        }
      }, 
      error=>{
        var errorMessage = <any>error;
        if(errorMessage != null){
          var body = JSON.parse(error._body);
          this.alertRegister = body.message;
          console.log(error);
        }
      });
  }

}
