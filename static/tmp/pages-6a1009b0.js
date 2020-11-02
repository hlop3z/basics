
const VuePage = function ( scripts, template ) {
    return {...scripts, ...template}
}
const PageHome = VuePage({
  props: {
  },
  data: () => ({
  }),
  computed: {
  },
  mounted(){
  },
  updated(){
  },
  methods: {
  },
},
{
template: `<v-app>
<v-app-bar absolute="" app="" color="deep-purple accent-4" dark="">
<v-app-bar-nav-icon></v-app-bar-nav-icon>
<v-btn icon="">
<v-icon>mdi-home</v-icon>
</v-btn>
<v-btn @click="go('userProfile', { username: 'toxic' })" icon="">
<v-icon>mdi-heart</v-icon>
</v-btn>
<v-toolbar-title>{{ routes }}</v-toolbar-title>
</v-app-bar>
<v-main>
<the-view cut="120"> {{ $ablaze.lorem.s( 1000 ) }} </the-view>
</v-main>
<v-footer app="" padless="">
<v-col class="text-center" cols="12">
        {{ new Date().getFullYear() }} — <strong>Vuetify</strong>
</v-col>
</v-footer>
</v-app>`
})

const PageDebug = VuePage({},
{
template: `<div>
<h1> Debug </h1>
</div>`
})

const PageUserprofile = VuePage({
  props: {
  },
  data: () => ({
  }),
  computed: {
  },
  mounted(){
  },
  updated(){
  },
  methods: {
  },
},
{
template: `<div>
<h1 @click="go('home')"> User {{ $route.params.username }} </h1>
<h1> {{ api }} </h1>
</div>`
})

const Page404 = VuePage({
  props: {
  },
  data: () => ({
  }),
  computed: {
  },
  mounted(){
  },
  updated(){
  },
  methods: {
  },
},
{
template: `<div>
<h1> 404 </h1>
</div>`
})
