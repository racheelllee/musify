import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  providers:[UserService]
})
export class UserEditComponent implements OnInit {

	public titulo:string;
	public user: User;
	public identity;
	public token;


	constructor(private _userService:UserService) { 
		this.titulo = 'Actualizar mis datos';
	}

	ngOnInit() {
		console.log('user-edit.component.ts cargando');
		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();
		console.log(this.identity, this.token);
	}

}
