import { Routes, RouterModule } from '@angular/router';

//import userEdit component
import { UserEditComponent } from './components/user-edit/user-edit.component';
import { ArtistListComponent } from './components/artist-list/artist-list.component';

const APP_ROUTES: Routes = [

	{
		path:'',
		redirectTo:'/artist/1',
		pathMatch:'full'
	},
	{path:'', component: ArtistListComponent},
	{path:'artist/:page', component: ArtistListComponent},
	{path:'mis-datos', component: UserEditComponent},
	{ path:'**', pathMatch:'full', redirectTo:'home'}
];


export const APP_ROUTING = RouterModule.forRoot(APP_ROUTES);
