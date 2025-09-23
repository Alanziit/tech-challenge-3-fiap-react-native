import { Documento } from "./documento.interface";
import { Extract } from "./extrato.interface";

export interface Account {
    id:string,
    userName?: string,
    saldo?:number,
    extrato?:Array<Extract>,
    documento?: Documento,
    dataCriacao?: Date
}