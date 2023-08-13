const searchBox = document.querySelector('.searchBox');
const searchBtn = document.querySelector('.searchBtn');
const recipeContainer = document.querySelector('.recipe-container');
const recipeCloseBtn = document.querySelector('.recipe-close-btn');
const recipeDetailsContent = document.querySelector('.recipe-details-content');

const heading = document.querySelector('.heading');
heading.addEventListener("click",()=>{
    recipeContainer.innerHTML="<h2>Search your favorite recipes ...</h2>";
})

const fetchRecipe = async (query) =>{
    recipeContainer.innerHTML = "<h2>Finding your recipe...<h2>"
    try {
        const data = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
        const response = await data.json();
        
        recipeContainer.innerHTML="";
        response.meals.forEach(meal=>{
            // console.log(meal.strYoutube);
            const recipeDiv = document.createElement('div');
            recipeDiv.classList.add('recipe');
    
            recipeDiv.innerHTML = `
                <img src="${meal.strMealThumb}">
                <h3>${meal.strMeal}</h3>
                <p><span>${meal.strArea}</span> Dish</p>
                <p>Belongs to <span>${meal.strCategory}</span> category</p>
            `;
    
            const button = document.createElement('button');
            button.textContent = "View Recipe";
            recipeDiv.appendChild(button);
    
            button.addEventListener("click",()=>{
                openRecipePopup(meal);
            })
    
            recipeContainer.appendChild(recipeDiv);
        })
    } catch (error) {
        recipeContainer.innerHTML = "<h2>No such meal found !<h2>"
    }
  
}

const fetchIngredients = (meal) => {
    let ingredientsList = "";
    for(let i=1 ; i<=20 ; i++){
        const ingredient = meal[`strIngredient${i}`];
        if(ingredient){
            const measure = meal[`strMeasure${i}`];
            ingredientsList+= `
            <li>${measure} ${ingredient}</li>
            `
        }
        else{
            break;
        }
    }
    return ingredientsList;
}

const openRecipePopup = (meal) => {
    recipeDetailsContent.innerHTML = `
        <h2 class="recipeName">${meal.strMeal}</h2>
        <h3 class="ingredients">Ingredients:</h3>
        <ul class="ingredientList">${fetchIngredients(meal)}</ul>
        <div class="recipeInstruction">
            <h3>Instructions:</h3>
            <p>${meal.strInstructions}</p>
        </div>
        <a href="${meal.strYoutube}" target="_blank" class="youtubeLink">Watch tutorial</a>
    `
   

    // recipe-content-deatils div is child of recipe details
    recipeDetailsContent.parentElement.style.display = "block";
}


recipeCloseBtn.addEventListener("click",()=>{
    recipeDetailsContent.parentElement.style.display = "none";
})


searchBtn.addEventListener("click",(e)=>{
    e.preventDefault();
    const searchInput = searchBox.value.trim();
    if(!searchInput){
        recipeContainer.innerHTML = "<h2>Type the meal in the search box.</h2>";
        return;
    }
    fetchRecipe(searchInput);
});

