# Pizza Paradise Design System

This document outlines the design standards for the Pizza Paradise application to ensure consistency across all components and pages.

## Typography

### Font Families

The application uses three primary font families:

- **Display Font**: Playfair Display / Cormorant Garamond - Used for headings, titles, and decorative text
- **Body Font**: Roboto / Open Sans - Used for body text, UI elements, and general content
- **Accent Font**: Amatic SC / Satisfy - Used for special elements like promotional text, quotes, or highlights

### Type Scale

We follow a consistent typographic scale:

| Class Name          | Font Size       | Line Height | Font Weight | Usage                                      |
| ------------------- | --------------- | ----------- | ----------- | ------------------------------------------ |
| `heading-1`         | 2.5rem (40px)   | 1.2         | 700         | Main page titles                           |
| `heading-2`         | 2rem (32px)     | 1.2         | 700         | Section headings                           |
| `heading-3`         | 1.75rem (28px)  | 1.3         | 600         | Sub-section headings                       |
| `heading-4`         | 1.5rem (24px)   | 1.3         | 600         | Card headings, minor sections              |
| `heading-5`         | 1.25rem (20px)  | 1.4         | 600         | Small headings                             |
| `heading-6`         | 1rem (16px)     | 1.4         | 600         | Mini headings                              |
| `menu-banner-title` | 3rem (48px)     | 1.1         | 700         | Large banner titles with shadow            |
| `menu-banner-text`  | 1.25rem (20px)  | 1.4         | 500         | Text for banner areas with enhanced shadow |
| `page-title`        | 2.5rem (40px)   | 1.2         | 700         | Standard page titles                       |
| `section-title`     | 1.5rem (24px)   | 1.3         | 600         | Main section dividers                      |
| `text-body`         | 1rem (16px)     | 1.5         | 400         | Standard paragraph text                    |
| `text-body-lg`      | 1.125rem (18px) | 1.5         | 400         | Larger body text for emphasis              |
| `text-body-sm`      | 0.875rem (14px) | 1.5         | 400         | Smaller body text, captions                |
| `text-ui`           | 0.875rem (14px) | 1.5         | 400         | General UI text                            |
| `text-ui-bold`      | 0.875rem (14px) | 1.5         | 500         | Emphasized UI text                         |

### Pizza-Themed Typography

Special typography classes for enhancing the pizza restaurant theme:

| Class Name             | Font Family  | Size Range   | Usage                                    |
| ---------------------- | ------------ | ------------ | ---------------------------------------- |
| `pizza-title`          | Display Font | 3-5rem       | Major headings with Italian-style shadow |
| `pizza-accent-title`   | Amatic SC    | 2-4rem       | Playful accent headings                  |
| `pizza-slogan`         | Satisfy      | 1.25-2rem    | Promotional copy and taglines            |
| `menu-section-title`   | Amatic SC    | 2-4rem       | Menu section headings                    |
| `handwritten-note`     | Satisfy      | 1.25-1.75rem | Personal touch elements, chef's notes    |
| `italian-phrase`       | Cormorant    | 1.25-1.5rem  | Italian quotes and phrases               |
| `chefs-special`        | Amatic SC    | 1.25rem      | Highlighting special menu items          |
| `menu-category-header` | Display Font | 1.5-2rem     | Menu category titles with underline      |
| `customer-name`        | Display Font | 1rem         | For testimonials and reviews             |
| `review-quote`         | Body Font    | 1rem         | Customer reviews with style              |

### Special Text Styles

- `card-title`: For headings within card components
- `card-subtitle`: For secondary text in cards
- `card-body`: For main content in cards
- `footer-heading`: Specific style for headings in the footer
- `nav-link`: For navigation links
- `banner-text`: For text in banner components
- `notice-text`: For informational notices
- `price-text`: For displaying prices (uses the display font for better emphasis)
- `menu-category-text`: For menu category labels
- `button-text`: For text within buttons

### Text on Images

For text displayed on images or colored backgrounds, use these classes:

- `menu-banner-title`: For large text headings on dark background images
- `menu-banner-text`: For body text on dark background images
- `bg-image-text-title`: Alternative for title text on image backgrounds
- `bg-image-text-body`: Alternative for body text on image backgrounds

## Color System

### Primary Colors

- **Brand Red**: `#b91c1c` (red-700)
  - Lighter: `#ef4444` (red-500)
  - Darker: `#991b1b` (red-800)

### Pizza-Themed Colors

- **Tomato Red**: `#e53e3e` (red-600) - For sauce elements and important accents
- **Cheese Yellow**: `#f6d860` (custom) - For cheese textures and highlights
- **Crust Brown**: `#d4b483` (custom) - For borders and background elements
- **Basil Green**: `#008C45` (Italian flag green) - For fresh ingredient accents
- **Wood Brown**: `#f8f4e9` (custom) - For wood-fired textures and backgrounds

### Neutrals

- **Dark Gray**: `#1f2937` (gray-800)
- **Medium Gray**: `#4b5563` (gray-600)
- **Light Gray**: `#f3f4f6` (gray-100)

### UI States

- **Success**: `#10b981` (green-500)
- **Warning**: `#f59e0b` (amber-500)
- **Error**: `#ef4444` (red-500)
- **Info**: `#3b82f6` (blue-500)

### Text Colors

- **Primary Text**: `#1a202c` (gray-900)
- **Secondary Text**: `#4a5568` (gray-700)
- **Tertiary Text**: `#718096` (gray-500)
- **Text on Dark**: `#f7fafc` (gray-50)

## Pizza-Themed Visual Elements

### Texture Backgrounds

- `cheese-texture`: Subtle dotted pattern resembling cheese
- `pepperoni-pattern`: Red circular dots for a playful pattern
- `wood-fired-texture`: Warm wood-grain pattern for backgrounds

### Decorative Elements

- `pizza-badge`: Circular badge for promotional elements
- `pizza-slice-divider`: Decorative divider with pizza slice icon
- `pizza-crust-border`: Border resembling pizza crust
- `italian-flag-accent`: Subtle green-white-red accent
- `tomato-sauce-accent`: Red underline accent
- `pizza-price-tag`: Styled price display for menu items

### Interactive Effects

- `pizza-card`: Styled card with pizza-themed bottom border
- `pizza-card-hover`: Enhanced hover effect for cards
- `rotating-pizza-icon`: Icon that rotates on hover
- `sauce-drip-button`: Button with dripping sauce animation
- `cheese-reveal`: Melting cheese effect on hover

## Text Enhancement Techniques

### Text Shadow

We use several text shadow techniques to improve readability:

1. **Banner Text Shadows**: Heavier shadows for text on photo backgrounds

   ```css
   text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8), 0 0 10px rgba(0, 0, 0, 0.5);
   ```

2. **Subtle Heading Enhancement**: Light shadow for headings to add depth

   ```css
   text-shadow: 1px 1px 0 rgba(0, 0, 0, 0.05);
   ```

3. **Italian Style Text Shadow**: Red/black dual shadow for authentic restaurant feel

   ```css
   text-shadow: 2px 2px 0 #b91c1c, 3px 3px 0 rgba(0, 0, 0, 0.8);
   ```

4. **Body Text on Images**: Medium shadow for body text on varying backgrounds
   ```css
   text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.9), 0 0 8px rgba(0, 0, 0, 0.6);
   ```

### Background Overlays

For text on image backgrounds, we use several overlay techniques:

1. **Simple Dark Overlay**: Basic overlay for text readability

   ```css
   <div className="absolute inset-0 bg-black bg-opacity-50"></div>
   ```

2. **Gradient Overlay**: Gradient for more nuanced control of text visibility

   ```css
   <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70"></div>
   ```

3. **Texture Overlay**: Adds texture while improving readability
   ```css
   <div className="absolute inset-0 opacity-15"
     style={{
       backgroundImage: "url('https://www.transparenttextures.com/patterns/checkered-pattern.png')",
       mixBlendMode: 'multiply'
     }}
   ></div>
   ```

## UI Components

### Buttons

Three sizes available:

- `sm`: Small - for compact interfaces
- `md`: Medium (default) - standard usage
- `lg`: Large - for calls to action

Five variants available:

- `primary`: Red background, white text - primary actions
- `secondary`: Gray background, dark text - secondary actions
- `outline`: Transparent with red border - alternate actions
- `text`: Text only - subtle actions
- `danger`: Red background - destructive actions

Pizza-themed buttons:

- Add the `sauce-drip-button` class for a dripping sauce animation effect
- Use rounded-full with the Italian flag colors for special CTA buttons

### Cards

Standard card structure:

- Rounded corners (`rounded-xl`)
- Optional shadow (`shadow-md`, `shadow-lg`)
- Consistent padding (`p-6` as default)
- Structured with `card-title`, `card-subtitle`, and `card-body` classes

Pizza-themed cards:

- `pizza-card`: Base card with pizza-themed styling
- `pizza-card-hover`: Enhanced hover effects for interactive cards
- `pizza-crust-border`: Special border resembling pizza crust
- Add `cheese-texture` class to card bodies for subtle texture

### Forms

Form elements should follow these patterns:

- Labels use `label-text` class
- Inputs use `input-text` class
- Maintain consistent spacing between form elements
- Use appropriate error messaging

## Best Practices

### Text Readability

1. Ensure sufficient contrast between text and background
2. For text on images, always use a semi-transparent overlay
3. Apply appropriate text shadows based on background complexity
4. Maintain appropriate text sizes for readability (minimum 14px for body text)

### Using Pizza-Themed Elements

1. Use pizza-themed elements purposefully - don't overuse them
2. Combine standard components with pizza accents for balance
3. Reserve the most playful elements (like `pizza-accent-title`) for key sections
4. Ensure decorative elements don't interfere with usability or readability

### Responsive Typography

The typography system includes responsive adjustments:

- Headings scale down on mobile devices
- Banner text reduces size on smaller screens
- Line lengths should not exceed ~70 characters for readability
- Maintain sufficient spacing between text elements

### Component Usage

1. Use the `Card` component for content grouping
2. Prefer the `Button` component over custom buttons
3. Use the design system's spacing and color variables
4. Maintain consistent padding/margin scales

## Implementation

All typography classes are implemented in `src/styles/typography.css` and imported into the main styles.
Pizza-themed elements are defined in `src/styles/pizza.css`.

The design system leverages Tailwind CSS utilities but wraps them in semantic class names to provide better developer experience and consistency.

When adding new components, refer to this document to ensure they follow the established patterns and style guidelines.
