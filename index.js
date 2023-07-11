require('dotenv').config();

const Busquedas = require('./models/busquedas');
const {inquirerMenu, pausa, leerInput, listarLugares} = require('./helpers/inquirer');


const main = async() =>{
   
    const busquedas = new Busquedas();
    let opt;

    do{

        opt = await inquirerMenu();

        switch(opt){

            case 1:
                //mostrar mensajes
                const terminoDeBusqueda = await leerInput('ciudad:');

                //buscar los lugares
                const lugares = await busquedas.ciudad(terminoDeBusqueda);
                
                //seleccionar el lugar
                const idSeleccionado = await listarLugares(lugares);
                if(idSeleccionado === '0') continue;

                
                const lugarSel = lugares.find(l => l.id === idSeleccionado);

                //guardar en db
                busquedas.agregarHistorial(lugarSel.nombre);

                //clima
                const climaLugarSel = await busquedas.climaLugar(lugarSel.lat, lugarSel.lng);
        
                //Mostrar resultados
                console.clear();
                console.log('\n Informacion de la ciudad\n'.green);
                console.log('Ciudad:', lugarSel.nombre.green);
                console.log('Lat:', lugarSel.lat );
                console.log('Lng:', lugarSel.lng);
                console.log('Temperatura:',climaLugarSel.temp );
                console.log('Minima:',climaLugarSel.min );
                console.log('Maxima:',climaLugarSel.max );
                console.log('Descripcion del Clima:',climaLugarSel.desc.green );
            break;    

            case 2:
                
            busquedas.historialCapitalizado.forEach((lugar, i) =>{
                const idx = `${i + 1}.`.green;
                console.log(`${idx} ${lugar}`);

            })

            break;
        }

       if(opt !== 0){
           await pausa();
        }

    }while(opt !== 0 )
}

main();