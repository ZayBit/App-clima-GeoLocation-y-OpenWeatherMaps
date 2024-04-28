const inquirer = require("inquirer");
require("colors");
// Opciones para listar
const menuOpts = [
  {
    type: "list",
    name: "opcion",
    message: "¿Que desea hacer?",
    choices: [
      {
        value: 1,
        name: `${'1.'.green} Buscar lugar`,
      },
      {
        value: 2,
        name:`${'2.'.green} Historial`,
      },
      {
        value: 0,
        name:`${'0.'.green} Salir`
      },
    ],
  },
];
// mostrar la lista de opciones
const inquirerMenu = async () => {
  console.clear();
  console.log("=====================".green);
  console.log("Seleccione una opcion".white);
  console.log("=====================\n".green);
// valor de la opcion seleccionada
  const { opcion } = await inquirer.prompt(menuOpts);

  return opcion;
};
// mostrar un mensaje para continuar... y pausar la aplicacion para que el usuario observe lo que hace
const pausa = async () => {
  console.log("\n");
  const question = [
    {
      type: "input",
      name: "ent",
      message: `Presione ${"ENTER".green} para continuar...\n`,
    },
  ];
  await inquirer.prompt(question);
};
// leer la entrada para crear una tarea y validar que no sea un valor vacio
const leerInput = async (message) => {
  const preguntas = [
    {
      type: "input",
      name: "desc",
      message,
      validate( value ) {
        if (value.length === 0) {
          return "Por favor ingrese un valor";
        }
        return true;
      },
    },
  ];

  const { desc } =  await inquirer.prompt( preguntas );
  return desc
};

const listarLugares = async( lugares = [] )=>{
  console.log('ss');
  const opciones = lugares.map(( lugar, i )=>{
    const idx = `${i+1}.`.green

    return {
      value:lugar.id,
      name: `${idx} ${lugar.nombre} - ${lugar.direccion}`
    }
  })

  opciones.unshift({
    value:'0',
    name:'0.'.green + ' Cancelar'
  })

  const preguntas = [
    {
      type:'list',
      name:'id',
      message:'Seleccione lugar:',
      choices:opciones
    }
  ]

  const { id } = await inquirer.prompt( preguntas );
  return id
}

const mostrarListadoCheckList = async( tareas = [] )=>{
  
  const opciones = tareas.map(( tarea, i )=>{
    const idx = `${i+1}.`.green

    return {
      value:tarea.id,
      name: `${idx} ${tarea.desc}`,
      checked: (tarea.completadoEn) ? true : false
    }
  })

  opciones.unshift({
    value:'0',
    name:'0.'.green + ' Cancelar'
  })

  const preguntas = [
    {
      type:'checkbox',
      name:'ids',
      message:'Selecciones',
      choices:opciones
    }
  ]

  const { ids } = await inquirer.prompt( preguntas );
  return ids
}

const confirmar = async( message ) => {
  const preguntas = [
    {
      type:'confirm',
      name:'ok',
      message
    }
  ]

  const { ok } = await inquirer.prompt( preguntas )

  return ok
}


module.exports = {
  inquirerMenu,
  pausa,
  leerInput,
  listarLugares,
  confirmar,
  mostrarListadoCheckList
};