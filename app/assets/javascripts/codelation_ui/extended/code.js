//= require highlight.pack

// NORMAL
//      <vue-code lang="javascript">
//        function name(){
//          return 'jake';
//        }
//
//        //comment
//        var test = '12' + ' days';
//      </vue-code>

// DARK UI
//      <vue-code lang="javascript" dark>
//        function name(){
//          return 'jake';
//        }
//
//        //comment
//        var test = '12' + ' days';
//      </vue-code>

// INLINE
//      <vue-code lang="javascript" inline>
//        function name(){
//          return 'jake';
//        }
//
//        //comment
//        var test = '12' + ' days';
//      </vue-code>

(function() {
  "use strict";

  App.register('component').enter(function() {

    var template = '<div class="vue-code" :class="[inline ? \'vue-code-inline\' : \'vue-code-block\', dark ? \'vue-code-dark\' : \'\']">\
                      <pre v-if="!inline"><code v-el:code :class="lang"><slot></slot></code></pre>\
                      <span v-else><code v-el:code :class="lang"><slot></slot></code></span>\
                    </div>';

    Vue.component('vue-code', {
      template: template,
      props: {
        lang: String,
        inline: {
          type: Boolean,
          default: false
        },
        dark: {
          type: Boolean,
          default: false
        }
      },
      ready: function() {
        var code = this.$els.code;
        hljs.highlightBlock(code);
      }
    });
  });
})();
