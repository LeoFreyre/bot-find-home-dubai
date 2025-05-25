<h1 align="center">Business Logic App - Real Estate 📱</h1>
<div align="center">
  Ideal for medium and growing Holiday Homes Startups to organize all business logic and easily keep track of everything.
  <br>
  <br>
<p align="center">
  <a href="https://flutter.dev/">
    <img src="https://img.shields.io/badge/Flutter-blue?style=flat-square&logo=flutter" alt="Flutter" />
  </a>
  <a href="https://firebase.google.com/">
    <img src="https://img.shields.io/badge/Firebase-orange?style=flat-square&logo=firebase" alt="Firebase" />
  </a>
  <a href="https://cloudinary.com/">
    <img src="https://img.shields.io/badge/Cloudinary-blue?style=flat-square&logo=cloudinary" alt="Cloudinary" />
  </a>
  <a href="https://cloud.google.com/">
    <img src="https://img.shields.io/badge/Google%20Cloud-red?style=flat-square&logo=google-cloud" alt="Google Cloud" />
  </a>
  <a href="https://vercel.com/">
    <img src="https://img.shields.io/badge/Vercel-black?style=flat-square&logo=vercel" alt="Vercel" />
  </a>
  <a href="https://github.com/LeoFreyre/adminrentalho-app-real-estate-control">
    <img src="https://img.shields.io/badge/GitHub-Repository-gray?style=flat-square&logo=github" alt="GitHub" />
  </a>
</p>
</div>

## 🌟 Features
- **Owner Module**
  - Smart task assignment with automatic Smoobu API integration
  - Complete maintenance ticket management with multimedia support
  - Document management with check-in workflow and booking synchronization
  - Real-time updates via Firestore with visual notifications

- **Employee Module**
  - Interactive cleaning tasks with real-time status updates
  - Assigned maintenance tickets with progress tracking
  - Document verification interface with quick marking system
  - Integrated multimedia capture and cloud storage

- **Advanced Technical Features**
  - Firebase Auth with role-based access control
  - Cross-platform support (iOS/Android)
  - Cloudinary integration for optimized media management
  - Dynamic UI with smooth and responsive design

## 📦 Installation
1. Clone the repository:
```bash
git clone https://github.com/LeoFreyre/adminrentalho-app-real-estate-control.git
cd adminrentalho-app-real-estate-control
```

2. Install Flutter dependencies:
```bash
flutter pub get
```

3. Install iOS dependencies (macOS only):
```bash
cd ios
pod install
cd ..
```
##
4. Configure Firebase:
   - Create a new Firebase project
   - Add your Android and iOS apps to the project
   - Download and place the configuration files:
     - `google-services.json` in `android/app/`
     - `GoogleService-Info.plist` in `ios/Runner/`
   - Enable Authentication, Firestore, and Storage in Firebase Console

5. Set up Android and iOS emulators:
   - **Android**: Install Android Studio and create an AVD
   - **iOS** (macOS only): Install Xcode and iOS Simulator

## 🚀 Usage
1. Run the application:
```bash
flutter run
```

2. Configure Firebase and connect it to your project

3. Set up Android and iOS emulators (if working with macOS)

4. The app provides different interfaces based on user roles:
   - **Owners**: Full property management and employee oversight
   - **Employees**: Access to assigned tasks and document verification

##

> [!IMPORTANT]
> Create a `.env` file with the following variables:
```env
# Smoobu
API_KEY=your_smoobu_api_key_here
SMOOBU_BASE_URL=https://login.smoobu.com/api/reservations

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
CLOUDINARY_UPLOAD_PRESET=your_upload_preset

```

## 💻 Technology Stack
- **Flutter** - Cross-platform mobile development
- **Firebase** - Backend services and real-time database
- **Cloudinary** - Media management and optimization
- **Vercel** - Web deployment platform

### External Tools
- **Homebrew** - Package manager for macOS
- **Node.js** - JavaScript runtime for additional tooling

##

>[!NOTE]
> This project is based on the API architecture of the smoobu.com channel manager. You can find the documentation of the API here 👇
> https://docs.smoobu.com/#introduction

## 📸 Screenshots

<div align="center">

<table>
  <tr>
    <td><img src="https://github.com/LeoFreyre/adminrentalho-app-real-estate-control/blob/main/Screenshots/09D8593C-C819-473B-B7D9-4CEAAE63F655_4_5005_c.jpeg?raw=true" width="250"/></td>
    <td><img src="https://github.com/LeoFreyre/adminrentalho-app-real-estate-control/blob/main/Screenshots/0F80B5B2-7CE8-4F88-B393-669B313B9B62_4_5005_c.jpeg?raw=true" width="250"/></td>
    <td><img src="https://github.com/LeoFreyre/adminrentalho-app-real-estate-control/blob/main/Screenshots/115BC7AA-72E3-407D-8A98-2B6F17B45A93_4_5005_c.jpeg?raw=true" width="250"/></td>
  </tr>
  <tr>
    <td><img src="https://github.com/LeoFreyre/adminrentalho-app-real-estate-control/blob/main/Screenshots/183D5DA1-3A4E-4DE8-AF00-0C015D0EE7FC_4_5005_c.jpeg?raw=true" width="250"/></td>
    <td><img src="https://github.com/LeoFreyre/adminrentalho-app-real-estate-control/blob/main/Screenshots/3A237C94-A2B5-4EBE-9504-532583DC7993_4_5005_c.jpeg?raw=true" width="250"/></td>
    <td><img src="https://github.com/LeoFreyre/adminrentalho-app-real-estate-control/blob/main/Screenshots/A4ADA533-4DC4-4BF9-9B9C-308E43E15C3F_4_5005_c.jpeg?raw=true" width="250"/></td>
  </tr>
  <tr>
    <td><img src="https://github.com/LeoFreyre/adminrentalho-app-real-estate-control/blob/main/Screenshots/D51AC1DF-FDB8-43C5-920F-6FB3D1667224_4_5005_c.jpeg?raw=true" width="250"/></td>
    <td><img src="https://github.com/LeoFreyre/adminrentalho-app-real-estate-control/blob/main/Screenshots/D9F9EA7B-6EED-4CFE-9AA1-33F1B0CC2D59_4_5005_c.jpeg?raw=true" width="250"/></td>
    <td><img src="https://github.com/LeoFreyre/adminrentalho-app-real-estate-control/blob/main/Screenshots/DA22B31B-D8CA-4CC3-B952-F8640DE52514_4_5005_c.jpeg?raw=true" width="250"/></td>
  </tr>
</table>

</div>

*[Support for iOS 15+/Android 10+ – Timezone: Asia/Dubai configured by default]*


## 🌐 Live
Visit the web of the project: https://suite-adminrentalho.web.app

## 📄 License
This project is licensed under the MIT License.
