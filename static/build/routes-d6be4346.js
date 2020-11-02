const routes = [
	{ path: '/', name: 'home', component: PageHome },
	{ path: '/user/:username/profile', name: 'user/profile', component: PageUserProfile },
	{ path: '/debug', name: 'basics/debug', component: PageBasicsDebug },
	{ path: '/*', name: 'basics/404', component: PageBasics404 },
]