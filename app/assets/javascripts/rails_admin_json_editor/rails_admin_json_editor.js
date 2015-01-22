//= require rails_admin_json_editor/vue.0.11.4
//= require rails_admin_json_editor/lodash.2.4.1

$(document).on('rails_admin.dom_ready', function() {
  // TODO: Make this possible for multiple instances

  // Get data
  var data = $('[ref=json-editor]').data('json');
  if(!data) {
    data = { components: [] };
  }

  // Re-initialize temporary vars
  data.tmp = { showJson: false };

  // Re-initialMake sure all components have their (possibly new) defaults
  var componentTmpDefaults = { expanded: true };
  data.components = _.map(data.components, function(component) {
    component.tmp = _.clone(componentTmpDefaults);
    return component;
  });

  // Make sure we let Vue update the json-field, but do it here to prevent data-loss when js is disabled
  $('[ref=json-editor] [v-model^="$root.$data"]').val('');

  // Let's go
  var componentsVM = new Vue({
    el: '[ref=json-editor]',
    data: data,
    methods: {
      addComponent: function(e) {
        e.preventDefault();
        var type = e.target.getAttribute('component-type');
        this.components.push({
          type: type,
          props: {},
          tmp: _.clone(componentTmpDefaults)
        })
      },
      removeComponent: function(index) {
        if(confirm("Are you sure?")) {
          this.components.$remove(index);
        }
      },
      moveComponentUp: function(index) {
        var from = index;
        var to = index - 1;
        var element = this.components[from];
        this.components.splice(from, 1);
        this.components.splice(to, 0, element);
      },
      moveComponentDown: function(index) {
        var from = index;
        var to = index + 1;
        var element = this.components[from];
        this.components.splice(from, 1);
        this.components.splice(to, 0, element);
      },
      onChangePicker: function(e, index, fieldName) {
        var el = e.target;
        var value = el.options[el.selectedIndex].getAttribute('data-json');
        var json = JSON.parse(value);

        var props = {};
        props[fieldName] = json;

        var data = $.extend({}, componentsVM.components[index], {
          props: props
        });

        componentsVM.components.$set(index, data)
      },
      pickerOptionIsSelected: function(component, fieldName, recordLabel, recordName) {
        return component.props[fieldName]
          && component.props[fieldName][recordLabel]
          && component.props[fieldName][recordLabel] == recordName;
      }
    }
  });
});
