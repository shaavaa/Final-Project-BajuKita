import { NextFunction, Request, Response } from "express";
import Joi from "joi";

const addData = Joi.object({
    nama: Joi.string().required(),
    harga: Joi.number().min(1).required(),
    type: Joi.string().required(),
    ukuran: Joi.string().required(),
    warna: Joi.string().required(),
    detail: Joi.string().required(),
    gambar: Joi.allow().optional()
})

const updateData = Joi.object({
    nama: Joi.string().optional(),
    harga: Joi.number().min(1).optional(),
    type: Joi.string().optional(),
    ukuran: Joi.string().optional(),
    warna: Joi.string().optional(),
    detail: Joi.string().optional(),
    gambar: Joi.allow().optional()
})

export const verifyAddGaun = (request: Request, response: Response, next: NextFunction) => {
    const {error} = addData.validate(request.body, {abortEarly: false})

    if (error) {
        return response
        .status(400)
        .json({
            status: false,
            message: error.details.map(it => it.message).join()
        })
    }
    return next()
}

export const verifyEditGaun = (request: Request, response: Response, next: NextFunction) => {
    const {error} = updateData.validate(request.body, {abortEarly: false})

    if (error) {
        return response
        .status(400)
        .json({
            status: false,
            message: error.details.map(it => it.message).join()
        })
    }
    return next()
}