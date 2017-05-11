(function() {
  "use strict";

  var template = '<div class="ui-file">\
                    <input type="file" v-on:change="fileChanged($event)" :accept="acceptsFormats" v-el:input>\
                    <template v-if="dropzone">\
                      <div class="ui-file-dropzone" :class="[dragIsOver ? \'active\' : \'\']" v-el:dragzone v-on:click="openFileDialog()" v-on:dragover="dropZoneDragOver($event)" v-on:drop="dropZoneDrop($event)" v-on:dragleave="cursorLeft()">{{ dropZoneText }}</div>\
                    </template>\
                    <div v-if="message" class="vue-input-message-container">\
                    <i class="fa fa-exclamation-triangle"></i><div><h5>{{ message }}</h5></div>\
                  </div>\
                  </div>';

  App.ui.components.forms.file = Vue.extend({
    mixins: [App.ui.interfaces.forms.input, App.ui.interfaces.std.validate],
    template: template,
    props: ['value', 'name', 'required', 'placeholder', 'accepts', 'dropzone'],
    data: function() {
      return {
        message: null,
        skipValidation: false,
        dragIsOver: false
      }
    },
    ready: function() {
      console.log(this.name);
      this.skipValidation = true;
    },
    watch: {
      value: function() {
        this.validateContent();
      }
    },
    computed: {
      dropZoneText: function() {
        if (this.dragIsOver) {
          return 'Drop File to Upload';
        }

        return 'Upload a File';
      },
      fileName: function() {},
      fileAdded: function() {
        return false;
      },
      acceptsFormats: function() {
        if (this.accepts.constructor === Array) {
          return this.accepts.map(function(i) {
            return i + '/*'
          }).join(',');
        } else if (App.ui.interfaces.std.validate.methods._valueIsEmpty(this.accepts)) {
          return null;
        } else {
          return this.accepts + '/*';
        }
      },
      isImage: function() {
        if (this.accepts.constructor === Array && this.accepts.indexOf('image')) {
          return true;
        } else if (this.accepts === 'image') {
          return true;
        } else {
          return false;
        }
      }
    },
    methods: {
      openFileDialog: function() {
        console.log(this.$els);
        this.$els.input.trigger('click');
      },
      cursorLeft: function() {
        this.dragIsOver = false;
      },
      dropZoneDrop: function(e) {
        e.stopPropagation();
        e.preventDefault();

        var file = e.dataTransfer.files[0]; // FileList object.
        this.name = file.name;
        this.value = file;
      },
      dropZoneDragOver: function(e) {
        this.dragIsOver = true;
        e.stopPropagation();
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
      },
      deleteOld: function() {
        this.name = '';
      },
      fileChanged: function(e) {
        var files = e.target.files || e.dataTransfer.files;
        if (!files.length) {
          return;
        } else {
          this.value = files[0];
          this.name = files[0].name;
        }
      },
      validateContent: function() {

        if (this.skipValidation) {
          this.skipValidation = false;
          return true;
        } else {
          this.message = null;
          if (this.required && this._valueIsEmpty(this.value)) {
            this.message = "This can't be empty";
            return false;
          } else {
            return true;
          }
        }
      }
    }
  });
})();
