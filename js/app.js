function inicarApp(){
    const divResultado = document.querySelector('#resultado');
    const selectCategorias = document.querySelector('#categorias');

    if(selectCategorias){
        selectCategorias.addEventListener('change', selectCategoria);
        obtenerCategorias();
    }
    
    const favoritosDiv = document.querySelector('.favoritos');
    if (favoritosDiv) {
        obtenerFavoritos();
    }

    


    const modal = new bootstrap.Modal('#modal', {});

    //Obtener todas las categorias de la API, usando el siguiente endpoint www.themealdb.com/api/json/v1/1/categories.php
    
    

    function obtenerCategorias(){
        const url = 'https://www.themealdb.com/api/json/v1/1/categories.php';

        /* Consumiendo la API con fetch */
        fetch(url)
            .then(respuesta =>{
                //console.log('respuesta', respuesta);
                return respuesta.json(); //Retornamos la respuesta en formato JSON
            })
            .then(resultado =>{
                //console.log('resultado', resultado);
                //console.log('resultado.categories', resultado.categories)
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
        //console.log('e.target.value :>> ', e.target.value);
        const categoria = e.target.value;
        const url = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${categoria}`;
        //console.log('url :>> ', url);

        /* Consumiendo API que filtra los resultados por categoria  a traves del endpoint https://www.themealdb.com/api/json/v1/1/filter.php?c=Seafood*/

        fetch(url)
            .then(respuesta =>{
                //console.log('respuesta :>> ', respuesta);
                return respuesta.json();
            })
            .then(resultado=>{
               // console.log('resultado :>> ', resultado);
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
            recetaImagen.alt = `Imagen de la receta ${strMeal ?? receta.img}`;
            recetaImagen.src = strMealThumb ?? receta.img;


            const recetaCardBody = document.createElement('DIV');
            recetaCardBody.classList.add('card-body');

            const recetaHeading = document.createElement('H3');
            recetaHeading.classList.add('card-title', 'mb-3');
            recetaHeading.textContent = strMeal ?? receta.titulo;

            const recetaButton = document.createElement('BUTTON');
            recetaButton.classList.add('btn', 'btn-danger', 'w-100');
            recetaButton.textContent = 'Ver Receta';

            /* Conecta el modal de boostrap */
            /* recetaButton.dataset.bsTarget = "#modal";
            recetaButton.dataset.bsToggle = "modal";  */

            recetaButton.onclick = function (){
                seleccionarReceta(idMeal ?? receta.id);
            }


            //Insertar receta en el HTML
            recetaCardBody.appendChild(recetaHeading);
            recetaCardBody.appendChild(recetaButton);

            recetaCard.appendChild(recetaImagen);
            recetaCard.appendChild(recetaCardBody);

            recetaContenedor.appendChild(recetaCard);


            divResultado.appendChild(recetaContenedor);
        })
        
    }



    function seleccionarReceta(id){
        //console.log('id :>> ', id);
        const url = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`;
        
        fetch(url)
            .then(respuesta =>{
                //console.log('respuesta', respuesta);
                return respuesta.json();
            })
             .then(resultado =>{
                mostrarRecetaModal(resultado.meals[0])
            }) 
    }

    function mostrarRecetaModal(receta){

        const {idMeal, strInstructions, strMeal, strMealThumb} = receta;

        /* Añadir contenido al modal */
        const modalTitle = document.querySelector('.modal .modal-title');
        const modalBody = document.querySelector('.modal .modal-body');

        modalTitle.textContent = strMeal;
        modalBody.innerHTML = `
                <img class = "img-fluid" src= "${strMealThumb}" alt= "Receta ${strMeal}" title="Receta ${strMeal}" />
                <h3 class="my-3">Instrucciones</h3>
                <p>${strInstructions}</p>
                <h3 class="my-3">Ingredientes y Cantidades</h3>
            `;

            const listGroup = document.createElement('UL');
            listGroup.classList.add('list-group');
        /* Mostrar cantidades e ingredientes */
        for(let i = 1; i<=20; i++){
            if(receta[`strIngredient${i}`]){
                const ingrediente = receta[`strIngredient${i}`];
                const cantidad = receta[`strMeasure${i}`];

                const ingredienteLi = document.createElement('LI');
                ingredienteLi.classList.add('list-group-item');
                ingredienteLi.textContent = `${ingrediente} - ${cantidad}`;
                //console.log(`${ingrediente} - ${cantidad}`);

                listGroup.appendChild(ingredienteLi);
            }
        }
        modalBody.appendChild(listGroup);

        /* Botones de cerrar y favorito */
        
        const modalFooter = document.querySelector('.modal-footer');
        limpiarHTML(modalFooter);
        const btnFavorito = document.createElement('BUTTON');
        btnFavorito.classList.add('btn', 'btn-danger', 'col');
        btnFavorito.textContent = existeStorage(idMeal) ? 'Eliminar Favorito' : 'Agregar Favorito';
       
        
        //LocalStorage
        btnFavorito.onclick = ()=>{
            

            if(existeStorage(idMeal)){
                eliminarFavorito(idMeal);
                btnFavorito.textContent = 'Agregar Favorito';
                mostarToast('Eliminado Correctamente de Favoritos 🗑');
                return
            }
            agregarFavorito({
                id: idMeal,
                titulo : strMeal,
                img: strMealThumb

            });
            btnFavorito.textContent = 'Eliminar Favorito';
            mostarToast('Agregado Correctamente a Favoritos 📌');
        }

        const btnCerrarModal = document.createElement('BUTTON');
        btnCerrarModal.classList.add('btn', 'btn-secondary', 'col');
        btnCerrarModal.textContent = 'Cerrar';
        btnCerrarModal.onclick = () =>{
            modal.hide();
        }

        modalFooter.appendChild(btnFavorito);
        modalFooter.appendChild(btnCerrarModal);


        /* Muestra modal */
        modal.show();
    }

    function agregarFavorito(receta) {
        //console.log('Agregando', receta);
        const favoritos = JSON.parse(localStorage.getItem('favoritos')) ?? []; /* ?? quiere decir que en caso de que la expresion devuelva un null, se va a tomar el valor del lado derecho en este caso un array vacio */

        localStorage.setItem('favoritos', JSON.stringify([...favoritos, receta]));
    }

    function eliminarFavorito(id) {
        const favoritos = JSON.parse(localStorage.getItem('favoritos')) ?? [];
        const nuevosFavoritos = favoritos.filter(favorito => favorito.id !== id);
        localStorage.setItem('favoritos', JSON.stringify(nuevosFavoritos));
    }
    function existeStorage(id) {
        const favoritos = JSON.parse(localStorage.getItem('favoritos')) ?? [];
        return favoritos.some(favorito =>favorito.id === id);
    }

    function mostarToast(mensaje) {
        const toastDiv = document.querySelector('#toast');
        const toastBody = document.querySelector('.toast-body');
        const toast = new bootstrap.Toast(toastDiv);

        toastBody.textContent = mensaje;
        toast.show();
    }


    function obtenerFavoritos() {
        const favoritos = JSON.parse(localStorage.getItem('favoritos')) ?? [];
        if(favoritos.length){

            mostrarRecetas(favoritos);
            return
        }
            const noFavoritos = document.createElement('P');
            noFavoritos.classList.add('fs-4', 'text-center', 'font-bold', 'mt-5');
            noFavoritos.textContent = 'No Hay Favoritos Aún';
            favoritosDiv.appendChild(noFavoritos);
        
    }
    function limpiarHTML (selector){
        while(selector.firstChild){
            selector.removeChild(selector.firstChild);
        }
    };
}

document.addEventListener("DOMContentLoaded",inicarApp);