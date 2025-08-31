import { Extract } from "./extrato.interface";

export interface Account {
    id:number,
    userName?: string,
    saldo?:number,
    extrato?:Array<Extract>
    dataCriacao?: Date
}