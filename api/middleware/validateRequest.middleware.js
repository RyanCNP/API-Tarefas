import { validationResult } from "express-validator"

// Middleware para verificar resultados da validação
export const validateRequest = (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({
            error: true,
            message: "Erro de validação",
            errors: errors.array(),
        })
    }
    next()
}