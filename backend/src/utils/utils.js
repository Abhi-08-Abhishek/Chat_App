import jwt from 'jsonwebtoken';
 
        //pass in parameter userId to generate token
        export const generateToken = async(userId, res) => {
            const jwt_secret = process.env.JWT_SECRET;
            const token = await jwt.sign({userId}, jwt_secret, {expiresIn:'15d'});   
      
            // set token in cookie
        res.cookie('jwt', token , {
        maxAge: 15*24*60*60*1000,   // 7 days
        httpOnly: true, // prevent XSS attacks cross-site scripting attacks
        sameSite: "strict", // CSRF attacks cross-site request forgery attacks
       
       // secure:process.env.NODE_ENV !== "development"
        
})
return token;
}

/*export const generate = (userId , res) =>{
   const token = jwt.sign({userId},secret_key,{expiresIn:'1d'});

   res.cookie('jwt',token ,{
    maxAge:24*60*60*1000,
    httpOnly:true,
    secure:NODE_ENV !== 'development'
   })
   return token
}*/