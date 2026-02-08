import { BlockPlugin } from "@kishtarn/mcboilerplate";
interface TrapdoorOptions {
    baseNamespace?:string,
    openSound?: string,
    closeSound?: string,

}

const getTrapdoorPermutation = (facing: "north" | "east" | "west"| "south", vertical_half:"bottom" | "top", open_bit:boolean) => {
  const rots = {
    "north": 0,
    "east": -90,
    "west": 90,
    "south": 180
  };
  const rotY = rots[facing];

  const box = open_bit?
  {
    "origin": [-8, 0, 5],
    "size": [16, 16, 3]
  } : {
    "origin": [-8, 0, -8],
    "size": [16, 3, 16]
  }
  let dY = (vertical_half  === "bottom") || (["south", "north"].indexOf(facing)!==-1)?0:180;
  const perm = {
    "condition": `q.block_state('minecraft:cardinal_direction') == '${facing}' && q.block_state('minecraft:vertical_half') == '${vertical_half}' && q.block_state('cc:open_bit') == ${open_bit}`,
    "components": {

      "minecraft:transformation": { "rotation": [0, rotY + dY, vertical_half==="bottom"?0:180]},
      
      "minecraft:collision_box": box,
      "minecraft:selection_box": box,
    }
  };

  return perm;
}

export const trapdoorBlock =(trapdoorOptions: TrapdoorOptions): BlockPlugin => (target)=> {
    const baseNamespace = trapdoorOptions.baseNamespace ?? "cc";


    target.setState(`${baseNamespace}:open_bit`, [false, true]);
    target.setComponent(
        "minecraft:geometry",
        { 
            identifier: `geometry.cc_trapdoor`,
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

    
    let permutations: { condition: string,components: Partial<any>}[] = [];
    const or = ["bottom", "top"] as const;
    for (let i = 0; i < 4; i++) {
        permutations.push(
        getTrapdoorPermutation("north", or[i&1], (i&2)!==0?true:false)
        );
        permutations.push(
        getTrapdoorPermutation("east", or[i&1], (i&2)!==0?true:false)
        );
        permutations.push(
        getTrapdoorPermutation("south", or[i&1], (i&2)!==0?true:false)
        );
        permutations.push(
        getTrapdoorPermutation("west", or[i&1], (i&2)!==0?true:false)
        );
    }

    if (target.permutations.length === 0) {
        target.permutations = permutations;
    } else {
        target.permutations = target.permutations.flatMap(
            perm => permutations.map(trapdoorPerm => ({
                condition: `(${perm.condition}) && ${trapdoorPerm.condition}`,
                components: {
                    ...perm.components,
                    ...trapdoorPerm.components,
                }
            }))
        );
    }
}