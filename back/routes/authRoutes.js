import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import pool from '../db/db.js'
import authenticateToken from "../middleware/authToken.js";


const router = express.Router()

router.post("/signup", async (req, res) => {
    const { name, email, password } = req.body;

    const hashedPassword = bcrypt.hashSync(password, 8);

    try {

        
        const user = await pool.query(
            `INSERT INTO users (name, email, password)
            VALUES ($1, $2, $3)
            RETURNING id`,
            [name, email, hashedPassword]
        )
        
       
        const token = jwt.sign({ id: user.rows[0].id }, process.env.JWT_SECRET, { expiresIn: '24h' });

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 24 * 60 * 60 * 1000, 
        });
        res.status(200).json({ message: "User created successfully" });


    } catch (err) {
        if (err.code === "23505") {
            return res.status(409).json({ message: "User already exists" });
        }
        console.log(err.message)
        res.sendStatus(503)
    }
})

router.post("/login", async (req, res) => {
    const {email, password} = req.body;

    try {
        const user = await pool.query(
            `SELECT id, password
            FROM users WHERE email = $1`,
        [email])
            
        if(user.rows.length === 0){return res.status(401).send({message: "user not found"})}
        
        
        const passwordIsValid = bcrypt.compareSync(password, user.rows[0].password)

        if (!passwordIsValid) { return res.status(401).send({ message: "Invalid password" }) }

        const token = jwt.sign({ id: user.rows[0].id }, process.env.JWT_SECRET, { expiresIn: '24h' })
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 24 * 60 * 60 * 1000, 
            });
        res.status(200).json({ message: "Login successful" });


    } catch(err){
        console.log(err.message)
        res.sendStatus(503)
    }
  

})
router.post("/logout", (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
    });
    res.status(200).json({ message: "Logged out successfully" });
});

router.get("/me", authenticateToken, (req, res) => {
    res.json({ loggedIn: true, userId: req.user.id });
});


export default router;