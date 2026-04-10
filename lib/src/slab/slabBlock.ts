import { BlockPermutation, BlockPlugin } from "@kishtarn/mcboilerplate";



export const SlabBlock =(): BlockPlugin => (target)=> {    

    target.setTrait(
        "minecraft:placement_position", {
            enabled_states: ["minecraft:vertical_half"] 
        }
    )
    target.setComponent("minecraft:geometry", {
        identifier: "geometry.cc_slab",
        bone_visibility: {            
          lower: "q.block_state('minecraft:vertical_half')=='bottom'",
          top: "q.block_state('minecraft:vertical_half')=='top'"
        }
    });
    const permutations = []
    if (target.permutations.length > 0) {
        for (const permutation of target.permutations) {
            const bottomPerm: BlockPermutation = { 
                condition: `q.block_state('minecraft:vertical_half')=='bottom' && (${permutation.condition})`,
                components: {
                    ...permutation.components,
                    "minecraft:selection_box": { "origin": [-8, 0, -8], "size": [16, 8, 16] },
                    "minecraft:collision_box": { "origin": [-8, 0, -8], "size": [16, 8, 16] }
                }
            };const topPerm: BlockPermutation = { 
                condition: `q.block_state('minecraft:vertical_half')=='top' && (${permutation.condition})`,
                components: {
                    ...permutation.components,
                    "minecraft:selection_box": { "origin": [-8, 8, -8], "size": [16, 8, 16] },
                    "minecraft:collision_box": { "origin": [-8, 8, -8], "size": [16, 8, 16] }
                }
            };
            permutations.push(bottomPerm);
            permutations.push(topPerm);
        }
    } else {
        permutations.push({
            condition: "q.block_state('minecraft:vertical_half')=='bottom'",
            components: {
                "minecraft:selection_box": { "origin": [-8, 0, -8], "size": [16, 8, 16] },
                "minecraft:collision_box": { "origin": [-8, 0, -8], "size": [16, 8, 16] }
            }
        });
        permutations.push({
            condition: "q.block_state('minecraft:vertical_half')=='top'",
            components: {
                "minecraft:selection_box": { "origin": [-8, 8, -8], "size": [16, 8, 16] },
                "minecraft:collision_box": { "origin": [-8, 8, -8], "size": [16, 8, 16] }
            }
        });
    }
    target.permutations = permutations;
    

}