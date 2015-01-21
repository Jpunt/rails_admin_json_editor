//= require rails_admin_json_editor/vue.0.11.4

$(document).on('rails_admin.dom_ready', function() {
  // TODO: Make this possible for multiple instances

  var recordPickers = {};

  var componentsVM = new Vue({
    el: '[ref=components_json]',
    data: {
      components: $('[ref=components_json]').data('json')
    },
    methods: {
      addComponent: function(e) {
        e.preventDefault();
        var type = e.target.getAttribute('component-type');
        this.components.push({ type:type, props:{} })
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
