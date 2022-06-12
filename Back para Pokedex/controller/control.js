const axios = require("axios");
const db = require("../db/index")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const { TOKEN_SECRET } = require("../middlewares/verify")



/* Imagenes de los pokemons */

// import aron from "./img/aron.png"
// import bulbasur from "./img/bulbasaur.png"
// import butterfree from "./img/butterfree.png"
// import charmander from "./img/charmander.png"
// import ditto from "./img/ditto.png"
// import gastly from "./img/gastly.png"
// import mew from "./img/mew.png"
// import pikachu from "./img/pikachu.png"
// import squirtle from "./img/squirtle.png"

const pokemons = [
    {
        img: "aron",
        name: "Aron",
        id: "#304",
        elements: {
            element1: "Steel",
            element2: "Rock",
        },
        about: {
            weight: "60,0 kg",
            height: "0,4 m",
            moves: "Sturdy Rock-Head"
        },
        info: "It eats iron ore- and sometimes railroad tracks - to build up the steel armor that protects its body",
        baseStats: {
            hp: "050",
            atk: "070",
            def: "100",
            satk: "040",
            sdef: "040",
            spd: "030"
        }
    }
    ,
    {
        img: "bulbasur",
        name: "Bulbasaur",
        id: "#001",
        elements: {
            element1: "Grass",
            element2: "Poison",
        },
        about: {
            weight: "6,9 kg",
            height: "0,7 m",
            moves: "Chiorophyll Overgrow"
        },

        info: "There is a plant seed on its back right from the day this pokemon is born. The seed slowly grows larger",
        baseStats: {
            hp: "045",
            atk: "049",
            def: "049",
            satk: "065",
            sdef: "065",
            spd: "045"
        }
    }
    ,
    {
        img: "butterfree",
        name: "Butterfree",
        id: "#012",
        elements: {
            element1: "Bug",
            element2: "Flying",
        },
        about: {
            weight: "32,0 kg",
            height: "1,1 m",
            moves: "Compound-Eyes-Tinted-Lens"
        },
        info: "In battle, it flaps its wings at great speed to release highly toxic dust into the air",
        baseStats: {
            hp: "060",
            atk: "045",
            def: "050",
            satk: "090",
            sdef: "080",
            spd: "070"
        }
    }
    ,
    {
        img: "charmander",
        name: "Charmander",
        id: "#004",
        elements: {
            element1: "Fire",
        },
        about: {
            weight: "8,5 kg",
            height: "0,6 m",
            moves: "Mega-Punch-Fire-Punch"
        },
        info: "It has a preference for hot things. When it rains, steam is said to spout from the tip of its tail",
        baseStats: {
            hp: "039",
            atk: "052",
            def: "043",
            satk: "060",
            sdef: "050",
            spd: "065"
        }
    }
    ,
    {
        img: "ditto",
        name: "Ditto",
        id: "#132",
        elements: {
            element1: "Normal",
        },
        about: {
            weight: "4,0 kg",
            height: "0,3 m",
            moves: "Limber Imposter"
        },

        info: "It can reconstitute its entire cellular structure to change into what it sees, but it returns to normal when it relaxes",
        baseStats: {
            hp: "048",
            atk: "048",
            def: "048",
            satk: "048",
            sdef: "048",
            spd: "048"
        }
    }

    ,
    {
        img: "gastly",
        name: "Gastly",
        id: "#092",
        elements: {
            element1: "Ghost",
            element2: "Type",
        },
        about: {
            weight: "0,1 kg",
            height: "1,3 m",
            moves: "Levitate"
        },

        info: "Born from gases, anyone would falint if engulfed by its gaseous body, which contains poison",
        baseStats: {
            hp: "030",
            atk: "035",
            def: "030",
            satk: "100",
            sdef: "035",
            spd: "080"
        }
    }
    ,
    {
        img: "mew",
        name: "Mew",
        id: "#152",
        elements: {
            element1: "Psychic",
        },
        about: {
            weight: "4,0 kg",
            height: "0,4 m",
            moves: "Synchronize"
        },
        info: "When viewed throught a microscope, this pokemons short, fine, delicate hair can be seen",
        baseStats: {
            hp: "100",
            atk: "100",
            def: "100",
            satk: "100",
            sdef: "100",
            spd: "100"
        }
    }

    ,
    {
        img: "pikachu",
        name: "Pikachu",
        id: "#025",
        elements: {
            element1: "Electric",
        },
        about: {
            weight: "6,0 kg",
            height: "0,4 m",
            moves: "Mega-Punch-Pay-Day"
        },
        info: "Pikachu that can generate powerful electricity have a cheek sacs that are extra soft and super stretchy",
        baseStats: {
            hp: "035",
            atk: "055",
            def: "040",
            satk: "050",
            sdef: "050",
            spd: "090"
        }
    }

    ,
    {
        img: "squirtle",
        name: "Squirtle",
        id: "#007",
        elements: {
            element1: "Water",
        },
        about: {
            weight: "9,0 kg",
            height: "0,5 m",
            moves: "Torrent Rain-Dish"
        },
        info: "When it retracts its long neck into its shell, it squirts out water with vigorous force",
        baseStats: {
            hp: "044",
            atk: "048",
            def: "065",
            satk: "050",
            sdef: "064",
            spd: "043"
        }
    }

]

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
            // postElements, 
            // postElements2, 
            createdPokemon,
            // relPokemonElements, 
            // relPokemonElements2, 
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

        // return res.send(usuarios)
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