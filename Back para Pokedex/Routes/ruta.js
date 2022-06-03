const express = require('express')
const router = express.Router();
const axios = require("axios");
const { getPokemonsApi, getUsers, login, createPokemon, getPokeObjetTest } = require("../controller/control")


router.get("/", getPokemonsApi)


router.get("/ArrayPokemons", getPokeObjetTest);
router.post("/ArrayPokemons", createPokemon)


router.get("/usuarios", getUsers)
router.post("/usuarios/login", login)


module.exports = router;