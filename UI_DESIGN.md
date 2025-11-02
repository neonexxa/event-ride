# UI Design Documentation

## Overview

The carpool seat selection system uses a clean, modern interface inspired by movie ticket booking systems.

## Color Scheme

### Primary Colors
- **Purple Gradient**: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`
- **White Background**: `#ffffff`
- **Text Primary**: `#333333`
- **Text Secondary**: `#666666`

### Seat States
- **Available**: White background (`#ffffff`) with purple text (`#667eea`)
- **Occupied**: Semi-transparent white (`rgba(255, 255, 255, 0.3)`)
- **Hover (Available)**: Light blue (`#f0f4ff`)
- **Hover (Occupied)**: Red tint (`rgba(255, 100, 100, 0.4)`)

## Layout Structure

### Page Layout

```
┌─────────────────────────────────────────────────────────────────┐
│                         HEADER                                   │
│                  🚗 Carpool Seat Selection                       │
└─────────────────────────────────────────────────────────────────┘
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐     │
│  │  📋 Select Event:                                      │     │
│  │  [ AirAsia Annual Dinner 2025 - 2025-12-15... ▼ ]    │     │
│  └────────────────────────────────────────────────────────┘     │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                    CARS GRID                             │   │
│  │  (Max 3 cars per row, responsive)                       │   │
│  │                                                          │   │
│  │  ┌────────┐  ┌────────┐  ┌────────┐                   │   │
│  │  │ Car 1  │  │ Car 2  │  │ Car 3  │                   │   │
│  │  └────────┘  └────────┘  └────────┘                   │   │
│  │  ┌────────┐  ┌────────┐  ┌────────┐                   │   │
│  │  │ Car 4  │  │ Car 5  │  │ Car 6  │                   │   │
│  │  └────────┘  └────────┘  └────────┘                   │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐     │
│  │  LEGEND:  🟢 Available    🔴 Occupied                 │     │
│  └────────────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────────┘
```

### Car Card Layout

```
┌──────────────────────────────────────────────────┐
│  ┌────────────────────────────────────────────┐  │
│  │  🚙 Ahmad Ibrahim                          │  │ ← White header
│  │  ⏰ 6:00 PM                               │  │
│  │  📍 RedQ Main Lobby                       │  │
│  └────────────────────────────────────────────┘  │
│                                                  │
│  SEATS (2 per row):                              │ ← Purple gradient bg
│  ┌───────────┬───────────┐                       │
│  │  Seat 1   │  Seat 2   │                       │
│  │  ┌─────┐  │  ┌─────┐  │                       │
│  │  │  1  │  │  │  2  │  │                       │
│  │  │ 👤  │  │  │     │  │                       │
│  │  └─────┘  │  └─────┘  │                       │
│  │  Alice    │ Available │                       │
│  └───────────┴───────────┘                       │
│  ┌───────────┬───────────┐                       │
│  │  Seat 3   │  Seat 4   │                       │
│  │  ┌─────┐  │  ┌─────┐  │                       │
│  │  │  3  │  │  │  4  │  │                       │
│  │  │ 👤  │  │  │     │  │                       │
│  │  └─────┘  │  └─────┘  │                       │
│  │  Bob      │ Available │                       │
│  └───────────┴───────────┘                       │
└──────────────────────────────────────────────────┘
```

### Seat Button Design

#### Available Seat
```
┌─────────────┐
│      1      │  ← White background
│             │     Purple text (#667eea)
│             │     2px white border
│  Available  │     Hover: Light blue bg
└─────────────┘
```

#### Occupied Seat
```
┌─────────────┐
│      2      │  ← Semi-transparent white
│     👤      │     White text
│   Alice     │     Shows passenger name
│             │     Hover: Red tint (cancellation)
└─────────────┘
```

## Responsive Design

### Desktop (> 768px)
- **Container width**: 1200px max
- **Cars per row**: 3
- **Seats per row**: 2
- **Padding**: 40px

### Tablet (768px - 480px)
- **Container width**: 100%
- **Cars per row**: 2 or 1 (auto-adjust)
- **Seats per row**: 2
- **Padding**: 30px

### Mobile (< 768px)
- **Container width**: 100%
- **Cars per row**: 1
- **Seats per row**: 2
- **Padding**: 20px
- **Title font**: 1.8rem (smaller)

## Typography

### Font Family
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 
             'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 
             'Helvetica Neue', sans-serif;
```

### Font Sizes
- **Page Title**: 2.5rem (desktop), 1.8rem (mobile)
- **Car Name**: 1.5rem
- **Car Info**: 0.95rem
- **Seat Number**: 1.2rem
- **Seat Label**: 0.7rem
- **Modal Title**: 1.8rem
- **Form Labels**: 0.95rem

### Font Weights
- **Bold**: 700 (titles, headings)
- **Semibold**: 600 (labels, driver names)
- **Regular**: 400 (body text)

## Spacing System

### Gap Sizes
- **Cars Grid**: 30px
- **Seats Grid**: 12px
- **Form Fields**: 20px margin-bottom
- **Modal Buttons**: 15px gap

### Padding
- **Container**: 40px (desktop), 20px (mobile)
- **Car Card**: 25px
- **Car Header**: 20px
- **Seat Button**: 10px
- **Modal**: 40px (desktop), 30px (mobile)

## Components

### 1. Event Dropdown
```
Width: 100% (max 400px)
Height: Auto
Padding: 12px 20px
Border: 2px solid #667eea
Border-radius: 10px
Font-size: 1rem
```

### 2. Car Card
```
Background: Linear gradient (purple)
Border-radius: 15px
Padding: 25px
Box-shadow: 0 10px 30px rgba(0,0,0,0.15)
Hover: Transform translateY(-5px)
```

### 3. Seat Button
```
Aspect-ratio: 1:1
Border-radius: 10px
Display: Flex column
Align: Center
Justify: Center
Padding: 10px
Transition: 0.3s ease
```

### 4. Modal Dialog
```
Background: White
Border-radius: 20px
Padding: 40px
Max-width: 500px
Width: 90%
Box-shadow: 0 20px 60px rgba(0,0,0,0.3)
Animation: slideUp 0.3s ease
```

## Interactions

### Hover Effects

**Available Seat**:
```css
hover {
  background: #f0f4ff;
  transform: scale(1.05);
  box-shadow: 0 5px 15px rgba(255, 255, 255, 0.3);
}
```

**Occupied Seat**:
```css
hover {
  background: rgba(255, 100, 100, 0.4);
  transform: scale(1.05);
  cursor: pointer; /* Shows it's clickable for cancellation */
}
```

**Car Card**:
```css
hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.25);
}
```

### Animations

**Modal Entrance**:
```css
@keyframes slideUp {
  from {
    transform: translateY(50px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
```

**Fade In**:
```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
```

## Accessibility

### Color Contrast
- **Text on white**: #333 (AAA compliant)
- **Text on purple**: White (AAA compliant)
- **Available seat**: Purple on white (High contrast)

### Interactive Elements
- All buttons have `:hover` and `:focus` states
- Large click targets (min 44x44px)
- Clear visual feedback on interaction

### Semantic HTML
- Proper form labels
- Button elements for clickable items
- Alt text for icons (emoji fallback)

## Icon System

### Emoji Icons Used
- 🚗 Carpool (title)
- 🚙 Car (driver card)
- ⏰ Time
- 📍 Location
- 👤 Occupied seat
- 🎯 Event selection
- 🟢 Available (legend)
- 🔴 Occupied (legend)

### Why Emojis?
- No external dependencies
- Universal recognition
- Consistent across platforms
- Lightweight

## Forms

### Input Fields
```
Width: 100%
Padding: 12px 15px
Border: 2px solid #e0e0e0
Border-radius: 10px
Font-size: 1rem

Focus state:
  Border: 2px solid #667eea
  Box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1)
```

### Buttons
```
Primary (Submit):
  Background: Linear gradient (purple)
  Color: White
  Padding: 14px
  Border-radius: 10px
  Hover: translateY(-2px) + shadow

Secondary (Cancel):
  Background: #f0f0f0
  Color: #666
  Padding: 14px
  Border-radius: 10px
  Hover: background #e0e0e0
```

## Loading States

### Loading Cars
```
Display: "Loading cars..."
Text-align: Center
Font-size: 1.2rem
Color: #667eea
Padding: 40px
```

### No Data States
```
Display: "No cars available for this event"
Background: #f8f9fa
Border-radius: 10px
Padding: 60px 20px
Text-align: Center
Color: #999
```

## Best Practices

### Do's ✅
- Use the gradient for primary elements
- Maintain 2 seats per row for consistency
- Provide hover feedback on all interactive elements
- Use white space generously
- Keep seat buttons square (aspect-ratio: 1)
- Show passenger names on occupied seats
- Animate state changes smoothly

### Don'ts ❌
- Don't use more than 2 seats per row
- Don't make click targets too small
- Don't use colors without sufficient contrast
- Don't disable animations (improves UX)
- Don't hide important information
- Don't make cards too wide on mobile

## Future Enhancements

### Potential UI Improvements
1. **Seat tooltips** with full passenger details
2. **Car capacity indicators** (3/5 seats occupied)
3. **Filtering options** (by time, location)
4. **Sorting options** (by departure time, available seats)
5. **Toast notifications** instead of alerts
6. **Skeleton loaders** for better loading states
7. **Animations** for seat booking/cancellation
8. **Dark mode** support
9. **Accessibility improvements** (screen reader support)
10. **Print-friendly view** for drivers

## Design Tokens

```css
:root {
  /* Colors */
  --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --primary-color: #667eea;
  --secondary-color: #764ba2;
  --text-primary: #333;
  --text-secondary: #666;
  --text-light: #999;
  --bg-white: #ffffff;
  --bg-light: #f8f9fa;
  --border-color: #e0e0e0;
  
  /* Spacing */
  --spacing-xs: 8px;
  --spacing-sm: 12px;
  --spacing-md: 20px;
  --spacing-lg: 30px;
  --spacing-xl: 40px;
  
  /* Border Radius */
  --radius-sm: 5px;
  --radius-md: 10px;
  --radius-lg: 15px;
  --radius-xl: 20px;
  
  /* Shadows */
  --shadow-sm: 0 5px 15px rgba(0, 0, 0, 0.1);
  --shadow-md: 0 10px 30px rgba(0, 0, 0, 0.15);
  --shadow-lg: 0 20px 60px rgba(0, 0, 0, 0.3);
  
  /* Transitions */
  --transition-fast: 0.2s ease;
  --transition-base: 0.3s ease;
  --transition-slow: 0.5s ease;
}
```

## Summary

The UI follows modern design principles:
- **Clean**: Minimal clutter, focused on task
- **Intuitive**: Clear visual hierarchy
- **Responsive**: Works on all devices
- **Accessible**: High contrast, large targets
- **Animated**: Smooth transitions enhance UX
- **Consistent**: Unified color scheme and spacing

The 2-seats-per-row layout provides optimal balance between information density and usability.

