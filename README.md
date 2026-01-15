# 2DO - Firebase-Powered Todo & Notes App

A full-stack React Native application built with Expo, featuring Firebase Authentication and Firestore for seamless data management across devices.

## ✨ Features

- **📝 Todo Management**: Create, edit, and delete todos with priorities and due dates
- **📔 Notes**: Rich text notes with tags and search functionality
- **🛒 Shopping Lists**: Manage shopping lists with items, quantities, and prices
- **🔐 Authentication**: Secure email/password authentication with Firebase
- **☁️ Cloud Sync**: Real-time data synchronization across all devices
- **🎨 Beautiful UI**: Smooth animations and intuitive design
- **📱 Cross-Platform**: Works on iOS, Android, and Web

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- A Firebase account ([firebase.google.com](https://firebase.google.com))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/nyambogahezron/2do.git
   cd 2do
   ```

2. **Install dependencies**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Set up Firebase**
   
   Follow the detailed instructions in [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) to:
   - Create a Firebase project
   - Enable Authentication and Firestore
   - Get your Firebase configuration
   - Set up environment variables

4. **Configure environment variables**
   
   Copy the example environment file and add your Firebase credentials:
   ```bash
   cp .env.example .env
   ```
   
   Then edit `.env` and replace the placeholder values with your actual Firebase configuration.

5. **Start the development server**
   ```bash
   npm start
   ```

6. **Run on your preferred platform**
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Press `w` for web browser

## 📚 Documentation

- **Firebase Setup**: See [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) for detailed Firebase configuration instructions
- **Environment Variables**: See [.env.example](./.env.example) for required environment variables

## 🏗️ Project Structure

```
2do/
├── app/                    # App screens and navigation
│   ├── notes/             # Notes screens
│   ├── shoppingList/      # Shopping list screens
│   ├── todo/              # Todo screens
│   └── _layout.tsx        # Root layout with navigation
├── components/            # Reusable UI components
│   ├── notes/            # Note-related components
│   ├── todos/            # Todo-related components
│   └── ui/               # Generic UI components
├── context/              # React contexts
│   └── ThemeContext.tsx  # Theme state management
├── db/                   # Database configuration
│   ├── schema.ts         # Drizzle ORM schema definitions
│   └── connect.ts        # Database connection
├── drizzle/             # Database migrations
│   └── migrations.js     # Auto-generated migration files
├── lib/                  # Core libraries
│   ├── db.ts            # Database singleton and initialization
│   └── utils.ts         # Utility functions
├── store/               # State management with Drizzle ORM
│   ├── todo.ts          # Todo store with hooks
│   ├── notes.ts         # Notes store with hooks
│   ├── shopping.ts      # Shopping store with hooks
│   └── models.ts        # TypeScript type definitions
└── utils/               # Utility functions
```

## 🔒 Security

This app uses Firebase Authentication and Firestore Security Rules to protect user data:

- **Authentication**: Users must sign in to access the app
- **Data Isolation**: Each user can only access their own data
- **Secure Communication**: All data is transmitted over HTTPS
- **Environment Variables**: Sensitive configuration is stored in `.env` (not committed to git)

### Recommended Firestore Security Rules

For production, update your Firestore security rules in the Firebase Console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow users to read/write only their own data
    match /todos/{todoId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null;
    }
    
    match /notes/{noteId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null;
    }
    
    match /shoppingLists/{listId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null;
    }
    
    match /shoppingItems/{itemId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null;
    }
  }
}
```

## 🛠️ Built With

- **[React Native](https://reactnative.dev/)** - Mobile app framework
- **[Expo](https://expo.dev/)** - Development platform
- **[Firebase](https://firebase.google.com/)** - Backend as a Service
  - Firebase Authentication - User authentication
  - Cloud Firestore - NoSQL database
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety
- **[React Navigation](https://reactnavigation.org/)** - Navigation
- **[React Native Paper](https://callstack.github.io/react-native-paper/)** - UI components
- **[React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)** - Animations

## 📝 Available Scripts

- `npm start` - Start the Expo development server
- `npm run android` - Start the app on Android
- `npm run ios` - Start the app on iOS
- `npm run web` - Start the app on web

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Thanks to the Expo team for the amazing development platform
- Thanks to Firebase for providing an excellent backend solution
- Thanks to all contributors and users of this app

## 📧 Contact

For questions or support, please open an issue on GitHub.

---

Made with ❤️ by the 2DO team
