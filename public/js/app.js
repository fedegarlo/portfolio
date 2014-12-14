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
    var mirrorType = (type === 'venues') ? 'users' : (type === 'lists') ? 'guests' : 'events',
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
        $('form').find("input[type=text], input[type=tel], input[type=email], input[type=password], textarea").val("");
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
        $('#myModal').hide();
      }
    });
  }

  renderData = function(data, type) {
    var $container = $('#' + type + '_container'),
        shortType = type.substr(0, type.length - 1),
        $emptyListMessage = $container.closest('div').find('[data-message]').removeClass('hidden');

    $container.empty();
    if (data.length !== 0) {
      $emptyListMessage.addClass('hidden');
      $.each(data, function (i, item) {
        $container.append('<li id="' + type + '_' + i + '" class="list_item"><span data-toggle="modal" data-target="#myModal" data-name="' + item[shortType].name + '" data-delete="' + type + '" data-delete-id="' + item['_id'] + '">Eliminar</span></li>');
        $.each(item[shortType], function (field) {
          $('#' + type + '_' + i).prepend('<span class="' + field + '">' + this.valueOf() + '</span>');
        });
      });
    } else {
      $emptyListMessage.removeClass('hidden');
    }
  }

  $('#myModal').on('show.bs.modal', function (event) {
    var $target = $(event.relatedTarget),
      type = $target.attr('data-delete'),
      id = $target.attr('data-delete-id'),
      name = $target.attr('data-name');

    var modal = $(this)
    modal.find('.modal-title').text('Atención')
    modal.find('.modal-body').find('p').text('Vas a eliminar el registro ' + name)
    modal.find('[data-send]').off('click.delete').on('click.delete', function(event, data){
      deleteItem(type, id);
    });
  });

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