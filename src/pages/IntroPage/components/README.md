# Intro Page Components

New modular component structure for the IntroPage, reading data from `/public/data/intro_data.json`.

## Component Hierarchy

```
IntroPage
├── IntroHeader (title + logo)
├── IntroContentContainer (scrollable with references)
│   └── IntroContent[] (multiple sections)
│       ├── IntroContentHeader (colored header with icon)
│       └── Body + IntroContentStatContainer
│           └── IntroContentStat[] (ZORYVE vs Vehicle stats)
└── Button (Get Started)
```

## Components

### IntroHeader
- **Purpose**: Page header with title and Zoryve logo
- **Layout**: Flexbox - title (left), logo (right, 60px height)
- **Props**: `title` (string)
- **Responsive**: Stacks vertically on mobile

### IntroContentContainer
- **Purpose**: Scrollable container for all content sections plus references footer
- **Features**: 
  - Masked corners with border-radius
  - Custom scrollbar styling
  - References block at bottom (max-width 700px)
- **Props**: `children`, `references` (HTML string)
- **Responsive**: Adjusts padding on mobile

### IntroContent
- **Purpose**: Individual content section (e.g., "Plaque psoriasis - 0.3% Foam")
- **Layout**: Header + 2-column grid (body text left, stats right)
- **Props**: `icon`, `title`, `headerColor`, `body`, `stats`
- **Responsive**: Stacks to single column at 900px breakpoint

### IntroContentHeader
- **Purpose**: Colored header bar for each content section
- **Layout**: Icon (left) + Title (uppercase, centered)
- **Height**: 50px (40px on mobile)
- **Props**: `icon`, `title`, `headerColor` (CSS variable or hex)
- **Features**: Handles CSS variables (e.g., `--colour-plaque-psoriasis`)

### IntroContentStatContainer
- **Purpose**: Grid container for stat cards
- **Layout**: 2-column grid, gap 20px
- **Props**: `stats` (array of stat objects)
- **Responsive**: Collapses to 1 column at 900px

### IntroContentStat
- **Purpose**: Individual stat card showing ZORYVE vs Vehicle comparison
- **Layout**: 
  - Title (full width)
  - White divider
  - 2-column flex (ZORYVE | Vehicle)
  - Each column: label, large %, n=count
- **Dimensions**: Max-width 290px, 70% midnight blue background
- **Props**: `title`, `zoryvePercent`, `vehiclePercent`, `zoryveCount`, `vehicleCount`

## Data Structure

Reads from `intro_data.json`:

```json
{
  "title": "Page title",
  "content": [
    {
      "header-colour": "--colour-plaque-psoriasis",
      "icon": "icon-foam-03.svg",
      "title": "Section title",
      "body": "Body text (HTML)",
      "stats": [
        {
          "title": "Stat title",
          "zoryve-percent": "63",
          "vehicle-percent": "21",
          "zoryve-count": "481",
          "vehicle-count": "255"
        }
      ]
    }
  ],
  "references": "References HTML string"
}
```

## Rollback

To revert to the old intro page:
1. Open `IntroPage.jsx`
2. Replace content with `IntroPageOld.jsx` component
3. Or simply import and render `<IntroPageOld />` instead of the new structure

## Styling

- All components use CSS custom properties from `index.css`
- Main colors: `--colour-white`, `--colour-zoryve-midnight-blue`, condition-specific colors
- Spacing: Uses CSS variables (`--spacing-xs` through `--spacing-xxl`)
- Typography: Uses font size variables (`--font-size-xs` through `--font-size-xxl`)
