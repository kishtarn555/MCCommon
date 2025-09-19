import { BlockPermutation } from "@minecraft/server";

import { world,system } from "@minecraft/server";

function debugParticle(x, y, z) {
    const location = { x, y, z };
    
    
    // spawn a simple vanilla particle (flame)
    system.run(()=>{
        const overworld = world.getDimension("overworld");
        for (let i = 0; i < 1; i++) {
            
            // console.error("SPAWNING AT", JSON.stringify(location));
            overworld.spawnParticle("minecraft:blue_flame_particle", location);
        }
    });
}

const getState = (face) => {
    switch (face) {
        case "Up":
            return "cc:b";
        case "Down":
            return "cc:t";
        default:
            return `cc:${face.charAt(0).toLowerCase() }`;
    }
}

export class LichenLikeComponent {
    
    beforeOnPlayerPlace(arg, p) {
        const block = arg.block;
        if (block.type === arg.permutationToPlace.type) {
            const hit = arg.player.getBlockFromViewDirection({
                includePassableBlocks: false
            });

            
            if (!hit) {
                arg.cancel = true;
                return;
            }
            const dist = {
                x: arg.block.x - hit.block.x,
                y: arg.block.y - hit.block.y,
                z: arg.block.z - hit.block.z,
            }

            if (dist.x*dist.x+dist.y*dist.y+dist.z*dist.z > 1.01) {
                arg.cancel = true;
                return;
            }


            arg.permutationToPlace = arg.block.permutation.withState(
                getState(hit.face), true
            )

        } else {
            
            arg.permutationToPlace = arg.permutationToPlace.withState(
                getState(arg.face), true
            )
        }
    }
}