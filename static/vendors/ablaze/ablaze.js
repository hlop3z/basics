const $ablaze           = {};
$ablaze.is              = {};
$ablaze.download        = {};
$ablaze.number          = {};
$ablaze.vue             = {};
$ablaze.field           = {};
$ablaze.filter          = {};
$ablaze.storage         = {};
$ablaze.storage.cookie  = {};
$ablaze.storage.session = {};
$ablaze.storage.local   = {};

$ablaze.download.json=function(exportObj,exportName){var dataStr="data:text/json;charset=utf-8,"+encodeURIComponent(JSON.stringify(exportObj));var downloadAnchorNode=document.createElement("a");downloadAnchorNode.setAttribute("href",dataStr);downloadAnchorNode.setAttribute("download",exportName+".json");downloadAnchorNode.click();downloadAnchorNode.remove()};

$ablaze.storage.cookie.set=function(e,t,i){var o=new Date();o.setTime(o.getTime()+24*i*60*60*1e3);var n="expires="+o.toUTCString();document.cookie=e+"="+t+";"+n+";path=/"};
$ablaze.storage.cookie.get=function(t){for(var n=t+"=",r=document.cookie.split(";"),e=0;e<r.length;e++){for(var i=r[e];" "===i.charAt(0);)i=i.substring(1);if(0===i.indexOf(n))return i.substring(n.length,i.length)} return""};
$ablaze.storage.cookie.delete=function(t){document.cookie=t + "=;expires=Thu, 01 Jan 1970 00:00:01 GMT;"};
$ablaze.storage.local.set=function(k,v){localStorage.setItem(k,JSON.stringify(v))};
$ablaze.storage.local.get=function(k){return JSON.parse(localStorage.getItem(k))};
$ablaze.storage.local.remove=function(k){localStorage.removeItem(k)};
$ablaze.storage.local.clear=function(){localStorage.clear()};
$ablaze.storage.session.set=function(k,v){sessionStorage.setItem(k,JSON.stringify(v))};
$ablaze.storage.session.remove=function(k){sessionStorage.removeItem(k)};
$ablaze.storage.session.clear=function(){sessionStorage.clear()};

$ablaze.loop=function(count,action,...params){for(var i=0;i<count;i++){action(...params)}};
$ablaze.debounce=function(func,wait,immediate){var timeout;return function(){var context=this,args=arguments;var callNow=immediate&&!timeout;clearTimeout(timeout);timeout=setTimeout(function(){timeout=null;if(!immediate){func.apply(context,args)}},wait);if(callNow)func.apply(context,args)}};
$ablaze.throttle=function(func,wait,options){var context,args,result;var timeout=null;var previous=0;if(!options)options={};var later=function(){previous=options.leading===!1?0:Date.now();timeout=null;result=func.apply(context,args);if(!timeout)context=args=null};return function(){var now=Date.now();if(!previous&&options.leading===!1)previous=now;var remaining=wait-(now-previous);context=this;args=arguments;if(remaining<=0||remaining>wait){if(timeout){clearTimeout(timeout);timeout=null};
previous=now;result=func.apply(context,args);if(!timeout)context=args=null}else if(!timeout&&options.trailing!==!1){timeout=setTimeout(later,remaining)}; return result}}

$ablaze.reverse=function(str){var splitString=str.split("");var reverseArray=splitString.reverse();var joinArray=reverseArray.join("");return joinArray};

$ablaze.is.function = function(v) {
  return "function" == typeof v;
};
$ablaze.is.obj = function(v) {
  return v && "object" == typeof v && v.constructor === Object;
};
$ablaze.is.str = function isString(n) {
  return "string" == typeof n || n instanceof String;
};
$ablaze.is.num = function(v) {
  return "number" == typeof v && isFinite(v);
};
$ablaze.is.list = function(v) {
  return v && "object" == typeof v && v.constructor === Array;
};
$ablaze.is.null = function(v) {
  return null === v;
};
$ablaze.is.undefined = function(v) {
  return void 0 === v;
};
$ablaze.is.boolean = function(v) {
  return "boolean" == typeof v;
};
$ablaze.is.date = function(v) {
  return v instanceof Date;
};
$ablaze.is.regex = function(v) {
  return v && "object" == typeof v && v.constructor === RegExp;
};
$ablaze.is.error = function(v) {
  return v instanceof Error && void 0 !== v.message;
};
$ablaze.is.symbol = function(v) {
  return "symbol" == typeof v;
};

$ablaze.filter.capitalize=function(t){return t?(t=(t=t.toString()).toLowerCase()).charAt(0).toUpperCase()+t.slice(1):""}
$ablaze.filter.caps = $ablaze.filter.capitalize;
$ablaze.filter.title=function(t){return t?t.toLowerCase().split(" ").map(function(t){return t.charAt(0).toUpperCase()+t.slice(1)}).join(" "):""}
$ablaze.filter.lower = function(t) {
  return t ? t.toLowerCase() : "";
};
$ablaze.filter.upper = function(t) {
  return t ? t.toUpperCase() : "";
};
var __ablaze_filter_cut__ = function(t, z) {
  return t ? t.substring(0, z) : "";
};
$ablaze.filter.cut=function(v,s,t=!0){var end="";if(v.length>s&&t===!0){end="..."}
return `${__ablaze_filter_cut__(v, s)}${end}`}

$ablaze.lorem=function(e,t){var lorem=["Lorem Ipsum is simply dummy text of the printing and typesetting industry.","Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.","An unknown printer took a galley of type and scrambled it to make a type specimen book.","It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.","It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages.","Lorem Ipsum is simply dummy text of the printing and typesetting industry."];var list=[];var len=lorem.length;switch(e[0]){case "w":for(var i=0;i<t;i++){var rand=Math.floor(len*Math.random());var words=lorem[rand].trim().split(" ");list.push(words[Math.floor(len*Math.random())])}
break;case "s":for(var i=0;i<t;i++){var rand=Math.floor(len*Math.random());list.push(lorem[rand])}
break}
return list.join(" ")}

$ablaze.lorem.word = function(e) {
  return $ablaze.filter.capitalize($ablaze.lorem("w", e));
};
$ablaze.lorem.sentence = function(e) {
  return $ablaze.filter.capitalize($ablaze.lorem("s", e));
};
$ablaze.lorem.w = $ablaze.lorem.words;
$ablaze.lorem.s = $ablaze.lorem.sentence;

$ablaze.has = {};
$ablaze.has.value=function(value){if(value&&value!=""&&value!=" "&&typeof value!=="undefined"){return!0}else{return!1}};
$ablaze.has.value.not_zero=function(value){if(value&&value!=0&&value!=""&&value!=" "&&typeof value!=="undefined"){return!0}else{return!1}}

$ablaze.number.commas = function(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
$ablaze.number.float=function(e,t=2){var a,s;return((e=String(e).replace(/[^0-9\.\,]+/g,"").replace(/\,{1,}/g,",").replace(/\.{1,}/g,".").replace(/,/g,"")),(amount=parseFloat(e).toFixed(t)),(e=amount.replace(/(\d)(?=(\d{3})+(?!\d))/g,"$1,")),(cc=e.split(".")),(coins=cc[0]),(cents=String(cc[1]).replace(/,/g,"").replace(/[0]{1,}$/g,"")),(a=0===parseInt(cents)?`${coins}`:`${coins}.${cents}`),(s=0===parseInt(cents)?`${parseInt(coins.replace(/,/g, ""))}`:`${parseInt(coins.replace(/,/g, ""))}.${cents}`),(out={display:""===a.split(".")[1]?`${a.split(".")[0]}.${Array(t + 1).join("0")}`:a,value:parseFloat(s)}),out,(""!==out.display.split(".")[1]&&"undefined"!==out.display.split(".")[1])||(out.display=out.display.split(".")[0]),out)};
$ablaze.number.currency = function(d) {
  return $ablaze.number.float(d, 2);
};

$ablaze.string = {};
$ablaze.string.lowercase = "abcdefghijklmnopqrstuvwxyz";
$ablaze.string.uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
$ablaze.string.digits = "0123456789";
$ablaze.string.hexdigits = "0123456789abcdefABCDEF";
$ablaze.string.others = "-._~";

$ablaze.random = function(size, choices) {
  var text = "";
  var possible = choices;
  for (var i = 0; i < size; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
};
$ablaze.random.letters = function(s) {
  return $ablaze.random(s, $ablaze.string.lowercase + $ablaze.string.uppercase);
};
$ablaze.random.alphanum = function(s) {
  return $ablaze.random(
    s,
    $ablaze.string.lowercase + $ablaze.string.uppercase + $ablaze.string.digits
  );
};
$ablaze.random.lowercase = function(s) {
  return $ablaze.random(s, $ablaze.string.lowercase);
};
$ablaze.random.uppercase = function(s) {
  return $ablaze.random(s, $ablaze.string.uppercase);
};
$ablaze.random.digits = function(s) {
  return $ablaze.random(s, $ablaze.string.digits);
};
$ablaze.random.hexdigits = function(s) {
  return $ablaze.random(s, $ablaze.string.hexdigits);
};
$ablaze.random.all = function(s) {
  return $ablaze.random(
    s,
    $ablaze.string.lowercase +
      $ablaze.string.uppercase +
      $ablaze.string.digits +
      $ablaze.string.hexdigits +
      $ablaze.string.others
  );
};

$ablaze.field.letters = function(e) {
  return e.replace(/((?!([a-zA-Z])).)/g, "");
};
$ablaze.field.letters.lower = function(e) {
  return e.toLowerCase().replace(/((?!([a-z])).)/g, "");
};
$ablaze.field.letters.upper = function(e) {
  return e.toUpperCase().replace(/((?!([A-Z])).)/g, "");
};
$ablaze.field.alphanum = function(e) {
  return e.replace(/((?!([a-zA-Z0-9])).)/g, "");
};
$ablaze.field.alphanum.lower = function(e) {
  return e.toLowerCase().replace(/((?!([a-z0-9])).)/g, "");
};
$ablaze.field.alphanum.upper = function(e) {
  return e.toUpperCase().replace(/((?!([A-Z0-9])).)/g, "");
};
$ablaze.field.zipcode = function(e) {
  return e.toUpperCase().replace(/((?!([A-Z0-9\-])).)/g, "");
};

$ablaze.field.username=function(e){return e.toLowerCase().replace(/((?!([a-z0-9_])).)/g,"").replace(/_{1,}/g,"_").replace(/^\d+$/,"")}
$ablaze.field.username.dot=function(e){return e.toLowerCase().replace(/\.{1,}/g,".").replace(/((?!([a-z0-9_\.])).)/g,"").replace(/_{1,}/g,"_").replace(/\.{1,}/g,".").replace(/_\.{0,}/g,"_").replace(/\._{0,}/g,".").replace(/^\d+$/,"")}
$ablaze.field.phone=function(e){return e.replace(/((?!(^[\+?]|[0-9])).)/g,"")}
$ablaze.field.phone.custom=function(e,c){return e.replace(/((?!(^[\+?]|[0-9])).)/g,"").replace(/(\+)/g,"").slice(0,c)}

$ablaze.field.email=function(e){return((e=(e=e.replace(/\.{1,}/g,".").replace(/@{1,}/g,"@").replace(/@\./g,"@").replace(/\.@/g,".").replace(/-{1,}/g,"-").replace(/_{1,}/g,"_").replace(/-\./g,"-").replace(/\.-/g,".").replace(/_\./g,"_").replace(/\._/g,".")).replace(/-@/g,"@").replace(/@-/g,"@")),(f=e.split("@")),f.length>2&&((b=f.slice(-1).pop()),(a=f.slice(0,f.length-1)),(e=`${a.join("")}@${b}`)),(e=e.replace(/\._/g,".").replace(/_\./g,"_")).replace(/\.{1,}/g,".").replace(/@{1,}/g,"@").replace(/@\./g,"@").replace(/\.@/g,".").replace(/-{1,}/g,"-").replace(/_{1,}/g,"_").replace(/-\./g,"-").replace(/\.-/g,".").replace(/_\./g,"_").replace(/\._/g,".").replace(/_-/g,"_").replace(/-_/g,"-"))}
$ablaze.field.slug=function(e){return e.toLowerCase().replace(/((?!([a-z0-9-])).)/g,"").replace(/-{1,}/g,"-").replace(/^-/,"").replace(/^\d+$/,"")}
$ablaze.field.tags=function(e){return[...new Set(e.toLowerCase().replace(/((?!([a-z,])).)/g,"").replace(/,{1,}/g,",").replace(/^\d+$/,"").replace(/,$/,"").split(","))]}
$ablaze.field.hashtags=function(e){return[...new Set(e.toLowerCase().replace(/((?!([a-z#\s])).)/g,"").replace(/#{1,}/g,"#").replace(/^\d+$/,"").split(" "))].filter(e=>{return e.startsWith("#")}).map(e=>{return e.replace("#","")})}
$ablaze.field.attags=function(e){return[...new Set(e.toLowerCase().replace(/((?!([a-z0-9_@\s])).)/g,"").replace(/_{1,}/g,"_").replace(/@{1,}/g,"@").replace(/^\d+$/,"").split(" "))].filter(e=>{return e.startsWith("@")}).map(e=>{return e.replace("@","")})}
$ablaze.field.attags.dot=function(e){return[...new Set(e.toLowerCase().replace(/((?!([a-z0-9_\.@\s])).)/g,"").replace(/_{1,}/g,"_").replace(/\.{1,}/g,".").replace(/_\.{0,}/g,"_").replace(/\._{0,}/g,".").replace(/@{1,}/g,"@").replace(/^\d+$/,"").split(" "))].filter(e=>{return e.startsWith("@")}).map(e=>{return e.replace("@","")})}

$ablaze.field.int=function(e){return((e=(e=(e=e.split(".")[0]).replace(/((?!(^[-?]|[0-9])).)/g,"")).replace(/^[0]/,"")),(e=parseInt(e).toString()).replace(/^-0/,"-"))}
$ablaze.field.int.positive=function(e){return(e=(e=String(e)).replace(/^0/,"")).replace(/((?!([0-9])).)/g,"")};
$ablaze.field.int.negative=function(e){return((e=String(e)).length>0&&(e=(e=(e=e.replace(/^/,"-")).replace(/-{1,}/,"-")).replace(/^-0{1,}/,"-")),1==e.length&&(e=e.replace(/-/,"")),e.replace(/((?!(^[-?]|[0-9])).)/g,""))}
$ablaze.field.number=function(field,decimal){l=String(String(field).split(".")[1]).length;if(l&&!decimal){decimal=l} return $ablaze.number.float(field,decimal)}
$ablaze.field.float = function(field, decimal = 4) {
  return $ablaze.number.float(field, decimal).value;
};
$ablaze.field.currency = function(field) {
  return $ablaze.field.number(field, 2);
};
$ablaze.field.money = function(field) {
  return $ablaze.field.number(field, 2);
};
$ablaze.field.list = function(field, size = 10) {
  return field
    .reverse()
    .slice(0, size)
    .reverse();
};

$ablaze.script = function(url){
    var s = document.createElement('script');
    s.type = 'text/javascript';
    s.async = true;
    s.src = url;
    var x = document.getElementsByTagName('head')[0];
    x.appendChild(s);
}

$ablaze.form_update = function(original,updates,pk=!1){const UPDATED={};Object.keys(original).forEach((k)=>{if(JSON.stringify(original[k])!==JSON.stringify(updates[k])){UPDATED[k]=updates[k]}});if(Object.keys(UPDATED).length>0){if(pk){UPDATED[pk]=original[pk]} return UPDATED} return{}}

$ablaze.vue.filters = {
  capitalize    : function (value) { return $ablaze.filter.capitalize(value)  },
  caps          : function (value) { return $ablaze.filter.caps(value)  },
  title         : function (value) { return $ablaze.filter.title(value)  },
  lower         : function (value) { return $ablaze.filter.lower(value)  },
  upper         : function (value) { return $ablaze.filter.upper(value)  },
  cut           : function (value, size, suffix=true) { return $ablaze.filter.cut(value, size, suffix)  },
  //timesince     : function (value) { return moment( sec_to_ms(value) ).fromNow(true)  },
  //timesince_ms  : function (value) { return moment( value ).fromNow(true)  },
  //calc_time     : function (value) { return calc_time_since( sec_to_ms(value) ) },
  //calc_time_ms  : function (value) { return calc_time_since(value) },
}

const DynamicVuex={
  namespaced:!0,
  state(){return{ value:null }},
  mutations:{setValue(state,value){ state.value=value } },
  actions:{value:function(context,value){ context.commit("setValue",value) }},
  getters:{value(state){ return state.value }},
}
class __AblazeVuex__ {
    constructor(name, store) {
      var model = `abz-${ name }`;
      this.name  = model;
      this.store = store;
      store.registerModule(`${ model }`, DynamicVuex);
      store.dispatch(`${ model }/value`, [])
    }
    get val(){
        return this.store.getters[`${ this.name }/value`]
    }
    set val(value){
        this.store.dispatch(`${ this.name }/value`, value)
    }
    get value(){
        return this.val
    }
    set value(value){
        this.val = value
    }
    get state(){
        return this.val
    }
    set state(value){
        this.val = value
    }
}

const AblazeVuex = ({ store=null, name=null }={}) => new __AblazeVuex__(name, store);

const AblazeVue = {}
AblazeVue.install = function (Vue, options) {
  console.log( ' i worked' )

  var $globals    = AblazeVuex({ name: "globals"   , store: options.store });
  var $components = AblazeVuex({ name: "components", store: options.store });
  var $forms      = AblazeVuex({ name: "forms"     , store: options.store });
  var $views      = AblazeVuex({ name: "views"     , store: options.store });
  var $roles      = AblazeVuex({ name: "roles"     , store: options.store });
  var $screen     = AblazeVuex({ name: "screen"    , store: options.store });
  var $payloads   = AblazeVuex({ name: "payloads"  , store: options.store });

  Vue.prototype.$timestamp = () => Math.round(new Date().getTime() / 1000);

  Vue.mixin({
    filters: $ablaze.vue.filters,

    mounted(){
      console.log( 'I worked' )
    },

    computed:{

      $globals: {
        get: function () {
          return $globals.value;
        },
        set: function (value) {
          $globals.value = value;
        }
      },

      $payloads: {
        get: function () {
          return $payloads.value;
        },
        set: function (value) {
          $payloads.value = value;
        }
      }


    },
  })

  Vue.component('api-form', {
    props:{
      name   : String,
      url    : String,
      crud   : String,
      form   : Object,
      perms: {
        type: Boolean,
        default:false
      },
      valid: {
        type: Boolean,
        default:true
      },
    },
    methods: {
      submit () {
        var vm = this;
        var api;
        this.$refs[ this.name ].validate();
        if(this.perms){ api = this.$httpc }else{ api = this.$http }
        if(this.url && this.valid){
          api.post(this.url, { crud:this.crud, data:this.form })
          .then(r=>{
            const data = { url: vm.url, crud: vm.crud, status: true, data: r.data, code: r.status, timestamp: vm.$timestamp() }
            vm.$payloads.push( data );
          }).catch(e=>{
            const data = { url: vm.url, crud: vm.crud, status: false, data: e.response.statusText, code: e.response.status, timestamp: vm.$timestamp() }
            vm.$payloads.push( data );
          })
        }else{ null }
        this.$emit('update:valid', this.valid);
      },
      reset () {
        this.$refs[ this.name ].reset()
        this.$emit('update:valid', this.valid);
      },
      clean () {
        this.$refs[ this.name ].resetValidation()
        this.$emit('update:valid', this.valid);
      },
    },
    template: `<v-form :ref="name" v-model="valid"> <slot v-bind:submit="submit" v-bind:reset="reset" v-bind:clean="clean"></slot>  </v-form>`,
  })
}
