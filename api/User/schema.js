const Joi = require('joi');

const signUp ={ 
  body: Joi.object({
  name: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  phone: Joi.string().min(10).required(),
  role: Joi.string().valid('admin', 'user').required(),
})}

const login ={
  body: Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
})
} 


const options = {
  abortEarly: false,
  allowUnknown: true,
  stripUnknown: true,
};

module.exports = {
  signUp,
  login,
  options
};