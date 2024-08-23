import express from "express"
import adminR from "./route/adminR"
import custR from "./route/custR"
import gaunR from "./route/gaunR"
import transaksiR from "./route/transaksiR"

const app = express()
const PORT = 800

app.use(express.json())

app.use(adminR)
app.use(custR)
app.use(gaunR)
app.use(transaksiR)

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})