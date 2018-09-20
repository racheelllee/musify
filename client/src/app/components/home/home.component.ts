import { Component, OnInit } from '@angular/core';
import {  Router, ActivatedRoute, Params } from '@angular/router';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public titulo:string;

  constructor(
    private _route:ActivatedRoute,
    private _router:Router
   ) {
     this.titulo = 'Artistas';
    }

  ngOnInit() {
    console.log('home.component.ts cargado');
    //conseguir el listado de artistas
  }

}
