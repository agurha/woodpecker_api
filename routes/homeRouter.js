/**
 * Created with JetBrains WebStorm.
 * User: agurha
 * Date: 08/03/2013
 * Time: 08:54
 * To change this template use File | Settings | File Templates.
 */

exports.index = function(req, res) {
  var body;
  body = 'Welcome to API Server';

  res.writeHead(200, {
    'Content-Length': Buffer.byteLength(body),
    'Content-Type': 'text/plain'
  });
  res.write(body);
  return res.end();

};
