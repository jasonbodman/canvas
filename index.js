//createCanvas is the function that creates the canvas object
//loadImage is the function that loads an image
const { createCanvas, loadImage } = require("canvas");

//get the express library
const express = require("express");

//the web server
const app = express();

//the port that the server will listen on
//use the process environment variable PORT
//and if PORT is undefined, use 8081
const port = process.env.PORT || 8081;

const makeMeme = async ({
    //the text to put on the image
    url,
		x,
		y,
		size,
    fname,
    lname
  }) => {
    //if there's no image to work with
    //don't try anything
    
    const input = fname + ' ' + lname;
    const canvas = createCanvas(200, 200);
    const context = canvas.getContext("2d");
  
    const fontSetting = "bold " + size + "px sans-serif";
    context.font = fontSetting;
  
    //loadImage is a function from node-canvas that loads an image
    const image = await loadImage(url);
  
    //set the canvas to the same size as the image
    canvas.width = image.width;
    canvas.height = image.height;
  
    //changing the canvas size resets the font
    //so use the fontSetting again
    context.font = fontSetting;
  
    //put the image into the canvas first
    //x: 0, y: 0 is the upper left corner
    context.drawImage(image, 0, 0);
  
    //set the color to white
    context.fillStyle = "white";
    //draw the text in white
    //x uses the value we calculated to center the text
    //y is 30 pixels above the bottom of the image
    context.fillText(input, x, y);
  
    //set the color to black
    context.fillStyle = "black";
    //draw the outline in black
    context.strokeText(input, x, y);
  
    //return the buffer
    return canvas.toBuffer();
  };

//ROUTES
//this is a 'route'
//it defines the response to an http 'get' request
app.get("/", (req, res) =>
  //this response will display text in the browser
  res.send("You have reached Shifty Images")
);

app.get("/campaigns/:job/:x/:y/:size/:name", async (req, res) => {
	const job = req?.params?.job
	const name = req?.params?.name
	const x = req?.params?.x
	const y = req?.params?.y
	const size = req?.params?.size
	
	const fname = req.query.mm_firstName
	const lname = req.query.mm_lastName
	
	const url="https://quacks.web-mm.com/grabs/"+job+"/"+name;
 	const finalImage = await makeMeme({ url, x, y, size, fname, lname })
 	const headers = { "Content-Type": "image/png" }
 	res.writeHead(200, headers);
 	res.end(finalImage);
})

//start the web server listening
app.listen(port, () => {
  console.log(`Meme Maker listening at on port ${port}`);
});
