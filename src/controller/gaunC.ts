import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import fs from "fs"
import { BASE_URL } from "../global";

const prisma = new PrismaClient({errorFormat: "pretty"})

export const getGaun = async (request: Request, response: Response) => {
    try {
        const {search} = request.params

        const allGaun = await prisma.gaun.findMany({
            where: {
                nama: {contains: search?.toString() || ""},
                ukuran: {contains: search?.toString() || ""},
                warna: {contains: search?.toString() || ""},
                type: {contains: search?.toString() || ""}
            }
        })

        return response
        .json({
            status: true,
            data: allGaun,
            message: `Gaun has been loaded`
        }).status(200)
    } catch (error) {
        return response
            .json({
                status: false,
                message: `There is an error. ${error}`
            }).status(400)
    }
}

export const postGaun = async (request: Request, response: Response) => {
    try {
        const { nama, harga, type, ukuran, warna, detail } = request.body

        let filename = ""
        if (request.file) filename = request.file.filename

        const newGaun = await prisma.gaun.create({
            data: {
                nama, harga: Number(harga), type, ukuran, warna, detail, gambar: filename
            }
        })

        return response
            .json({
                status: true,
                data: newGaun,
                message: `Gaun has been created`
            }).status(200)
    } catch (error) {
        return response
            .json({
                status: false,
                message: `There is an error. ${error}`
            }).status(400)
    }
}

export const putGaun = async (request: Request, response: Response) => {
    try {
        const { id } = request.params
        const { nama, harga, type, ukuran, warna, detail } = request.body

        const findGaun = await prisma.gaun.findFirst({
            where: { id: Number(id) }
        })

        if (!findGaun)
            return response
                .json({
                    status: false,
                    message: `Gaun is not found`
                }).status(200)

        let filename = findGaun.gambar

        if (request.file) {
            filename = request.file.filename
            let path = `${BASE_URL}/public/gaun-image/${findGaun.gambar}`
            let exists = fs.existsSync(path)
            if (exists && findGaun.gambar !== ``) fs.unlinkSync(path)
        }

        const updateGaun = await prisma.gaun.update({
            data: {
                nama: nama || findGaun.nama,
                harga: harga ? Number(harga) : findGaun.harga,
                type: type || findGaun.type,
                ukuran: ukuran || findGaun.ukuran,
                warna: warna || findGaun.warna,
                detail: detail || findGaun.detail,
                gambar: filename
            },
            where: {id: Number(id)}
        })

        return response
        .json({
            status: true,
            data: updateGaun,
            message: `Gaun has been update`
        }).status(200)
    } catch (error) {
        return response
            .json({
                status: false,
                message: `There is an error. ${error}`
            }).status(400)
    }
}

export const delGaun = async (request: Request, response: Response) => {
    try {
        const {id} = request.params

        const findGaun = await prisma.gaun.findFirst({
            where: { id: Number(id) }
        })

        if (!findGaun)
            return response
                .json({
                    status: false,
                    message: `Gaun is not found`
                }).status(200)

        let path = `${BASE_URL}/public/gaun-image/${findGaun.gambar}`
        let exists = fs.existsSync(path)
        if (exists && findGaun.gambar !== ``) fs.unlinkSync(path)

        const deleteGaun = await prisma.gaun.delete({
            where: {id: Number(id)}
        })

        return response
        .json({
            status: true,
            data: deleteGaun,
            message: `Gaun has been delete`
        }).status(200)
    } catch (error) {
        return response
            .json({
                status: false,
                message: `There is an error. ${error}`
            }).status(400)
    }
}