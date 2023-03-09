const bcryptjs = require('bcryptjs');
const {response, json}= require('express');
const {generarJWT} = require('../helpers/generar-jwt')
const { googleVerify } = require('../helpers/google-verify');
const usuario = require('../models/usuario');


const Usuario= require('../models/usuario')

const login = async(req,res= response) =>{
    const {correo, password} = req.body;
    try {
        //VErificar si el email existe

        const usuario = await Usuario.findOne({correo});

        if(!usuario){
            return res.status(400).json({
                msg: 'Usuario / PAssword no son correctos-correo'
            })
        }

        //Verifico si el usuario esta activo

        if (!usuario.estado) {
            return res.status(400).json
({
    msg: 'Usuarios/ pasword o son correctos- estado-false'
})            
        }

        //Verificarla contraseña

        const validPassword = bcryptjs.compareSync(password, usuario.password);
        if (!validPassword) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos- password'
            })
            
        }

        //Generar el JWT
const token = await generarJWT(usuario.id);
console.log("token",token);

    res.json({
        usuario,
        token
    })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Hable con el administrador'
        })
        
    }

}

const googleSignIn = async(req, res = response) => {

    const { id_token } = req.body;
    try {

        const { correo, nombre, img } = await googleVerify(id_token)
        let usuario = await Usuario.findOne({correo});

        if (!usuario) {
            const data ={
                nombre,
                correo,
                password: ':p',
                img,
                google: true
            }

            usuario= new Usuario(data);
            await usuario.save();

            //Si el usuario en DB
            if (!usuario.estado) 
            {
                return res.status(401).json({
                    msg: 'Hable con el administrador, usuaro bloqueado'
                })
                
            }

            const token = await generarJWT(usuario.id);

            res.json({
                usuario,
                token
            });
            
        }

        
    } catch (error) {

        res.status(400).json({
            ok: false,
            msg: 'El token no se pudo verificar'
        })
        
    }

    


}

module.exports ={
    login,
    googleSignIn
}