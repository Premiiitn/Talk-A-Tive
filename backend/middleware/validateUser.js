// validateRegistration.js
const Joi = require('joi');

// Define the Joi schema
const registrationSchema = Joi.object({
  name: Joi.string()
    .min(3)
    .max(30)
    .required()
    .messages({
      'string.empty': 'Name is required',
      'string.min': 'Name should have a minimum length of {#limit}',
      'string.max': 'Name should have a maximum length of {#limit}',
    }),
  
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      'string.empty': 'Email is required',
      'string.email': 'Please provide a valid email address',
    }),

  password: Joi.string()
    .min(8)
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()_+\\-={}\\[\\]|;:"<>,.?/~`]).{8,}$'))
    .required()
    .messages({
      'string.empty': 'Password is required',
      'string.min': 'Password should have a minimum length of {#limit}',
      'string.pattern.base': 'Password must include at least one uppercase letter, one lowercase letter, one number, and one special character',
    }),

  pic: Joi.string()
    .uri()
    .optional()
    .messages({
      'string.uri': 'Picture must be a valid URL',
    }),
});

// Middleware function
const validateRegistration = (req, res, next) => {
  const { error, value } = registrationSchema.validate(req.body, { abortEarly: false });

  if (error) {
    // Extract error messages
    const errorMessages = error.details.map(detail => detail.message);
    return res.status(400).json({ errors: errorMessages });
  }

  // Convert email to lowercase
  if (value.email) {
    req.body.email = value.email.toLowerCase();
  }

  // Optionally, replace the request body with the validated and sanitized data
  req.body = value;

  next();
};

module.exports = validateRegistration;
