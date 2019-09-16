var createError = require('http-errors');
var express = require('express');
var cors = require('cors');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var mongoSanitize = require('express-mongo-sanitize');
var graphqlHttp = require('express-graphql');
var socketio = require('socket.io');

var databaseConfig = require('./databaseconfig');
var graphQlSchema = require('./graphql/schema/index');
var graphQlResolvers = require('./graphql/resolvers/index');
var jwtUtil = require('./auth/jwtUtil');

var usersRouter = require('./controllers/userRouter');
var mediaRouter = require('./controllers/mediaRouter');
var commentsRouter = require('./controllers/commentRouter');
var postsRouter = require('./controllers/postRouter');
var likesRouter = require('./controllers/likeRouter');
var searchRouter = require('./controllers/searchRouter');
var notificationRouter = require('./controllers/notificationRouter');

var app = express();
app.use(cors());
var port = process.env.PORT || 3001;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


app.use(logger('dev'));
app.use(cookieParser());
app.use(mongoSanitize());
app.use(bodyParser.json())


app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
  next();
});

app.use(express.static(path.join(__dirname, 'public')));

app.use('/users', usersRouter);
app.use('/media', mediaRouter);
app.use('/comments', commentsRouter);
app.use('/posts', postsRouter);
app.use('/likes', likesRouter);
app.use('/search', searchRouter);
app.use('/notifications', notificationRouter);
/* DEFINE ROUTE FOR GRAPHSQL
app.use('/graphql', jwtUtil.isLogged);
app.use(
  graphqlHttp({
    schema: graphQlSchema,
    rootValue: graphQlResolvers,
    graphiql: true
  })
);*/


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.send(err);
  //save errors to loger
  console.log(err);

});

//connect to mongoose
mongoose.connect(databaseConfig.mongoDbUrl, { keepAlive: 300000, connectTimeoutMS: 30000, useNewUrlParser: true });
var conn = mongoose.connection;
conn.on('error', console.error.bind(console, 'connection error:'));

htpServer = require('http').createServer(app);

/*SOCKETS LADIES AND GENTLMEN */
var websocket = socketio(htpServer);
websocket.on('connection', client => {

});
//set socket io so routes can access it 
app.set('socketio', websocket);

htpServer.listen(port);
module.htpServer = htpServer;
