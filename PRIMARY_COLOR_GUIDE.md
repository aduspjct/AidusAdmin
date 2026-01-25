# How to Change Primary Color

## Quick Guide

To change your primary color throughout the entire application, follow these steps:

### Step 1: Update the CSS Variable

Open `src/app/globals.css` and find the `--color-primary` variable in the `@theme` block (around line 44):

```css
/* PRIMARY COLOR - Change this value to change your primary color throughout the app */
--color-primary: #0056FF;  /* ← Change this hex color */
```

Simply change `#0056FF` to your desired color. For example:
- `#FF5733` for orange
- `#10B981` for green
- `#8B5CF6` for purple
- `#F59E0B` for amber

### Step 2: Update Component Classes

Replace `blue-600`, `blue-700`, `blue-50`, etc. with the new primary color classes:

**Before:**
```tsx
<button className="btn-primary hover:bg-blue-700">
<span className="text-blue">Home Services</span>
<div className="bg-blue-50">
```

**After:**
```tsx
<button className="bg-primary hover:bg-primary-600">
<span className="text-primary">Home Services</span>
<div className="bg-primary-50">
```

## Available Primary Color Classes

After updating the CSS variable, you can use these classes:

- `bg-primary` - Main primary background
- `text-primary` - Main primary text color
- `border-primary` - Primary border color
- `bg-primary-50` through `bg-primary-900` - Different shades
- `text-primary-50` through `text-primary-900` - Different text shades
- `hover:bg-primary-600` - Hover state

## Example: Changing to Green

1. In `globals.css`, change:
   ```css
   --color-primary: #10B981;
   ```

2. In your components, replace:
   - `btn-primary` → `bg-primary`
   - `text-blue` → `text-primary`
   - `bg-blue-50` → `bg-primary-50`
   - `hover:bg-blue-700` → `hover:bg-primary-600`

## Color Shade Generator

If you need to generate different shades for your color, you can use online tools like:
- https://tailwindcss.com/docs/customizing-colors
- https://coolors.co/generate

Then update all the `--color-primary-*` variables in `globals.css` accordingly.

