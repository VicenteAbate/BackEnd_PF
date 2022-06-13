const express = require('express')
const router = express.Router();
const axios = require("axios");
const { getPokemonsApi, getUsers, login, createPokemon, getPokeObjetTest, createPokemonForApi } = require("../controller/control");

router.get("/ArrayPokemons", getPokeObjetTest);
router.post("/ArrayPokemons", createPokemon)


router.get("/usuarios", getUsers);
router.post("/usuarios/login", login);

router.post("/pokemon/add", createPokemonForApi);
router.get("/pokemon", getPokemonsApi);

module.exports = router;