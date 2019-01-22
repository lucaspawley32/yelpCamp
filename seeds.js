const mongoose = require('mongoose');
let Campground = require('./models/campground');
let Comment = require('./models/comment');
var data = [{
    name: "Clouds Rest",
    image: "https://pixabay.com/get/eb30b00d21f0053ed1584d05fb1d4e97e07ee3d21cac104496f5c07da1edb7b8_340.jpg",
    description: "blah blah blah"
  },
  {
    name: "Glacier Mountain",
    image: "https://pixabay.com/get/ea31b10929f7063ed1584d05fb1d4e97e07ee3d21cac104496f5c07da1edb7b8_340.jpg",
    description: "blah blah blah"
  },
  {
    name: "calm lake",
    image: "https://pixabay.com/get/eb3cb60b28f1013ed1584d05fb1d4e97e07ee3d21cac104496f5c07da1edb7b8_340.jpg",
    description: "blah blah blah"
  },
]

function seedDB() {

  //REMOVE ALL CAMPGROUDNS

  Campground.remove({}, (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log("ALL CAMPGROUNDS REMOVED");
        data.forEach(seed => {
            Campground.create(seed, (err, data) => {
              if (err) {
                console.log(err);
              } else {
                console.log('new campground');
                Comment.create({
                  text: "this is a comment",
                  author: "homer"
                }, (err, comment) => {
                  if (err) {
                    console.log(err);
                  } else {
                    data.comments.push(comment);
                    data.save()
                    console.log('new comment');
                  }
                });
              }
            });
          });
        }
        });
  }


  module.exports = seedDB;
