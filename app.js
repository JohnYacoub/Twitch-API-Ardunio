require('dotenv').config();
const createError = require('http-errors');
const express = require('express');
const logger = require('morgan');
const helmet = require("helmet");
const cors = require('cors')
const verifyTwitchSignature = require("./middlewares/verifyTwitchSignature");
const indexRouter = require('./routes/index');
const twitchRoutes = require("./routes/twitch.eventSub.routes")
const {
  Board,
} = require("johnny-five");
const app = express();

app.use(helmet());
app.use(
  helmet.referrerPolicy({
    policy: "no-referrer",
  })
  );
  app.use(logger('dev'));
  app.use(express.urlencoded({ extended: false }));
  
  app.use(cors({origin:true,credentials:true}))


app.use(express.json({
  verify: verifyTwitchSignature
}));
app.use('/', indexRouter);
app.use('/twitch', twitchRoutes);

// catch 404 and forward to error handler
app.use((req, res, next)=> {
  next(createError(404));
});

let board = new Board();
board.on("ready", () => {

  console.log("Board is activated")
});

// error handler
app.use((err, req, res, next) =>{
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send('error');
});

module.exports = app;
