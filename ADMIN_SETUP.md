# 🔐 Admin Account Setup Guide

## Admin Credentials

**IMPORTANT:** Only this specific admin account can access the admin panel. Customer accounts are separate and cannot access the admin console.

### Admin Account Details:
- **Email:** `adusservice.project@gmail.com`
- **Password:** `Aidus@123`

---

## Step 1: Create Admin User in Firebase

1. **Go to Firebase Console**
   - Visit [https://console.firebase.google.com/](https://console.firebase.google.com/)
   - Select your project: `aidus-a8f03`

2. **Navigate to Authentication**
   - Click **"Authentication"** in the left sidebar
   - Click **"Users"** tab

3. **Add Admin User**
   - Click **"Add user"** button
   - Enter the following:
     - **Email:** `adusservice.project@gmail.com`
     - **Password:** `Aidus@123`
   - Click **"Add user"**

4. **Verify User Created**
   - You should see the user in the Users list
   - The email should match exactly: `adusservice.project@gmail.com`

---

## Step 2: Enable Email/Password Authentication

If you haven't already:

1. In Firebase Console, go to **Authentication** > **Sign-in method**
2. Click on **"Email/Password"**
3. Toggle **"Enable"** to **ON**
4. Click **"Save"**

---

## Step 3: Security Features

The admin panel has built-in security:

✅ **Admin Email Verification**
- Only `adusservice.project@gmail.com` can access the admin panel
- If any other user tries to log in, they will be redirected to login
- Customer accounts cannot access the admin console

✅ **Route Protection**
- All `/adminconsole/*` routes are protected
- Unauthenticated users are redirected to login
- Non-admin users are automatically signed out

---

## Step 4: Test Admin Login

1. **Start your development server:**
   ```bash
   npm run dev
   ```

2. **Go to login page:**
   - Visit: `http://localhost:3000/adminconsole/login`

3. **Log in with admin credentials:**
   - Email: `adusservice.project@gmail.com`
   - Password: `Aidus@123`

4. **Verify access:**
   - You should be redirected to `/adminconsole` (dashboard)
   - You should see the admin sidebar and header

---

## Important Notes

### 🔒 Security
- **Never share admin credentials** publicly
- The admin email is hardcoded in the AuthGuard component for security
- Only this specific email can access the admin panel

### 👥 Customer Accounts
- Customer accounts are completely separate
- They cannot access `/adminconsole` routes
- They use the main application (landing pages)

### 🔑 Changing Admin Email
If you need to change the admin email:
1. Update `ADMIN_EMAIL` in `/src/components/admin/AuthGuard.tsx`
2. Create the new admin user in Firebase
3. Restart your development server

### 🔄 Changing Admin Password
To change the admin password:
1. Go to Firebase Console > Authentication > Users
2. Find `adusservice.project@gmail.com`
3. Click the three dots menu
4. Select "Reset password" or "Change password"
5. Update the password
6. Update this document with the new password

---

## Troubleshooting

### "Access Denied" or Redirected to Login

**Possible causes:**
- Email doesn't match exactly: `adusservice.project@gmail.com`
- User doesn't exist in Firebase
- Email/Password authentication not enabled

**Solution:**
1. Verify the user exists in Firebase Console
2. Check that the email matches exactly (case-sensitive)
3. Ensure Email/Password authentication is enabled

### "User not found" Error

**Solution:**
1. Go to Firebase Console > Authentication > Users
2. Verify `adusservice.project@gmail.com` exists
3. If not, create it using the steps above

### Can't Log In

**Check:**
1. ✅ Firebase configuration in `.env.local` is correct
2. ✅ Email/Password authentication is enabled
3. ✅ Admin user exists in Firebase
4. ✅ Email and password are correct
5. ✅ Development server was restarted after creating `.env.local`

---

## Quick Reference

**Admin Email:** `adusservice.project@gmail.com`  
**Admin Password:** `Aidus@123`  
**Login URL:** `http://localhost:3000/adminconsole/login`  
**Firebase Console:** [https://console.firebase.google.com/](https://console.firebase.google.com/)  
**Project ID:** `aidus-a8f03`

---

## ✅ Setup Checklist

- [ ] Firebase project created (`aidus-a8f03`)
- [ ] `.env.local` file created with Firebase config
- [ ] Email/Password authentication enabled
- [ ] Admin user created: `adusservice.project@gmail.com`
- [ ] Development server restarted
- [ ] Successfully logged in to admin panel
- [ ] Can access admin dashboard

---

**🎉 Once all checkboxes are complete, your admin panel is ready to use!**
