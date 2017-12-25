// Full Documentation - https://www.turbo360.co/docs
const turbo = require('turbo360')({site_id: process.env.TURBO_APP_ID})
const vertex = require('vertex360')({site_id: process.env.TURBO_APP_ID})
const router = vertex.router()
const superagent = require('superagent')

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

    //foursquare query string is "http://localhost:3000/foursquare?near=chicago&query=bagels"

    if (page == 'foursquare'){
        if (req.query.near == null) {
            res.json({
                confirmation: 'fail',
                message: 'Missing near parameter'
            })
            return
        }

        if (req.query.query == null) {
            res.json({
                confirmation: 'fail',
                message: 'Missing query parameter'
            })
            return
        }
   
        const endpoint = 'https://api.foursquare.com/v2/venues/search'

        const query = {
            v: '20140806',
            near: req.query.near,
            query: req.query.query,
            client_id: 'VZZ1EUDOT0JYITGFDKVVMCLYHB3NURAYK3OHB5SK5N453NFD',
            client_secret: 'UAA15MIFIWVKZQRH22KPSYVWREIF2EMMH0GQ0ZKIQZC322NZ'
        }

        superagent.get(endpoint)
        .query(query)
        .set('Accept', 'application/json')
        .end((err, response) => {
            if (err) {
                res.json({
                    confirmation: 'fail',
                    message: err.message
                })

                return
            }

            const data = response.body
            // const results = data.response.venues

            let results = []
            data.response.venues.forEach((venue, i) => {
                results.push({
                    naem: venue.name,
                    url: venue.url
                })
            })

            res.json({
                results: results
            })
        })

        // res.render('foursquare', null)
        return
    }

    if (page == 'instagram') {

        if (user == null){
            res.json({
                confirmation: 'fail',
                message: 'please enter a user query parameter!'
            })
            return
        }

        //make API call to: https://www.instagram.com/14streety/?__a=1 

        superagent.get('https://www.instagram.com/'+user+'/?__a=1')
        .query(null)
        .set('Accept', 'application/json')
        .end((err, response) => {
        	if (err){
        		res.json({
        			confirmation: 'fail',
        			message: err.message
        		})
        		return
        	}
            
            const data = response.body || response.text
            // const feed = data.user.media.nodes
            let feed = []
            data.user.media.nodes.forEach((post, i) => {
                // const p = {
                // 	image: post['thumbnail_src'],
                // 	caption: post['caption']
                // }
                feed.push({
                	// image: post['thumbnail_src'],
                	// caption: post['caption']
                	image: post.thumbnail_src,
                	caption: post.caption
                })
            })

            // res.json({
            // 	feed: feed
            // })

            res.render('instagram', {feed: feed})

            return

        })

    	// var data = {
    	// 	user: user
    	// }
    	// res.render('instagram', data)
    	return
    }

	res.json({
		confirmation: 'success',
		page: page
	})
})

module.exports = router
