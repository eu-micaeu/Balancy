import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { getAuthTokenFromCookies } from '../../utils/cookies';
import './Main.css';

function Main() {
    const { isLoggedIn } = useContext(AuthContext);
    const [menu, setMenu] = useState(null); // O menu completo com refeições e alimentos
    const [error, setError] = useState(null);

    const fetchOptions = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getAuthTokenFromCookies()}`,
        },
    };

    const fetchMenu = async () => {
        try {
            const response = await fetch('http://localhost:8080/readMenu', fetchOptions);
            if (!response.ok) {
                throw new Error(`Erro da API: ${response.status}`);
            }
            const data = await response.json();
            setMenu(data.menu); // Definir o menu completo na state
        } catch (error) {
            console.error('Erro ao carregar o menu:', error);
            setError(error.message);
        }
    };

    useEffect(() => {
        if (isLoggedIn) {
            fetchMenu();
        }
    }, [isLoggedIn]);

    const createFood = async (mealId, foodName, calories, quantity) => {
        try {
            const response = await fetch('http://localhost:8080/createFood', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getAuthTokenFromCookies()}`,
                },
                body: JSON.stringify({
                    meal_id: parseInt(mealId),
                    food_name: foodName,
                    calories: parseInt(calories),
                    quantity: parseInt(quantity),
                }),
            });

            if (!response.ok) {
                throw new Error(`Erro da API: ${response.statusText}`);
            }

            const data = await response.json();
            alert("Alimento adicionado com sucesso!");

            // Atualiza o menu após adicionar alimento
            await fetchMenu();
        } catch (error) {
            console.error("Erro ao criar alimento:", error);
            alert("Erro ao adicionar o alimento. Tente novamente.");
        }
    };

    return (
        <main className="main-container">
            {isLoggedIn ? (
                <div className="menu-container">
                    {menu ? (
                        <>
                            <div className="menu-header">
                                <h2 className="menu-title">Menu Atual</h2>
                                <p className="menu-name">{menu.menu_name}</p>
                            </div>
                            {menu.meals && menu.meals.length > 0 ? (
                                <div className="meals-container">
                                    {menu.meals.map((meal) => (
                                        <div className="meal-item" key={meal.meal_id}>
                                            <h3>{meal.meal_name}</h3>
                                            {meal.foods && meal.foods.length > 0 ? (
                                                <ul className="food-list">
                                                    {meal.foods.map((food, index) => (
                                                        <li key={index}>{food}</li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <p>Nenhum alimento adicionado nesta refeição.</p>
                                            )}
                                        </div>
                                    ))}
                                    <div>
                                        <h3>Adicionar Alimento</h3>
                                        <form
                                            onSubmit={(e) => {
                                                e.preventDefault();
                                                const mealId = e.target.mealId.value;
                                                const foodName = e.target.foodName.value;
                                                const calories = e.target.calories.value;
                                                const quantity = e.target.quantity.value;

                                                createFood(mealId, foodName, parseFloat(calories), parseInt(quantity));
                                            }}
                                        >
                                            <label>
                                                Refeição:
                                                <select name="mealId" required>
                                                    {menu.meals.map((meal) => (
                                                        <option key={meal.meal_id} value={meal.meal_id}>
                                                            {meal.meal_name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </label>
                                            <label>
                                                Nome do Alimento:
                                                <input type="text" name="foodName" required/>
                                            </label>
                                            <label>
                                                Calorias:
                                                <input type="number" name="calories" step="0.01" required/>
                                            </label>
                                            <label>
                                                Quantidade:
                                                <input type="number" name="quantity" min="1" required/>
                                            </label>
                                            <button type="submit">Adicionar Alimento</button>
                                        </form>
                                    </div>
                                </div>
                            ) : (
                                <div className="no-meals-message">
                                    <p>Nenhuma refeição disponível no momento.</p>
                                </div>
                            )}
                        </>
                    ) : error ? (
                        <p className="error-message">{error}</p>
                    ) : (
                        <p>Carregando menu...</p>
                    )}
                </div>
            ) : (
                <div className="menu-guest">
                    <h1 className="main-title">Bem-Vindo ao Balancy!</h1>
                    <p className="subtitle">
                        Torne sua alimentação mais saudável, eficiente e organizada. Descubra funcionalidades incríveis:
                    </p>
                    <div className="cards-container">
                        <div className="card">
                            <h3>Planeje Suas Refeições</h3>
                            <p>
                                Organize o seu dia com uma visão completa das refeições e mantenha uma alimentação
                                balanceada.
                            </p>
                        </div>
                        <div className="card">
                            <h3>Receitas Personalizadas</h3>
                            <p>
                                Descubra receitas ajustadas ao seu gosto e às suas restrições alimentares. Sabor e saúde
                                juntos!
                            </p>
                        </div>
                        <div className="card">
                            <h3>Controle de Calorias</h3>
                            <p>
                                Acompanhe o consumo diário e alcance seus objetivos de nutrição com facilidade.
                            </p>
                        </div>
                    </div>
                    <section className="testimonials">
                        <h2>O que nossos usuários dizem:</h2>
                        <div className="testimonial-cards">
                            <div className="testimonial-card">
                                <p>
                                    "O Balancy transformou minha rotina alimentar. Agora consigo me organizar e manter
                                    uma dieta mais saudável!"
                                </p>
                                <span>– Maria Silva</span>
                            </div>
                            <div className="testimonial-card">
                                <p>
                                    "As receitas personalizadas são incríveis! Tudo o que preciso para cozinhar está lá,
                                    e ainda respeita minhas restrições."
                                </p>
                                <span>– João Oliveira</span>
                            </div>
                            <div className="testimonial-card">
                                <p>
                                    "Com o controle de calorias, alcancei meus objetivos em poucos meses. Recomendo a
                                    todos!"
                                </p>
                                <span>– Ana Costa</span>
                            </div>
                        </div>
                    </section>
                </div>
            )}
        </main>
    );
}

export default Main;