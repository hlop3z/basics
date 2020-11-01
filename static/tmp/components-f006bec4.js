const AblazeVue = {}
AblazeVue.install = function ( Vue ) {
const Component = function ( name, scripts, template ) {
return Vue.component(name, {...scripts, ...template});
}
Component('example-test', {
  data: () => ({
    name : "testing"
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
  data: () => ({
    name : "testing"
  }),
  computed: {
  },
  mounted(){
  },
  methods: {
    onScroll(e){
      this['testwindow'] = e.target.scrollTop;
    }
  },
},
{
template: `<v-container :style="{  maxHeight: ( (screen.height - 5) + 'px' )  }" class="overflow-y-auto" fluid="" v-scroll.self="onScroll">
<slot></slot>
</v-container>`
})

Component('example-form', {
    data: () => ({
      name: "testing"
    }),
    computed: {},
    mounted() {},
    methods: {},
  },
{
template: `<api-form cors="" crud="create" name="users" url="/json" v-slot="{ form, submit, clean, reset }">
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