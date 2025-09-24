export interface Conta {
    id:string,
    name?: string,
    saldo?:number,
    extrato?:Array<any>,
    documento?: Array<any>,
}