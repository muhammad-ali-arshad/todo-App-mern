# 📱 Todo App - React Native & MERN Stack

A modern, feature-rich task management application built with React Native (Expo) and MERN stack. This app provides an intuitive interface for managing your daily tasks with a beautiful, soft, and relaxing UI design.

![React Native](https://img.shields.io/badge/React%20Native-0.81.5-blue)
![Expo](https://img.shields.io/badge/Expo-54.0.31-black)
![Node.js](https://img.shields.io/badge/Node.js-Express-green)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-brightgreen)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.2-blue)

## 📸 Screenshots

### Authentication Screens
![Login Screen](./screen%20shots%20for%20readme/WhatsApp%20Image%202026-01-22%20at%202.15.18%20PM.jpeg)
*Clean and modern login interface*

![Signup Screen](./screen%20shots%20for%20readme/WhatsApp%20Image%202026-01-22%20at%202.15.18%20PM%20(1).jpeg)
*User registration with validation*

### Main Features
![Home Screen](./screen%20shots%20for%20readme/WhatsApp%20Image%202026-01-22%20at%202.15.19%20PM.jpeg)
*Task list with beautiful card design*

![Create Task](./screen%20shots%20for%20readme/WhatsApp%20Image%202026-01-22%20at%202.15.20%20PM.jpeg)
*Intuitive task creation interface*

![Date Picker](./screen%20shots%20for%20readme/WhatsApp%20Image%202026-01-22%20at%202.15.20%20PM%20(1).jpeg)
*Calendar date picker with future dates only*

![Edit Task](./screen%20shots%20for%20readme/WhatsApp%20Image%202026-01-22%20at%202.15.20%20PM%20(2).jpeg)
*Floating edit modal with pre-filled data*

![Task Selection](./screen%20shots%20for%20readme/WhatsApp%20Image%202026-01-22%20at%202.15.21%20PM.jpeg)
*Long-press selection mode with delete button*

![Completed Tasks](./screen%20shots%20for%20readme/WhatsApp%20Image%202026-01-22%20at%202.15.21%20PM%20(1).jpeg)
*Visual distinction for completed tasks*

## ✨ Features

### 🔐 Authentication
- **Secure User Registration** - Sign up with email and password
- **JWT-based Authentication** - Token-based secure login
- **Persistent Sessions** - Stay logged in across app restarts
- **Protected Routes** - Automatic redirect for unauthenticated users

### 📝 Task Management
- **Create Tasks** - Add tasks with title, description, and due date
- **Edit Tasks** - Floating modal for quick task editing
- **Delete Tasks** - Single or bulk delete with smooth animations
- **Task Status** - Mark tasks as pending or completed
- **Due Date Management** - Set and edit due dates with calendar picker
- **Task Filtering** - Visual distinction between completed and pending tasks

### 🎨 User Interface
- **Soft & Relaxing Design** - Light, calming color scheme for long usage
- **Modern UI Components** - Clean, Notion-style interface
- **Responsive Layout** - Works seamlessly on all screen sizes
- **Smooth Animations** - Fade and scale animations for better UX
- **Haptic Feedback** - Tactile responses for better interaction

### 🚀 Advanced Features
- **Long-Press Selection** - Multi-select tasks for bulk operations
- **Animated Deletions** - Smooth fade-out animations before removal
- **Optimistic UI Updates** - Instant feedback for better perceived performance
- **Pull-to-Refresh** - Refresh task list with a simple gesture
- **Keyboard Handling** - Smart keyboard avoidance for better input experience

## 🛠️ Tech Stack

### Frontend
- **React Native** (0.81.5) - Cross-platform mobile framework
- **Expo** (54.0.31) - Development platform and tooling
- **Expo Router** (6.0.21) - File-based routing system
- **TypeScript** (5.9.2) - Type-safe JavaScript
- **React Native Reanimated** (4.1.1) - Smooth animations
- **Day.js** (1.11.19) - Date manipulation library
- **React Native UI Datepicker** (3.1.2) - Calendar component
- **Expo Haptics** (15.0.8) - Haptic feedback support

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** (4.18.2) - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** (7.5.0) - MongoDB object modeling
- **JWT** (9.0.2) - JSON Web Token authentication
- **Bcrypt.js** (2.4.3) - Password hashing
- **CORS** (2.8.5) - Cross-origin resource sharing

## 🏗️ Architecture & Approach

### Project Structure
```
todo-app/
├── client/                 # React Native frontend
│   ├── app/               # Expo Router pages
│   │   ├── (auth)/       # Authentication routes
│   │   ├── home.tsx      # Main task list screen
│   │   └── addTask.jsx   # Task creation screen
│   ├── components/        # Reusable UI components
│   │   ├── TaskCard.jsx  # Task display component
│   │   ├── EditTaskModal.tsx  # Edit modal
│   │   └── DeleteButton.tsx    # Delete action button
│   ├── services/          # API service layer
│   │   ├── api.js        # Base API configuration
│   │   ├── auth.service.js    # Auth API calls
│   │   └── task.service.js    # Task API calls
│   └── context/           # React Context providers
│       └── AuthContext.js # Authentication state
│
└── backend/               # Node.js backend
    ├── controllers/      # Request handlers
    │   ├── authController.js
    │   └── taskController.js
    ├── models/           # Mongoose schemas
    │   ├── User.js
    │   └── Task.js
    ├── routes/           # API routes
    │   ├── auth.js
    │   └── tasks.js
    └── middleware/       # Express middleware
        └── auth.js       # JWT verification
```

### Design Patterns

#### 1. **Service Layer Pattern**
- Separation of concerns between UI and API calls
- Centralized error handling
- Reusable API functions

#### 2. **Context API for State Management**
- Global authentication state
- User session management
- Token storage and refresh

#### 3. **Component Composition**
- Reusable UI components
- Props-based configuration
- Conditional rendering for different states

#### 4. **Optimistic UI Updates**
- Immediate feedback for user actions
- Background API synchronization
- Error rollback on failure

#### 5. **RESTful API Design**
- Standard HTTP methods (GET, POST, PUT, DELETE)
- Resource-based URLs
- JSON request/response format

### Key Implementation Details

#### Authentication Flow
1. User registers/logs in → Backend validates credentials
2. JWT token generated → Stored securely in Expo SecureStore
3. Token included in API requests → Middleware validates on backend
4. Automatic token refresh → Seamless user experience

#### Task Management Flow
1. **Create**: UI → Service → API → Controller → Database
2. **Read**: Database → Controller → API → Service → UI
3. **Update**: UI → Service → API → Controller → Database → UI refresh
4. **Delete**: UI animation → API call → Database → UI update

#### State Management
- **Local State**: `useState` for component-specific data
- **Global State**: `Context API` for authentication
- **Server State**: API calls with optimistic updates

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB (local or Atlas)
- Expo CLI (`npm install -g expo-cli`)
- Expo Go app (for mobile testing) or Android Studio/iOS Simulator

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd todo-app
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env` file in the `backend` directory:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```

4. **Frontend Setup**
   ```bash
   cd ../client
   npm install
   ```

5. **Start Backend Server**
   ```bash
   cd backend
   npm run dev
   ```

6. **Start Frontend**
   ```bash
   cd client
   npm start
   ```

### Running the App

1. **For Mobile (Expo Go)**
   - Scan QR code with Expo Go app (iOS/Android)
   - App will load on your device

2. **For Android Emulator**
   ```bash
   npm run android
   ```

3. **For iOS Simulator** (macOS only)
   ```bash
   npm run ios
   ```

4. **For Web**
   ```bash
   npm run web
   ```

## 📱 Usage Guide

### Creating a Task
1. Tap the **+** button on the home screen
2. Enter task title (required)
3. Add description (optional)
4. Select due date using the calendar picker
5. Choose task status (Pending/Completed)
6. Tap the checkmark to save

### Editing a Task
1. Tap any task card to open edit modal
2. Modify title, description, or due date
3. Tap **Save** to update

### Deleting Tasks
1. **Long-press** a task card to enter selection mode
2. Tap additional tasks to select multiple
3. Tap the **delete icon** (trash) at the top
4. Tasks animate out smoothly before deletion

### Completing Tasks
1. Tap the **checkbox** on any task card
2. Task status toggles between pending and completed
3. Visual styling updates automatically

## 🔌 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

### Task Endpoints

#### Get All Tasks
```http
GET /api/tasks
Authorization: Bearer <token>
```

#### Create Task
```http
POST /api/tasks
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Task title",
  "description": "Task description",
  "completed": false,
  "dueDate": "2024-12-31T00:00:00.000Z"
}
```

#### Update Task
```http
PUT /api/tasks/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated title",
  "description": "Updated description",
  "completed": true,
  "dueDate": "2024-12-31T00:00:00.000Z"
}
```

#### Delete Task
```http
DELETE /api/tasks/:id
Authorization: Bearer <token>
```

## 🎨 Design Philosophy

### Color Scheme
- **Background**: Soft lavender-grey (`#F5F7FB`)
- **Primary Accent**: Soft indigo (`#6C63FF`)
- **Completed Tasks**: Soft green (`#D1FAE5`)
- **Pending Tasks**: Clean white (`#FFFFFF`)
- **Selected Items**: Light rose (`#FEF2F2`)
- **Delete Action**: Soft red (`#EF4444`)

### UI Principles
- **Calm & Relaxing**: Colors chosen for long-term usage
- **Clear Hierarchy**: Visual distinction between elements
- **Smooth Interactions**: Animations for better feedback
- **Accessibility**: High contrast for readability
- **Modern Aesthetics**: Inspired by Notion and Todoist

## 🧪 Testing

### Manual Testing Checklist
- [ ] User registration and login
- [ ] Task creation with all fields
- [ ] Task editing functionality
- [ ] Task deletion (single and bulk)
- [ ] Task completion toggle
- [ ] Date picker validation
- [ ] Pull-to-refresh
- [ ] Long-press selection
- [ ] Error handling
- [ ] Network offline scenarios

## 🐛 Known Issues & Future Enhancements

### Potential Improvements
- [ ] Task categories/tags
- [ ] Task search and filtering
- [ ] Task sorting options
- [ ] Push notifications for due dates
- [ ] Dark mode support
- [ ] Task sharing/collaboration
- [ ] Offline mode with sync
- [ ] Task templates
- [ ] Recurring tasks

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support

For support, email your-email@example.com or open an issue in the repository.

## 🙏 Acknowledgments

- Expo team for the amazing development platform
- React Native community for excellent libraries
- Design inspiration from Notion and Todoist

---

**Built with ❤️ using React Native and MERN Stack**
