import { Extract } from "./extrato.interface";

export interface Account {
    id:string,
    userName?: string,
    saldo?:number,
    extrato?:Array<Extract>
    dataCriacao?: Date
}