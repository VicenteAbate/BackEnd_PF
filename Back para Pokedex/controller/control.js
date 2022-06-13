const axios = require("axios");
const db = require("../db/index")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const { TOKEN_SECRET } = require("../middlewares/verify")



//select 

const getPokemonsApi = async (req, res, next) => {
    try {
        const pokemonsApiFromSql = await db.query("SELECT * FROM pokemons po INNER JOIN about ab ON po.id = ab.id INNER JOIN baseStats bs ON po.id = bs.id");
        let pokemonElement = []
        const elements = await db.query(
            `select elements.nameElements, pokemons.name_pokemon 
        from rel_pokemons_elements, elements, pokemons 
        where rel_pokemons_elements.pokemon_id = pokemons.id 
        and rel_pokemons_elements.element_id = elements.id_elements`
        )
        for (let index = 0; index < pokemonsApiFromSql.rows.length; index++) {
            let i = index
            let element1 = ""
            let element2 = ""
            while (i < elements.rows.length) {
                if (!element1 && elements.rows[i].name_pokemon == pokemonsApiFromSql.rows[index].name_pokemon) {
                    element1 = elements.rows[i].nameelements;
                    i++;
                } else if (elements.rows[i].name_pokemon == pokemonsApiFromSql.rows[index].name_pokemon) {
                    element2 = elements.rows[i].nameelements
                    i += elements.rows.length;
                } else {
                    i++
                }

            }

            pokemonElement.push(
                {

                    img: pokemonsApiFromSql.rows[index].img,
                    name: pokemonsApiFromSql.rows[index].name_pokemon,
                    id: pokemonsApiFromSql.rows[index].code,
                    elements: {
                        element1: element1,
                        element2: element2,
                    },
                    about: {
                        weight: pokemonsApiFromSql.rows[index].weight,
                        height: pokemonsApiFromSql.rows[index].height,
                        moves: pokemonsApiFromSql.rows[index].moves
                    },
                    info: pokemonsApiFromSql.rows[index].info_pokemon,
                    baseStats: {
                        hp: pokemonsApiFromSql.rows[index].hp,
                        atk: pokemonsApiFromSql.rows[index].atk,
                        def: pokemonsApiFromSql.rows[index].def,
                        satk: pokemonsApiFromSql.rows[index].satk,
                        sdef: pokemonsApiFromSql.rows[index].sdef,
                        spd: pokemonsApiFromSql.rows[index].spd
                    }
                }
            )

        }


        /* Pudimos traer los datos desde la base de datos, venian desordenados entonces creamos un form que es pokemonElement
        para darle la forma que nosotros queremos (la forma que vamos a usar es igual a el array que habiamos hecho nosotoros).
        Como ejemplo esta hecho el primer pokemon (eso es lo que esta arriba), falta hacer un FOR para conseguir todos los pokemons PERO
        usando este mismo form que usamos arriba como ejemplo. */

        return res.status(200).json({ success: true, data: pokemonElement, message: "Pokemons obtenidos" });
    } catch (error) {
        return next(error)
    }
};

// /* ESTE SERIA EL POST DE NUEVO POKEMON EN BASE DE DATOS.  */ 
const createPokemonForApi = async (req, res, next) => {
    try {
        const newPoke = req.body

        const postBaseStats = await db.query("Insert into basestats (hp,atk,def,satk,sdef,spd) values ($1,$2,$3,$4,$5,$6)", [
            newPoke.baseStats.hp, newPoke.baseStats.atk, newPoke.baseStats.def, newPoke.baseStats.satk, newPoke.baseStats.sdef, newPoke.baseStats.spd
        ]);

        const newBasestatsId = await db.query("select max(id) from basestats");

        const postAbout = await db.query("Insert into about (weight,height,moves) values ($1,$2,$3)", [
            newPoke.about.weight, newPoke.about.height, newPoke.about.moves
        ])

        const newAboutId = await db.query("select max(id) from about");

        console.log(newAboutId)

        const createdPokemon = await db.query("Insert into pokemons(code,img,name_pokemon,id_about,info_pokemon,id_basestats) values ($1,$2,$3,$4,$5,$6)", [
            newPoke.code, newPoke.img, newPoke.name_pokemon, newAboutId.rows[0].max, newPoke.info_pokemon, newBasestatsId.rows[0].max
        ]);

        const newPokemonId = await db.query("select max(id) from pokemons");
        const elementId1 = await db.query("select id_elements from elements where nameelements = $1", [
            newPoke.elements.element1
        ])

     
        const relPokemonElements = await db.query("Insert into rel_pokemons_elements(element_id,pokemon_id) values ($1, $2)", [
            elementId1.rows.id_elements, newPokemonId.rows[0].max
        ])
     
        if (newPoke.elements.element2) {
            const elementId2 = await db.query("select id_elements from elements where nameelements = $1", [
                newPoke.elements.element2
            ])
        }

        return res.status(201).json({
            succes: true,
            data: postBaseStats,
            postAbout,
            createdPokemon,
            message: "New Pokemon!"
        })
    } catch (error) {
        return next(error);
    }
};




/* Get y post pokemon que funciona con array de objetos Pokemons */

const getPokeObjetTest = (req, res, next) => {
    try {
        return res.send(pokemons);
    } catch (error) {
        return next(error);
    }
}


/* El createPokemon funciona pero solo agrega en el array de pokemons ("Pokemons.js" que usamos para pokedex de react). Falta poder agregar pokemons a la base de datos desde aca */
const createPokemon = (req, res, next) => {
    try {
        const nuevoPokemon = req.body;
        pokemons.push(req.body)
        return res.send({ success: true, data: nuevoPokemon, message: "Pokemon se agrego con exito" });
    } catch (error) {
        return next(error);
    }
}


/* GET DE USUARIOS QUE VAN A ESTAR EN LA BASE DE DATOS,
NO HAY QUE HACER UN POST DE USUARIOS. LOS USUARIOS LOS AGREGAMOS DIRECTAMENTE DESDE LA BASE DE DATOS.  */

const getUsers = async (req, res, next) => {
    try {
        const getUsersFromSql = await db.query("Select * From usuarios");
        return res.status(200).json({ success: true, data: getUsersFromSql.rows, message: "Usuarios obtenidos" });

    } catch (error) {
        return next(error)
    }
}

const login = async (req, res, next) => {
    try {
        const { mail, password } = req.body
        if (!mail || !password) {
            return res.send({
                success: false,
                data: [],
                message: "Ingrese su correo y contraseña"
            });
        };

        const user = await db.query("Select * from usuarios where mail = $1",
            [mail])

        if (user.rowCount === 0) {
            return res.send({
                success: false,
                data: [],
                message: "No se encontro el usuario"
            });
        }

        const ROUNDS = 10;

        const passwordHashed = await bcrypt.hash(user.rows[0].password, ROUNDS);

        const validPassword = await bcrypt.compare(password, passwordHashed);


        if (!validPassword) {
            return res.status(401).json({ success: false, data: [], message: "Quien sos?" })
        }

        const token = jwt.sign({
            name: user.rows[0].name,
            mail: user.rows[0].mail,
        }, TOKEN_SECRET)

        console.log(token)

        return res.status(200).json({ success: true, data: user.rows[0], message: "Exito", token })
    } catch (error) {
        return next(error)
    }
}



module.exports = { getPokemonsApi, createPokemon, getUsers, login, getPokeObjetTest, createPokemonForApi }