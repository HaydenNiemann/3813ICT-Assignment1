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