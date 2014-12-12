$(function() {
  var url = '/',
      boxOpened = false;

  fillCombo = function(data, type, mirrorType) {
    var $combo = $('form#' + mirrorType).find('[data-combo-' + type + ']');

    $combo.empty();
    $.each(data, function(i, item){
      $combo.append('<option value="' + item['_id'] + '">' + item[type.substr(0, type.length - 1)].name + '</li>');
    })
  }

  evaluateMenu = function(data, type) {
    var mirrorType = (type === 'venues') ? 'profiles' : (type === 'lists') ? 'guests' : 'events',
        $dataContainer = $('[role="complementary"]').find('[data-container="' + type + '"]'),
        $message = $dataContainer.find('[data-message]');

    if (data.length !== 0) {
      $('[role="main"]').find('[data-dropdown="' + mirrorType + '"]').removeClass('disable');
      $message.addClass('hidden');
      fillCombo(data, type, mirrorType);
    } else {
      if (!boxOpened) {
        $dataContainer.removeClass('hidden');
        $('[role="main"]').find('[data-dropdown="' + type + '"]').closest('div').addClass('active');
        boxOpened = true;
      }
      $message.removeClass('hidden');
    }
  }

  getData = function(type) {
    $.ajax({
      type: 'GET',
      url: url + type,
      contentType: 'application/json',
      cache: 'true',
      success: function(json) {
        renderData(json, type);
        if (type === 'venues' || type === 'lists' || type === 'guests') {
          evaluateMenu(json, type);
        }
      }
    });
  }

  add = function(data, formType) {
    $.ajax({
      url: url + formType,
      type: "POST",
      data: data,
      complete: function (data) {
        getData(formType);
        $('form').find("input[type=text], textarea").val("");
      }
    });
  }

  deleteItem = function(type, id) {
    var params = { id : id };
    $.ajax({
      url: url + type,
      type: "DELETE",
      data: params,
      complete: function (data) {
        getData(type);
      }
    });
  }

  renderData = function(data, type) {
    var $container = $('#' + type + '_container'),
        shortType = type.substr(0, type.length - 1);

    if (data.length !== 0) {
      $container.empty();
      $.each(data, function (i, item) {
        $container.append('<li id="' + type + '_' + i + '" class="list_item"><span data-delete="' + type + '" data-delete-id="' + item['_id'] + '">Eliminar</span></li>');
        $.each(item[shortType], function (field) {
          $('#' + type + '_' + i).prepend('<span class="' + field + '">' + this.valueOf() + '</span>');
        });
      });
    } else {
      $container.closest('div').find('[data-message]').removeClass('hidden');
    }
    $('[data-delete]').off('click').on('click', function(ev) {
      var type = $(ev.currentTarget).attr('data-delete'),
          id = $(ev.currentTarget).attr('data-delete-id');
      deleteItem(type, id);
    });
  }

  $('form').on('submit', function(ev) {
    ev.preventDefault();
    var data = $(ev.currentTarget).serialize(),
        formType = $(ev.currentTarget).attr('id');
    add(data, formType);
  });

  $('[data-dropdown]').on('click', function(ev) {
    var $target = $(ev.currentTarget),
        $container = $target.closest('div'),
        type = $target.attr('data-dropdown'),
        $dataContainer = $('#' + type + '_container');

    if (!$container.hasClass('active') && !$target.hasClass('disable')) {
      $target.closest('div').addClass('active').siblings().removeClass('active');
      $dataContainer.empty();
      $dataContainer.closest('[data-container]').removeClass('hidden').siblings().addClass('hidden');
      getData(type);
    } else {
      $container.removeClass('active');
    }
  });

  getData('venues');
  getData('lists');
  getData('guests');

});