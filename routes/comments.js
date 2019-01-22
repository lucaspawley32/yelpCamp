const express = require('express');
const middleware = require('../middleware');
let router = express.Router();
let Campground = require('../models/campground')
let Comment = require('../models/comment')


router.get('/campgrounds/:id/comments/new', middleware.isLoggedIn, (req, res) => {
  //find campgrounds
  Campground.findById(req.params.id, (err, campground) => {
    if (err) {
    } else {
      res.render('comments/new', {
        campground: campground
      });
    }
  });
});

router.post('/campgrounds/:id/comments', middleware.isLoggedIn, (req, res) => {
  Campground.findById(req.params.id, (err, campground) => {
    if (err) {
      res.redirect('/campgrounds');
    } else {
      Comment.create(req.body.comment, (err, comment) => {
        if (err) {
        } else {
          //add username and id to comments
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          comment.save();
          //save comment
          campground.comments.push(comment);
          campground.save();
          res.redirect('/campgrounds/' + campground._id);
        }
      });
    }
  });
});

//edit comment

router.get('/campgrounds/:id/comments/:comment_id/edit',middleware.checkCommentOwner, (req, res) => {
  let campground_id = req.params.id;
  Comment.findById(req.params.comment_id, (err, comment) => {
    if (err) {
      res.redirect('back');
    } else {
      res.render('comments/edit', {
        campground_id: campground_id,
        comment: comment
      });
    }
  });

});
router.put('/campgrounds/:id/comments/:comment_id',middleware.checkCommentOwner, (req, res) => {
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, comment) => {
    if (err) {
      console.log('err')
      req.redirect('back');
    } else {
      res.redirect('/campgrounds/' + req.params.id);
    }
  });
});

router.delete('/campgrounds/:id/comments/:comment_id',middleware.checkCommentOwner, (req, res) => {
  Comment.findByIdAndRemove(req.params.comment_id, err => {
    if(err){
      res.redirect('back');
    }else{
      res.redirect('/campgrounds/' + req.params.id);
    }
  });
});

module.exports = router;
