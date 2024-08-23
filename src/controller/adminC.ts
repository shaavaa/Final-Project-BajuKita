import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client"
import md5 from "md5";
import { sign } from "jsonwebtoken";

const prisma = new PrismaClient({ errorFormat: "pretty" })

export const getAdmin = async (request: Request, response: Response) => {
    try {
        const { search } = request.query

        const allAdmin = await prisma.admin.findMany({
            where:
            {
                nama: { contains: search?.toString() || "" },
                email: { contains: search?.toString() || "" }
            }
        })

        return response
            .json({
                status: true,
                data: allAdmin,
                message: `Admin has been loaded`
            }).status(200)
    } catch (error) {
        return response
            .json({
                status: false,
                message: `There is an error. ${error}`
            }).status(400)
    }
}

export const postAdmin = async (request: Request, response: Response) => {
    try {
        const { nama, email, password } = request.body

        const newAdmin = await prisma.admin.create({
            data: {
                nama, email, password: md5(password)
            }
        })

        return response
            .json({
                status: true,
                data: newAdmin,
                message: `Admin has been created`
            }).status(200)
    } catch (error) {
        return response
            .json({
                status: false,
                message: `There is an error. ${error}`
            }).status(400)
    }
}

export const putAdmin = async (request: Request, response: Response) => {
    try {
        const { id } = request.params

        const { nama, email, password } = request.body

        const findAdmin = await prisma.admin.findFirst({
            where: { id: Number(id) }
        })

        if (!findAdmin)
            return response
                .json({
                    status: false,
                    message: `Admin not found`
                }).status(200)

        const updateAdmin = await prisma.admin.update({
            where: { id: Number(id) },
            data: {
                nama: nama || findAdmin.nama,
                email: email || findAdmin.email,
                password: password ? md5(password) : findAdmin.password
            }
        })

        return response
            .json({
                status: true,
                data: updateAdmin,
                message: `Admin has been update`
            }).status(200)
    } catch (error) {
        return response
            .json({
                status: false,
                message: `There is an error. ${error}`
            }).status(400)
    }
}

export const delAdmin = async (request: Request, response: Response) => {
    try {
        const { id } = request.params

        const findAdmin = await prisma.admin.findFirst({
            where: { id: Number(id) }
        })

        if (!findAdmin)
            return response
                .json({
                    status: false,
                    message: `Admin not found`
                }).status(200)

        const deleteAdmin = await prisma.admin.delete({
            where: { id: Number(id) }
        })

        return response
            .json({
                status: true,
                data: deleteAdmin,
                message: `Admin has been delete`
            }).status(200)
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

        const findAdmin = await prisma.admin.findFirst({
            where: { email, password: md5(password) }
        })

        if (!findAdmin)
            return response
                .json({
                    status: false,
                    logged: false,
                    message: `Email or password is invalid`
                }).status(200)

        let payload = JSON.stringify(findAdmin)

        let secretkey = process.env.JWT_SECRET_ADMIN
        
        let token = sign(payload, secretkey || "darrel")

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
        const {search} = request.query

        const allCust = await prisma.cust.findMany({
            where: {nama: {contains: search?.toString() || ""}}
        })

        return response
        .json({
            status: true,
            data: allCust,
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