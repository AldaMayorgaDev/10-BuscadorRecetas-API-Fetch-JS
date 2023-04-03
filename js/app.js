function inicarApp(){
    const selectCategorias = document.querySelector('#categorias');
    selectCategorias.addEventListener('change', selectCategoria);

    const divResultado = document.querySelector('#resultado');

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

    function selectCategoria(e) {
        console.log('e.target.value :>> ', e.target.value);
        const categoria = e.target.value;
        const url = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${categoria}`;
        console.log('url :>> ', url);

        /* Consumiendo API que filtra los resultados por categoria  a traves del endpoint https://www.themealdb.com/api/json/v1/1/filter.php?c=Seafood*/

        fetch(url)
            .then(respuesta =>{
                //console.log('respuesta :>> ', respuesta);
                return respuesta.json();
            })
            .then(resultado=>{
                console.log('resultado :>> ', resultado);
                mostrarRecetas(resultado.meals);
            })
    }

    function mostrarRecetas(recetas =[]) {

        //impiar html previo
        limpiarHTML(divResultado);

        const heading = document.createElement('H2');
        heading.classList.add('text-center', 'text-black', 'my-5');
        heading.textContent = recetas.length ? 'Resultados' : 'No Hay Resultados';

        divResultado.appendChild(heading);
        //Iterar los resultados

        recetas.forEach( receta =>{

            const {idMeal, strMeal, strMealThumb}= receta;
            const recetaContenedor = document.createElement('DIV');
            recetaContenedor.classList.add('col-md-4');
            //console.log('recetaContenedor :>> ', recetaContenedor);

            const recetaCard = document.createElement('DIV');
            recetaCard.classList.add('card', 'mb-4')
            //console.log('recetaCard :>> ', recetaCard);

            const recetaImagen = document.createElement('IMG');
            recetaImagen.classList.add('card-img-top');
            recetaImagen.alt = `Imagen de la receta ${strMeal}`;
            recetaImagen.src = strMealThumb;


            const recetaCardBody = document.createElement('DIV');
            recetaCardBody.classList.add('card-body');

            const recetaHeading = document.createElement('H3');
            recetaHeading.classList.add('card-title', 'mb-3');
            recetaHeading.textContent = strMeal;

            const recetaButton = document.createElement('BUTTON');
            recetaButton.classList.add('btn', 'btn-danger', 'w-100');
            recetaButton.textContent = 'Ver Receta';


            //Insertar receta en el HTML
            recetaCardBody.appendChild(recetaHeading);
            recetaCardBody.appendChild(recetaButton);

            recetaCard.appendChild(recetaImagen);
            recetaCard.appendChild(recetaCardBody);

            recetaContenedor.appendChild(recetaCard);


            divResultado.appendChild(recetaContenedor);
        })
        
    }

    function limpiarHTML (selector){
        while(selector.firstChild){
            selector.removeChild(selector.firstChild);
        }
    }
}

document.addEventListener("DOMContentLoaded",inicarApp);