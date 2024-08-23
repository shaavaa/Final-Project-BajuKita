import express from "express"
import { verifyTokenAdmin } from "../middleware/auth"
import { delTransaksi, getTransaksi, postTransaksi, readTransaksi } from "../controller/transaksiC"
import { verifyTokenCust } from "../middleware/auth"
import { verifyAddTransaksi } from "../middleware/transaksiM"

const app = express()
app.use(express.json())

app.get(`/transaksi`, [verifyTokenAdmin], getTransaksi)
app.get(`/transaksi/:id`, [verifyTokenCust], readTransaksi)
app.post(`/transaksi`, [verifyTokenCust, verifyAddTransaksi], postTransaksi)
app.delete(`/transaksi/:id`, [verifyTokenCust] ,delTransaksi)

export default app