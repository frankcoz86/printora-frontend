export const dtfTemplates = [
    {
        id: 'team-sposa',
        name: 'Team Sposa',
        category: 'Addio al Nubilato',
        description: 'Design classico per il team della sposa.',
        preview: 'Testo rosa e bianco per maglietta "Team Sposa"',
        objects: (canvas) => [
            {type:"textbox", text:"Team", originX:"center", originY:"center", left: canvas.width/2, top: canvas.height*0.4, width:300, fill:"#ff00ff", fontFamily:"Garamond", fontStyle:"italic", fontSize:45},
            {type:"textbox", text:"SPOSA", originX:"center", originY:"center", left: canvas.width/2, top: canvas.height*0.55, width:300, fill:"#ffffff", fontFamily:"Garamond", fontWeight:"bold", fontSize:45}
        ]
    },
    {
        id: 'game-over-sposo',
        name: 'Game Over Sposo',
        category: 'Addio al Celibato',
        description: 'Design divertente per l\'addio al celibato.',
        preview: 'Testo "Game Over" in stile pixel art per lo sposo',
        objects: (canvas) => [
            {type:"textbox", text:"GAME OVER", originX:"center", originY:"center", left: canvas.width/2, top: canvas.height*0.45, width:400, fill:"#ffffff", fontFamily:"Impact", fontSize:40, textAlign:"center", lineHeight: 1},
            {type:"textbox", text:"Lo Sposo", originX:"center", originY:"center", left: canvas.width/2, top: canvas.height*0.6, width:300, fill:"#ffffff", fontFamily:"Arial", fontSize:20, textAlign:"center"}
        ]
    },
    {
        id: 're-del-compleanno',
        name: 'Re del Compleanno',
        category: 'Compleanno',
        description: 'Per il festeggiato che si sente un re.',
        preview: 'Testo "Re del Compleanno" con una corona stilizzata',
        objects: (canvas) => [
            {type:"textbox", text:"RE DEL\nCOMPLEANNO", originX:"center", originY:"center", left: canvas.width/2, top: canvas.height*0.5, width:400, fill:"#ffd700", fontFamily:"Impact", fontSize:45, textAlign:"center", lineHeight: 1}
        ]
    },
    {
        id: 'regina-della-festa',
        name: 'Regina della Festa',
        category: 'Compleanno',
        description: 'Per la festeggiata che ama brillare.',
        preview: 'Testo "Regina della Festa" in rosa e stile corsivo',
        objects: (canvas) => [
            {type:"textbox", text:"Regina\ndella Festa", originX:"center", originY:"center", left: canvas.width/2, top: canvas.height*0.5, width:400, fill:"#ff00ff", fontFamily:"Garamond", fontStyle:"italic", fontSize:45, textAlign:"center", lineHeight: 1}
        ]
    },
    {
        id: 'eat-sleep-repeat',
        name: 'Eat Sleep Train Repeat',
        category: 'Fitness',
        description: 'La routine del vero sportivo.',
        preview: 'Testo "Eat Sleep Train Repeat" in stile moderno e sportivo',
        objects: (canvas) => [
            {type:"textbox", text:"EAT\nSLEEP\nTRAIN\nREPEAT", originX:"center", originY:"center", left: canvas.width/2, top: canvas.height*0.5, width:400, fill:"#ffffff", fontFamily:"Impact", fontSize:40, textAlign:"center", lineHeight: 1}
        ]
    },
    {
        id: 'just-one-more-game',
        name: 'Just One More Game',
        category: 'Gaming',
        description: 'La frase tipica di ogni gamer.',
        preview: 'Testo "Just One More Game" in stile 8-bit verde neon',
        objects: (canvas) => [
            {type:"textbox", text:"JUST ONE\nMORE GAME", originX:"center", originY:"center", left: canvas.width/2, top: canvas.height*0.5, width:350, fill:"#ccff00", fontFamily:"Courier New", fontWeight:"bold", fontSize:40, textAlign:"center", lineHeight: 1}
        ]
    },
    {
        id: 'security-staff',
        name: 'Security Staff',
        category: 'Eventi',
        description: 'Design semplice e diretto per lo staff di sicurezza.',
        preview: 'Testo "SECURITY" in bianco su sfondo nero, stile professionale',
        objects: (canvas) => [
            {type:"textbox", text:"SECURITY", originX:"center", originY:"center", left: canvas.width/2, top: canvas.height*0.5, width:380, fill:"#ffffff", fontFamily:"Arial Black", fontSize:50, textAlign:"center"}
        ]
    },
    {
        id: 'best-dad-ever',
        name: 'Miglior Papà di Sempre',
        category: 'Famiglia',
        description: 'Un classico per la festa del papà.',
        preview: 'Testo "Best Dad Ever" con un design da trofeo',
        objects: (canvas) => [
            {type:"textbox", text:"BEST\DAD\nEVER", originX:"center", originY:"center", left: canvas.width/2, top: canvas.height*0.5, width:350, fill:"#1d4ed8", fontFamily:"Impact", fontSize:45, textAlign:"center", lineHeight: 1}
        ]
    },
    {
        id: 'super-mom',
        name: 'Super Mamma',
        category: 'Famiglia',
        description: 'Per la supereroina di casa.',
        preview: 'Testo "Super Mom" con un emblema da supereroe',
        objects: (canvas) => [
            {type:"textbox", text:"SUPER\nMOM", originX:"center", originY:"center", left: canvas.width/2, top: canvas.height*0.5, width:350, fill:"#be185d", fontFamily:"Impact", fontSize:50, textAlign:"center", lineHeight: 0.9}
        ]
    }
];