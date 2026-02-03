for this component it is split into a few parts and is using R3F

first component is the image component that holds the loaded image and an image frame around it, the frame has radius corners and a 4px solid white line with same radius and a strong #ffffff glow of 20px

the image component will be part of a 3D carousel that is adaptive in its rows/cols based on how many results come back from the datamanager, we can talk about the way it views and works in a minute, first ill explain the image split with rows/cols

when there is 45 and over results it will be 5 rows deep and roughly a maximum 9 viewable columns
when there is 21 and over results it will be 3 rows deep and roughly a maximum 7 viewable columns
when there is 2 and over results it will be 1 row deep and roughly a maximum 5 viewable columns

so as you can see it will be adaptive to the amount of content we have to show, i want a pooling system that is also adaptive, we now we will only need X amount of image holders and we will know we have only Y amount of results and between them we want to form what feels like a never ending pan and rotate 3D caorusel we can click and drag left to right and click and image to view more details

when we click and drag we want a threshold to be met that means it will not be registered as a press up event, in this case of dragging, when the user lets go, we want to understand what column should line up in the middle view and use GSAP to softly tween it back to the middle, if another click and pan event happens then we stop this animation

the carousel itself like i said is 3D, its like the image rows/cols are all spaced around a 3D circle, so the front image closest is the largest and as your can imagine the ones either side of the center get smaller due to perspective etc

and as the images are bigger the less rows we have, this is why we have less viewable columns

so as the virtual cylinder carousel gets panned left to right etc the image rows become there largest in the center and as they get to the sides start to vanish away, so if you imagine the front is 0 degress and the left might be 90 and the right might be -90, as the image rows reach these extremes they are faded away and repooled

the pan rotate system does not need a complex mechanic for keeping on top of it, all we need is a base variable we are tracking for its global rotation, and based on X amount of image rows spaced along the virtual round edge we know the angle lock for moving to an image row when we have stopped panning

ideally the front image and the immediate 1 column either side are full opacity and no blur, and as the angle increases after this they start to fade and blur away from that angle to the 90 degree cut off like mentioned above

in the same main component i would like a arrow button to the left and right that is clickable to also move the carousel to its next row

i would prefer the logic being split into smaller components etc, we could have one managing the image and data pooling, one managing the rotation state and have getters and setters for easy updates, viewable components etc

underneath the main component we have a fake shadow image, it would be nice if this is around 900px wide and perfectly centered underneath and a component itself which can move up and down depending on how many images we show in rows, so it feels attached to the current state of the viewable images etc

when we click and image for now please lets just have a global overlay component which shows a message to some of the relatable data for that image via the main json in the datamanager