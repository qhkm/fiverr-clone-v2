const router = require('express').Router();
const Gig = require('../models/gig');
const User = require('../models/user');
const Promocode = require('../models/promocode');
const async = require('async');

const algoliasearch = require('algoliasearch')
var client = algoliasearch('B208GQV2JF', '9f799c2601799fed175ca3b4bd9bb598');
var index = client.initIndex('GigSchema');

//GET request to /
router.get('/', (req, res, next) => {
    Gig
        .find({}, function (err, gigs) {
            res.render('main/home', {gigs: gigs})
        })
});

router
    .route('/search')
    .get((req, res) => {
        if (req.query.q) {
            index
                .search(req.query.q, function (err, content) {
                    res.render('main/search_results', {
                        content: content,
                        search_result: req.query.q
                    });
                })
        }
    })
    .post((req, res) => {
        res.redirect('/search/?q=' + req.body.search_input)
    })

//GET request to /gigs
router.get('/gigs', (req, res) => {
    Gig
        .find({
            owner: req.user._id
        }, function (err, gigs) {
            res.render('main/gigs', {gigs: gigs})
        })
});

//Handle GET and POST request to /add-new-gig
router
    .route('/add-new-gig')
    .get((req, res) => {
        res.render('main/add-new-gig');
    })
    .post((req, res) => {
        async.waterfall([function (callback) {
                let gig = new Gig();
                gig.owner = req.user._id;
                gig.title = req.body.gig_title;
                gig.category = req.body.gig_category;
                gig.about = req.body.gig_about;
                gig.price = req.body.gig_price;
                gig.save(function (err, gig) {
                    User
                        .update({
                            _id: req.user._id
                        }, {
                            $push: {
                                gigs: gig._id
                            }
                        }, function (err, count) {
                            res.redirect('/gigs');
                        })
                });
            }
        ]);
    });

//Handle single gig req
router.get('/service_detail/:id', (req, res, next) => {
    Gig
        .findOne({ _id: req.params.id })
        .populate('owner')
        .exec(function (err, gig) {
            res.render('main/service_detail', {gig: gig});
        })
})

//Handle Promo code API
router.get('/api/add-promocode', (req, res) => {
    var promocode = new Promocode();
    promocode.name = "testcoupon";
    promocode.discount = 0.4;
    promocode.save(function (err) {
        res.json("Successfull")
    })
})

//Handle Post promocode API
router.post('/promocode', (req, res) => {
    var promocode = req.body.promocode;
    var totalPrice = req.session.price;
    Promocode.findOne({
        name: promocode
    }, function (err, foundCode) {
        if (foundCode) {
            var newPrice = foundCode.discount * totalPrice;
            newPrice = totalPrice - newPrice;
            req.session.price = newPrice;
            res.json(newPrice);
        } else {
            res.json(0)
        }
    });
});

module.exports = router;
