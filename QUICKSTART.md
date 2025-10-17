# Lattelier - Quick Start Guide

## Running the Application

The development server should now be running at: **http://localhost:5173**

Open your browser and navigate to this URL to see Lattelier!

## First Steps

### 1. Exploring the Interface

You'll see three main panels:
- **Left Panel**: Canvas settings (grid, points, lines, fill)
- **Center**: Interactive canvas
- **Right Panel**: Distortion settings (tools and wells)

### 2. Create Your First Distorted Pattern

1. **Add a Well**
   - Click the "Place Well" tool in the right panel
   - Click anywhere on the canvas
   - You'll see a blue circle appear with a center point
   - The grid will deform around this point

2. **Adjust the Well**
   - Drag the center point to move it
   - Use the right panel to adjust:
     - **Strength**: How much it attracts (positive) or repels (negative)
     - **Radius**: How far its influence extends
     - **Falloff**: How the influence decreases with distance
     - **Distortion**: Random scrambling of points within the radius

3. **Add More Wells**
   - Keep placing wells to add multiple distortion points
   - Watch how they interact with each other
   - Combine attracting and repelling forces for interesting effects

### 3. Customize Your Grid

Use the **left panel** to configure:
- **Grid Type**: Switch between square, triangular, or hexagonal
- **Dimensions**: Adjust rows and columns
- **Spacing**: Change the distance between points
- **Display**: Toggle points, lines, or fill
- **Styling**: Customize colors and opacity

### 4. Export Your Creation

1. Click the **Export** button in the toolbar
2. Choose your format:
   - **PNG (2x)**: High-resolution raster image
   - **SVG**: Scalable vector graphics (editable in Illustrator, Figma, etc.)

## Tips & Tricks

### Navigation
- **Scroll Wheel**: Zoom in/out
- **Pan Tool**: Click and drag to move around the canvas
- **Place Well Tool**: Click to add new well, drag existing wells to move them
- **Middle/Right Click**: Pan the view (works with any tool)

### Creating Interesting Effects

**Radial Burst**
- Add one well in the center
- Set strength to 0.8, radius to 300
- Use "smooth" falloff

**Wave Pattern**
- Add 3-4 wells in a line
- Alternate between positive and negative strength
- Try different falloff types

**Vortex**
- Add a central well with high positive strength
- Add 4-6 surrounding wells with negative strength
- Adjust radii to create spiraling effect

**Organic Deformation**
- Use multiple weak wells (strength 0.2-0.4)
- Overlap their influence radii
- Try "exponential" or "smooth" falloffs
- Add slight distortion (0.1-0.2) for natural randomness

### Color Schemes

Try these color combinations:

**Minimalist Dark**
- Points: #1f2937
- Lines: #9ca3af
- Background: (default)

**Blueprint**
- Points: #60a5fa
- Lines: #3b82f6
- Background: Use dark blue via browser inspector

**Neon**
- Points: #22d3ee
- Lines: #06b6d4
- High opacity (0.9-1.0)

## Navigation Controls

- **Mouse Wheel**: Zoom in/out
- **Pan Tool + Left Click Drag**: Move around canvas
- **Place Well Tool + Left Click**: Add new well
- **Place Well Tool + Drag Well**: Move existing well
- **Middle/Right Mouse Button**: Pan (works with any tool)

## Common Workflows

### For Graphic Design
1. Configure grid settings in left panel (type, dimensions, colors)
2. Switch to "Place Well" tool
3. Add wells to create your desired pattern
4. Adjust well properties (strength, radius, falloff, distortion)
5. Toggle "Hide Wells" to see clean result
6. Download as PNG (multiple resolutions) or SVG

### For Exploring Patterns
1. Start with default 30x30 grid
2. Use "Place Well" tool to add a single well
3. Adjust parameters and observe the effect
4. Add more wells gradually
5. Experiment with different grid types (square, triangular, hexagonal)
6. Try different line frequencies and curvatures

### For Animation Concepts
1. Create starting state with wells positioned
2. Export configuration as JSON (save your setup)
3. Move wells to create different frames
4. Export each frame as high-resolution PNG
5. Use external tool to create GIF/video from frames

## Troubleshooting

**Grid not updating?**
- Try changing a grid parameter to trigger regeneration
- Refresh the page

**Canvas performance slow?**
- Reduce grid size (fewer rows/columns)
- Decrease the number of wells
- Lower line/fill frequency
- Zoom out to see full grid

**Download not working?**
- Check if your browser blocks pop-ups/downloads
- For very large PNG exports, try a lower resolution
- Use SVG for unlimited resolution without browser limits
- Check browser console for errors

**Import configuration failing?**
- Ensure JSON file is properly formatted
- Verify file is a valid Lattelier configuration export
- Check error messages in the import modal

## Next Steps

Now that you've learned the basics:
1. Experiment with different grid types (square, triangular, hexagonal)
2. Try combining multiple wells with opposite forces
3. Explore line curvature and frequency for artistic effects
4. Create and export your designs as PNG or SVG
5. Save your configurations as JSON for later use
6. Share your creations!

Enjoy creating with Lattelier!

