We are going to build a web app using ReactJS with JS not TS, we will be using R3F via ThreeJS also but we will spec that part out later, for now i want it considered in the setup. Please use vite for building with and i want to use a light weight styling framework like tailwind, but really i want a global way of managing styles and do not want lots of inline styles

The global font is inter in various weights

The app is responsive though for now it will not collapse on mobile layouts as its only really intended for desktop and iPad currently

I want everything we do to be componentised as much as possible, i want a clear routes class for handling all the app routes

I will also setup a github repo and i want you to add actions into the workflow where as when i agree to keep one of your edits it then needs to be commit and pushed to the repo

to start with we are going to build one of the main pages and work backwards and forwards from that point, i want to use framer or similar for nice simple animations, i want to include gsap for more custom animations needed at points

where mentioned and where you see similar styles for colours, fonts or anything, then please put them into variables etc in the global CSS

basic button component
- regular font weight 10px in all caps
- 6px rounded corners
- 100px min width and 40px height
- width can expand width 30px left/right margin on the text contained inside
- background of button is #1378A8
- if disabled the button is 40% opacity
- if in a selected state for some usages then the background is #FFFFFF and any text or icon elements are #1F2B2B with a glow on the main button of #FDE939 20px in size

on the main page we have a filter system on the left, it is setup like follows
- It is 300px wide and responsive at 100% height
- It has a 20px soft shadow #000000 at 15% and 00xy
- The panel is split in three, the top part a two button tab looking like system, it is full width of the filter container and 60px height, the two tab buttons have equal 20px padding left, right and top and in the middle of them both, the buttons follow a similar style to basic button, but when one is selected it has a flat bottom and increases its size slightly to join the top of the body part of the container and body the text or the selected one and 40% alpha on the unselected one
- tab one - Clinical Trial, linear grad top to bottom - #21679E to #154E80
- tab two - Practice Based, linear grad top to bottom - #224B8C to #112C5A
- the body part is responsive in height and can scroll its contents if needed
- The bottom part holds a basic button component aligned middle center, and is 60px high and anchored to the bottom, it has a background of 10% black
- inside the top part we have the filter components, these are held in a flex style container in a vertical alignment width equal 45px spacing around each sides, so the main container is 45px equal spacing inside this top part, but the filters themselves are also 45px apart so it all looks correct
- there is two backgrounds like the main window background and should work the same way public/UI/filter-bkgd-ct.jpg and filter-bkgd-pb.jpg and will stretch 100% on the filter container

filter component
- 100% width within the filter container (460px with padding applied as above etc roughly) and responsive height based on its contents
- It has a 10px soft shadow #000000 at 15% and 00xy
- is split into a header/body
- header height is dictated by the title copy
- title copy is Inter Semi Bold at 12px in white and has 15px padding L/R and 10px padding T/B, and #FFFFFF when Clinical trial is selected and #14365B (Zoryve Midnight Blue) when Practice based is
- header background is #14365B when Clinical trial is selected and #FFB81C when Practice based is
- radius corners only on top corners of 8px
- body part has same radius corners but only on the bottom and a background of #689ACF 35% opacity
- content in the body has 15px padding all around typical apart from the condition filter which is 10px

Condition button component
- 100% width of its container
- 26px height
- all content left middle aligned
- 13px text size and this is the same for all of the filter component options, and regular weight when not selected and bold when selected, text is 10px right from the dot and this is the same for all filter options with their various other styles of selection
- 5px dot to the left inset with equal padding/margin to look good, #FFFFFF when selected #14365B and 40% alpha when not
- no background shown when not selected

Radio button style multiple selection
- unselected state 15px w/h 4px radius corners and 2px solid stroke #FFFFFF line
- selected state has a #FFFFFF fill and a small tick inside using zoryve black #1F2B2B, and a 6px glow using zoryve yellow #FDE939
- text like other options is 10px away to the right

filter component - Condition
- 3 options only one selected at one time
-- Plaque Psoriasis - button background colour when selected #44988A
-- Atopic Dermatitis - button background colour when selected #E57424
-- Seborrheic Dermatitis - button background colour when selected #984FBA

filter component - Formulation
- this is a radio button style with 4 options
-- 0.05% Cream
-- 0.15% Cream
-- 0.3% Cream
-- 0.3% Foam

filter component - Body Area
- this is a radio button style with 4 options
-- Head and neck
-- Torso
-- Arms and hands
-- Legs and feet
-- this has a slightly different override to the other in that it has an SVG applied to the bottom left of the container with no margins in place as a non repeating background - public/UI/body-area-person.svg, and the radio buttons are butted up against it so it looks seamless
- because of the background trying to look seamlessly attached to the filter options, this one has an override on the left margin/padding, so instead of 15px like all the others its 60px on the left on this one

filter component - Baseline Severity
- this is a radio button style with 3 options
-- Mild
-- Moderate
-- Severe

filter component - Age 
- this is a basic button style with 5 options and only one selectable at a time in a 3x2 column layout with the buttons having equal spacing around them 30px around them all like other containers but 20px between the buttons themselves, and the buttons width is 100% to the allowable width for the layout and height as per the basic button standard
-- 2-5
-- 6-18
-- 19-30
-- 31-50
-- 50+
- 40% alpha if in a disabled state
- 100% when not selected and enabled
- when selected it follows the exact same styling as the radio button, zoryve black for content and body text, and the button background is white with the zoryve yellow glow

filter component - Gender
- same setup as Age except just 2x1 layout
-- Male
-- Female
- each button has a 90x100 contained SVG that needs floating to the left with no additional padding etc and text to the right, public/UI/icon-male.svg and icon-female.svg etc
-same rules on selection etc as age, icon goes zoryve black on selection etc

filter bottom pane
- full width, 10% #000000 background
- basic button aligned center middle
- RESET FILTERS
- only active if filters are selected and resets all the state when pressed

main container to the right of the filters and taking up the rest of the width of the page
- filter pane sits higher in z-index so the shadow shows
- this consists of a 3 ways split vertically
- footer bottom
-- full width 40px height #408BAB (Zoryve Blue) Background
-- two buttons to the left using these SVGS
--- public/UI/footer-info.svg
--- public/UI/footer-refs.svg
-- logo to the right middle vertical alignment and 20px padding to the right - public/UI/logo-zoryve.svg
- important safety information - ISI Panel above it
-- we will put this there as a placeholder for now and populate later, for now it has a 100px height and full width using midnight blue for background
-- has a + button floating top right with 10px margin T/R - public/UI/plus-button.svg
-- when pressed to open the panel the button rotates 45 degrees which a smooth animation to become a close button
-- when pressed again rotates back to become plus button
-- when panel is open it animates and grows its height to 800px high and content inside (that we will populate later) becomes active and scrollable within the panel
-- when open a linear gradient covers the main window from the top of the ISI panel to the top of the screen, from top to bottom is is #000000 for all parts, but 3 stops 0, 75, 100, with values 15%, 35% and 100% alpha
- main window above that will have the main 3D content inside it, for now put a placeholder component in that ill update you on shortly

In the public/data folder i have a patient_data.json and a patient_schema.json, i want you to use the schema to create some constants against in a global Constants file so we know the types in a simple way as we are in JS so its not perfectly typed etc, the data json has all the data in that will be filtered against with the filter system, so please analyse it and in the main filter data class lets make sure we can filter the way we need to, as a rule when the app starts it will be filtering by clinical patients and no other filters set create a way of having views and data classes apart ideally, so the filter data class can have ways of asking for all the images to show etc, this needs to work in a way that the first image only is returned in an array, so whether its baseline, week1, week2 etc until we see a valid image, and then if the 3D component in the middle, if a user clicks on an image we can use that image to look back and get all the data to move into a detail view that we will discuss later we need some app and data managers to handle data loading and simple app states etc, store state enums in constants etc, again lets make sure to have sensible ways of storing logic etc through the app

create a global event system similar to this but obviously with diferent event names

// Simple event system
class EventSystem {
  constructor() {
    this.events = {}
  }

  // Event constants
  static EVENTS = {
    CATEGORY_CHANGED: 'categoryChanged',
    FILTER_CHANGED: 'filterChanged',
    FILTERS_RESET: 'filtersReset',
    IMAGE_CLICKED: 'imageClicked',
    IMAGES_UPDATED: 'imagesUpdated'
  }

  // Subscribe to an event
  on(eventName, callback) {
    if (!this.events[eventName]) {
      this.events[eventName] = []
    }
    this.events[eventName].push(callback)
  }

  // Unsubscribe from an event
  off(eventName, callback) {
    if (!this.events[eventName]) return
    if (!callback) {
      delete this.events[eventName]
      return
    }
    this.events[eventName] = this.events[eventName].filter(cb => cb !== callback)
  }

  // Emit an event
  emit(eventName, data) {
    if (!this.events[eventName]) return
    this.events[eventName].forEach(callback => {
      try {
        callback(data)
      } catch (error) {
        console.error(`Error in event handler for ${eventName}:`, error)
      }
    })
  }

  // Remove all listeners for an event
  clear(eventName) {
    if (eventName) {
      delete this.events[eventName]
    } else {
      this.events = {}
    }
  }
}

// Create a singleton instance
const eventSystem = new EventSystem()

export default eventSystem
export { EventSystem }


this means we do not need react to have one way of managing events like slices and then another in threejs and vanilla JS etc, make sure to use this and not to be overly reliant on props moving through lots of components unless it makes sense etc

Also one thing to note that we will add in later is an intro screen where a bit of up front content will show and we have to click to confirm before entering the main part of the app, so for now please have an intro page with a basic button in the middle just saying GET STARTED

when clicked the filter panel will subtly animate in from the left edge of the screen and so will the footers upwards and then our 3D main view (that we have not built yet) will come into the main window

we have a corresponding background image for both clinical trial and patient based routes, public/UI/bkgd-ct.jpg and bkgd-pb.jpg, please have a nice fade between if we move through the main sections with these and also the filter container headers when they change colour also, with everything make sure we use framer to have lovely animations on everything and also like i said GSAP for more custom animations

make sure all data is loaded from the JSON etc before the app can start utilsing state management and the event system etc

all of the SVGs are 2x the size they need to be, so bare this in mind when styling them, please read there bounding box and make them 50% smaller in the css per component they are used in etc