const express = require('express')
const axios = require("axios");
const pokeRoutes = require("../Back para Pokedex/Routes/ruta");
const app = express()
const cors = require("cors")

const PORT = 3000

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors())

app.use("/pkmn", pokeRoutes)




app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
