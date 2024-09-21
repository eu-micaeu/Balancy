const User = require('../models/User');

const jwt = require('jsonwebtoken');

const dotenv = require('dotenv');

dotenv.config();

exports.registerUser = async (req, res) => {

  try {

    const { username, password, height, weight, gender, age, activityLevel } = req.body;

    const user = await User.create({ username, password, height, weight, gender, age, activityLevel });

    res.status(201).json(user);

  } catch (error) {

    res.status(400).json({ error: error.message });

  }

};

exports.loginUser = async (req, res) => {

  const { username, password } = req.body;

  try {

    const user = await User.findOne({ where: { username, password } });

    if (!user) {

      return res.status(401).json({ error: 'Invalid credentials' });

    }

    const token = jwt.sign({

      user_id: user.user_id,
      username: user.username,
      height: user.height,
      weight: user.weight,
      gender: user.gender,
      age: user.age,
      activityLevel: user.activityLevel

    }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.cookie('jwt', token);

    res.redirect('/home');

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

};

exports.updateUser = async (req, res) => {

  const { id } = req.params;

  const { username, height, weight, gender, age, activityLevel } = req.body;

  console.log(req.body);

  try {

    const user = await User.findByPk(id);

    if (!user) {

      return res.status(404).json({ error: 'User not found' });

    }

    if (username) user.username = username;

    if (height) user.height = height;

    if (weight) user.weight = weight;

    if (gender) user.gender = gender;
    
    if (age) user.age = age;

    if (activityLevel) user.activityLevel = activityLevel;

    await user.save();

    const token = jwt.sign({

      user_id: user.user_id,
      username: user.username,
      height: user.height,
      weight: user.weight,
      gender: user.gender,
      age: user.age,
      activityLevel: user.activityLevel

    }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.cookie('jwt', token);

    // Refresh

    res.redirect('/perfil');

  } catch (error) {

    res.status(400).json({ error: error.message });

  }

};

exports.deleteUser = async (req, res) => {

  const { id } = req.params;

  try {

    const user = await User.findByPk(id);

    if (!user) {

      return res.status(404).json({ error: 'User not found' });

    }
    res.json({ message: 'User deleted' });

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

};

exports.logoutUser = async (req, res) => {

  res.clearCookie('jwt');

  res.redirect('/');

};