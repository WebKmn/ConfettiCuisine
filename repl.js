"use strict";

const mongoose = require("mongoose"),
  Subscriber = require("./models/subscriber"),
  Course = require("./models/course"),
  User = require("./models/user");
mongoose.connect(
  "mongodb://localhost:27017/confetti_cuisine",
  { useNewUrlParser: true }
);
mongoose.Promise = global.Promise;
var testCourse, testSubscriber;
Subscriber.remove({})
  .then(items => console.log(`Removed ${items.n} records!`))
  .then(() => {
    return Course.remove({});
  })
  .then(items => console.log(`Removed ${items.n} records!`))
  .then(() => {
    return User.remove({});
  })
  .then(items => console.log(`Removed ${items.n} records!`))
  .then(() => {
    return Subscriber.create({
      name: "Jon",
      email: "jon@jonwexler.com",
      zipCode: "12345"
    });
  })
  .then(subscriber => {
    console.log(`Created Subscriber: ${subscriber.getInfo()}`);
  })
  .then(() => {
    return Subscriber.findOne({
      name: "Jon"
    });
  })
  .then(subscriber => {
    testSubscriber = subscriber;
    console.log(`Found one subscriber: ${subscriber.getInfo()}`);
  })
  .then(() => {
    return Course.create({
      title: "Mochi IceCream",
      description: "Learn how to make the best Mochi ice cream in town!",
      maxStudents: 20,
      cost: 200
    });
  })
  .then(course => {
    console.log(`Created course: ${course.title}`);
    testCourse = course;
    console.log("test:" + testCourse)
  })
  .then(() => {
    testSubscriber.courses.push(testCourse);
    testSubscriber.save();
    
  })
  .then(() => {
    Subscriber.populate(testSubscriber, "courses");
  })
  .then(() => console.log(testSubscriber))
  .then(() => {
    return Subscriber.find({
      courses: mongoose.Types.ObjectId(testCourse._id)
    });
  })
  .then( () => {
    return User.create({
      name: {
        first: "Jon",
        last: "Wexler"
      },
      email: "jon@jonwexler.com",
      password: "pass123",
      zipCode: 12345
    })

  })
  .then(user => {
    user.subscribedAccount = testSubscriber;
    user.courses.push(testCourse);
    user.save().then(user => console.log("User info:" + user));
  })
  .catch(error => console.log(error.message));
  
