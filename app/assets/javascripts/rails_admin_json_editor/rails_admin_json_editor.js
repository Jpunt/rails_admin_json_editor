//= require rails_admin_json_editor/vue.0.11.4
//= require rails_admin_json_editor/lodash.2.4.1

$(document).on('rails_admin.dom_ready', function() {
  // TODO: Make this possible for multiple instances

  var cmsDefaults = { expanded: true };

  var data = $('[ref=json-editor]').data('json');
  if(!data) {
    data = { components: [] };
  }

  data.components = _.map(data.components, function(component) {
    if(!component.cms) component.cms = _.clone(cmsDefaults);
    return component;
  });

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
          cms: _.clone(cmsDefaults)
        })
      },
      removeComponent: function(index) {
        if(confirm("Are you sure?")) {
          this.components.$remove(index);
        }
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
        return component.$data
          && component.$data.props
          && component.$data.props[fieldName]
          && component.$data.props[fieldName][recordLabel] == recordName
          && component.$data.props[fieldName][recordLabel] == recordName;
      }
    }
  });
});
