exports.handler = function(event, context, callback) {
  callback(null, {
    statusCode: 200,
    body: JSON.stringify(event, null, 4) + '\n' +
      JSON.stringify(context, null, 4)
  });
}
