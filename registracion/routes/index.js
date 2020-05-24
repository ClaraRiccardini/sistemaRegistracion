var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get("/pruebaSession", function (req, res){
  if (req.session.numeroVisitas == undefined){
    req.session.numeroVisitas = 0 }
    req.session.numeroVisitas++
  res.send("Session tiene el número " + req.session.numeroVisitas)
})

router.get("/mostrarnumerosession", function(req,res){
  res.send("Session tiene el número " + req.session.numeroVisitas)
})
module.exports = router;
