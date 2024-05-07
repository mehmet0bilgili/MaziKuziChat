const socket = io();

// Display a chat message
function displayMessage(message, senderId, messageId) {
  const messagesContainer = document.getElementById('messages');
  const messageItem = createMessageItem(message, senderId, messageId);

  messagesContainer.appendChild(messageItem);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Create a message item with message actions and delete options
function createMessageItem(message, senderId, messageId) {
  const isOwnMessage = senderId === socket.id;
  const messageItem = document.createElement('li');
  messageItem.textContent = message;
  messageItem.id = messageId;
  messageItem.classList.add(isOwnMessage ? 'sent-message' : 'received-message');

  // Add message actions (ellipsis icon)
  const actionsIcon = createActionsIcon(messageId, isOwnMessage);
  messageItem.appendChild(actionsIcon);

  return messageItem;
}

// Create message actions icon (ellipsis icon) with event listener
function createActionsIcon(messageId, isOwnMessage) {
  const actionsIcon = document.createElement('span');
  actionsIcon.textContent = '...';
  actionsIcon.classList.add('message-actions');

  actionsIcon.addEventListener('click', (e) => {
    e.stopPropagation(); // Prevent the message click event from firing
    toggleActionsMenu(messageId, isOwnMessage);
  });

  return actionsIcon;
}

// Toggle actions menu (delete options or dismiss option)
function toggleActionsMenu(messageId, isOwnMessage) {
  const messageItem = document.getElementById(messageId);
  if (!messageItem) return;

  const actionsMenu = messageItem.querySelector('.actions-menu');
  if (actionsMenu) {
    actionsMenu.classList.toggle('show'); // Toggle visibility of existing menu
  } else {
    const newActionsMenu = createActionsMenu(messageId, isOwnMessage);
    messageItem.appendChild(newActionsMenu); // Append new actions menu
  }
}

// Create actions menu (delete options or dismiss option) for a message
function createActionsMenu(messageId, isOwnMessage) {
  const actionsMenu = document.createElement('div');
  actionsMenu.classList.add('actions-menu');

  if (isOwnMessage) {
    // Create delete options for own messages
    const deleteForMeButton = createActionButton('Delete', messageId, false);
    const deleteForEveryoneButton = createActionButton('Delete for everyone', messageId, true);
    actionsMenu.appendChild(deleteForMeButton);
    actionsMenu.appendChild(deleteForEveryoneButton);
  } else {
    // Create dismiss option for received messages
    const dismissButton = createActionButton('Delete', messageId);
    actionsMenu.appendChild(dismissButton);
  }

  return actionsMenu;
}

// Create an action button for a message
function createActionButton(text, messageId, deleteForEveryone = false) {
  const button = document.createElement('button');
  button.textContent = text;

  button.addEventListener('click', () => {
    socket.emit('delete message', { messageId, deleteForEveryone });
  });

  return button;
}

// Handle form submission (sending chat messages)
const form = document.getElementById('form');
const input = document.getElementById('input');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const message = input.value.trim();

  if (message) {
    socket.emit('chat message', { message });
    input.value = '';
  }
});

// Listen for 'chat message' events to display messages
socket.on('chat message', ({ message, senderId, messageId }) => {
  displayMessage(message, senderId, messageId);
});

// Listen for 'delete message' events to handle message deletion
socket.on('delete message', ({ messageId, deletedForEveryone }) => {
  const messageElement = document.getElementById(messageId);
  
  if (messageElement) {
    if (deletedForEveryone) {
      messageElement.textContent = "Message deleted for everyone";
    } else {
      messageElement.remove();
    }
  }
});
