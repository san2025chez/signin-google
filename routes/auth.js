const { login } = require("../controllers/auth");
const { googleSignIn } = require("../controllers/auth")
const { usuariosGet } = require("../controllers/usuarios");


const {Router} = require('express')
const {check}=require('express-validator');
const { validarCampos } = require("../middlewares/validar-campos");

const router = Router();

router.post('/login',[
    check('correo', 'el correo e obligatorio').isEmail(),
    check('password','la contraseña es obligatoria').not().isEmpty(),
validarCampos], login)


router.post('/google',[
    check('id_token', 'id_token es necesario').not().isEmpty(),
validarCampos], googleSignIn)


module.exports= router;