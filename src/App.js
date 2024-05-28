import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [ingredients, setIngredients] = useState([]);
  const [selectedCatalogue, setSelectedCatalogue] = useState('');
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [percentages, setPercentages] = useState({});
  const [totalPercentage, setTotalPercentage] = useState(0);

  useEffect(() => {
    axios.get('http://localhost:8000/ingredients')
      .then(response => {
        setIngredients(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the ingredients!', error);
      });
  }, []);

  const handleCatalogueSelection = (catalogue) => {
    setSelectedCatalogue(catalogue);
    setSelectedIngredients([]);
    setPercentages({});
    setTotalPercentage(0);
  };

  const handleIngredientSelection = (category, event) => {
    const ingredientName = event.target.value;
    const selectedIngredient = ingredients.find(ingredient => ingredient.Ingredient === ingredientName);
    if (selectedIngredient && !selectedIngredients.includes(selectedIngredient)) {
      setSelectedIngredients([...selectedIngredients, selectedIngredient]);
      setPercentages({ ...percentages, [selectedIngredient.Ingredient]: 0 });
      // Disable the selected option in the dropdown
      event.target.disabled = false;
  
      // Find the next available ingredient index
      const nextIndex = ingredients.findIndex(ingredient => !selectedIngredients.includes(ingredient));
      if (nextIndex !== -1) {
        // Focus on the next available ingredient in the dropdown
        const nextIngredient = ingredients[nextIndex];
        const nextDropdown = document.querySelector(`select[value="${nextIngredient.Ingredient}"]`);
        if (nextDropdown) {
          nextDropdown.focus();
        }
      }
    }
  };
  const handlePercentageChange = (ingredientName, percentage) => {
    const newPercentages = { ...percentages, [ingredientName]: Number(percentage) };
    setPercentages(newPercentages);
    const newTotalPercentage = Object.values(newPercentages).reduce((acc, val) => acc + val, 0);
    setTotalPercentage(newTotalPercentage);

    if (newTotalPercentage > 100) {
      window.alert('Total percentage exceeds 100%');
    }
  };

  const handleRemoveIngredient = (ingredientName) => {
    const updatedIngredients = selectedIngredients.filter(ingredient => ingredient.Ingredient !== ingredientName);
    const updatedPercentages = { ...percentages };
    delete updatedPercentages[ingredientName];
    setSelectedIngredients(updatedIngredients);
    setPercentages(updatedPercentages);
    // Re-enable the corresponding option in the dropdown
    const dropdownOptions = document.querySelectorAll(`option[value="${ingredientName}"]`);
    dropdownOptions.forEach(option => option.disabled = false);

    const newTotalPercentage = Object.values(updatedPercentages).reduce((acc, val) => acc + val, 0);
    setTotalPercentage(newTotalPercentage);
  };

  const categories = [...new Set(ingredients.map(ingredient => ingredient.Category))];

  return (
    <div className="App">
      <h1 className="title">Custom Formulation</h1>
      <div className="buttons">
        <button onClick={() => handleCatalogueSelection('Skin')}>Skin</button>
        <button onClick={() => handleCatalogueSelection('Hair')}>Hair</button>
      </div>

      {selectedCatalogue && (
        <div className="categories">
          {categories.map((category, index) => (
            <div key={index} className="category-section">
              <div className="category-header">
                <h3>{category}</h3>
                <select onChange={(e) => handleIngredientSelection(category, e)}>
                  <option value="">Select an ingredient</option>
                  {ingredients
                    .filter(ingredient => ingredient.Category === category)
                    .map((ingredient, index) => (
                      <option key={index} value={ingredient.Ingredient}>{ingredient.Ingredient}</option>
                    ))}
                </select>
              </div>
              <div className="selected-ingredients">
                {selectedIngredients
                  .filter(ingredient => ingredient.Category === category)
                  .map(selectedIngredient => (
                    <div key={selectedIngredient.Ingredient} className="ingredient">
                      <p>{selectedIngredient.Ingredient}</p>
                      <input
                        type="range"
                        value={percentages[selectedIngredient.Ingredient] || 0}
                        onChange={(e) => handlePercentageChange(selectedIngredient.Ingredient, e.target.value)}
                        min="0"
                        max="100"
                        step="1"
                      />
                      <span>{percentages[selectedIngredient.Ingredient] || 0}%</span>
                      <button onClick={() => handleRemoveIngredient(selectedIngredient.Ingredient)}>Remove</button>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="total-percentage">
        <h2>Total Percentage: {totalPercentage}%</h2>
        {totalPercentage < 100 && <h2>Water: {100 - totalPercentage}%</h2>}
        {totalPercentage > 100 && <h2 style={{ color: 'red' }}>Total percentage exceeds 100%</h2>}
      </div>
    </div>
  );
}

export default App;
