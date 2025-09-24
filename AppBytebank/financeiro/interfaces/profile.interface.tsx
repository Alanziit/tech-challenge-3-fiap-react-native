import { Conta } from "./conta.interface";

export interface Profile {
    id:string,
    userName?: string,
    conta:Conta,
    dataCriacao?: Date
}