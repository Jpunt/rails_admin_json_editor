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

  // Setup dynamic component-type components
  var components = {};
  _.each(jsonComponentTypes, function(c) {
    components['component-type-' + c.type] = {
      template: '#template-component-type-' + c.type,
      data: function() {
        return {
          expanded: true
        };
      },
      computed: {
        moveUpEnabled: function() {
          return this.parentIndex > 0;
        },
        moveDownEnabled: function() {
          return this.parentIndex < this.parentComponents.length - 1;
        }
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
          if(_.values(this.component.props).length === 0 || confirm("Are you sure?")) {
            this.parentComponents.$remove(this.parentIndex);
          }
        },

        // TODO: DRY up with $root.addComponent
        addComponent: function(event, target, type) {
          event.preventDefault();

          var clonedProps = _.clone(this.component.props);
          if(!clonedProps[target]) {
            clonedProps[target] = [];
          }

          var obj = {
            type: type,
            props: {}
          };

          clonedProps[target].push(obj);
          this.parentComponents[this.parentIndex].props = clonedProps;
        },

        onChangePicker: function(event, fieldName) {
          var el = event.target;
          var value = el.options[el.selectedIndex].getAttribute('data-json');
          var json = JSON.parse(value);

          var clonedProps = _.clone(this.component.props);
          clonedProps[fieldName] = json;
          this.parentComponents[this.parentIndex].props = clonedProps;
        },

        pickerOptionIsSelected: function(fieldName, recordLabel, recordName) {
          return this.component.props &&
            this.component.props[fieldName] &&
            this.component.props[fieldName][recordLabel] &&
            this.component.props[fieldName][recordLabel] === recordName;
        },

        nestedComponentTypeIsAllowed: function(componentType, allowedComponentTypes) {
          return _.contains(allowedComponentTypes, componentType)
        }
      }
    };
  });

  // Let's go
  vm = new Vue({
    el: '[ref=json-editor]',
    data: {
      components: jsonResult.components,
      componentTypes: jsonComponentTypes,
      showJson: false
    },
    methods: {
      addComponent: function(e, type) {
        e.preventDefault();

        var obj = {
          type: type,
          props: {}
        };

        this.components.push(obj);
      }
    },
    computed: {
      result: function() {
        return { components: this.components };
      }
    },
    components: components
  });
});
