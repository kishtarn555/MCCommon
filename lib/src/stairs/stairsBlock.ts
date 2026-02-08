import { BlockPlugin } from "@kishtarn/mcboilerplate";
import { freezeBlock } from "../freeze/freezableBlock.js";
interface stairsOptions {
    /** Enable this if you want your stair to have the freeze state, which allows it to freeze its bend
     * If this feature is not wanted, then it is recommended to disable this to avoid creating unnecessary permutations.
     */
    freezable?:string,

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
    const baseNamespace = "cc";
    if (trapdoorOptions.freezable) {
        target.usePlugin(freezeBlock());
    }
    const VALID_STAIR_MODE = ["normal", "left_dot", "right_dot", "left_l", "right_l"]
    target.setState(`${baseNamespace}:stair_mode`, VALID_STAIR_MODE);
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
    
    target.setCustomComponent(
        "tag:cc:stairs",{}
    );

    const sizeToState: Record<string, [[number, number], [number, number, number]]> = {
        "normal": [[-8,-8], [8, 8, 16]],
        "left_dot": [[-8,-8], [8, 8, 8]],
        "right_dot": [[-8,0], [8, 8, 8]],
        "left_l": [[-8,-8], [16, 8, 8]],
        "right_l": [[-8,0], [16, 8, 8]],
    }

    let permutations: { condition: string,components: Partial<any>}[] = [
        ...VALID_STAIR_MODE.flatMap(stair_mode => [
            {
                condition: `q.block_state('minecraft:vertical_half') == 'bottom' && ${baseNamespace}:stair_mode == '${stair_mode}'`,
                components: {
                    "minecraft:collision_box": [
                        { "origin": [-8, 0, -8], "size": [16, 8, 16] },
                        { 
                            "origin": [
                                sizeToState[stair_mode][0][0], 8, sizeToState[stair_mode][0][1]
                            ], 
                            size: sizeToState[stair_mode][1]
                        }

                    ]
                }
            },
            {
                condition: `q.block_state('minecraft:vertical_half') == 'top' && ${baseNamespace}:stair_mode == '${stair_mode}'`,
                components: {
                    "minecraft:collision_box": [
                        { "origin": [-8, 8, -8], "size": [16, 8, 16] },
                        { 
                            "origin": [
                                sizeToState[stair_mode][0][0], 0, sizeToState[stair_mode][0][1]
                            ], 
                            size: sizeToState[stair_mode][1]
                        }

                    ]
                }
            },
        ]),
    ]

    if (target.permutations.length === 0) {
        target.permutations = permutations;
    } else {
        target.permutations = target.permutations.flatMap(
            perm => permutations.map(stairPerms => ({
                condition: `(${perm.condition}) && ${stairPerms.condition}`,
                components: {
                    ...perm.components,
                    ...stairPerms.components,
                }
            }))
        );
    }

}