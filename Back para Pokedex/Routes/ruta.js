const express = require('express')
const router = express.Router();
const axios = require("axios");
const {getPokemonsApi,createPokemon,getUsers,login} = require ("../controller/control")


router.get("/", getPokemonsApi)
router.post("/", createPokemon)


router.get("/usuarios", getUsers)
router.post("/usuarios/login", login)


module.exports = router;
