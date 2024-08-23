import { NextFunction, Request, Response } from "express";
import Joi from "joi";

const addData = Joi.object({
    nama: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required()
})

const updateData = Joi.object({
    nama: Joi.string().optional(),
    email: Joi.string().email().optional(),
    password: Joi.string().optional()
})

const auth = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
})

export const verifyAddAdmin = (request: Request, response: Response, next: NextFunction) =>{
    const {error} = addData.validate(request.body, {abortEarly: false})

    if(error) {
        return response
        .json({
            status: false,
            message: error.details.map(it=> it.message).join()
        }).status(400)
    }
    return next()
}

export const verifyUpdateAdmin = (request: Request, response: Response, next: NextFunction) =>{
    const {error} = updateData.validate(request.body, {abortEarly: false})

    if(error) {
        return response
        .json({
            status: false,
            message: error.details.map(it=> it.message).join()
        }).status(400)
    }
    return next()
}

export const verifyAuth = (request: Request, response: Response, next: NextFunction) =>{
    const {error} = auth.validate(request.body, {abortEarly: false})

    if(error) {
        return response
        .json({
            status: false,
            message: error.details.map(it=> it.message).join()
        }).status(400)
    }
    return next()
}