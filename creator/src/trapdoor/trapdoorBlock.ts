import { BlockPlugin } from "@kishtarn/mcboilerplate";
interface TrapdoorOptions {
    baseNamespace?:string,
    openSound?: string,
    closeSound?: string,

}

export const trapdoorBlock =(trapdoorOptions: TrapdoorOptions): BlockPlugin => (target)=> {
    const baseNamespace = trapdoorOptions.baseNamespace ?? "cc";


    target.setState(`${baseNamespace}:open_bit`, [false, true]);
    target.setComponent(
        "minecraft:geometry",
        { 
            identifier: `mccommon:geometry.trapdoor`,                
            bone_visibility: {
                open: `q.block_state('${baseNamespace}:open_bit')`,
                closed: `!q.block_state('${baseNamespace}:open_bit')`
            }
        }
    );
    target.setCustomComponent(
        "cc:openable",{
            openSound:trapdoorOptions.openSound,
            closeSound:trapdoorOptions.closeSound,
            
        }
    );
}