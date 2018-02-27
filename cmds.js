const model = require('./model');
const {log, biglog, errorlog,colorize} = require("./out");

exports.helpCmd = rl => {
	log('Commandos:');
    log("  h|help - Muestra esta ayuda.");
    log("  list - Listar los quizzes existentes.");
    log("  show <id> - Muestra la pregunta y a respuesta el quiz indicado.");
    log("  add - Añadir un nuevo quiz interactivamente.");
    log("  delete <id> - Borrar el quiz indicado.");
    log("  edit <id> - Editar el quiz indicado.");
    log("  test <id> - Probar el quiz indicado.");
    log("  p|play - Jugar a preguntar aleatoriamente todos los quizzes.");
    log("  credits - Créditos.");
    log("  q|quit - Salir del programa.");
    rl.prompt();
};


exports.quitCmd = rl => {
	rl.close();
	rl.prompt();
};

exports.addCmd = rl => {
	
	rl.question(colorize(' Introduzca una pregunta: ', 'red'),question => {

		rl.question(colorize(' Introduzca la respuesta: ', 'red'), answer => {

			model.add(question, answer);
			log(` ${colorize('Se ha añadido', 'magenta')}: ${question} ${colorize('=>', 'magenta')} ${answer}`);
			rl.prompt();
		});
	});


};

exports.listCmd = rl => {

	model.getAll().forEach((quiz, id) =>{
		log(`  [${colorize(id,'magenta')}]: ${quiz.question}`);
	})

	rl.prompt();
};

exports.showCmd = (rl,id) => {
	
	if (typeof id=== "undefined") {
		errorlog(`Falta el parámetro id.`);
	} else {
		try{
			const quiz = model.getByIndex(id);
			log(`  [${colorize(id, 'magenta')}]: ${quiz.question} ${colorize('=>', 'magenta')} ${quiz.answer}`);		
			rl.prompt();
		} catch(error){
			errorlog(error.message);
			rl.prompt();
		}
	}


};

exports.testCmd = (rl,id) => {
	
	if (typeof id=== "undefined") {
		errorlog(`Falta el parámetro id.`);
	} else {
		try{

			const quiz = model.getByIndex(id);

			rl.question(colorize(`¿${quiz.question}? `, 'red'),answer => {

						if(answer.toLowerCase().trim() === quiz.answer.toLowerCase().trim()){
							biglog(`CORRECTO`,'green');
						}else{
							biglog('INCORRECTO','red');
						}
						rl.prompt();
					});
				
		} catch(error){
			errorlog(error.message);
			rl.prompt();
		}
	}

};

exports.deleteCmd = (rl,id) => {
	
	if (typeof id=== "undefined") {
		errorlog(`Falta el parámetro id.`);
	} else {
		try{
			model.deleteByIndex(id);
			rl.prompt();	
		} catch(error){
			errorlog(error.message);
			rl.prompt();
		}
	}


};

exports.editCmd = (rl,id) => {
	if (typeof id=== "undefined") {
		errorlog(`Falta el parámetro id.`);
	} else {
		try{

			const quiz = model.getByIndex(id);

			process.stdout.isTTY && setTimeout(() => {rl.write(quiz.question)},0);

			rl.question(colorize(' Introduzca una pregunta: ', 'red'),question => {

					process.stdout.isTTY && setTimeout(() => {rl.write(quiz.answer)},0);

					rl.question(colorize(' Introduzca la respuesta: ', 'red'), answer => {

						model.update(id, question, answer);
						log(`Se ha cambiado el quiz ${colorize(id, 'magenta')} por: ${question} ${colorize('=>', 'magenta')} ${answer}`);
						rl.prompt();
					});
				});
		} catch(error){
			errorlog(error.message);
			rl.prompt();
		}
	}
	
};

exports.playCmd = rl => {
	
	let score = 0;

	var indices = [];

	model.getAll().forEach((quiz, id) =>{
		indices.push(id);
	});

	const playOne = () => {
	if (!indices.length){
		log('No hay nada más que preguntar.');
		log(`Fin del juego. Aciertos: ${score}`);
		biglog(`${score}`,'magenta');
		rl.prompt();
	}else{

		let idr = Math.floor(Math.random()*indices.length);

		let id = indices[idr];
		indices.splice(idr,1);

		const quiz = model.getByIndex(id);

		rl.question(colorize(`¿${quiz.question}? `, 'red'),answer => {

					if(answer.toLowerCase().trim() === quiz.answer.toLowerCase().trim()){
						score++;
						log(`CORRECTO - Lleva ${score} aciertos.`);
						playOne();

					}else{
						log('INCORRECTO.');
						log(`Fin del juego. Aciertos: ${score}`);
						biglog(`${score}`,'magenta');
						rl.prompt();
					}

				});
		}
		
	}

	

	playOne();



};

exports.creditsCmd = rl => {
	log('Autor de la práctica:');
    log('JORGE GONZALEZ','green');
    rl.prompt();
};

