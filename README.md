## Git Repository Organization and Usage

The Git repository for this project is organized to ensure a clear separation of concerns and smooth collaboration. The repository is structured as follows:

### Branches:
- **`master`**: The stable branch that contains the most recent, tested version of the application. All final code is updated here after testing.

### Commit Frequency:
- Commits are made frequently, typically after completing a small chunk of work. Each commit message is descriptive, clearly indicating the changes made, such as "Added Login Auth" or "Fixed bug in Login Auth".

### Repository Structure:
- The repository is organized into separate directories for the frontend (Angular) and backend (Node.js and Express) code. This separation allows for easier management and navigation of the code.
  - **Frontend (Angular)**:
    - All Angular components, services, models, and routes are stored under the `src/app/` directory. Each feature or component has its own folder for a modular design.
  - **Backend (Node.js)**:
    - The backend server code is organized under the `server/` directory, with separate files for different aspects of the server such as `server.js` for initializing the server, `sockets.js` for handling Socket.io events, and various route handlers.

## Data Structures

The system uses several core data structures to manage users, groups, and channels.

### User Object:
Represents a user in the system.

- **`username`**: The unique identifier for the user.
- **`role`**: The role of the user (e.g., 'User', 'GroupAdmin', 'SuperAdmin'). This field is optional.
- **`groups`**: An optional array of group IDs the user belongs to.

### Group Object:
Represents a collection of users and channels.

- **`id`**: Unique identifier for the group.
- **`name`**: Name of the group.
- **`channels`**: Array of channels within the group.
- **`users`**: Array of users in the group.

### Channel Object:
Represents a communication channel within a group.

- **`name`**: Name of the channel.
- **`users`**: Array of users in the channel.

## Angular Architecture

The application follows a modular Angular architecture with components, services, models, and routes which helps maintainability.

### Components:
- **`ChatComponent`**: Manages chat functionality, including creating/joining channels and sending messages.
- **`LoginComponent`**: Handles user login and registration processes.

### Services:
- **`SocketService`**: Manages real-time communication between the front end and the server using Socket.io.

### Models:
- **`User`**: Defines user structure, including username, role, and groups.
- **`Group`**: Defines group structure with ID, name, channels, and users.
- **`Channel`**: Defines channel structure with name and users.

### Routes:
- **`/login`**: User login and registration.
- **`/chat`**: Chat interface for interacting with other users.


## Node Server Architecture

The Node.js server architecture is structured to handle various tasks, divided across various files and functions.

### Modules:
- **`express`**: Handles server requests and routing.
- **`socket.io`**: Manages real-time, bi-directional communication.
- **`cors`**: Enables cross-origin requests between the client and server.
- **`http`**: Provides core HTTP functionalities to manage requests and responses.
- **`fs`**: Handles file system operations such as reading and writing files.
- **`sockethandler`**: Custom module to import sockets.js to manage Socket.io events for real time chat.

### Functions:

#### **server.js**:
- **`loadData()`**: Loads saved channel messages from `data.json` if the file exists.
- **`socketHandler.connect()`**: Connects Socket.io with the server, passing in `io` and `channelMessages`.

#### **sockets.js**:
- **`saveData()`**: Saves updated channel messages to `data.json`.
- **`joinChannel()`**: Allows users to join a channel and sends chat history.
- **`sendMessage()`**: Sends a message to the channel and broadcasts it to other users.
- **`deleteChannel()`**: Deletes a channel and its messages from the data store.

### Files:
- **`server.js`**: Initializes the server, loads data, and connects Socket.io.
- **`sockets.js`**: Handles all Socket.io events for real-time chat.

### Global Variables:
- **`channelMessages`**: Stores channel-specific messages across the app.



## Server-Side Routes

### **`GET /`**
- **Purpose**: Serves the main application or index page.
- **Parameters**: None.
- **Return Values**: HTML file that renders the main application page.

### **`POST /sendMessage`**
- **Purpose**: Handles the submission of new messages to a channel.
- **Parameters**:
  - `channelName` (string): The name of the channel where the message will be sent.
  - `message` (string): The content of the message.
  - `user` (string): The name of the user sending the message (optional).
- **Return Values**:
  - Result: The new message is sent to all users in the specified channel.

### **`POST /joinChannel`**
- **Purpose**: Allows a user to join a specific channel.
- **Parameters**:
  - `channelName` (string): The name of the channel to join.
  - `user` (string): The name of the user joining the channel.
- **Return Values**:
  - Result: Sends the latest chat history to the newly joined user.

### **`POST /deleteChannel`**
- **Purpose**: Deletes a specific channel and its associated messages.
- **Parameters**:
  - `channelName` (string): The name of the channel to be deleted.
- **Return Values**:
  - Result: Notifies users that the channel has been deleted.

## Socket.io Events

### **`connection`**
- **Purpose**: Initializes a new connection between the client and server.
- **Parameters**: None.
- **Return Values**:
  - Event Handling: Establishes socket event listeners for the connected client.

### **`joinChannel`**
- **Purpose**: Handles a user joining a channel.
- **Parameters**:
  - `channelName` (string): The name of the channel the user is joining.
  - `user` (string): The username of the user joining the channel.
- **Return Values**:
  - Event Handling: Joins the specified channel and sends chat history.

### **`sendMessage`**
- **Purpose**: Sends a message to a specific channel.
- **Parameters**:
  - `channelName` (string): The name of the channel where the message will be sent.
  - `message` (string): The content of the message.
  - `user` (string): The username of the sender (optional).
- **Return Values**:
  - Result: Sends the message to all users in the specified channel.

### **`deleteChannel`**
- **Purpose**: Deletes a channel and its associated messages.
- **Parameters**:
  - `channelName` (string): The name of the channel to be deleted.
- **Return Values**:
  - Result: Notifies users that the channel has been deleted.
