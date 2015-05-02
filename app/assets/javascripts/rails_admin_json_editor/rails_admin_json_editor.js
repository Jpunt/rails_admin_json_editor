/*globals $, Vue, markdown, _*/

//= require rails_admin_json_editor/lib/vue.0.11.4
//= require rails_admin_json_editor/lib/lodash.2.4.1
//= require rails_admin_json_editor/lib/markdown

//= require rails_admin_json_editor/ra.remoteForm.custom

var vm;

$(document).on('rails_admin.dom_ready', function() {
  'use strict';

  // TODO: Make this possible for multiple instances

  // Get data
  var jsonResult = $('[ref=json-editor]').data('json-result');
  var jsonScheme = $('[ref=json-editor]').data('json-scheme');
  var enableGuids = $('[ref=json-editor]').data('enable-guids');

  if(!jsonResult) {
    jsonResult = { components: [] };
  }

  Vue.filter('markdown', function(value) {
    return value ? markdown.toHTML(value) : '';
  });

  // Setup templates for models
  var components = {};
  _.each(jsonScheme.models, function(model) {
    components['fields-for-' + model.name] = {
      template: '#template-fields-for-' + model.name,
      data: function() {
        return {
          expanded: true,
          showPreview: false
        };
      },
      computed: {
        moveUpEnabled: function() {
          return this.parentIndex > 0;
        },
        moveDownEnabled: function() {
          return this.parentIndex < this.parentComponents.length - 1;
        },
      },
      methods: {
        moveUp: function() {
          var from = this.parentIndex;
          var to = this.parentIndex - 1;
          var element = this.parentComponents[from];
          this.parentComponents.splice(from, 1);
          this.parentComponents.splice(to, 0, element);
        },

        moveDown: function() {
          var from = this.parentIndex;
          var to = this.parentIndex + 1;
          var element = this.parentComponents[from];
          this.parentComponents.splice(from, 1);
          this.parentComponents.splice(to, 0, element);
        },

        remove: function() {
          if(_.values(this.component.properties).length === 0 || confirm("Are you sure?")) {
            this.parentComponents.$remove(this.parentIndex);
          }
        },

        // TODO: DRY up with $root.addComponent
        addComponent: function(event, target, model) {
          event.preventDefault();

          var clonedproperties = _.clone(this.component.properties);
          if(!clonedproperties[target]) {
            clonedproperties[target] = [];
          }

          var obj = {
            model_name: model.name,
            properties: {}
          };

          clonedproperties[target].push(obj);
          this.parentComponents[this.parentIndex].properties = clonedproperties;
        },

        showPickerModal: function(fieldName, modalLink) {
          var remoteForm = window.jsonEditorRemoteForm;
          var $modal = remoteForm.getModal();
          var self = this;

          remoteForm.init(modalLink)
            // Inject form-DOM into modal
            .then(function(form) {
              $modal.find('.modal-body').html(form);
            })

            // Wait for results from modal
            .then(function() {
              return remoteForm.setupForm($modal);
            })

            // Result received
            .then(function(json) {
              var clonedproperties = _.clone(self.component.properties);
              clonedproperties[fieldName] = json;
              self.parentComponents[self.parentIndex].properties = clonedproperties;
            })

            // Cleanup
            .always(function() {
              setTimeout(function() {
                $('.modal-backdrop, #modal').remove();
              }, 500);
            });
        },

        pickerResult: function(fieldName) {
          console.log('pickerResult', fieldName, this.component);
          return this.component.properties[fieldName];
        },

        removePickerResult: function(fieldName) {
          this.component.properties[fieldName] = null;
        },

        nestedModelIsAllowed: function(model, allowedModels) {
          return _.contains(allowedModels, model.name);
        }
      }
    };
  });

  // Let's go
  vm = new Vue({
    el: '[ref=json-editor]',
    data: {
      components: jsonResult.components,
      scheme: jsonScheme,
      showJson: false
    },
    methods: {
      addComponent: function(e, model) {
        e.preventDefault();

        var obj = {
          model_name: model.name,
          properties: {}
        };

        if(enableGuids) {
          obj.guid = guid();
        }

        this.components.push(obj);
      }
    },
    computed: {
      result: function() {
        var result = { components: this.components };
        $(this.$el).trigger('json-editor:changed', result);
        return JSON.stringify(result);
      }
    },
    components: components
  });
});

function guid() {
  'use strict';
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4();
}
