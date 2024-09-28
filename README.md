# kCal

**kCal** is a web application designed to help users organize their daily meal plans and assist them in achieving specific dietary goals. The platform allows users to track their meals, foods, and nutritional information efficiently.

## Features

- **User Management**: Create and manage user profiles with personalized information.
- **Meal Planning**: Users can create, edit, and delete meals.
- **Food Database**: Access a database of foods with detailed nutritional information.
- **Dietary Goals**: Set and track dietary goals to meet specific caloric and nutritional targets.
- **Interactive Dashboard**: Visual representation of user data, including IMC (Body Mass Index), TMB (Basal Metabolic Rate), and TMR (Total Metabolic Rate).

## Technology Stack

- **Frontend**: HTML, CSS, JavaScript (ES6 modules)
- **Backend**: GoLang with Gin framework
- **Database**: PostgreSQL

## Database Schema

The database consists of the following tables:

- **Users**: Stores user profile information.
- **Meals**: Records meals created by users.
- **Foods**: Contains nutritional information for various food items.
- **Meal_Foods**: Manages the many-to-many relationship between meals and foods.
- **Dietary Goals**: Allows users to set specific dietary targets.

