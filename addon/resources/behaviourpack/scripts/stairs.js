
import { BlockPermutation, system } from "@minecraft/server";
const getStairDirection = (block)=> {
    if (!block.isValid) {
        return undefined;
    }
    if (block.hasTag('cc:stairs')) {
        return block.permutation.getState("minecraft:cardinal_direction");
    }
    return undefined;
}
const getStairSide = (block)=> {
    if (!block.isValid) {
        return undefined;
    }
    if (block.hasTag('cc:stairs')) {
        return block.permutation.getState("minecraft:vertical_half");
    }
    return undefined;
}

const getStairPermutation = (block, permutation) => {
    const dir = permutation.getState("minecraft:cardinal_direction");
    const side = permutation.getState("minecraft:vertical_half");
    let lDot = false;
    let rDot = false;
    
    let lHoleSoft = false;
    let rHoleSoft = false;

    let lHoleHard = false;
    let rHoleHard = false;

    const northSide = getStairSide(block.north());
    const southSide = getStairSide(block.south());
    const westSide = getStairSide(block.west());
    const eastSide = getStairSide(block.east());
    
    const northDirection = getStairDirection(block.north());
    const southDirection = getStairDirection(block.south());
    const westDirection = getStairDirection(block.west());
    const eastDirection = getStairDirection(block.east());
    if (dir === 'north') {


        if (southSide ===  side) {
            if (southDirection === "west") lDot = true;
            else if (southDirection === "east") rDot = true;
        }
        
        if (northSide ===  side) {
            if (northDirection === "west") {
                rHoleSoft = true;
                rHoleHard = (westSide === side && westDirection === dir);
            }
            else if (northDirection === "east") {
                lHoleSoft = true;
                lHoleHard = (eastSide === side && eastDirection === dir);
            }
        }

        
        if (eastSide == side && eastDirection == dir && westSide == side && westDirection == dir) {
           return permutation.withState("cc:stair_mode", "normal");
        }
    }

    
    if (dir === 'south') {


        if (northSide ===  side) {
            if (northDirection === "west") rDot = true;
            else if (northDirection === "east") lDot = true;
        }
        
        if (southSide ===  side) {
            if (southDirection === "west") {
                lHoleSoft = true;
                lHoleHard = (westSide === side && westDirection === dir);
            }
            else if (southDirection === "east") {
                rHoleSoft = true;
                rHoleHard = (eastSide === side && eastDirection === dir);
            }
        }

        
        if (eastSide == side && eastDirection == dir && westSide == side && westDirection == dir) {
           return permutation.withState("cc:stair_mode", "normal");
        }
    }
    
    
    if (dir === 'east') {


        if (westSide ===  side) {
            if (westDirection === "north") lDot = true;
            else if (westDirection === "south") rDot = true;
        }
        
        if (eastSide ===  side) {
            if (eastDirection === "north") {
                rHoleSoft = true;
                rHoleHard = (northSide === side && northDirection === dir);
            }
            else if (eastDirection === "south") {
                lHoleSoft = true;
                lHoleHard = (southSide === side && southDirection === dir);
            }
        }

        
        if (northSide == side && northDirection == dir && southSide == side && southDirection == dir) {
           return permutation.withState("cc:stair_mode", "normal");
        }
    }

    if (dir === 'west') {


        if (eastSide ===  side) {
            if (eastDirection === "north") rDot = true;
            else if (eastDirection === "south") lDot = true;
        }
        
        if (westSide ===  side) {
            if (westDirection === "north") {
                lHoleSoft = true;
                lHoleHard = (northSide === side && northDirection === dir);
            }
            else if (westDirection === "south") {
                rHoleSoft = true;
                rHoleHard = (southSide === side && southDirection === dir);
            }
        }

        
        if (northSide == side && northDirection == dir && southSide == side && southDirection == dir) {
           return permutation.withState("cc:stair_mode", "normal");
        }
    }

    if (rHoleHard) {
        return permutation.withState("cc:stair_mode", "right_l");
    } else if (lHoleHard) {
        return permutation.withState("cc:stair_mode", "left_l");
    } else if (lDot) {
        return permutation.withState("cc:stair_mode", "left_dot");
    } else if (rDot) {
        return permutation.withState("cc:stair_mode", "right_dot");
    } else if (rHoleSoft) {
        return permutation.withState("cc:stair_mode", "right_l");
    } else if (lHoleSoft) {
        return permutation.withState("cc:stair_mode", "left_l");
    }
    return permutation.withState("cc:stair_mode", "normal");
}



export const updateStair = (block) => {
    if (block.permutation.getState("cc:freeze") === "all") {
        return;
    }
    const perm = getStairPermutation(block, block.permutation);    
    if (block.permutation.getState("cc:freeze") !== "partial") {
        block.setPermutation(perm);
    }
    

}
export class StairComponent {
    beforeOnPlayerPlace(arg, p) {
        const perm = getStairPermutation(arg.block, arg.permutationToPlace);
        arg.permutationToPlace = perm;
    }

    onPlayerBreak(arg, p) {
        const above = arg.block.above();
        if (above.isValid && above.type.id === "cc:staircollider") {
            above.setPermutation(BlockPermutation.resolve("air"));
        }
    }
    onRandomTick(arg, p) {
        updateStair(arg.block);
    }
}

