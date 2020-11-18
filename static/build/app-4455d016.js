const AblazeVue = {}
AblazeVue.install = function ( Vue ) {
const Component = function ( name, scripts, template ) {
    return Vue.component(name, {...scripts, ...template});
}
Component('example-test', {
  data: () => ({
  }),
  computed: {
  },
  mounted(){
  },
  methods: {
  },
},
{
template: `<div>
<h1>
   My Vue App {{ name }}
  </h1>
</div>`
})

Component('api-form', {
    sync: [ "payload" ],
    props: {
      name: String,
      url: String,
      crud: String,
      cors: {
        type: Boolean,
        default: false
      },
    },
    data: () => ({
      valid: false,
      default_form: {}
    }),
    computed: {
      form: {
        get: function() {
          return this.forms[ this.name ]
        },
        set: function(value) {
          this.forms[ this.name ] = value
        }
      },
    },
    mounted() {
      this.default_form = JSON.parse(JSON.stringify( this.form ));
    },
    methods: {
      sendToServer() {
        console.log("Sent to Server!");
        this.resetDefaults();
      },
      resetDefaults() {
        this.form = JSON.parse(JSON.stringify( this.default_form ));
      },
      submit() {
        this.payload = { username: "hlopez", user_type : "admin" }
        console.log( this.payload )
        var vm = this;
        this.$refs[ this.name ].validate();
        if ( this.valid ) {
          this.sendToServer();
        }
      },
      reset() {
        this.$refs[ this.name ].resetValidation()
      },
      clean() {
        //this.$refs[ this.name ].reset()
        this.resetDefaults();
      },
    },

  },
{
template: `<v-form :ref="name" v-model="valid">
<slot v-bind:clean="clean" v-bind:form="form" v-bind:reset="reset" v-bind:submit="submit">
</slot>
</v-form>`
})

Component('the-view', {
  props: {
    cut         : { default: 0, type: Number },
    autoScroll  : { default: false, type: Boolean }
  },
  data: () => ({
    name : "testing"
  }),
  computed: {
    scroller:{
      get: function () {
        return this.routes[ this.$route.name ].scroller
      },
      set: function (value) {
        this.routes[ this.$route.name ].scroller = value;
      }
    },
  },
  mounted(){
    if ( this.autoScroll ) { this.pageScroll( this.scroller ); }
  },
  updated(){
    if ( this.autoScroll ) { this.pageScroll( this.scroller ); }
  },
  methods: {
    pageScroll(to) {
        const autoScroll = () => this.$el.scroll(0, to);
        setTimeout(autoScroll, 20)
    },
    onScroll(e){
      //this.scroller = e.target.scrollTop;
    }
  },
},
{
template: `<v-container :style="{
      maxHeight: ( (screen.height - cut) + 'px' ),
      overflowX: 'hidden',
      paddingBottom: '100px'
    }" class="overflow-y-auto" v-bind="$attrs" v-scroll.self="onScroll">
<slot></slot>
</v-container>`
})

Component('abz-dev', {
    sync:['lang', 'uid', 'code', 'font', 'theme'],
    props: {
      cut : { default: 290 }
    },

    data: () => ({
      ID    : null,
      editor: null,
      theStyle:'',
    }),

    created() {
      var ID   = this.random_id_name();
      this.ID   = ID;
      this.uid  = ID;
    },

    mounted () {
      var self    = this;
      this.registerAceEditor();
      window.addEventListener("keyup", function(e) {
        var code = self.editor.getValue();
        self.code = code;
        self.$emit('update:code', code)
      }.bind(this));
      this.theStyle = `width:100%; height:100%; overflow: hidden; margin-bottom:`;
      this.editor.setValue( this.code );
    },
    computed:{
    },

    updated() {
      //do something after updating vue instance
      var element = document.getElementById( this.ID );
      element.style.fontSize = (this.font+"px");
      element.style.zIndex = 0;
    },
    watch:{
      lang(val, old){
        this.editor.getSession().setMode(`ace/mode/${ val }`);
      },
      font(val, old){
        document.getElementById( this.uid ).style.fontSize = (val+"px");
      },
      theme(val, old){
        this.editor.setTheme(`ace/theme/${ val }`);
      },
    },

    methods: {
      random_id_name(){
        function random(size=32, choices="0123456789abcdefghijklmnopqrstuvwxyz") {
          var text = "";
          var possible = choices;
          for (var i = 0; i < size; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));
          return text;
        };
        return `${ this.lang }-${ random() }`;
      },
      registerAceEditor: function(){
        var langTools = ace.require("ace/ext/language_tools");
        this.editor   = ace.edit( this.ID );
        this.editor.setTheme(`ace/theme/${ this.theme }`);
        console.log( this.lang )
        this.editor.getSession().setMode(`ace/mode/${ this.lang }`);
        this.editor.setOptions({
            enableBasicAutocompletion: true,
            enableSnippets: false,
            enableLiveAutocompletion: true,
        });
      },
    },
  },
{
template: `<v-container class="fill-height" v-bind="$attrs">
<v-row :style="{
      height: screen.height - cut + 'px'
    }" no-gutters="">
<slot></slot>
<v-col :id="ID" @keyup="$emit('save')" cols="12">
</v-col>
</v-row>
</v-container>`
})

Component('abz-main-bar', {
  data: () => ({
  }),
  computed: {
  },
  mounted(){
  },
  methods: {
  },
},
{
template: `<v-app-bar app="" v-bind="$attrs">
<v-app-bar-nav-icon></v-app-bar-nav-icon>
<v-btn icon="">
<v-icon>mdi-home</v-icon>
</v-btn>
<v-btn @click="go('userProfile', { username: 'toxic' })" icon="">
<v-icon>mdi-heart</v-icon>
</v-btn>
<v-toolbar-title>Home</v-toolbar-title>
<v-spacer></v-spacer>
<v-toolbar-title>{{ __keys__ }}</v-toolbar-title>
</v-app-bar>`
})

Component('example-form', {
    data: () => ({
      name: "testing"
    }),
    computed: {},
    mounted() {  },
    methods: {},
  },
{
template: `<api-form :payload.sync="payload.sales_orders.active" cors="" crud="create" name="users" url="/json" v-slot="{ form, submit, clean, reset }">
<v-text-field :rules="[
        v =&gt; !!v || 'Primary-Key is required',
    ]" @click:append="reset" @input="$nextTick(() =&gt; { form.name = $ablaze.field.username( form.name ) })" append-icon="mdi-plus" label="Globals" v-model="form.name"></v-text-field>
<v-btn @click="submit" color="success" depressed="">
      submit
    </v-btn>
<v-btn @click="reset" color="info" depressed="">
      reset
    </v-btn>
<v-btn @click="clean" color="warning" depressed="">
      clean
    </v-btn>
</api-form>`
})
}

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
    this.current_page.left  = true;
    this.current_page.right = true;
  },
  updated(){
  },
  methods: {
  },
},
{
template: `<v-app>
<abz-main-bar clipped-left="" clipped-right="" color="deep-purple accent-4" dark=""></abz-main-bar>
<v-navigation-drawer app="" clipped="" v-model="current_page.left">
<h1>Left</h1>
</v-navigation-drawer>
<v-navigation-drawer app="" clipped="" right="" v-model="current_page.right">
<h1>Right</h1>
</v-navigation-drawer>
<v-main>
<the-view auto-scroll="" cut="120" fluid="">
<v-row>
<v-col cols="2">
<v-text-field @click:append="editor.config.font--" @click:prepend="editor.config.font++" append-icon="mdi-minus" dense="" hide-details="auto" label="Font ( Px )" prepend-icon="mdi-plus" v-model="editor.config.font"></v-text-field>
</v-col>
<v-col cols="5">
<v-autocomplete :items="editor.themes" dense="" label="Theme" v-model="editor.config.theme"></v-autocomplete>
</v-col>
<v-col cols="4">
<v-autocomplete :items="editor.langs" dense="" label="Language" v-model="editor.live.lang"></v-autocomplete>
</v-col>
</v-row>
<abz-dev :code.sync="editor.live.code" :font.sync="editor.config.font" :lang.sync="editor.live.lang" :theme.sync="editor.config.theme" :uid.sync="editor.live.uid" cut="230"></abz-dev>
</the-view>
</v-main>
<v-footer app="" padless="">
<v-col class="text-center" cols="12">
        {{ new Date().getFullYear() }} — <strong>Ablaze</strong>
</v-col>
</v-footer>
</v-app>`
})

const PageUserProfile = VuePage({
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
<h1 @click="go('basics/home')"> User {{ $route.params.username }} </h1>
</div>`
})

const PageBasicsDebug = VuePage({},
{
template: `<div>
<h1> Debug </h1>
</div>`
})

const PageBasics404 = VuePage({
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
<v-main>
<the-view>
<h1>Error 404</h1>
</the-view>
</v-main>
</v-app>`
})
