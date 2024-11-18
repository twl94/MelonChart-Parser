const express = require("express");
const app = express();
var cheerio = require("cheerio");
var request = require("request");
var cors = require("cors");

app.use(cors());
var url = "https://www.melon.com/chart/";

app.get("/", (req, res) => {
  var url = "http://www.melon.com/chart/";

  request(url, function (error, response, html) {
    if (!error) {
      var $ = cheerio.load(html);
      let chart_number = [];
      let chart_name = [];
      let chart_image = [];
      let chart_artist = [];

      let final = [];

      $(".rank01").each(function () {
        let name = $(this).find("span").find("a").text();
        chart_name.push(name);
      });

      $(".rank").each(function () {
        let number = $(this).text();
        chart_number.push(number);
      });

      $(".image_typeAll").each(function () {
        let img = $(this).find("img").attr("src");
        chart_image.push(img);
      });

      $(".rank02").each(function () {
        let artist = $(this)
          .find("a")
          .attr("title")
          .replace(/ - 페이지 이동/gi, "");
        chart_artist.push(artist);
      });
      for (let i = 0; i < chart_number.length; i++) {
        final.push({
          number: parseInt(chart_number[i + 1]),
          name: chart_name[i],
          artist: chart_artist[i],
          image: chart_image[i],
        });
      }
      delete final[100];

      for (let i = 0; i < final.length; i++) {
        if (final[i] == null) {
          final.splice(i, 1);
          i--;
        }
      }

      res.send(final);
    }
  });
});

app.listen(9834);
