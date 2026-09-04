# User Flow & Layout

## Primary Flow
1. **Load**: App initializes with a beautiful default dataset (e.g., "Monthly Revenue"). The preview immediately plays the animation.
2. **Data Entry**: User edits the data via the data table on the left, or pastes CSV data into a modal/textarea.
3. **Configuration**: User selects a visualization template (Bar, Counter, Donut), sets a color theme, and toggles Dark/Light mode.
4. **Generate & Preview**: Clicking "Generate" updates the visualization on the right.
5. **Playback Controls**: User can "Play", "Pause", or "Replay" the animation.
6. **Export**: User clicks "Export" to download a PNG image of the final frame.

## Layout (Desktop)
- **Left Panel (30-40% width)**:
  - Dataset Title & Subtitle Inputs
  - Data Table Editor (Label, Value, Add Row, Delete Row)
  - CSV Import Button
  - Controls: Template Selector, Theme Selector
- **Right Panel (60-70% width)**:
  - Hero Preview Area (centered visualization)
  - Playback Controls (Play/Replay button below visualization)
  - Export Button
  - Fullscreen Toggle

## Layout (Mobile)
- Stacked vertically. Top: Preview and Playback. Bottom: Data Editor and Controls.

## Error States
- **Invalid CSV**: Highlight error in red, don't break existing data.
- **Empty Dataset**: Show a graceful placeholder message ("Please add data to preview").
- **Non-numeric Values**: Fallback to `0` or highlight cell in red.
