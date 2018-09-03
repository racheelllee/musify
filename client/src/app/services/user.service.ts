import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { GLOBAL } from './global';

@Injectable()
export class UserService{
	public url:string;
	constructor(private _http:Http){
		this.url = GLOBAL.url;
	}

	singup(user_to_login, gethash=null){
		if(gethash != null )
			user_to_login.gethash = gethash;
		let params = JSON.stringify(user_to_login);
		let headers = new Headers({'Content-Type': 'application/json'});
		return this._http.post(this.url+'login', params, {headers: headers}).pipe(map(res => res.json()));
	}
}