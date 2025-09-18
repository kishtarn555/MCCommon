
import { system } from "@minecraft/server";

const OPEN_STATE = "cc:open_bit"


class OpenableComponent {
    onPlayerInteract (arg, p) {
        const block = arg.block;
        const bit = block.permutation.getState(OPEN_STATE);
        const params = p.params ;
        const sound = bit ?   params.closeSound : params.openSound ;
        if (sound) {
            block.dimension.playSound(sound, block.location);
        }
        block.setPermutation( block.permutation.withState(OPEN_STATE, !bit))
    }
}
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

class StairComponent {
    beforeOnPlayerPlace(arg, p) {
        arg.permutationToPlace = getStairPermutation(arg.block, arg.permutationToPlace);
    }
}

system.beforeEvents.startup.subscribe(initEvent => {
    initEvent.blockComponentRegistry.registerCustomComponent('cc:openable', new OpenableComponent());
    initEvent.blockComponentRegistry.registerCustomComponent('cc:stairs', new StairComponent());
});