import { BlockPlugin } from "@kishtarn/mcboilerplate";
interface stairsOptions {
    baseNamespace?:string,

}

const getCornerVisible = (leftOnDirection: 'east'|'west'|'north'|'south', rightOnDirection: 'east'|'west'|'north'|'south', baseNamespace: string) => {
    const oposite  = {
        'north': 'south',
        'east': 'west',
        'south': 'north',
        'west': 'east',
    } as const;
    return (
        `(q.block_state('minecraft:cardinal_direction') == '${leftOnDirection}' && (q.block_state('${baseNamespace}:stair_mode') == 'normal' || q.block_state('${baseNamespace}:stair_mode') == 'left_dot' || q.block_state('${baseNamespace}:stair_mode') == 'left_l' ||  q.block_state('${baseNamespace}:stair_mode') == 'right_l'))`
        + ` || (q.block_state('minecraft:cardinal_direction') == '${rightOnDirection}' && (q.block_state('${baseNamespace}:stair_mode') == 'normal' || q.block_state('${baseNamespace}:stair_mode') == 'right_dot' || q.block_state('${baseNamespace}:stair_mode') == 'right_l' || q.block_state('${baseNamespace}:stair_mode') == 'left_l'))`
        + ` || (q.block_state('minecraft:cardinal_direction') == '${oposite[leftOnDirection]}' && q.block_state('${baseNamespace}:stair_mode') == 'left_l')`
        + ` || (q.block_state('minecraft:cardinal_direction') == '${oposite[rightOnDirection]}' && q.block_state('${baseNamespace}:stair_mode') == 'right_l')`
    );
}

export const stairsBlock =(trapdoorOptions: stairsOptions): BlockPlugin => (target)=> {
    const baseNamespace = trapdoorOptions.baseNamespace ?? "cc";


    target.setState(`${baseNamespace}:stair_mode`, ["normal", "left_dot", "right_dot", "left_l", "right_l"]);
    target.setComponent(
        "minecraft:geometry",
        { 
            identifier: `geometry.cc_stairs`,
            bone_visibility: {
                bottomne: `q.block_state('minecraft:vertical_half') == 'bottom' || (${getCornerVisible('south','east',  baseNamespace)})`,
                bottomnw: `q.block_state('minecraft:vertical_half') == 'bottom' || (${getCornerVisible('west','south', baseNamespace)})`,
                bottomse: `q.block_state('minecraft:vertical_half') == 'bottom' || (${getCornerVisible('east','north', baseNamespace)})`,
                bottomsw: `q.block_state('minecraft:vertical_half') == 'bottom' || (${getCornerVisible('north','west', baseNamespace)})`,

                topne: `q.block_state('minecraft:vertical_half') == 'top' || (${getCornerVisible('south','east',  baseNamespace)})`,
                topnw: `q.block_state('minecraft:vertical_half') == 'top' || (${getCornerVisible('west','south', baseNamespace)})`,
                topse: `q.block_state('minecraft:vertical_half') == 'top' || (${getCornerVisible('east','north', baseNamespace)})`,
                topsw: `q.block_state('minecraft:vertical_half') == 'top' || (${getCornerVisible('north','west', baseNamespace)})`,
            }
        }
    );
    target.setCustomComponent(
        "cc:stairs",{}
    );
    target.setTrait(
        "minecraft:placement_direction",
        {
            enabled_states: ["minecraft:cardinal_direction"] ,
            y_rotation_offset: 180
        }
    );
    target.setTrait(
        "minecraft:placement_position",
        {
            enabled_states: ["minecraft:vertical_half"] 
        }
    );

}