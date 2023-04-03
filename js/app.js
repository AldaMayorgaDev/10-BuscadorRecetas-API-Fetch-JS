function inicarApp(){

    //Obtener todas las categorias de la API, usando el siguiente endpoint www.themealdb.com/api/json/v1/1/categories.php
    
    obtenerCategorias();

    function obtenerCategorias(){
        const url = 'https://www.themealdb.com/api/json/v1/1/categories.php';

        /* Consumiendo la API con fetch */
        fetch(url)
            .then(respuesta =>{
                console.log('respuesta', respuesta);
                return respuesta.json(); //Retornamos la respuesta en formato JSON
            })
            .then(resultado =>{
                console.log('resultado', resultado)
            })
            .catch(error =>{
                console.log('error', error);
            })
            
    }
}

document.addEventListener("DOMContentLoaded",inicarApp);