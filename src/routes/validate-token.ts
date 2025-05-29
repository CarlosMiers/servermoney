import { Request, Response, NextFunction } from "express";
import config from "../config/varenv";
import jwt from 'jsonwebtoken';

const validateToken = (req: Request, res: Response, next: NextFunction) => {
    const headerToken = req.headers['authorization']
    console.log(headerToken);
    if (headerToken != undefined && headerToken.startsWith('Bearer')) {
        try {
            const bearerToken = headerToken.slice(7);
            jwt.verify(bearerToken, config.secretkey)
            next()
        } catch (error) {
            res.status(401).json({
                msg: 'Token no válido'
            })
        }
    } else {
        res.status(401).json({
            msg: 'Acceso Denegado'
        })
    }

}

export default validateToken;
