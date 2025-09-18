import { BlockPermutation } from "@minecraft/server";

export const decayBlock = (block, params) => {
    
    const below = block.below();
    if (!below.isValid) {
            return;
        }
    if (!params.tags.some(tag => below.hasTag(tag))) {
        block.setPermutation(BlockPermutation.resolve("air"));
    }
}

export class DecayComponent {
    
    onRandomTick(arg, p) {
        decayBlock(arg.block, p.params);
    }
}