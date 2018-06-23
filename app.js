const express = require('express');
const app = express();
const token = process.env.SLACK_TOKEN;

app.setImageService = function(svc) { this.imageService = svc; };
app.setRenderingService = function(svc) { this.renderingService = svc; };

function isEmpty(obj) {
  return Object.keys(obj).length === 0 && obj.constructor === Object;
}

app.use(express.urlencoded({extended : true}));

app.post('/api/v1/ascii/slack', (req, res) => {
  const body = req.body;
  if (isEmpty(body)) {
    return res.status(400).json({error : 'request body was empty'});
  }

  if (body.token !== token) {
    return res.status(403).json({error : 'invalid token'});
  }

  if (body.text === undefined) {
    return res.status(400).json({error : 'missing text field in request body'});
  } else if (!body.text) {
    return res.json({
      response_type : "ephemeral",
      text : "Please provide an AsciiMath formula to render"
    });
  }

  const renderingService = req.app.renderingService;
  const formula = body.text;
  const imgPromise = renderingService.render(formula);
  imgPromise
      .then(
          (result, options) => {
            base64Data = result.png.replace(/^data:image\/png;base64,/, "");
            const imgBuffer = Buffer.from(base64Data, 'base64');
            const imageStoreService = req.app.imageService;
            return imageStoreService.storeImage(imgBuffer);
          },
          err => {
            console.log(err);
            res.json({
              response_type : "ephemeral",
              text : `Unable to render the formula '${formula}'`
            });
          })
      .then(
          url => {
            res.json({
              response_type : "in_channel",
              attachments : [ {fallback : formula, image_url : url} ]
            });
          },
          err => {
            console.log(err);
            res.json({
              response_type : "ephemeral",
              text : `Unable to store the image`
            });
          });
});

module.exports = app;
