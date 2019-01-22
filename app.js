const express         = require('express');
const bodyParser       = require('body-parser');
const mongoose        = require('mongoose');
const passport        = require('passport');
const localStrategy    = require('passport-local');
const methodOverride   = require('method-override')
const flash            = require('connect-flash')
let app                = express();
let Campground         = require('./models/campground');
let Comment            = require('./models/comment');
let User               = require('./models/user');
let commentRoutes      = require('./routes/comments');
let campgroundRoutes   = require('./routes/campgrounds');
let authRoutes         = require('./routes/auth');
let seed               = require('./seeds');
mongoose.connect('mongodb://localhost/yelp_camp');
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({extended: true}));
// seed();
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  //res.locals.error = req.flash("error");
//  res.locals.success = req.flash('success');
  next();
});
app.use(require('express-session')({
  secret: 'secret',
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(authRoutes);
app.use(commentRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use(flash());


app.listen(3000, () => {
  console.log("Yelpcamp Has started")
});
