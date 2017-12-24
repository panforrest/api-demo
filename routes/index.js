// Full Documentation - https://www.turbo360.co/docs
const turbo = require('turbo360')({site_id: process.env.TURBO_APP_ID})
const vertex = require('vertex360')({site_id: process.env.TURBO_APP_ID})
const router = vertex.router()

/*  This is the home route. It renders the index.mustache page from the views directory.
	Data is rendered using the Mustache templating engine. For more
	information, view here: https://mustache.github.io/#demo */
router.get('/', function(req, res){

	var data = {
        text: 'Hello from WeWork!',
        firstName: 'Forrest',
        lastName: 'Pan'

	}
	res.render('index', data)
})

router.get('/:page', function(req, res){
	var page = req.params.page
	var user = req.query.user

	if (user == null){
		res.json({
			confirmation: 'fail',
			message: 'please enter a user query parameter!'
		})
		return
	}

    if (page == 'instagram') {
    	var data = {
    		user: user
    	}
    	res.render('instagram', data)
    	return
    }

	res.json({
		confirmation: 'success',
		page: page
	})
})

module.exports = router
