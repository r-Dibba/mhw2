/*
* SELEZIONE RISPOSTA
* Mantengo una lista contentente tutte le risposte e l'id relativo alla domanda per controllare successivamente la personalità ottenuta
* Quando si sceglie una risposta, considero prima tutte le risposte alla data domanda come 'non scelte' 
* Successivamente, applico le modifiche specifiche alla risposta scelta
*
* Quando è stata scelta una risposta per ogni domanda, la lunghezza di chosenAnswers sarà pari a 3
* Quando ciò accade, creo e aggiungo un elemento html alla fine della pagina che contiene la personalità e il bottone per eseguire nuovamente il test
* Una volta determinata la personalità, rimuovo l'event listener da ogni risposta per impedire la selezione di altre risposte
*/

const answers = document.querySelectorAll('.choice-grid div');
let chosenAnswers = [];

function selectAnswer(event){
    const thisDiv = event.currentTarget;
    const choice = thisDiv.dataset.choiceId; /* stringa identificativa della personalità scelta */
    const idx = thisDiv.dataset.questionId; /* ID della domanda */

    for (let box of thisDiv.parentNode.querySelectorAll('div')){ /* Itero fra tutti i <div> della <section> relativa alla domanda, ovvero il contenitore (parent node) del div cliccato */
        /* Considero tutte le risposte 'non scelte' a priori, aggiornandone lo sfondo e impostando la checkbox unchecekd */
        box.querySelector('.checkbox').classList.remove('hidden');
        box.querySelector('.checked').classList.add('hidden');
        box.classList.remove('chosen');
        box.classList.add('not-chosen');
    }

    /* Aggiornamento della checkbox e del colore di sfondo corrente */
    const unchecked = thisDiv.querySelector('.checkbox');
    const checked = thisDiv.querySelector('.checked');
    unchecked.classList.add('hidden');
    checked.classList.remove('hidden');
    thisDiv.classList.remove('not-chosen');
    thisDiv.classList.add('chosen');

    /* Tolgo (se presenti) altre 'scelte' relative alla stessa domanda (necessario se si decide di scegliere nuovamente una risposta) */
    let i;
    for (i = 0; i < chosenAnswers.length; i++){

        if (chosenAnswers[i].id === idx){
            chosenAnswers.splice(i, 1);
            break; /* Se l'elemento esiste è unico, non serve iterare ancora */
        }
    }
    
    /* Aggiungo la risposta selezionata alla lista di risposte scelte */
    const temp = { 
        id: idx,
        choice: choice
    }

    chosenAnswers.push(temp);

    if(chosenAnswers.length === 3){

        getPersonality();

        for (let box of answers){
            box.removeEventListener('click', selectAnswer);
            
        }
        
    }

}

/* Aggiungo l'event listener sopra definito a ogni div di ogni choice grid */
for (let box of answers){
    box.addEventListener('click', selectAnswer);
    
}

/* 
* DETERMINAZIONE PERSONALITÀ
*/

function getPersonality(){

    /* Nella map 'occurrences' viene memorizzata una stringa rappresentante la personalità e il numero di occorrenze */
    const occurrences = {};
    let i;
    for (i = 0; i < chosenAnswers.length; i++){
        let type = chosenAnswers[i].choice;
        /* 
        * if necessario poichè, se si verifica la prima occorrenza di una personalità, è necessario assegnare 1 al valore a esso associata.
        * Non si può semplicemente sommare perchè il numero di occorrenze iniziali non è 0, bensì NaN
        */
        if (occurrences[type] >= 1 )
            occurrences[type] += 1;
        else
            occurrences[type] = 1;
    }

    /* Selezione della personalità col massimo numero di occorrenze */
    let max = chosenAnswers[0].choice;
    for (let pers in occurrences){
        if (occurrences[pers] > occurrences[max])
            max = pers;
    }
    
    const article = document.querySelector('article');

    const container = document.createElement('div');
    
    const title = document.createElement('h2');
    title.textContent = RESULTS_MAP[max].title;
    
    const text = document.createElement('p');
    text.textContent = RESULTS_MAP[max].contents;
    
    const button = document.createElement('div');
    button.textContent = "Ricomincia il Quiz";

    /* NOTA: sarebbe più appropriato aggiungere degli ID invece che classi */
    container.classList.add('answer');
    title.classList.add('answerTitle');
    text.classList.add('answerDesc');
    button.classList.add('resetButton');
    
    article.appendChild(container);
    container.appendChild(title);
    container.appendChild(text);
    container.appendChild(button);

    /* Imposto il gestore della funzione di reset */
    button.addEventListener('click', reset);

}

function reset(event){
    for (let box of answers){
        box.addEventListener('click', selectAnswer);
        box.classList.remove('chosen', 'not-chosen');
        box.querySelector('.checked').classList.add('hidden');
        box.querySelector('.checkbox').classList.remove('hidden');
    }

    event.currentTarget.parentNode.remove();

    chosenAnswers = [];

}