
    const store   = new Vuex.Store({ state: () => ({  }) });
    const config  = {"api": {"core": "http://0.0.0.0:8085"}, "globals": {"project": "ablaze"}, "forms": {"users": {"name": null}}, "editor": {"config": {"font": "20", "theme": "chaos", "active": "live"}, "live": {"lang": "python", "uid": null, "code": ""}, "python": {"lang": "python", "uid": null, "code": ""}, "javascript": {"lang": "javascript", "uid": null, "code": ""}, "html": {"lang": "html", "uid": null, "code": ""}, "langs": ["python", "javascript", "html", "css", "json", "sh", "mysql", "pgsql", "sql", "batchfile", "powershell", "makefile", "nginx", "dockerfile", "markdown", "text"], "themes": ["ambiance", "chaos", "chrome", "clouds", "clouds_midnight", "cobalt", "crimson_editor", "dawn", "dracula", "dreamweaver", "eclipse", "github", "gob", "gruvbox", "idle_fingers", "iplastic", "katzenmilch", "kr_theme", "kuroir", "merbivore", "merbivore_soft", "mono_industrial", "monokai", "nord_dark", "pastel_on_dark", "solarized_dark", "solarized_light", "sqlserver", "terminal", "textmate", "tomorrow", "tomorrow_night", "tomorrow_night_blue", "tomorrow_night_bright", "tomorrow_night_eighties", "twilight", "vibrant_ink", "xcode"]}, "payload": {"sales_orders": {"crud": "create", "active": null}}};
    const load_time  = 200;


    Vue.prototype.$http = {};
    Vue.prototype.$http.api  = axios.create({ withCredentials: false });
    Vue.prototype.$http.cors = axios.create({ withCredentials: true });


    var routes_names = {}
    routes.forEach((view) => {
      routes_names[ view.name ] = {
        scroller: 0,
        left    : false,
        right   : false,
      }
    });

    Vue.use( AblazeVue );
    Vue.use( AblazeVuex, { store, config:{
      ...{ screen : {'width':0, 'height':0} },
      ...{ loading: { state: true, time: load_time } },
      ...{ routes : routes_names },
      ...config }
    });


    const router = new VueRouter({
      mode: 'history',
      routes
    })
    new Vue({
      router,
      store,
      el: '#app',
      vuetify: new Vuetify(),
      mounted(){
        this.stopLoading();
  		},
      watch: {
        '$route' (to, from) {
          this.loading.state = true;
          this.stopLoading();
        }
      },
      methods: {
        onResize () {
          this.screen = { width: window.innerWidth, height: window.innerHeight };
        },
      },
    })
  