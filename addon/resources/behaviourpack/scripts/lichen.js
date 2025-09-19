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
            const states = arg.block.permutation.getAllStates();
            const state = getState(hit.face);
            if (state in states && !states[state]) {
                arg.permutationToPlace = arg.block.permutation.withState(
                    state, true
                )
            } else {
                const alternative = Object.entries(states).find(([key, value])=> {
                    if (value) return false;
                    switch(key) {
                        case "cc:t": return arg.block.above().isValid && !arg.block.above().isAir
                        case "cc:b": return arg.block.below().isValid && !arg.block.below().isAir
                        case "cc:s": return arg.block.north().isValid && !arg.block.north().isAir
                        case "cc:w": return arg.block.east().isValid && !arg.block.east().isAir
                        case "cc:n": return arg.block.south().isValid && !arg.block.south().isAir
                        case "cc:e": return arg.block.west().isValid && !arg.block.west().isAir
                    }
                    return false;
                });
                if (alternative) {
                    arg.permutationToPlace = arg.block.permutation.withState(
                    alternative[0], true
                )
                } else {
                    arg.cancel = true;
                }
            }

        } else {
            const states = arg.permutationToPlace.getAllStates();

            const state = getState(arg.face);            
            if (state in states) {
                arg.permutationToPlace = arg.permutationToPlace.withState(
                    state, true
                    
                )
            }
        }
    }
}