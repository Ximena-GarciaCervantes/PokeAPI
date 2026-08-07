const URL_BASE = "https://pokeapi.co/api/v2/";

const inputPokemon = document.getElementById("input-pokemon");

const nombrePokemon = document.getElementById("nombre-pokemon");
const imagenPokemon = document.getElementById("imagen-pokemon");
const idPokemon = document.getElementById("id-pokemon");
const tipoPokemon = document.getElementById("tipos-pokemon");

const alturaPokemon = document.getElementById("altura-pokemon");
const pesoPokemon = document.getElementById("peso-pokemon");

const vidaPokemon = document.getElementById("hp-val");
const ataquePokemon = document.getElementById("atk-val");
const defensaPokemon = document.getElementById("def-val");

const hpBar = document.getElementById("hp-bar");
const ataqueBar = document.getElementById("ataque-bar");
const defensaBar = document.getElementById("defensa-bar");

const botonBorrar = document.getElementById("btn-borrar");

function realizarBusqueda() {
    const valorBusqueda = inputPokemon.value.trim();
    if (valorBusqueda !== "") {
        obtenerPokemon(valorBusqueda);
    }
}

inputPokemon.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        realizarBusqueda();
    } 
});

async function obtenerPokemon(pokemon){
    try {
        const respuesta = await fetch(`${URL_BASE}/pokemon/${pokemon.toLowerCase()}`);
        if (!respuesta.ok) throw new Error("Pokémon no encontrado...");
    
        const datosPokemon = await respuesta.json();
        
        nombrePokemon.textContent = datosPokemon.name.toUpperCase();
        idPokemon.textContent = `#${datosPokemon.id}`;
        
        imagenPokemon.src = datosPokemon.sprites.front_default;
        imagenPokemon.alt = `Imagen del Pokémon ${datosPokemon.name}`;
        
        let tipos = "";
        datosPokemon.types.forEach(item => {
            tipos += `| ${item.type.name.toUpperCase()} | `; 
        });
        tipoPokemon.textContent = tipos;
        
        alturaPokemon.textContent = `${(datosPokemon.height / 10)} m`;
        pesoPokemon.textContent = `${(datosPokemon.weight / 10)} kg`; 

        let estadisticas = {};
        datosPokemon.stats.forEach(s => {
            estadisticas[s.stat.name] = s.base_stat;
        });
        
        const hp = estadisticas["hp"] || 0;
        const ataque = estadisticas["attack"] || 0;
        const defensa = estadisticas["defense"] || 0;
         
        vidaPokemon.textContent = hp;
        ataquePokemon.textContent = ataque;
        defensaPokemon.textContent = defensa;

        hpBar.style.width = `${Math.min((hp / 300) * 100, 100)}%`;
        ataqueBar.style.width = `${Math.min((ataque / 300) * 100, 100)}%`;
        defensaBar.style.width = `${Math.min((defensa / 300) * 100, 100)}%`;

    } catch(error) {
        console.error("Error: ", error.message);
        limpiarPokedex();
        nombrePokemon.textContent = `NO ENCONTRADO`;
    }
}

function limpiarPokedex() {
    inputPokemon.value = "";
    nombrePokemon.textContent = "--";
    idPokemon.textContent = "#000";
    imagenPokemon.src = "";
    imagenPokemon.alt = "";
    tipoPokemon.textContent = "";
    
    alturaPokemon.textContent = "--";
    pesoPokemon.textContent = "--";
    
    vidaPokemon.textContent = "--";
    ataquePokemon.textContent = "--";
    defensaPokemon.textContent = "--";
    
    hpBar.style.width = "0%";
    ataqueBar.style.width = "0%";
    defensaBar.style.width = "0%";
}

if (botonBorrar) {
    botonBorrar.addEventListener("click", limpiarPokedex);
}
