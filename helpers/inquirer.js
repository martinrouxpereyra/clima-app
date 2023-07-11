require('colors');

const inquirer = require('inquirer');

////////////////////////////////////////////////////////////////
//Genera las preguntas
////////////////////////////////////////////////////////////////
const preguntas = [
    {
        type: 'list',
        name:'opcion',
        message: '¿que desea hacer?',
        choices: [
            {
                value: 1,
                name: `${'1.'.green} Buscar ciudad`
            },
            {
                value: 2,
                name: `${'2.'.green} historial`
            },
            {
                value: 0,
                name: `${'0.'.green} Salir`
            }
            
        ]
    }
];
////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////
//Muestra el Menu y espera que se seleccione una de las preguntas
////////////////////////////////////////////////////////////////
const inquirerMenu = async() =>{

    console.clear();
    
    console.log('======================='.green);
    console.log(' seleccione una opcion'.white)
    console.log('=======================\n'.green);

   const { opcion } = await inquirer.prompt(preguntas);

   return opcion;
}
////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////
//pausa el proceso hasta que el usuario de enter
////////////////////////////////////////////////////////////////
const pausa = async() =>{

    const question = [
        {
            type:'input',
            name:'enter',
            message:`presione ${'enter'.green} para continuar`
        }
    ];

    console.log('\n');
    await inquirer.prompt(question);
   
}
////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////
//antes de crear una tarea lee el input, valida que la desc no sea vacia y la retorna 
////////////////////////////////////////////////////////////////
const leerInput = async(message) =>{

    const question = [
        {
            type:'input',
            name: 'desc',
            message,
            validate(value){
                if(value.length === 0){
                    return 'Por favor ingrese un valor';
                }
                return true;
            }
        }
    ];

    const {desc} = await inquirer.prompt(question);
    return desc;
}
////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////
//genera una lista con todos los lugares seleccionados
////////////////////////////////////////////////////////////////
const listarLugares = async(lugares = []) =>{

    const choices = lugares.map((lugar, i ) => {
        
        const idx = `${i + 1}`.green + `${'.'.green}`;

        return {
            value: lugar.id,
            name: `${idx} ${lugar.nombre}`
        }
    });

    choices.unshift({
        value:'0',
        name:'0.'.green + 'Cancelar'
    });

    const preguntas = [
        {
            type: 'list',
            name: 'id',
            message:'Seleccione un lugar:',
            choices
        }
    ]
    const { id } = await inquirer.prompt(preguntas);
    return id;
}
////////////////////////////////////////////////////////////////


module.exports = {

    inquirerMenu,
    pausa,
    leerInput,
    listarLugares,
}