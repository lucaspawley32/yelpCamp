const express = require('express');
const middleware = require('../middleware');
let router = express.Router();
let Campground = require('../models/campground')
let Comment = require('../models/comment')

router.get('/', (req, res) => {
  //get all campgrounds from database
  Campground.find({}, (err, allCampgrounds) => {
    if (err) {
      console.log(err);
    } else {
      res.render("campgrounds/index", {
        campgrounds: allCampgrounds,
        currentUser: req.user
      });
    }
  });
});

router.get('/new', middleware.isLoggedIn, (req, res) => {
  res.render('campgrounds/new');
});

router.get('/:id', (req, res) => {
  //find the campground with id
  Campground.findById(req.params.id).populate("comments").exec((err, foundCampground) => {
    if (err) {
      console.log(err);
    } else {
      //render template with the camground requested
      //console.log(foundCampground);
      res.render('campgrounds/show', {
        campground: foundCampground
      });
    }
  });

});

//edit
router.get('/:id/edit', middleware.checkCampgroundOwner, (req, res) => {
  Campground.findById(req.params.id, (err, campground) => {
    if (err) {
      console.log(err);
    } else {
      //does the user own the campground?
      res.render('campgrounds/edit', {
        campground: campground
      });
    }
  });

});
//update
router.put('/:id', middleware.checkCampgroundOwner, (req, res) => {
  //find and update campgrounds
  Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, campground) => {
    if (err) {
      console.log(err)
    } else {
      res.redirect('/campgrounds/' + req.params.id)
    }
  });
});
router.delete('/:id',middleware.checkCampgroundOwner, (req, res) => {
  Campground.findByIdAndRemove(req.params.id, err => {
    res.redirect('/campgrounds')
  });
});
router.post('/', middleware.isLoggedIn, (req, res) => {
  var name = req.body.name;
  var image = req.body.image;
  var description = req.body.description;
  var author = {
    id: req.user._id,
    username: req.user.username
  }
  let newCampground = {
    name: name,
    image: image,
    description: description,
    author
  };
  //create a new campground and save to database
  Campground.create(newCampground, (err, campground) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect('/campgrounds');
    }
  });

});


module.exports = router;
