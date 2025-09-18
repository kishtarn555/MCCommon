
import { system, world } from "@minecraft/server";
import { StairComponent, updateStair } from "./stairs";

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

system.beforeEvents.startup.subscribe(initEvent => {
    initEvent.blockComponentRegistry.registerCustomComponent('cc:openable', new OpenableComponent());
    initEvent.blockComponentRegistry.registerCustomComponent('cc:stairs', new StairComponent());
});

const updateBlock = (block) => {
    if (!block.isValid) {
        return;
    }
    if (block.hasTag("cc:stairs")) {
        updateStair(block);
    }
}

world.afterEvents.playerPlaceBlock.subscribe(event => {
    updateBlock(event.block.east());
    updateBlock(event.block.north());
    updateBlock(event.block.south());
    updateBlock(event.block.west());
    updateBlock(event.block.above());
    updateBlock(event.block.below());
});
world.afterEvents.playerBreakBlock.subscribe(event => {
    updateBlock(event.block.east());
    updateBlock(event.block.north());
    updateBlock(event.block.south());
    updateBlock(event.block.west());
    updateBlock(event.block.above());
    updateBlock(event.block.below());
});