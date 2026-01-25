# 🔥 Complete Firebase Setup Guide

This guide will walk you through connecting Firebase to your Aidus Admin Dashboard step by step.

---

## 📋 Prerequisites

- A Google account
- Node.js installed on your computer
- Your project set up and running

---

## Step 1: Create a Firebase Project

1. **Go to Firebase Console**
   - Visit [https://console.firebase.google.com/](https://console.firebase.google.com/)
   - Sign in with your Google account

2. **Create a New Project**
   - Click **"Add project"** or **"Create a project"**
   - Enter a project name (e.g., "Aidus Admin")
   - Click **"Continue"**

3. **Configure Google Analytics (Optional)**
   - You can enable or disable Google Analytics
   - Click **"Continue"** or **"Create project"**

4. **Wait for Project Creation**
   - Firebase will set up your project (takes 30-60 seconds)
   - Click **"Continue"** when ready

---

## Step 2: Add a Web App to Your Firebase Project

1. **In Firebase Console**
   - You should see your project dashboard
   - Look for the web icon `</>` or **"Add app"** button
   - Click on it

2. **Register Your App**
   - Enter an app nickname (e.g., "Aidus Admin Web")
   - **DO NOT** check "Also set up Firebase Hosting" (unless you want it)
   - Click **"Register app"**

3. **Copy Your Firebase Configuration**
   - You'll see a code block with your Firebase config
   - It looks like this:
   ```javascript
   const firebaseConfig = {
     apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
     authDomain: "your-project-id.firebaseapp.com",
     projectId: "your-project-id",
     storageBucket: "your-project-id.appspot.com",
     messagingSenderId: "123456789012",
     appId: "1:123456789012:web:abcdef1234567890"
   };
   ```
   - **Keep this page open** - you'll need these values!

---

## Step 3: Create Environment Variables File

1. **Navigate to Your Project Root**
   - Open your project folder in a code editor (VS Code, etc.)
   - Make sure you're in the root directory (where `package.json` is located)

2. **Create `.env.local` File**
   - Create a new file named `.env.local` in the root directory
   - **Important**: The file must be named exactly `.env.local` (with the dot at the beginning)

3. **Add Your Firebase Configuration**
   - Copy the values from Step 2 and add them to `.env.local`:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
   NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef1234567890
   ```

   **Example:**
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyAbCdEfGhIjKlMnOpQrStUvWxYz1234567
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=aidus-admin-12345.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=aidus-admin-12345
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=aidus-admin-12345.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=987654321098
   NEXT_PUBLIC_FIREBASE_APP_ID=1:987654321098:web:abc123def456ghi789
   ```

4. **Save the File**
   - Make sure to save `.env.local`
   - **Important**: Never commit this file to Git (it's already in `.gitignore`)

---

## Step 4: Enable Email/Password Authentication

1. **Go to Authentication**
   - In Firebase Console, click **"Authentication"** in the left sidebar
   - If you see "Get started", click it

2. **Enable Email/Password Sign-in**
   - Click on the **"Sign-in method"** tab (or "Get started")
   - Find **"Email/Password"** in the list
   - Click on it

3. **Enable Email/Password**
   - Toggle the **"Enable"** switch to **ON**
   - Leave "Email link (passwordless sign-in)" as OFF (unless you want it)
   - Click **"Save"**

---

## Step 5: Create Your Admin User Account

1. **Go to Users Tab**
   - In the Authentication section, click on **"Users"** tab
   - Click **"Add user"** button

2. **Create User**
   - Enter an email address (e.g., `admin@aidus.com`)
   - Enter a password (make it strong!)
   - Click **"Add user"**

3. **Save Your Credentials**
   - Write down your email and password
   - You'll use these to log into the admin panel

---

## Step 6: Restart Your Development Server

1. **Stop Your Server**
   - If your dev server is running, stop it (Ctrl+C or Cmd+C)

2. **Start It Again**
   ```bash
   npm run dev
   ```

3. **Why Restart?**
   - Next.js only loads environment variables when it starts
   - Changes to `.env.local` require a restart

---

## Step 7: Test Your Connection

1. **Open Your App**
   - Go to `http://localhost:3000/adminconsole/login`

2. **Try to Log In**
   - Enter the email and password you created in Step 5
   - Click "Sign in"

3. **Success!**
   - If you're redirected to the admin dashboard, Firebase is connected! ✅
   - If you see an error, check the troubleshooting section below

---

## 🔍 Troubleshooting

### Error: "Firebase: Error (auth/invalid-api-key)"

**Possible Causes:**
- Missing or incorrect API key in `.env.local`
- Forgot to restart the dev server
- Typo in environment variable name

**Solution:**
1. Check that `.env.local` exists in the project root
2. Verify all variable names start with `NEXT_PUBLIC_`
3. Make sure there are no extra spaces or quotes around values
4. Restart your dev server: `npm run dev`

### Error: "Firebase Auth is not initialized"

**Possible Causes:**
- One or more environment variables are missing
- Empty values in `.env.local`

**Solution:**
1. Check the browser console for a list of missing variables
2. Verify all 6 environment variables are in `.env.local`
3. Make sure no values are empty

### Error: "User not found" or "Wrong password"

**Possible Causes:**
- User doesn't exist in Firebase
- Wrong email or password

**Solution:**
1. Go to Firebase Console > Authentication > Users
2. Verify the user exists
3. Try resetting the password or creating a new user

### Can't Find Firebase Configuration

**If you lost your config:**
1. Go to Firebase Console
2. Click the gear icon ⚙️ next to "Project Overview"
3. Select "Project settings"
4. Scroll down to "Your apps"
5. Click on your web app
6. You'll see the config values there

---

## ✅ Verification Checklist

Before considering Firebase fully connected, verify:

- [ ] Firebase project created
- [ ] Web app registered in Firebase
- [ ] `.env.local` file created in project root
- [ ] All 6 environment variables added to `.env.local`
- [ ] Email/Password authentication enabled
- [ ] At least one user created in Firebase
- [ ] Development server restarted
- [ ] Can successfully log in at `/adminconsole/login`

---

## 📝 Quick Reference

**File Location:** `.env.local` (in project root)

**Required Variables:**
```env
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

**Firebase Console:** [https://console.firebase.google.com/](https://console.firebase.google.com/)

**Login URL:** `http://localhost:3000/adminconsole/login`

---

## 🆘 Still Having Issues?

1. **Check the Browser Console**
   - Open DevTools (F12)
   - Look for error messages
   - They often tell you exactly what's wrong

2. **Verify File Location**
   - `.env.local` must be in the root directory
   - Same level as `package.json` and `next.config.ts`

3. **Check for Typos**
   - Variable names are case-sensitive
   - Must start with `NEXT_PUBLIC_`
   - No spaces around the `=` sign

4. **Restart Everything**
   - Stop the dev server
   - Close your code editor
   - Reopen and restart: `npm run dev`

---

## 🎉 Success!

Once you can log in successfully, Firebase is fully connected and ready to use!

Your admin panel will now:
- ✅ Authenticate users securely
- ✅ Store user sessions
- ✅ Protect admin routes
- ✅ Be ready for Firestore and Storage (if needed later)
