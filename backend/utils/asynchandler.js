const asynchandlers=(requesthandler)=>{
    return (req,res,next) =>{
    Promise.resolve(requesthandler(req,res,next)).catch
    ((err)=>next(err))
    }
}
//for production grade only
module.exports = asynchandlers; 
//export {asynchandler}