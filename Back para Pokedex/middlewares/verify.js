const jwt =require("jsonwebtoken")

const TOKEN_SECRET = "laClaveUltraSecreta"

const verifyToken = (req,res,next)=>{
    try {
        const token = req.header("auth-token");

        if(!token){
            return res.status(401).json({error: "acceso denegado"});
        }
        
        const userVerified = jwt.verify(token, TOKEN_SECRET)

        req.user = userVerified
 
        next()
    } catch (error) {
        return res.status(401).json({error: "Token no valido"});        
    }
}

module.exports={TOKEN_SECRET, verifyToken}