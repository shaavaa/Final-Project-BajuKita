import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import md5 from "md5";
import { sign } from "jsonwebtoken";

const prisma = new PrismaClient({errorFormat: "pretty"})

export const postCust = async (request: Request, response: Response) => {
    try {
        const {nama, email, password, telp} = request.body

        const newCust = await prisma.cust.create({
            data: {
                nama, email, password: md5(password), telp
            }
        })

        return response
        .json({
            status: true,
            data: newCust,
            message: `Cust has been created`
        })
    } catch (error) {
        return response
            .json({
                status: false,
                message: `There is an error. ${error}`
            }).status(400)
    }
}

export const putCust = async (request: Request, response: Response) => {
    try {
        const {id} = request.params

        const {nama, email, password, telp} = request.body

        const findCust = await prisma.cust.findFirst({
            where: {id: Number(id)}
        })

        if (!findCust)
            return response
        .json({
            status: false,
            message: `Cust not found`
        }).status(200)

        const updateCust = await prisma.cust.update({
            where: {id: Number(id)},
            data: {
                nama: nama || findCust.nama,
                email: email || findCust.email,
                password: password? md5(password) : findCust.password,
                telp: telp || findCust.telp
            }
        })

        return response
        .json({
            status: true,
            data: updateCust,
            message: `Cust has been update`
        }).status(200)
    } catch (error) {
        return response
            .json({
                status: false,
                message: `There is an error. ${error}`
            }).status(400)
    }
}

export const delCust = async (request: Request, response: Response) => {
    try {
        const {id} = request.params

        const findCust = await prisma.cust.findFirst({
            where: {id: Number(id)}
        })

        if (!findCust)
            return response
        .json({
            status: false,
            message: `Cust not found`
        }).status(200)

        const deleteCust = await prisma.cust.delete({
            where: {id: Number(id)}
        })

        return response
        .json({
            status: true,
            data: deleteCust,
            message: `Cust has been delete`
        })
    } catch (error) {
        return response
            .json({
                status: false,
                message: `There is an error. ${error}`
            }).status(400)
    }
}

export const authentication = async (request: Request, response: Response) => {
    try {
        const { email, password } = request.body

        const findCust = await prisma.cust.findFirst({
            where: { email, password: md5(password) }
        })

        if (!findCust)
            return response
                .json({
                    status: false,
                    logged: false,
                    message: `Email or password is invalid`
                }).status(200)

        let payload = JSON.stringify(findCust)

        let secretKey = process.env.JWT_SECRET_CUST

        let token = sign(payload, secretKey || "darrel")

        return response
            .json({
                status: true,
                logged: true,
                message: `Login success`,
                token
            }).status(200)
    } catch (error) {
        return response
            .json({
                status: false,
                message: `There is an error. ${error}`
            }).status(400)
    }
}

export const getCust = async (request: Request, response: Response) => {
    try {
        const {id} = request.params

        const Cust = await prisma.cust.findFirst({
            where: {id: Number(id)}
        })

        return response
        .json({
            status: true,
            data: Cust,
            message: `Cust has been loaded`
        }).status(200)
    } catch (error) {
        return response
            .json({
                status: false,
                message: `There is an error. ${error}`
            }).status(400)
    }
}