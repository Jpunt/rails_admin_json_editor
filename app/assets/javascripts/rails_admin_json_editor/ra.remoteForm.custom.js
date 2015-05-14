(function($) {
  'use strict';

  window.jsonEditorRemoteForm = {
    init: function(url) {
      var deferred = $.Deferred();

      setTimeout(function() {
        $.ajax({
          url: url,
          beforeSend: function(xhr) {
            xhr.setRequestHeader("Accept", "text/javascript");
          },
          success: function(data, status, xhr) {
            deferred.resolve(data);
          },
          error: function(xhr, status, error) {
            deferred.reject(xhr.responseText);
          },
          dataType: 'text'
        });
      }, 200);

      return deferred.promise();
    },

    setupForm: function($modal) {
      var deferred = $.Deferred();

      var $form = $modal.find("form");
      var saveButtonText = $modal.find(":submit[name=_save]").html();
      var cancelButtonText = $modal.find(":submit[name=_continue]").html();
      $modal.find('.form-actions').remove();

      $form.attr("data-remote", true);
      $modal.find('.modal-header-title').text($form.data('title'));
      $modal.find('.cancel-action').unbind().click(function(){
        $modal.modal('hide');
        deferred.reject();
        return false;
      }).html(cancelButtonText);

      $modal.find('.save-action').unbind().click(function(){
        $form.submit();
        return false;
      }).html(saveButtonText);

      $(document).trigger('rails_admin.dom_ready', [$form]);

      $form.bind("ajax:complete", function(xhr, data, status) {
        if (status === 'error') {
          // TODO
          // $modal.find('.modal-body').html(data.responseText);
          // widget._bindFormEvents();
          deferred.reject(data.responseText);
        } else {
          var json = $.parseJSON(data.responseText);
          $modal.modal('hide');
          deferred.resolve(json);
        }
      });

      return deferred.promise();
    },

    getModal: function() {
      return $('<div id="modal" class="modal fade">\
          <div class="modal-dialog">\
          <div class="modal-content">\
          <div class="modal-header">\
            <a href="#" class="close" data-dismiss="modal">&times;</a>\
            <h3 class="modal-header-title">...</h3>\
          </div>\
          <div class="modal-body">\
            ...\
          </div>\
          <div class="modal-footer">\
            <a href="#" class="btn cancel-action">...</a>\
            <a href="#" class="btn btn-primary save-action">...</a>\
          </div>\
          </div>\
          </div>\
        </div>')
        .modal({
          keyboard: true,
          backdrop: true,
          show: true
        });
    }
  };
})(jQuery);
