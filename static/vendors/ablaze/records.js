const ablaze_records = {};

ablaze_records.dynamicSort = function (property) {
    var sortOrder = 1;
    if(property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a,b) {
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    }
}

ablaze_records.dynamicSortMultiple = function () {
    var props = arguments;
    return function (obj1, obj2) {
        var i = 0, result = 0, numberOfProperties = props.length;
        while(result === 0 && i < numberOfProperties) {
            result = ablaze_records.dynamicSort(props[i])(obj1, obj2);
            i++;
        }
        return result;
    }
}

ablaze_records.startswith   = function({items=[], key=null, value=null, i=false}={}){ return !i ? items.filter(item => String(item[ key ]).startsWith( String(value) ))   : items.filter(item => String(item[ key ]).toLowerCase().startsWith( String(value).toLowerCase() )); }
ablaze_records.istartswith  = function({items=[], key=null, value=null, i=false}={}){ return !i ? items.filter(item => !(String(item[ key ]).startsWith( String(value) ))): items.filter(item => !(String(item[ key ]).toLowerCase().startsWith( String(value).toLowerCase() ))); }

ablaze_records.endswith     = function({items=[], key=null, value=null, i=false}={}){ return !i ? items.filter(item => String(item[ key ]).endsWith( String(value) ))     : items.filter(item => String(item[ key ]).toLowerCase().endsWith( String(value).toLowerCase() )); }
ablaze_records.iendswith    = function({items=[], key=null, value=null, i=false}={}){ return !i ? items.filter(item => !(String(item[ key ]).endsWith( String(value) )))  : items.filter(item => !(String(item[ key ]).toLowerCase().endsWith( String(value).toLowerCase() ))); }

ablaze_records.search       = function({items=[], key=null, value=null, i=false}={}){ return !i ? items.filter(item => String(item[ key ]).includes( String(value) ))     : items.filter(item => String(item[ key ]).toLowerCase().includes( String(value).toLowerCase() )); }
ablaze_records.isearch      = function({items=[], key=null, value=null, i=false}={}){ return !i ? items.filter(item => !(String(item[ key ]).includes( String(value)) ))  : items.filter(item => !(String(item[ key ]).toLowerCase().includes( String(value).toLowerCase()) )); }

ablaze_records.find         = function({items=[], key=null, value=null}={}){ return items.filter((r) => r[key] === value) }
ablaze_records.ifind        = function({items=[], key=null, value=null}={}){ return items.filter((r) => r[key] !== value) }

ablaze_records.group        = function(e, t){ return t.reduce((t, r) => ((t[r[e]] = t[r[e]] || []).push(r), t), {}) }
ablaze_records.by           = function(t, e){ return e.reduce((e, r) => ((e[r[t]] = r), e), {}) }

ablaze_records.isFunction   = function(key){ return typeof( key ) === 'function' ? key() : key }

const valSize = function(value){
    if((value && "object" == typeof value) && (value.constructor === Object)){ return Object.keys(value).length; }
    else if( (value && "object" == typeof value && value.constructor === Array) || ("string" == typeof value || value instanceof String) ){ return value.length; }
    else{ return value; }
};

ablaze_records.lt    = function({items=[], key=null, value=null}={}){ return items.filter((r) => (valSize(r[key]) < value)) }
ablaze_records.lte   = function({items=[], key=null, value=null}={}){ return items.filter((r) => (valSize(r[key]) <= value)) }
ablaze_records.gt    = function({items=[], key=null, value=null}={}){ return items.filter((r) => (valSize(r[key]) > value)) }
ablaze_records.gte   = function({items=[], key=null, value=null}={}){ return items.filter((r) => (valSize(r[key]) >= value)) }
ablaze_records.bt    = function({items=[], key=null, min=null, max=null}={}){ return items.filter((r) => ((valSize(r[key]) > min) && (valSize(r[key]) < max))) }
ablaze_records.bte   = function({items=[], key=null, min=null, max=null}={}){ return items.filter((r) => ((valSize(r[key]) >= min) && (valSize(r[key]) <= max))) }
ablaze_records.ilt   = function({items=[], key=null, value=null}={}){ return items.filter((r) => !(valSize(r[key]) < value)) }
ablaze_records.ilte  = function({items=[], key=null, value=null}={}){ return items.filter((r) => !(valSize(r[key]) <= value)) }
ablaze_records.igt   = function({items=[], key=null, value=null}={}){ return items.filter((r) => !(valSize(r[key]) > value)) }
ablaze_records.igte  = function({items=[], key=null, value=null}={}){ return items.filter((r) => !(valSize(r[key]) >= value)) }
ablaze_records.ibt   = function({items=[], key=null, min=null, max=null}={}){ return items.filter((r) => (!(valSize(r[key]) > min) || !(valSize(r[key]) < max))) }
ablaze_records.ibte  = function({items=[], key=null, min=null, max=null}={}){ return items.filter((r) => (!(valSize(r[key]) >= min)) || !(valSize(r[key]) <= max)) }

function trimString(s){var l=0,r=s.length-1;while(l<s.length&&s[l]==' ')l++;while(r>l&&s[r]==' ')r-=1;return s.substring(l,r+1)}
function compareObjects(o1,o2){var k='';for(k in o1)if(o1[k]!=o2[k])return!1;for(k in o2)if(o1[k]!=o2[k])return!1;return!0}
function itemExists(haystack,needle){for(var i=0;i<haystack.length;i++)if(compareObjects(haystack[i],needle))return!0;return!1}

ablaze_records.searchFor=function(objects,toSearch){var results=[];toSearch=trimString(String(toSearch));for(var i=0;i<objects.length;i++){for(var key in objects[i]){if(String(objects[i][key]).indexOf(toSearch)!=-1){if(!itemExists(results,objects[i]))results.push(objects[i])}}} return results}


const isDirty=function(original,updates,pk=!1){const UPDATED={};Object.keys(original).forEach((k)=>{if(JSON.stringify(original[k])!==JSON.stringify(updates[k])){UPDATED[k]=updates[k]}});if(Object.keys(UPDATED).length>0){if(pk){UPDATED[pk]=original[pk]} return UPDATED} return{}}

class RecordsBase {
    constructor(pk,schema) {
        this.pk   = pk;
        this.meta = {
            fields : Object.keys( schema ),
            schema : schema
        };
    }

    get schema() {
      const schema = {};
      this.meta.fields.forEach(key=>{
          schema[key] = ablaze_records.isFunction( this.meta.schema[ key ] );
      });
      return schema
    }

    get list(){
        return this._list
    }
    set list(value){
        this._list = value;
    }
    get dict(){
      var dict = {};
      this._list.forEach(item => {
        dict[ item[ this.pk ] ] = item;
      });
      return dict
    }
    get keys(){
      var keys = [];
      this._list.forEach(item => {
        keys.push( item[ this.pk ] )
      });
      return keys
    }
    get copy(){
        return JSON.parse(JSON.stringify( this.dict ))
    }
    save(items) {
        this._list = Object.values( items );
    }


    append(item){
        var form = this.schema;
        var keys = Object.keys( item ).filter( x => this.meta.fields.includes(x) );
        var _key = item[this.pk];
        if(!this.dict[_key]){
          keys.forEach(key=>{
              form[ key ]=item[ key ]
          });
          var list = this._list;
          list.push( form )
          this._list = list;
        }
    }
    extend(items){
        items.forEach(item=>{
            this.append( item )
        });
    }
    new(item){
      this.append(item);
    }
    create(item){
      this.append(item);
    }
    create_many(items){
      this.extend(items);
    }
    update(item){
      var self = this;
      var objects = this.dict;
      let dirty   = isDirty(objects[ item[ this.pk ] ], item, this.pk);
      const save = function(){
        objects[ item[ self.pk ] ] = item;
        self.save(objects);
      }
      return { dirty, save }
    }
    update_many(items){
      var self = this;
      var objs;
      var _dirty=[];
      if(items && "object" == typeof items && items.constructor === Object){
        objs = Object.values(items);
      }
      else if(items && "object" == typeof items && items.constructor === Array){
        objs = items;
      }
      var objects = this.dict;
      objs.forEach(item => {
        let { dirty } = this.update(item);
        _dirty.push( dirty );
      });
      const save = function(){
        objs.forEach(item => {
          objects[ item[ self.pk ] ] = item;
        });
        self.save(objects);
      }
      var dirty = _dirty.filter(x => x);
      return { dirty, save }
    }
    remove(items){
      var objects = this.dict;
      if(items && "object" == typeof items && items.constructor === Array){
        items.forEach(item => {
          delete objects[item]
        });
      }else{
        delete objects[items];
      }
      this.save(objects);
    }
    del(items){
      this.remove(items);
    }

    head(t = 10) {
        return this._list.slice(0, t)
    }
    tail(t = 10) {
        return this._list.reverse().slice(0, t).reverse()
    }

    by(_key){
        var key = _key.startsWith('-') ? _key.replace('-', '') : _key
        return ablaze_records.by( key, this.sort_by(_key) )
    }
    sort_by(...keys){
        return this._list.sort( ablaze_records.dynamicSortMultiple(...keys) )
    }
    group_by(_key){
        var key = _key.startsWith('-') ? _key.replace('-', '') : _key
        return ablaze_records.group( key, this.sort_by(_key))
    }

    searchall(key){
        return ablaze_records.searchFor(this._list, key)
    }
    startswith(key, value){
        return ablaze_records.startswith({ key:key, value:value, items:this._list, i:true })
    }
    istartswith(key, value){
        return ablaze_records.istartswith({ key:key, value:value, items:this._list, i:true })
    }

    endswith(key, value){
        return ablaze_records.endswith({ key:key, value:value, items:this._list, i:true })
    }
    iendswith(key, value){
        return ablaze_records.iendswith({ key:key, value:value, items:this._list, i:true })
    }

    search(key, value){
        return ablaze_records.search({ key:key, value:value, items:this._list, i:true })
    }
    isearch(key, value){
        return ablaze_records.isearch({ key:key, value:value, items:this._list, i:true })
    }

    eq(key, value){
        return ablaze_records.find({ key:key, value:value, items:this._list })
    }
    ieq(key, value){
        return ablaze_records.ifind({ key:key, value:value, items:this._list })
    }

    lt(key, value){
        return ablaze_records.lt({ key:key, value:value, items:this._list })
    }
    lte(key, value){
        return ablaze_records.lte({ key:key, value:value, items:this._list })
    }
    ilt(key, value){
        return ablaze_records.ilt({ key:key, value:value, items:this._list })
    }
    ilte(key, value){
        return ablaze_records.ilte({ key:key, value:value, items:this._list })
    }

    gt(key, value){
        return ablaze_records.gt({ key:key, value:value, items:this._list })
    }
    gte(key, value){
        return ablaze_records.gte({ key:key, value:value, items:this._list })
    }
    igt(key, value){
        return ablaze_records.igt({ key:key, value:value, items:this._list })
    }
    igte(key, value){
        return ablaze_records.igte({ key:key, value:value, items:this._list })
    }

    bt(key, min, max){
        return ablaze_records.bt({ key:key, min:min, max:max, items:this._list })
    }
    bte(key, min, max){
        return ablaze_records.bte({ key:key, min:min, max:max, items:this._list })
    }
    ibt(key, min, max){
        return ablaze_records.ibt({ key:key, min:min, max:max, items:this._list })
    }
    ibte(key, min, max){
        return ablaze_records.ibte({ key:key, min:min, max:max, items:this._list })
    }
}

class __Records__ extends RecordsBase {
    constructor(pk, schema) {
        super(pk, schema);
        this._list = [];
    }
}
const Records = ({pk='id', schema=null}={}) => new __Records__(pk, schema);
