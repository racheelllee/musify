import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';
import { GLOBAL } from '../../services/global';

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
	public alertMessage;
	public fileUpload = Array<File>;


	constructor(private _userService:UserService) { 
		this.titulo = 'Actualizar mis datos';
		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();
    	this.user = this.identity;
    	this.url = GLOBAL.url;

	}

	ngOnInit() {
		console.log('user-edit.component.ts cargando');
	}

	onSubmit(){
		this._userService.updateUser(this.user).subscribe(
			response=>{
				if(!response.user){
					this.alertMessage = "El usuario no se ha actualizado";
				}else{
					localStorage.setItem('identity', JSON.stringify(this.user));
					document.getElementById('identity_name').innerHTML = this.user.name;
					this.alertMessage = "Se actualizo correctamente";
					if(!this.fileUpload){
						//redireccion
					}else{
						this.makeFilesRequest(this.url+'upload-image-user/'+this.user._id, [], this.fileUpload).then(
							(result:any)=>{
								this.user.image = result.image;
								localStorage.setItem('identity', JSON.stringify(this.user));
								console.log(this.user);
							}
						);
					}
				}
			},
			error=>{
				var errorMessage = <any>error;
				if(errorMessage != null){
					var body = JSON.parse(error._body);
					this.alertMessage = body.message;
					console.log(error);
				}

			}
		);
	}


	fileChangeEvent(fileInput:any){
		this.fileUpload = <Array<File>>fileInput.target.files;
	}

	makeFilesRequest(url:string, params:Array<string>, files:Array<file>){
		var token = this.token;
		return new Promise((resolve, reject)=>{
			var formData:any = new FormData();
			var xhr = new XMLHttpRequest();

			for(var i=0; i<files.length; i++){
				formData.append('image', files[i], files[i].name);
			}
			xhr.onreadystatechange = function(){
				if(xhr.readyState == 4){
					if(xhr.status == 200){
						resolve(JSON.parse(xhr.response));
					}else{
						reject(xhr.response);
					}

				}
			}

			xhr.open('POST', url, true);
			xhr.setRequestHeader('Authorization', token);
			xhr.send(formData);
		});
	}




}


