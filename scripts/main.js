

const program = require('commander');
const path = require('path')

const { version } = {version: '0.0.1'}


const actionsMap = {
    create: {
        description:'crate project',
        alias : 'cr',
        examples: [
            'wby create <template-name>'
        ],
    },
    config : {
        description: 'config info',
        alias: 'c',
        examples: [
            'wby config get <k>',
            'wby config set <k> <v>'
        ]
    },
    build : {
        description: 'build',
        alias:'bu',
        examples:[
            'wby build'
        ]
    },
    start : {
        description: 'start',
        alias:'s',
        examples:[
            'wby start'
        ]
    },
    '*': {
        description : 'command not found'
    }
}



Object.keys(actionsMap).forEach((key) => {
    const action = actionsMap[key]
    program
        .command(key)
        .alias(action.alias)
        .description(action.alias)
        .action(() => {
            if(action === '*'){
                console.log(action.description)
            }else{
                console.log("===", process.argv.slice(3))
                require(path.resolve(__dirname, key))(...process.argv.slice(3))
            }
        });
})

program.on('--help', () => {
    Object.keys(actionsMap).forEach((key) => {
        const action = actionsMap[key];
        (action.examples || []).forEach((example) => {
            console.log(` ${example}`)
        })
    })
})

program
    .version(version)
    .parse(process.argv);

