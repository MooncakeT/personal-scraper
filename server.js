const express = require('express');
const app = express();
const cors = require('cors');
const Nightmare = require('nightmare');

const port = 3000;

app.use(cors());

// first endpoint - already built
app.get('/', (req, res) => {
  res.send("This is my personal web scraper!");
});

// scraper endpoint
app.get('/dragon/:keyword', (req, res) => {
  var keyword = req.params.keyword;

//define function to find dragon pictures
  function findDragonImage(keyword) { //defines function to find dragon pictures
    var nightmare = Nightmare({show: true}); //creates bot & shows it searching or not

    return nightmare
      .goto('https://www.google.com') //goes to google
      .insert('input[title="Search"]', `dragon ${keyword}`) //puts the search term (dragon + keyword) into the search box
      .click('input[value="Google Search"]') //clicks the seach button to search for term
      .wait('a.q.qs') //waits for the link to appear
      .click('a.q.qs') //clicks the "images" link
      .wait('div#res.med') //waits for div to appear (container for images)
      .evaluate(function() { //gets images from google & sends back their sources
        var photoDivs = document.querySelectorAll('img.rg_ic');
        var list = [].slice.call(photoDivs); //creates a list for photos

        return list.map(function(div) {
          return div.src; //bot give collection of image links
        });
      })
      .end() //doing something new
      .then(function (result) {
        return result.slice(1, 7); //cuts down # of images found to 6
      })
      .then(function (images) {
        res.json(images); //gives back images to user
      })
      .catch(function (error) {
        console.error('Search failed:', error); //what to do if theres a failure
      });
  }

  findDragonImage(keyword); //actually performs the function
});


app.listen(port, () => {
  console.log(`app running on ${port}`);
});
