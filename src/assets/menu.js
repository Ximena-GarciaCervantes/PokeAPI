const URL_BASE = "https://pokeapi.co/api/v2/";

const contenedorTabla = document.getElementById("contenedor-tabla");
const tablaBody = document.getElementById("tabla-pokemon");
const txtTituloTabla = document.getElementById("txt-titulo-tabla");
const bienvenidaDashboard = document.getElementById("bienvenida-dashboard");

const btnLegendarios = document.getElementById("btn-legendarios");
const btnGeneraciones = document.getElementById("btn-generaciones");
const btnTopStats = document.getElementById("btn-top-stats");

const contenedorGeneraciones = document.getElementById("contenedor-generaciones");
const botonesGen = document.querySelectorAll(".btn-gen");

const legendariosIDs = [144, 145, 146, 150, 151, 243, 244, 245, 249, 250, 251, 377, 378, 379, 380, 381, 382, 383, 384, 385, 386];
const topStatsIDs = [242, 213, 384, 150, 487]; // Blissey (HP), Shuckle (DEF), Rayquaza, MEWTWO Y GIRATINA-ALTERED.

const rangosGeneraciones = {
    1: { inicio: 1, fin: 25 },
    2: { inicio: 152, fin: 176 },
    3: { inicio: 252, fin: 276 },
    4: { inicio: 387, fin: 411 },
    5: { inicio: 494, fin: 518 },
    6: { inicio: 650, fin: 674 },
    7: { inicio: 722, fin: 746 },
    8: { inicio: 810, fin: 834 },
    9: { inicio: 906, fin: 930 }
};

async function obtenerDatosPokemon(id) {
    const respuesta = await fetch(`${URL_BASE}/pokemon/${id}`);
    if (!respuesta.ok) throw new Error("Pokémon no encontrado");
    return await respuesta.json();
}

async function cargarTabla(listaIDs, titulo) {
    if (bienvenidaDashboard) bienvenidaDashboard.classList.add("hidden");
    contenedorTabla.classList.remove("hidden");
    txtTituloTabla.textContent = titulo;

    // Mensaje de carga
    tablaBody.innerHTML = `
        <tr>
            <td colspan="7" class="p-6 text-center text-emerald-400 animate-pulse font-mono">
                Cargando Pokémones...
            </td>
        </tr>`;

    try {
        let contenidoFilas = "";

        for (let id of listaIDs) {
            const pokemon = await obtenerDatosPokemon(id);

            let hp = 0, ataque = 0, defensa = 0;
            pokemon.stats.forEach(s => {
                if (s.stat.name === "hp") hp = s.base_stat;
                if (s.stat.name === "attack") ataque = s.base_stat;
                if (s.stat.name === "defense") defensa = s.base_stat;
            });

            let tipos = "";
            pokemon.types.forEach(item => {
                tipos += `| ${item.type.name.toUpperCase()} | `;
            });

            contenidoFilas += `
                <tr class="border-b border-zinc-800 hover:bg-zinc-900/80 transition-colors">
                    <td class="p-3 text-center text-emerald-400 font-bold border-r border-zinc-800/60">#${pokemon.id}</td>
                    <td class="p-3 text-center border-r border-zinc-800/60">
                        <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}" class="w-12 h-12 mx-auto object-contain">
                    </td>
                    <td class="p-3 text-center font-bold uppercase text-white border-r border-zinc-800/60">${pokemon.name}</td>
                    <td class="p-3 text-center text-zinc-400 font-bold text-xs border-r border-zinc-800/60">${tipos}</td>
                    <td class="p-3 text-center font-bold text-emerald-300 border-r border-zinc-800/60">${hp}</td>
                    <td class="p-3 text-center font-bold text-yellow-300 border-r border-zinc-800/60">${ataque}</td>
                    <td class="p-3 text-center font-bold text-sky-300">${defensa}</td>
                </tr>
            `;
        }

        tablaBody.innerHTML = contenidoFilas;

    } catch (error) {
        console.error("Error al cargar la tabla:", error);
        tablaBody.innerHTML = `
            <tr>
                <td colspan="7" class="p-6 text-center text-red-400 font-bold font-mono">
                    Hubo un error al consultar los datos.
                </td>
            </tr>`;
    }
}

if (btnLegendarios) {
    btnLegendarios.addEventListener("click", (e) => {
        if (e) e.preventDefault();
        contenedorGeneraciones.classList.add("hidden");
        cargarTabla(legendariosIDs, "POKÉMON LEGENDARIOS");
    });
}

if (btnGeneraciones) {
    btnGeneraciones.addEventListener("click", (e) => {
        if (e) e.preventDefault();
        contenedorGeneraciones.classList.remove("hidden");
        
        //Mostrar la tabla de la Gen 1
        const idsGen1 = Array.from({length: 25}, (_, i) => i + 1);
        cargarTabla(idsGen1, "GENERACIÓN 1 (KANTO)");
    });
}

botonesGen.forEach(boton => {
    boton.addEventListener("click", () => {
        const genSeleccionada = boton.getAttribute("data-gen");
        const rango = rangosGeneraciones[genSeleccionada];
        
        if (rango) {
            const idsGen = Array.from({length: rango.fin - rango.inicio + 1}, (_, i) => rango.inicio + i);
            cargarTabla(idsGen, `GENERACIÓN ${genSeleccionada}`);
        }
    });
});

if (btnTopStats) {
    btnTopStats.addEventListener("click", (e) => {
        if (e) e.preventDefault();
        contenedorGeneraciones.classList.add("hidden");
        cargarTabla(topStatsIDs, "TOP STATS POKÉMON");
    });
}
