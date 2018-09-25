
/* Dependencies */
var mongoose = require('mongoose'), 
    Listing = require('../models/listings.server.model.js');

/*
  In this file, you should use Mongoose queries in order to retrieve/add/remove/update listings.
  On an error you should send a 404 status code, as well as the error message. 
  On success (aka no error), you should send the listing(s) as JSON in the response.

  HINT: if you are struggling with implementing these functions, refer back to this tutorial 
  from assignment 3 https://scotch.io/tutorials/using-mongoosejs-in-node-js-and-mongodb-applications
 */

/* Create a listing */
exports.create = function(req, res) {

  /* Instantiate a Listing */
  var listing = new Listing(req.body);


  /* Then save the listing */
  listing.save(function(err) {
    if(err) {
      console.log(err);
      res.status(400).send(err);
    } else {
      res.json(listing);
    }
  });
};

/* Show the current listing */
exports.read = function(req, res) {
  /* send back the listing as json from the request */
  res.json(req.listing);
};

/* Update a listing */
exports.update = function(req, res) {
  var listing = req.listing;
  listing.name = req.body.name;
  listing.code = req.body.code;
  listing.address = req.body.address;
  if (req.body.lng && req.body.lat) {
    listing.longitude = req.body.lng;
    listing.latitude = req.body.lat;
  }

  listing.save(function(err) {
    if(err) {
      console.log(err);
      res.status(400).send(err);
    } else {
      res.json(listing);
    }
  });
};

/* Delete a listing */
exports.delete = function(req, res) {
  var listing = req.listing;
  Listing.findOneAndRemove({code: listing.code}, function(err, docs) {
    if (err) {
      console.log(err);
      res.status(400).send(err);
    }
    res.status(200).send(docs);
  });
  /*
  listing.remove(function(err) {
    if (err) {
      console.log(err);
      res.status(400).send(err);
    }
  });
  */
};

/* Retreive all the directory listings, sorted alphabetically by listing code */
exports.list = function(req, res) {
  Listing.find({}, function(err, docs) {
    if (err) {
      console.log(err);
      res.status(400).send(err);
    }
    docs.sort(function(a, b) {
      var x = a.code.toLowerCase();
      var y = b.code.toLowerCase();
      if (x < y) {return -1;}
      if (x > y) {return 1;}
      return 0;
    });
    res.status(200).send(docs);
  });
};

/* 
  Middleware: find a listing by its ID, then pass it to the next request handler. 

  Find the listing using a mongoose query, 
        bind it to the request object as the property 'listing', 
        then finally call next
 */
exports.listingByID = function(req, res, next, id) {
  Listing.findById(id).exec(function(err, listing) {
    if(err) {
      res.status(400).send(err);
    } else {
      req.listing = listing;
      next();
    }
  });
};
