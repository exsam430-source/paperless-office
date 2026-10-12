const Joi = require("joi");

exports.validateRegister = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string()
      .valid("ADMIN", "CLERK", "REGISTRAR", "DIRECTOR", "FINANCE", "DEAN", "VC")
      .required(),
    department: Joi.string().required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res
      .status(400)
      .json({ success: false, message: error.details[0].message });
  }
  next();
};

exports.validateLogin = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res
      .status(400)
      .json({ success: false, message: error.details[0].message });
  }
  next();
};

exports.validateFileCreation = (req, res, next) => {
  const schema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().allow("").optional(),
    fileType: Joi.string().required(),
    department: Joi.string().required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res
      .status(400)
      .json({ success: false, message: error.details[0].message });
  }
  next();
};

exports.validateFileAction = (req, res, next) => {
  const schema = Joi.object({
    action: Joi.string().valid('APPROVE', 'REJECT', 'REVISION').required(),
    remarks: Joi.string().allow('').optional(),

    // ✅ Allow large base64 signature strings
    signatureData: Joi.string().allow('').max(10 * 1024 * 1024).optional(), // 10MB max

    signaturePlacement: Joi.object({
      attachmentIndex: Joi.number().min(0).optional(),
      pageNumber: Joi.number().min(1).optional(),
      xPct: Joi.number().min(0).max(1).optional(),
      yPct: Joi.number().min(0).max(1).optional(),
      wPct: Joi.number().min(0.05).max(1).optional()
    })
      .optional()
      .allow(null)
  });

  const { error } = schema.validate(req.body, { abortEarly: false });
  
  if (error) {
    console.error('❌ Validation error:', error.details); // ✅ Add logging
    return res.status(400).json({ 
      success: false, 
      message: error.details[0].message,
      errors: error.details.map(d => d.message) // ✅ Return all errors
    });
  }
  
  next();
};