const app = require('./app');
const imgSvc = require('./s3image');
const renderSvc = require('./mjrender');
const port = process.env.PORT || 3000;

app.setRenderingService(renderSvc);
app.setImageService(imgSvc);

app.listen(port);

console.log('MathJax server listening on port %s', port);
