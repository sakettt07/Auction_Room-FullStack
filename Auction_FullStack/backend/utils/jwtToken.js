export const generateToken=(user,message,stateCode,res) =>{
    const token=user.generateToken();
    res.status(stateCode).cookie("token",token,{
        expires:new Date(Date.now()+process.env.JWT_COOKIE_EXPIRE*24*60*60*1000),
        httpOnly:true,
        secure:true
    }).json({
        success:true,
        message,
        token,
        user
    })
}