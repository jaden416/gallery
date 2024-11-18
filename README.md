# React Three Fiber Gallery

## First Goal: Create a mesh for each image on the home page.

### Objective 1: Inside the home file, you need to create an array of all the images within the HTML and then map that array inside your return statement. Hint: The map and one of the document.query functions are your friend.

Caveat: Due to the fact that the HTML component could potentially render after the THREE component; obtaining these images might initially give you an error.

Solution: Use the useState hook and set the value of the array to null initially. useEffect runs after the initial render so you can use that hook to set the state of the array. Create an if statement within your default function that returns null if your array is equal to null. In another return statement, create a JSX map of the array that returns a mesh (this will be changed later).

Notes:
Managing state is one of the most important habits you need to practice when working in React. For the array, you could have used a let variable instead of a state variable but that would be poor practice because React would not be able to keep track of the current state of the array.
You can avoid two return statements if you choose to conditionally render the JSX based on whether the array is null or not.

### Objective 2: Although you created the array of meshes, your screen is still blank. That is because the mesh is simply a mesh and not a detailed component with a set of props. You must now pass down a 3D plane and give the component an image texture. To do this you need to render an array of components within your return statement. You also need to set up a file for this component and import it. (I named mine Media.jsx)

Each Media component needs to carry the following props: element, geometry, (and don’t forget the key!). There will be more props you need to add later but these are the two props that are required to make a 3D element in three.js.

Caveat: You need to understand how [texture loading](https://threejs.org/docs/?q=text#api/en/loaders/TextureLoader) works in three.js and [how to append a geometry onto a mesh](https://r3f.docs.pmnd.rs/advanced/scaling-performance#re-using-geometries-and-materials).

Solution:
Key: The key is how React uniquely identifies each item in an array. (Hint: The key can be the index).
Element: The element prop is a reference to the image in the HTML. The array you created in the Home.jsx file already stores these images.
Geometry: The geometry prop should take in a three js plane. To create this plane you must use the [Three library](https://threejs.org/docs/#api/en/geometries/PlaneGeometry).

Within your map return a media component that passes down all of the objects above. Make sure that all of the parameters in the Media component are also set up. Inside the function body, create a texture loader using three.js texture loader. Then create a texture variable that uses this loader with the parameter (element.src). Inside the return statement create a mesh that has a geometry argument and have it assigned to your geometry prop.

Notes:
Initializing a plane geometry in the Home file rather than the Media file was intentional. Since each media component uses the same exact plane for its geometry argument, it would be redundant and memory intensive to recreate this geometry plane inside the Media component file.

### Objective 3: Nothing has appeared on the screen yet, why? This is because although you have the texture and geometry, you still need to create the shaders. There are fragment shaders and vertex shaders and each of them have a sole purpose. In a very broad sense, fragment shaders are used to manipulate the color of the 3D object and vertex shaders are used to manipulate the shape. You should consider using useRef() and useMemo().

Use the getBoundingClientRect method on the element to get the width and height of the images. Place these measurements in a reference that would be saved between re-rendering.
Use the Three.js [RawShaderMaterial](https://threejs.org/docs/?q=raw#api/en/materials/RawShaderMaterial) and give it an args parameter. Inside of this args parameter will be an object that contains your shader properties. The format will look like this:

Use the useThree() and destructure the size and viewport property from it. You will need this when you are sizing your planes

```javascript
{
uniform: {
someVar:{ value: }

},
fragmentShader: ,
vertexShader:
}
```

You should store this in a variable within your function body instead of the return statement.

Caveat: This might be the toughest objective so far.

Solution:
Create a useRef variable for the mesh of the component. We need to create a ref so that we can manipulate the DOM. Once you place the ref inside of the node (the mesh HTML tag) you can access all of the node's properties. This includes the shader properties that you will soon need to manipulate.
Inside the mesh tag create a ref parameter and assign it to your useRef variable.
Create a useRef variable for the bounds of the element. The usage for this useRef is a little different from the mesh ref. We are essentially going to store information without having to re-render.
We must access the size and viewport property of useThree(). We need these two values to scale the size of the plane relative to the viewport of the screen.
In a useEffect get the boundingClientRect of the element and store it in a variable. Then assign the bounds.current to an object that has a width and height of the variable. This is how we get the exact measurements of the image. We will be using this later to set up the scale of the geometry plane.
Create a function called updateScale(). For now this function will assign the scale of the mesh.current.scale.x and y to 1. Call the update scale in the same useEffect.
Now inside the return statement of your Media function, place a rawShaderMaterial tag inside the mesh. This element will take in an args parameter that stores an object similar to the codeblock above.

Inside of the uniform property create three uniforms. A uniform is a global shader variable and the three shader variables you need to pass are:

tMap: this is the texture (or the image you will pass down into the fragment shader). The value of this would be the texture variable you created earlier.
uViewportSizes: this is the viewport size you will pass down to the shader. The value of this would be an array that stores both viewport.width and viewport.height from the useThree() property.
uStrength: this is a post processing effect that will warp the plane when it moves. The value of this will be a number value of 0.

Outside of the uniform object you need to assign two other properties called fragmentShader and vertexShader. Their values will be the fragment and vertex variables that have been imported at the top.

Now pass in the object variable into the args and make sure it is inside an array. That is the way it reads the values appropriately.

A plane should now be visible but there are still some things that need to be changed. When you resize the screen, notice that the plane is flickering from a black plane to a textured plane. The reasoning for this is because every everytime you resize the screen, your component re-renders. This makes the variable that stores the shader reassign itself over and over again. To avoid this you must use useMemo. useMemo lets you cache the result of a calculation between re-renders.

Notes
Here is an [article](https://dev.to/bhavzlearn/demystifying-useref-and-usememo-in-react-4jcl) that goes over useRef and useMemo.

### Objective 4: Position all of the elements based on their bounds. To do this you need to use the boundingClientRect method add the top and left properties inside of the bounds variable. You must also create two functions similar to updateScale that instead update both x and y coordinates of the plane.

For the updateX function you need to use the viewport’s width, the media plane’s scale, the image element’s bound left property and the screen width.

Solution

updateX calculation is tricky. Essentially you want to decenter the list of planes and place them in a row that accounts for each individual plane’s x coordinate position.

To do that we have to first find out how to place the planes to the left border of the screen (the value must be negative). (-viewport.width / 2) does just that but as you can see only half of the plane is shown.
To adjust you must add (mesh.current.scale.x / 2). Now you can see the full plane touching the left border of the screen.
Now to give each plane their own specific position we need to access the bounds ref variable we used earlier to get the scale. This time we will be using the left property and divide it by the size width: bounds.current.left / size.width
As you can see it looks like a stack of cards. To fix this you must multiply it by the viewport.width

updateY is almost identical to updateX but this time we are dealing with the heights rather than widths.

To do that we have to first find out how to place the planes to the top border of the screen. (viewport.height / 2) does just that but as you can see only half of the plane is shown.
To adjust you must subtract (mesh.current.scale.y / 2). Now you can see the full plane touching the left border of the screen.
Now to give each plane their own specific position we need to access the bounds ref variable we used earlier to get the scale. This time we will be using the top property and divide it by the size height: bounds.current.top / size.height
As you can see it looks like a stack of cards. To fix this you must multiply it by the viewport.width

## Second Goal: Now that we have the scale and position of each image in three.js it is now time for the fun part. We are going to add the animation to the gallery.

First create a scroll ref and in the home file. This will be an object that contains the following properties:

```javascript
{
current: this is the journey property
target: this is the destination property
last: this keeps track of the current value.
position:
ease: this is the property that makes the animation very smooth
direction: this compares the current and the last property and returns a string that is either ‘up’ or ‘down’
}

We will also need a speed ref object that will contain the following properties:

{
current:
target:
ease:
}
```

Lastly, you will want to create a velocity ref variable that only holds a number. Let's go with -2.

To animate the scroll, we must use the three.js function useFrame in both files. Think of useFrame as Three.js's way of animating scenes.

Within the useFrame function inside the home file, you will want to increment (in our case we will decrement) the target property by a velocity. After updating the target, the current property should attempt to reach the target. The problem is that we do not want the current property to actually succeed in reaching the target. Instead we want it to follow directly behind it.

There are many ways to do this in animation but the best way to do it smoothly is by using [lerp](https://rachsmith.com/lerp/).
To do this mathematically the formula is:

target = (target - current) \* 0.001;

Keep in mind the .001 can be any number but that number simply controls the speed of the scroll.

Gsap has an [interpolate](<https://gsap.com/docs/v3/GSAP/UtilityMethods/interpolate()/>) function that achieves the same thing. We will be placing the following properties in this function: current, target, ease.

updateY was initially called in the useEffect when we were getting the coordinates of each plane based on their position in the HTML. y was set to zero in case there were no arguments being passed down. This is because we did not want to animate the plane based on the y coordinate until now.

We will once again call the updateY function inside of useFrame while also passing down the scroll.current prop as the argument. You will see the use of this argument in the bounds.current.top - y section of the calculation. The y variable allows us to move the plane up and down the y-axis based on its scroll.

## Third Goal: If everything is working properly, you should have a list of images moving downwards until there are no longer any images on the screen.

To create an infinite gallery we are going to need to know what the height of the gallery is and the direction the media components are heading towards. You will also need to know the offset of both the plane and the viewport. This is important because your DOM needs to know when your plane is leaving the viewport.

In the media file, you will need to create a new useRef variable called extra. This variable will be set to 0. The purpose of this variable is to reset the position of the plane once it leaves the viewport. Doing this will create an illusion where the images look as if they are revolving up and down the viewport infinitely.

Another important ref variable we need is the variable that gets the height of the gallery. Set this variable to 0 initially. Then in the useEffect function you must get the height of the gallery and then convert it into three.js dimensions. To obtain a height of a DOM element you can use the clientHeight property. The three.js conversion calculation should look similar to this:

galleryElement.clientHeight / size.height \* viewport.height

To do just add extra.current to the rest of the calculation

Inside of the useFrame function body create two offset variables one that holds the plane scale and another that holds the viewport width. Remember two divide both of them by two (because of cartesian rules):

planeOffset: the variable that holds the plane’s height offset. Will be used to tell the DOM when the plane’s border (whether it's the bottom or top) has left the viewport.

viewportOffset: It is essentially the same thing as the planeOffset variable but instead it holds the offset for the viewport.

Another already defined variable that is extremely important when locating where the plane is positioned is the mesh.current.position.y. This variable alongside the planeOffset will tell you where the top and bottom border is at, at all times.

Mesh.current.position.y is essentially at the center of the plane so in order to find the top and bottom position of the plane you would have to either add or subtract from the center.

The scroll.direction variable is also important when deciding what is to be done once a plane leaves the viewport. Depending on what direction your plane is heading, you would have to either subtract or add the galleryHeight to the extra variable.

Fourth Objective: Now the next step is to add the scroll event listeners to the scroll and apply the uSpeed property at the same time. To set up the event listeners we are going to use a custom hook that adds all the touch events to the canvas for us. For the sake of brevity, look inside the repo and find the hook folder that has the function and copy the file.

We are going to want to create a function that listens for a wheel scroll. Inside the home file you need to import [normalizeWheel](https://www.npmjs.com/package/normalize-wheel) from the normalize-wheel package and the useTouchEvents custom hook from the hooks folder.

Normalize-wheel has two different properties: pixelY and pixelX. Both of these properties are number values that are either negative or positive based on whether you are scrolling up or down. Because we only want the images to move based on the y axis we will only need pixelY.

Now create a function that takes in an event property and within the function body deconstruct the pixelY from normalizeWheel(event). Now increment the scroll.current.target value by pixelY.

Now outside of the is function call the useTouchEvents function. Add the function you just created as the first argument (this function takes four arguments so fill the rest of the arguments with null for now).

The scroll should work but it is not smooth. That is because although you are now able to scroll up and down, the scroll itself is fixed on scrolling down. To change this we will use a ternary operator that changes the velocity of the scroll based on your input. This will change the direction of the scroll.

Now we will add a special effect to the shader based on the scroll input.

Inside the useFrame function in the Home file we want to interpolate the speed ref that we set up eons ago.

First we need to interpolate the target then the current. Similar to how we did the scroll.

The target of the speed will be based off of the scroll properties due to how it changes speed dynamically thanks to our new input. So similar to how the lerp article create speed target value based on the scroll and give it an ease. Now use the gsap utils interpolate function for the speed.current.current value and pass down the speed’s current, target, and ease

Now make sure you pass down the speed ref into the media array and inside the Media file go inside the useFrame function and assign the speed.current to the uStrength mesh uniform value (look at how we updated the other mesh uniforms in that file as a refresher).

Fifth Objective: The last objective is to add the tap events for swiping. You will need three event listeners for this: touchDown, touchMove, touchUp.

The ref variable you will need is a binary variable that tells the DOM whether the user is touching the screen. It will initially be false at first. You will also need to add two more properties inside of the scroll ref variable: start and position.

scroll.current.start: This will store the position the user clicked on the screen. It will be the initial position.

scroll.current.position: stores the scroll.current property when the user touches the screen.

Now here is how you implement the three touch functions. Make sure each of these functions has an event argument except onTouchup

onTouchDown is notified when the user finger(s) make contact with the screen. Inside the function body you change the useRef variable to true. You then make the position property store the current scroll property. To get information for each tap the event argument has a set of properties that handles exactly that. Based on how many fingers are touching the screen the event property has either an array of touches or simply one touch. The array of touches can be called by typing event.touches and the first finger that touched the screen will be in the first index. Each item in the array has a clientY method that tells you the location of the finger tap on the screen. If the screen only had one finger touching it then to retrieve the location you can type event.clientY instead. We want the scroll.current.current to be equal to the location of the first finger that tapped the screen. To do this we must use a ternary operator because this event can either be an array or a number value.

onTouchMove will be called when the user is dragging the screen. We need to make sure that the ref variable is true and if not return. We need to create two variables for this function, one that stores the event clientY property and another that calculates the distance between that property and the scroll.current.start property (the distance will be a difference and not a sum).
Now make the scroll.current.target equal the scroll.current.position + the distance variable. Afterwards make sure the swipe changes the direction of the gallery by updating the velocity, similar to how we updated it in the onScroll function.

onTouchUp will be called when the user lets go of the screen. Simply make the ref variable false in this function.
