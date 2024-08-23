import express from "express"
import { delGaun, getGaun, postGaun, putGaun } from "../controller/gaunC"
import { verifyTokenAdmin } from "../middleware/auth"
import { uploadFile } from "../middleware/uploadImage"
import { verifyAddGaun, verifyEditGaun } from "../middleware/gaunM"

const app = express()

app.use(express.json())

app.get(`/gaun`, getGaun)
app.post(`/gaun`, [verifyTokenAdmin, uploadFile.single("gambar"), verifyAddGaun], postGaun)
app.put(`/gaun/:id`, [verifyTokenAdmin, uploadFile.single("gambar"), verifyEditGaun], putGaun)
app.delete(`/gaun/:id`, [verifyTokenAdmin], delGaun)

export default app