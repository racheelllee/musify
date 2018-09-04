import { Routes, RouterModule } from '@angular/router';

//import userEdit component
import { UserEditComponent } from './components/user-edit/user-edit.component';


const APP_ROUTES: Routes = [
	{path:'home', component: UserEditComponent},
	{path:'show', component: UserEditComponent},
	{ path:'**', pathMatch:'full', redirectTo:'home'}
];


export const APP_ROUTING = RouterModule.forRoot(APP_ROUTES);