function inicarApp(){
    const selectCategorias = document.querySelector('#categorias');

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
                console.log('resultado', resultado);
                console.log('resultado.categories', resultado.categories)
                mostrarCategorias(resultado.categories); //Se envia el array a la funcion mostrarCategorias 
            })
            .catch(error =>{
                console.log('error', error);
            })
            
    }

    function mostrarCategorias(categorias =[]){
        //console.log('categorias', categorias)

        //Se itera el arreglo para generar las opciones
            categorias.forEach(categoria =>{

                /* destructuring categoria */
                const {strCategory} = categoria;

                /* Crear el tag Option por cada categoria */
                const option = document.createElement('OPTION');
                option.value = strCategory;
                option.textContent = strCategory;

                /*Insetar option en el DOM  */
                selectCategorias.appendChild(option);
            })

    }
}

document.addEventListener("DOMContentLoaded",inicarApp);