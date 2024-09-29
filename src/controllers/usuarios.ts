import { Request, Response } from "express"
import { UserModel } from '../models/usuarios';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const getUsuarios = async (req: Request, res: Response) => {
    const listUsers = await UserModel.findAll();
    res.json({
        listUsers
    })
}

export const newUser = async (req: Request, res: Response) => {
    const { loginacceso, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    //validamos si el usuario ya existe
    const user = await UserModel.findOne({ where: { loginacceso: loginacceso } });
    if (user) {
        return res.status(400).json({
            msg: `Ya existe un Usuario con el nombre ${loginacceso}`
        })
    }
    try {
        await UserModel.create({
            loginacceso: loginacceso,
            password: hashedPassword,
        })

        res.json({
            msg: `Usuario ${loginacceso} creado exitosamente`,
        })
    } catch (error) {
        res.status(400).json({
            msg: `Ocurrio un error al Intentar crear el Usuario`,
            error
        })
    }

}


export const loginUser = async (req: Request, res: Response) => {

    const { loginacceso,password} = req.body;

    //validamos si el usuario existe en la base de datos
    const login: any = await UserModel.findOne({ where: { loginacceso: loginacceso } });
    if (!login) {
        return res.status(400).json({
            msg: `No existe un Usuario con el nombre ${loginacceso}`
        })
    }

    //validamos si el password es válido
    const passwordValid = await bcrypt.compare(password, login.password)
    console.log(passwordValid)
    if (!passwordValid) {
        return res.status(400).json({
            msg: `Password Incorrecto ${loginacceso}`
        })
    }

    //generamos el token

    const token = jwt.sign({
        loginacceso:loginacceso
    },process.env.SECRET_KEY || '85OYVb@2mUw1')

    res.json(token);

}    
