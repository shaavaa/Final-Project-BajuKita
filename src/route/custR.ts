import express from "express"
import { authentication, delCust, getCust, postCust, putCust } from "../controller/custC"
import { verifyTokenCust } from "../middleware/auth"
import { verifyAddCust, verifyAuth, verifyUpdateCust } from "../middleware/custM"

const app = express()

app.use(express.json())

app.post(`/cust`, [verifyAddCust], postCust)
app.put(`/cust/:id`, [verifyTokenCust, verifyUpdateCust], putCust)
app.delete(`/cust/:id`, [verifyTokenCust], delCust)
app.post(`/authCust`, [verifyAuth], authentication)
app.get(`/cust/:id`, [verifyTokenCust], getCust)

export default app