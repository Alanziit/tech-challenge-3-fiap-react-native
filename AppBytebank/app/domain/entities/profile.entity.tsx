import { Conta } from "./conta.entity";

export interface Profile {
    id:string,
    userName?: string,
    conta:Conta,
    dataCriacao?: Date
}