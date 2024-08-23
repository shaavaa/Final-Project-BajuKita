import express from "express"
import { getAdmin, postAdmin, putAdmin,delAdmin, authentication, getCust } from "../controller/adminC"
import { verifyTokenAdmin } from "../middleware/auth"
import { verifyAddAdmin, verifyAuth, verifyUpdateAdmin } from "../middleware/adminM"

const app = express()

app.use(express.json())

app.get(`/admin`, [verifyTokenAdmin], getAdmin)
app.post(`/admin`, [verifyTokenAdmin], postAdmin)
app.put(`/admin/:id`, [verifyTokenAdmin, verifyUpdateAdmin], putAdmin)
app.delete(`/admin/:id`,[verifyTokenAdmin], delAdmin)
app.get(`/cust`, [verifyTokenAdmin], getCust)
app.post(`/auth`, [verifyAuth], authentication)

export default app