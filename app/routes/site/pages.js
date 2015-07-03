var express = require('express'),
    pageRouter = express.Router(),
    request = require('request'),
    Pokemon = require('../../../pokemon-v1.json');

pageRouter.route('/').get(function (req, res) {
  res.render('index', {layout: 'main-template'});    
});

pageRouter.route('/pokemon').get(function (req, res) {
  res.redirect('/pokemon/1');
});

pageRouter.route('/pokemon/:name_or_id').get(function (req, res) {
  var url = 'http://okaymon.mybluemix.net/api/pokemon/' + req.params.name_or_id;
  
  request(url, function (error, response, body) {
    var _body = JSON.parse(body);
    var url = 'http://okaymon.mybluemix.net/api/pokemon/';

    function nextPokemonUrl(pokemonBody) {
      var id = pokemonBody[0].national_id;
      var site_url = 'http://okaymon.mybluemix.net/pokemon/';
      if (id === 718) {
        return null;
      } else {
        return site_url + (id + 1);
      }
    };

    function nextPokemonName(pokemonBody) {
      var id = pokemonBody[0].national_id;
      return Pokemon[id].name;
    }

    _body[0].next_pokemon = { 
      name: nextPokemonName(_body),
      url: nextPokemonUrl(_body)
    };

    console.log(_body);

    res.render('pokemon', { 
      layout: 'pokemon-template', 
      pokemon: _body
    });
  });
});

module.exports = pageRouter;