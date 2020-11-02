const routes = [
	{ path: '/', name: 'home', component: PageHome },
	{ path: '/debug', name: 'debug', component: PageDebug },
	{ path: '/user/:username/profile', name: 'userProfile', component: PageUserprofile },
	{ path: '/*', name: '404', component: Page404 },
]