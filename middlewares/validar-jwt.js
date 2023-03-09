const {response, request} = require('express')
const jwt = require('jsonwebtoken');
const usuario = require('../models/usuario');
const Usuario = require('../models/usuario');


const validarJWT = async(req = request, res = response, next) => {

console.log("ingreso a validar");
    const token = req.header('x-token');
    console.log(token);
    if (!token) {
        return res.status(401).json({
            msg: 'No hay token en la peticion'
        })
    } ;


    try {
     const {uid} = jwt.verify(token, process.env.SECRTORPRIVTEKEY);

        req.uid = uid;
        usuario= await Usuario.findById(uid);
        if (!usuario) {
            return res.status(401).json({
                msg: 'usuario no existe en bd'
            })
            
        }
        if(!usuario.estado){
            return res.status(401).json({
                msg: 'token no valido-usuario con estado false'

            })
        }
        console.log("el usuario encontrado es",req.user);
req.user=usuario;
     
        next();
    } catch (error) {
        console.log("El error es:",error);
    }
}

module.exports = {
    validarJWT
}