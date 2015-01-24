//= require rails_admin_json_editor/vue.0.11.4
//= require rails_admin_json_editor/lodash.2.4.1

var vm;

$(document).on('rails_admin.dom_ready', function() {
  // TODO: Make this possible for multiple instances

  // Vue.config.debug = true

  // Get data
  var jsonResult          = $('[ref=json-editor]').data('json-result');
  var jsonComponentTypes  = $('[ref=json-editor]').data('json-component-types');

  if(!jsonResult) {
    jsonResult = { components: [] };
  }

  // Make sure we let Vue update the json-field, but do it here to prevent data-loss when js is disabled
  $('[ref=json-textarea]').val('');

  // Setup dynamic component-type components
  var components = {};
  _.each(jsonComponentTypes, function(c) {
    components['component-type-' + c.type] = {
      template: '#template-component-type-' + c.type,
      data: function() {
        return {
          type: null,
          props: {},
          expanded: true
        };
      },
      methods: {
        moveUp: function() {
          var from = this.index;
          var to = this.index - 1;
          var element = this.$parent.result.components[from];
          this.$parent.result.components.splice(from, 1);
          this.$parent.result.components.splice(to, 0, element);
        },

        moveDown: function() {
          var from = this.index;
          var to = this.index + 1;
          var element = this.$parent.result.components[from];
          this.$parent.result.components.splice(from, 1);
          this.$parent.result.components.splice(to, 0, element);
        },

        remove: function() {
          console.log(this);
          if(confirm("Are you sure?")) {
            this.$parent.result.components.$remove(this.index);
          }
        },

        onChangePicker: function(event, index, fieldName) {
          var el = event.target;
          var value = el.options[el.selectedIndex].getAttribute('data-json');
          var json = JSON.parse(value);
          var clonedData = _.clone(this.$parent.result.components[index]);
          clonedData.props[fieldName] = json;
          this.$parent.result.components.$set(index, clonedData);
        },

        pickerOptionIsSelected: function(component, fieldName, recordLabel, recordName) {
          return component.props &&
            component.props[fieldName] &&
            component.props[fieldName][recordLabel] &&
            component.props[fieldName][recordLabel] === recordName;
        }
      }
    };
  });

  // Let's go
  vm = new Vue({
    el: '[ref=json-editor]',
    data: {
      result: jsonResult,
      componentTypes: jsonComponentTypes,
      showJson: true
    },
    methods: {
      addComponent: function(e, type) {
        e.preventDefault();

        this.result.components.push({
          type: type,
          props: {}
        });
      }
    },
    components: components
  });

  // Component fields component
  // Vue.component('fields-for-component', {
  //   template: '#template-fields-for-component',
  //   data: function() {
  //     return {
  //       type: null,
  //       props: {},
  //       tmp: _.clone(componentTmpDefaults)
  //     }
  //   },
  //   methods: {
  //
  //   }
  // })


  // // Let's go
  // var componentsVM = new Vue({
  //   el: '[ref=json-editor]',
  //   data: data,
  //   methods: {
  //     addComponent: function(e) {
  //       e.preventDefault();
  //       var type = e.target.getAttribute('component-type');
  //       this.components.push({
  //         type: type,
  //         props: {},
  //         tmp: _.clone(componentTmpDefaults)
  //       })
  //     },
  //     removeComponent: function(index) {
  //       if(confirm("Are you sure?")) {
  //         this.components.$remove(index);
  //       }
  //     },
  //     moveComponentUp: function(index) {
  //       var from = index;
  //       var to = index - 1;
  //       var element = this.components[from];
  //       this.components.splice(from, 1);
  //       this.components.splice(to, 0, element);
  //     },
  //     moveComponentDown: function(index) {
  //       var from = index;
  //       var to = index + 1;
  //       var element = this.components[from];
  //       this.components.splice(from, 1);
  //       this.components.splice(to, 0, element);
  //     }
  //   }
  // });
});
