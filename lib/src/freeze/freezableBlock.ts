import { BlockPlugin } from "@kishtarn/mcboilerplate";


export const freezeBlock =(): BlockPlugin => (target)=> {
    target.setState(`cc:freeze`, ["unfrozen", "partial", "all"]); 
}