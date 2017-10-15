const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {BlogPosts} = require("./models");

BlogPosts.create(
	"Today I Ate Apple Pie",
    "It was delightful",
    "Ian McDermott",
    "8/5/17"
    );

BlogPosts.create(
	'Today I Ate Pecan Pie',
    "It was pleasant",
    "Ian McDermott",
    "8/7/17"
    );

BlogPosts.create(
	"Today I Ate Blueberry Pie",
    "Top Notch!",
    "Ian McDermott",
    "9/2/17"
    );

router.get('/', (req, res)=>{
	res.json(BlogPosts.get());
});

router.put("/:id", jsonParser, (req, res)=>{
	const requiredFields = ["title","content","author","publishDate"];
	for(let i = 0; i < requiredFields.length; i++){
		const field = requiredFields[i];
		if(!(field in req.body)){
			const message = `Missing\`${field}\`in request body`;
			console.log(message);
			return res.status("400").send(message);
		}
	}
	if(req.params.id !== req.body.id){
		const message = `Request path id\`${req.params.id}\` and request body id \`${req.body.id}\` must match`;
		console.log(message);
		return res.status(400).send(message);
	}
	console.log(`Updating Blog Post \`${req.params.id}\``);
	
	const updatedPost = BlogPosts.update({
		id: req.params.id,
		title: req.body.title,
    	content: req.body.content,
    	author: req.body.author,
    	publishDate: req.body.publishDate 
	});
	res.status(204).end();
})

router.delete("/:id", (req, res)=>{
	BlogPosts.delete(req.params.id);
	console.log(`Deleted Blog Post \`${req.params.id}\``);
	res.status(204).end();
})

router.post("/", jsonParser, (req, res)=>{
	const requiredFields = ["title","content","author","date"];
	for(let i = 0; i < requiredFields.length; i++){
		const field = requiredFields[i];
		if(!(field !== req.body)){
			const message = `Missing \`${field}\` in request body`;
			console.log(message);
			return res.status(400).send(message);
		}
		
	}
	const item = BlogPosts.create(
		req.body.title, 
		req.body.content, 
		req.body.author, 
		req.body.publishDate 
	);

	res.status(201).json(item);
})

module.exports = router;