# mhw2

## Modifiche per il layout mobile
Nel file index.html ho aggiunto il tag meta viewport per far sì che il livello di zoom della viewport sia del 100% e la larghezza pari alla larghezza del dispositivo.

```html
<meta name="viewport" content="width=device-width, initial-scale=1">
```
per impostare il livello di zoom della viewport al 100% e la larghezza pari alla larghezza del dispositivo.  
Per quanto riguarda il foglio di stile, sono state aggiunte due media query:
```css
@media(max-width: 700px){
    article{
        width: 95%;
    }

    header div span{
        display: none;
    }

    .question-name h1{
        font-size: 40px;
    }
}
```
Quando la larghezza del dispositivo è inferiore a 700px, i cerchi gialli (span) scompaiono e al loro posto viene visualizzato un unico 'cerchio' (lo span #menumobile).  
Viene anche ridotta la dimensione del font degli elementi h1.

```css
@media(max-width: 500px){
    .choice-grid div{
        width: calc(49% - 20px);
    }
}
```
Questa media query è necessaria per cambiare la larghezza delle risposte. Vengono sottratti 20px in quanto i div hanno un padding di 10px.  
## Implementazione dello script
Mantengo una lista di risposte selezionate
```js
const chosenAnswers = [];
```
Quando verrà cliccato il bottone di reset, la svuoto utilizzando il metodo ```splice()```    
Ogni elemento della lista è un oggetto strutturato in questo modo
```js
const oggetto = {
  id: indice_domanda, /* che corrisponde all'ID della domanda per la quale è stata selezionata la risposta */
  choice: personalità /* la stringa che definisce la personalità associata alla risposta */
}
```
il campo ```id``` serve perchè, in caso di ri-selezione di una risposta, sarà necessario rimuovere la risposta associata alla domanda con lo stesso id (a ogni domanda si può dare una sola risposta)
Per determinare la personalità, utilizzo una mappa strutturata come segue
```js
const occurrences = {
  key: personalità,
  value: numero_di_occorrenze
}
```
Itero dunque la lista di risposte scelte e incremento opportunamente il numero di occorrenze nella mappa. Inizialmente pongo la personalità col massimo numero di occorrenze al primo elemento della lista (se il numero di occorrenze è uguale, verrà visualizzata la prima personalità scelta), poi ricerco nella mappa quella con numero di occorrenze maggiore (ricerca del massimo)
