import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({ errorFormat: "pretty" })

export const getTransaksi = async (request: Request, response: Response) => {
    try {
        const {search} = request.query

        const allTransaksi = await prisma.transaksi.findMany({
            where: {
                OR: [
                    {
                        status_payment: { contains: search?.toString() || "" },
                        status_sewa: { contains: search?.toString() || "" }
                    }
                ]
            },
            include: {
                detail_transaksi: { include: { gaun_detail: true } },
                cust_detail: true
            }
        })

        return response
            .json({
                status: true,
                data: allTransaksi,
                message: `Transaksi has been loaded`
            })
    } catch (error) {
        return response.json({
            status: false,
            message: `There is an error.${error}`
        }).status(400)
    }
}

export const postTransaksi = async (request: Request, response: Response) => {
    try {
        const { id_cust, tgl_sewa, tgl_kembali, status_payment, status_sewa, detail_transaksi } = request.body

        const newTransaksi = await prisma.transaksi.create({
            data: { id_cust, tgl_sewa, tgl_kembali, status_payment, status_sewa }
        })

        for (let index = 0; index<detail_transaksi.length; index++) {
            const {id_gaun, jumlah, harga} = detail_transaksi[index]

            await prisma.detail_transaksi.create({
                data: {
                    id_transaksi: newTransaksi.id,
                    id_gaun: Number(id_gaun),
                    jumlah: Number(jumlah),
                    harga: Number(harga)
                }
            })
        }

        return response
        .json({
            status: true,
            data: newTransaksi,
            message: `New transaksi has been create`
        })
    } catch (error) {
        return response.json({
            status: false,
            message: `There is an error.${error}`
        }).status(400)
    }
}

export const delTransaksi = async (request: Request, response: Response) => {
    try {
        const {id} = request.params

        const findTransaksi = await prisma.transaksi.findFirst({
            where: {id: Number(id)}
        })

        if (!findTransaksi)
            return response
        .status(200)
        .json({
            status: false,
            message: `Transaksi is not found`
        })

        let deleteTransaksi = await prisma.transaksi.delete({where: {id: Number(id)}})

        return response
        .json({
            status: true,
            data: deleteTransaksi,
            message: `Transaksi has been delete`
        }).status(200)
    } catch (error) {
        return response.json({
            status: false,
            message: `There is an error.${error}`
        }).status(400)
    }
}

export const readTransaksi = async (request: Request, response: Response) => {
    try {
        const {id} = request.params


        const Transaksi = await prisma.transaksi.findFirst({
            where: {
                id: Number(id)
            },
            include: {
                cust_detail: true,
                detail_transaksi: { include: { gaun_detail: true } },
            }
        })
        if (!Transaksi)
            return response
                .json({
                    status: false,
                    message: `Transaksi is not found`
                }).status(200)

        return response
            .json({
                status: true,
                data: Transaksi,
                message: `Transaksi has been loaded`
            })
    } catch (error) {
        return response.json({
            status: false,
            message: `There is an error.${error}`
        }).status(400)
    }
}