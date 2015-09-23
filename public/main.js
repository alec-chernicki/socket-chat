var socket = io.connect();

jQuery(function($) {
  var $username = $('#js-set-username-input');
  var $setUsernameForm = $('#js-set-username');
  var $message = $('#js-send-message-input');
  var $messageForm = $('#js-send-message');
  var $messageList = $('#js-message-list');
  var $usernameList = $('#js-username-list');
  var messageScroll = 0;

  $setUsernameForm.submit(function(e) {
    e.preventDefault();
    socket.emit('username', $username.val(), function(data) {
      if (data) {
        $setUsernameForm.hide();
        $messageForm.show();
        $messageList.show();
      }
      else {
        if ($('.username-error').length !== 1) {
          $setUsernameForm.prepend('<p class="username-error">Uh oh, that username is either invalid or already taken. Try again.</p>');
        }
      }
    });
  });

  $messageForm.submit(function(e) {
    e.preventDefault();
    if ($message.val() !== '') {
      socket.emit('user message', $message.val());
      $message.val('').focus();
    }
  });

  socket.on('usernames', function(data) {
    var html = '';
    for (var i = 0; i < data.length; i++) {
      html += '<li>' + data[i] + '</li>';
    }
    $usernameList.empty().append(html);
  });

  socket.on('user message', function(data) {
    $messageList.append('<div class="message"><p class="message-name">' + data.username + '</p><p class="message-text">' + data.message + '</p></div>');
    messageScroll += $messageList.last().height();
    $messageList.scrollTop(messageScroll);
  });
});
