//create a sample express server here
import express from 'express'
import { getDetails } from './captcha.js'
import cors from 'cors'
import { config } from 'dotenv'
config()
const app = express()

app.use(express.json())
app.use(cors('*'))
app.post('/',async (req, res)=> {
    console.log(req.body)
    const {passportNumber, passportExpiry} = req.body

    if(!passportNumber || !passportExpiry){
        return res.status(400).json({message: "Please provide passport number and expiry date"})
    }

    try {
        const response = await getDetails(passportNumber, passportExpiry)
        if(response.message === "not avaliable"){
            return res.status(400).json({message: response.message})
        }
        return res.status(200).json(response)
    } catch (error) {
        return res.status(500).json({message: "something went wrong"})
    }
})
app.listen(process.env.PORT||3000, () => console.log('Server started on port 3000'))
