const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();

const {app, runServer, closeServer} = require('../server');


chai.use(chaiHttp);

describe('Blog Post', function(){
	before(function(){
		return runServer();
	});

	after(function(){
		return closeServer();
	});

	it('Should list items on GET', function(){
		return chai.request(app)
			.get('/blogPostRouter')
			.then(function(res){
				res.should.have.status(200);
				res.should.be.json;
				res.body.should.be.a('array');

				res.body.length.should.be.at.least(1);

				const expectedKeys = ['id', 'title', 'content', 'author', 'publishDate'];
				res.body.forEach(function(item){
					item.should.be.a('object');
					item.should.include.keys(expectedKeys)
				});
			});
		});

	it("Should POST item", function(){
		
		const newItem = {
			title: 'Test Title', 
			content: 'Test content',
			author: 'Test author',
			publishDate: '1/1/18'};

		return chai.request(app)
			.post('/blogPostRouter')
			.send(newItem)
			.then(function(res){
				res.should.have.status(201);
				res.should.be.json;
				res.body.should.be.a('object');
				res.body.should.include.keys('id', 'title', 'content', 'author', 'publishDate');
				res.body.id.should.not.be.null;
				res.body.should.deep.equal(Object.assign(newItem, {id: res.body.id}));
			});
		});

	it('Should replace items on PUT', function(){
		const updateData = {
			title: 'Update Title', 
			content: 'Update content',
			author: 'Update author',
			publishDate: '1/1/19'
		};
		return chai.request(app)
			.get('/blogPostRouter')
			.then(function(res){
				updateData.id = res.body[0].id;

				return chai.request(app)
					.put(`/blogPostRouter/${updateData.id}`)
					.send(updateData)
			})
			.then(function(res){
				res.should.have.status(204);
			});
		});

	it('Should delete item on DELETE', function(){
		return chai.request(app)
			.get('/blogPostRouter')
			.then(function(res){
				return chai.request(app)
					.delete(`/blogPostRouter/${res.body[0].id}`);
			})
			.then(function(res){
				res.should.have.status(204);
			});
	});
})