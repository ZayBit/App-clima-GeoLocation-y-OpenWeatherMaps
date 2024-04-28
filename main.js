require('dotenv').config()

const { leerInput, inquirerMenu, pausa, listarLugares } = require("./helpers/inquirer");
const Busquedas = require("./models/busquedas");

const main = async () =>{
    let opt = null;

    const busquedas = new Busquedas()

    do {
        opt = await inquirerMenu()

        switch( opt ){
            case 1:
                // mostrar mensaje
                const termino = await leerInput('Ciudad: ')
                // buscar los lugares
                const lugares = await busquedas.ciudad( termino )
                // seleccionar el lugar
                const id = await listarLugares(lugares)

                if(id === '0') continue
                const { nombre, lat, lng, direccion } = lugares.find(lugar=> lugar.id === id) || {}

                // guardar en db
                busquedas.agregarHistorial( `${nombre} - ${direccion}` )
                
                // datos del clima
                let clima = await busquedas.climaLugar(lat, lng)
                const { desc, temp, min, max } = clima || {}
                // mostrar resultados
                console.log('\nInformacion de la ciudad'.green);
                console.log(`Ciudad: ${nombre} - ${direccion}`);
                console.log(`Lat: ${lat}`);
                console.log(`Lng: ${lng}`);
                console.log('Temperatura: ',temp);
                console.log('Minima: ',min);
                console.log('Maxima: ',max);
                console.log('Pronostico: ',desc);
                break;
            case 2:
                busquedas.historialCapitalizado.forEach( ( lugar, index ) =>{
                    const idx = `${index+1}.`.green
                    console.log(`${idx} ${lugar}`);
                })
                break;
        }

        if(opt !== 0) await pausa()
    } while (opt !== 0);

}

main()