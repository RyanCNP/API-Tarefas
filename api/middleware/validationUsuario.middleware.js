import { check, param } from "express-validator"
import { validateRequest } from "./validateRequest.middleware.js"

// Validar ObjectId
export const validateObjectId = [
  param("id").isMongoId().withMessage("Formato de ID inválido"),
  validateRequest
]

//Validações do Usuário
export const validateUsuario = [
  check('nome')
    .not().isEmpty().trim().withMessage('É obrigatório informar o nome')
    .isAlpha('pt-BR', { ignore: ' ' }).withMessage('Informe apenas texto')
    .isLength({ min: 3 }).withMessage('Informe no mínimo 3 caracteres')
    .isLength({ max: 100 }).withMessage('Informe no máximo 100 caracteres'),
  check('email')
    .not().isEmpty().trim().withMessage('É obrigatório informar o email')
    .isEmail().withMessage('Informe um email válido')
    .isLowercase().withMessage('Não são permitidas maiúsculas'),
  check('senha')
    .not().isEmpty().trim().withMessage('A senha é obrigatória')
    .isLength({ min: 8 }).withMessage('A senha deve ter no mínimo 8 caracteres')
    .isStrongPassword({
      minLength: 8,
      minLowercase: 1, minUppercase: 1,
      minSymbols: 1, minNumbers: 1
    }).withMessage('A senha não é segura. Informe no mínimo 1 caractere maiúsculo, 1 minúsculo, 1 número e 1 caractere especial'),
  check('ativo')
    .default(true)
    .isBoolean().withMessage('O valor deve ser um booleano'),
  check('tipo')
    .default('Cliente')
    .isIn(['Cliente', 'Admin']).withMessage('O tipo deve ser Admin ou Cliente'),
  check('sexo')
    .not().isEmpty().trim().withMessage('É obrigatório informar o sexo')
    .isIn(['Masculino', 'Feminino']).withMessage('O sexo deve ser Masculino ou Feminino'),
  //Aplica as validações
  validateRequest
]

export const checkEmailDuplicado = async (req, res, next) => {
  const db = req.app.locals.db
  const email = req.body.email

  if (!email) return next() // evita erro se o campo nem foi enviado

  try {
    const existe = await db.collection('usuarios').findOne({ email })
    if (existe) {
      return res.status(400).json({
        error: true,
        message: `O e-mail ${email} já está em uso`,
        errors: [{ msg: `O e-mail ${email} já está em uso`, param: 'email', location: 'body' }]
      })
    }
    next()
  } catch (err) {
    console.error("Erro ao verificar e-mail duplicado:", err)
    return res.status(500).json({
      error: true,
      message: "Erro interno ao validar o e-mail",
    })
  }
}
